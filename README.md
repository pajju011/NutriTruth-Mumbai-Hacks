# 🥗 NutriTruth

**Know What You Eat** - A smart food scanning application that helps users make informed dietary choices by analyzing product labels and ingredients.

## 🏗️ Project Structure

This is a **full-stack application** with separated frontend and backend:

```
nutritruth/
├── frontend/          # React/Vanilla JS frontend
│   ├── index.html     # Main application
│   ├── scripts/       # JavaScript files
│   ├── styles/        # CSS stylesheets
│   └── images/        # Static assets
├── backend/           # Node.js/Express API
│   ├── server.js      # Main server file
│   ├── package.json   # Backend dependencies
│   └── .env.example   # Environment variables template
└── package.json       # Root package.json for orchestration
```

### 🚀 Quick Start

#### Option 1: Use Batch Scripts (Windows)
```bash
# Run the setup script
setup.bat

# Start development environment
start-development.bat

# Or start individually:
start-backend.bat     # Backend on http://localhost:3000
start-frontend.bat    # Frontend on http://localhost:8000
```

#### Option 2: Manual Commands
```bash
# Install all dependencies
npm run install-all

# Development mode (both frontend & backend)
npm run dev

# Or start separately:
npm run start-backend  # Backend on http://localhost:3000
npm run start-frontend # Frontend on http://localhost:8000
```

### 🔧 Troubleshooting

**If the server doesn't start:**
1. Make sure Node.js is installed (v14+)
2. Run `setup.bat` to install all dependencies
3. Try starting backend and frontend separately
4. Check if ports 3000 and 8000 are available

**Common Issues:**
- **Port already in use**: Change ports in server.js or use different ports
- **Dependencies missing**: Run `npm install` in both backend and frontend folders
- **CORS errors**: Ensure backend is running before accessing frontend

## ✨ Features

### 🔐 User Authentication
- **Google OAuth Integration** - Secure sign-in with Google
- **Persistent Sessions** - Stay logged in across sessions

### 👤 Personalized Profile Setup
- **Allergy Management** - Select from common allergens:
  - Peanut 🥜
  - Soy 🌱
  - Lactose 🥛
  - Gluten 🌾
  - Seafood 🦐
  - Artificial Colors/Flavors 🧪
- **Dietary Preferences** - Customize your food safety alerts

### 📸 Dual Scanning Modes

#### Option A: Product Image Upload (OCR Analysis)
- Upload photos of nutrition labels
- Capture ingredient lists
- Photograph product packaging
- **AI-powered OCR** extracts text from images
- Comprehensive ingredient analysis

#### Option B: Barcode Scanning
- Quick barcode photo capture
- **Instant database lookup** via:
  - Google Product API
  - UPC Search API
  - OpenFoodFacts API
  - AI-powered fallback search
- Structured product information retrieval

### 🎯 Smart Analysis
- Real-time allergen detection
- Personalized warnings based on your profile
- Nutrition facts breakdown
- Ingredient safety ratings

## 🏗️ Architecture

### Frontend
- **HTML5** - Semantic markup with accessibility features
- **CSS3** - Modern design with:
  - Dark theme with vibrant gradients
  - Glassmorphism effects
  - Smooth animations and transitions
  - Fully responsive layout
- **Vanilla JavaScript** - No framework dependencies
  - State management
  - Local storage persistence
  - Async/await API calls

### Backend Integration (n8n)
The application integrates with n8n workflows for:

1. **OCR Processing Pipeline**
   - Image upload → n8n webhook
   - AI Vision API for text extraction
   - Ingredient parsing and analysis
   - Allergen detection
   - Response formatting

2. **Barcode Lookup Pipeline**
   - Barcode image → n8n webhook
   - AI Vision extracts barcode number
   - Multi-API lookup (Google, UPC, OpenFoodFacts)
   - Data aggregation and normalization
   - Allergen cross-reference

### Data Storage
- **MongoDB / Supabase** (configurable)
  - User profiles
  - Allergy preferences
  - Scan history
  - Product cache

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- n8n instance (self-hosted or cloud)
- Database (MongoDB or Supabase)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/NutriTruth.git
   cd NutriTruth
   ```

2. **Configure n8n Webhooks**
   - Open `scripts/config.js`
   - Replace placeholder URLs with your n8n webhook endpoints:
     ```javascript
     OCR_WEBHOOK_URL: 'https://your-n8n-instance.com/webhook/nutritruth-ocr'
     BARCODE_WEBHOOK_URL: 'https://your-n8n-instance.com/webhook/nutritruth-barcode'
     ```

3. **Set up Google OAuth**
   - Create a project in [Google Cloud Console](https://console.cloud.google.com)
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Update the OAuth configuration in `scripts/app.js`

4. **Run the application**
   - Open `index.html` in your browser, or
   - Use a local server:
     ```bash
     # Python
     python -m http.server 8000
     
     # Node.js
     npx serve
     ```
   - Navigate to `http://localhost:8000`

## 📁 Project Structure

```
NutriTruth/
├── index.html              # Main HTML file with all pages
├── styles/
│   └── main.css           # Complete styling with animations
├── scripts/
│   ├── app.js             # Main application logic
│   └── config.js          # n8n webhook configuration
└── README.md              # This file
```

## 🎨 Design Features

- **Modern Dark Theme** - Easy on the eyes with vibrant accents
- **Gradient Orbs** - Animated background elements
- **Glassmorphism** - Frosted glass effect on cards
- **Micro-animations** - Smooth transitions and hover effects
- **Responsive Design** - Works on all screen sizes
- **Accessibility** - Semantic HTML and ARIA labels

## 🔧 Configuration

### n8n Workflow Setup

#### OCR Workflow
1. Webhook Trigger (receives image)
2. AI Vision Node (extract text)
3. Text Processing (parse ingredients)
4. Database Query (check allergens)
5. Response Formatter

#### Barcode Workflow
1. Webhook Trigger (receives barcode image)
2. AI Vision Node (extract barcode number)
3. HTTP Request Nodes (parallel API calls)
4. Data Merger
5. Allergen Cross-Reference
6. Response Formatter

### API Keys Required
- Google Cloud Vision API (for OCR)
- Google Product API
- UPC Database API
- OpenFoodFacts API (free, no key needed)

## 🧪 Testing

### Clear All Data
Open browser console and run:
```javascript
NutriTruth.clearAllData()
```

### Navigate Manually
```javascript
NutriTruth.navigateToPage('landing')
NutriTruth.navigateToPage('profile-setup')
NutriTruth.navigateToPage('dashboard')
```

### Check State
```javascript
console.log(NutriTruth.AppState)
```

## 🛣️ Roadmap

- [ ] Real Google OAuth implementation
- [ ] n8n workflow templates
- [ ] Database schema and setup scripts
- [ ] Product detail view page
- [ ] Scan history with filters
- [ ] Export scan reports
- [ ] PWA support for mobile
- [ ] Camera integration for live scanning
- [ ] Multi-language support
- [ ] Nutrition score visualization

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Google Fonts (Inter, Outfit)
- OpenFoodFacts for product data
- n8n for workflow automation

---

**Built with ❤️ for Mumbai Hacks**
