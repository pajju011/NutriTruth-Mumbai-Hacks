const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'nutritruth-secret-key-2024';

// Middleware
app.use(cors({
    origin: function(origin, callback) {
        const allowedOrigins = [
            'http://localhost:8000',
            'http://localhost:3000',
            'http://127.0.0.1:8000',
            'http://127.0.0.1:3000',
            'http://localhost',
            'http://127.0.0.1'
        ];
        
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
}));

// Pre-flight requests
app.options('*', cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));

// File upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Database initialization
const db = new sqlite3.Database('./nutritruth.db');

// Create tables
db.serialize(() => {
    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        avatar_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // User allergies table
    db.run(`CREATE TABLE IF NOT EXISTS user_allergies (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        allergy_type TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`);

    // Products table
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        barcode TEXT,
        name TEXT NOT NULL,
        brand TEXT,
        ingredients TEXT,
        nutrition_facts TEXT,
        allergens TEXT,
        image_url TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Scan history table
    db.run(`CREATE TABLE IF NOT EXISTS scan_history (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        product_id TEXT,
        scan_type TEXT NOT NULL,
        image_path TEXT,
        result_data TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (product_id) REFERENCES products (id)
    )`);
});

// JWT middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Auth Routes
app.post('/api/auth/google', async (req, res) => {
    try {
        const { email, name, avatar_url } = req.body;
        
        // Check if user exists
        db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            let user;
            if (row) {
                user = row;
                
                // Generate JWT token for existing user
                const token = jwt.sign(
                    { id: user.id, email: user.email, name: user.name },
                    JWT_SECRET,
                    { expiresIn: '7d' }
                );

                res.json({ user, token });
            } else {
                // Create new user
                const userId = uuidv4();
                db.run('INSERT INTO users (id, email, name, avatar_url) VALUES (?, ?, ?, ?)',
                    [userId, email, name, avatar_url],
                    function(err) {
                        if (err) {
                            return res.status(500).json({ error: 'Failed to create user' });
                        }
                        user = { id: userId, email, name, avatar_url };
                        
                        // Generate JWT token
                        const token = jwt.sign(
                            { id: user.id, email: user.email, name: user.name },
                            JWT_SECRET,
                            { expiresIn: '7d' }
                        );

                        res.json({ user, token });
                    }
                );
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Authentication failed' });
    }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
    db.get('SELECT id, email, name, avatar_url FROM users WHERE id = ?', [req.user.id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (!row) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(row);
    });
});

// User Allergies Routes
app.post('/api/user/allergies', authenticateToken, (req, res) => {
    const { allergies } = req.body;
    const userId = req.user.id;

    // Clear existing allergies
    db.run('DELETE FROM user_allergies WHERE user_id = ?', [userId], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to update allergies' });
        }

        // Insert new allergies
        if (allergies && allergies.length > 0) {
            const stmt = db.prepare('INSERT INTO user_allergies (id, user_id, allergy_type) VALUES (?, ?, ?)');
            
            allergies.forEach(allergy => {
                const allergyId = uuidv4();
                stmt.run([allergyId, userId, allergy]);
            });
            
            stmt.finalize((err) => {
                if (err) {
                    return res.status(500).json({ error: 'Failed to save allergies' });
                }
                res.json({ message: 'Allergies updated successfully' });
            });
        } else {
            res.json({ message: 'Allergies updated successfully' });
        }
    });
});

app.get('/api/user/allergies', authenticateToken, (req, res) => {
    db.all('SELECT allergy_type FROM user_allergies WHERE user_id = ?', [req.user.id], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        const allergies = rows.map(row => row.allergy_type);
        res.json(allergies);
    });
});

// Product Analysis Routes - REMOVED (Frontend handles real API calls directly)
// All analysis is now done in frontend using:
// - Google Vision API for OCR and barcode detection
// - Open Food Facts API for real product data
// - n8n workflows (when configured)

// Scan History Routes
app.post('/api/scan-history', authenticateToken, upload.single('image'), (req, res) => {
    try {
        const { scanType, productData, barcode } = req.body;
        const userId = req.user.id;
        const imagePath = req.file ? req.file.path : null;
        
        // Create scan history record
        const scanId = uuidv4();
        const productId = uuidv4();
        
        // Create product record
        db.run('INSERT INTO products (id, barcode, name, brand, ingredients, allergens, nutrition_facts, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [productId, barcode || null, productData.productName || 'Unknown Product', 
             productData.brand || 'Unknown Brand', productData.ingredients?.join(', ') || '',
             productData.allergenWarnings?.join(', ') || '', 
             JSON.stringify(productData.nutritionFacts || {}), imagePath],
            function(err) {
                if (err) {
                    return res.status(500).json({ error: 'Failed to save product' });
                }

                // Create scan history record
                db.run('INSERT INTO scan_history (id, user_id, product_id, scan_type, image_path, result_data) VALUES (?, ?, ?, ?, ?, ?)',
                    [scanId, userId, productId, scanType, imagePath, JSON.stringify(productData)],
                    function(err) {
                        if (err) {
                            return res.status(500).json({ error: 'Failed to save scan history' });
                        }

                        res.json({
                            success: true,
                            scanId: scanId,
                            productId: productId
                        });
                    }
                );
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Failed to save scan' });
    }
});

app.get('/api/scan-history', authenticateToken, (req, res) => {
    db.all(`SELECT sh.*, p.name, p.brand, p.ingredients, p.allergens, p.nutrition_facts 
            FROM scan_history sh 
            LEFT JOIN products p ON sh.product_id = p.id 
            WHERE sh.user_id = ? 
            ORDER BY sh.created_at DESC 
            LIMIT 20`, [req.user.id], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        
        const history = rows.map(row => ({
            id: row.id,
            scan_type: row.scan_type,
            created_at: row.created_at,
            product: row.product_id ? {
                id: row.product_id,
                name: row.name,
                brand: row.brand,
                ingredients: row.ingredients ? row.ingredients.split(', ') : [],
                allergens: row.allergens ? row.allergens.split(', ') : [],
                nutrition_facts: row.nutrition_facts ? JSON.parse(row.nutrition_facts) : null
            } : null,
            result_data: row.result_data ? JSON.parse(row.result_data) : null
        }));
        
        res.json(history);
    });
});

// Serve the main application
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 NutriTruth server running on http://localhost:${PORT}`);
    console.log(`📁 Frontend served from: ${path.join(__dirname, '../frontend')}`);
    console.log(`📁 Uploads directory: ${path.join(__dirname, 'uploads')}`);
    console.log(`💾 Database: ${path.join(__dirname, 'nutritruth.db')}`);
});
