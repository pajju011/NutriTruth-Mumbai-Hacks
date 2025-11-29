// Backend Configuration
// This file replaces the n8n webhook configuration with local backend endpoints

const BACKEND_CONFIG = {
    // Base URL for the backend API
    BASE_URL: process.env.NODE_ENV === 'production' 
        ? 'https://your-domain.com/api' 
        : 'http://localhost:3000/api',
    
    // API Endpoints
    ENDPOINTS: {
        // Authentication
        AUTH: {
            GOOGLE: '/auth/google',
            ME: '/auth/me'
        },
        
        // User Management
        USER: {
            ALLERGIES: '/user/allergies'
        },
        
        // Product Analysis
        ANALYZE: {
            IMAGE: '/analyze/image',
            BARCODE: '/analyze/barcode'
        },
        
        // History
        HISTORY: '/scan-history'
    },
    
    // API timeout in milliseconds
    TIMEOUT: 30000,
    
    // Retry configuration
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
    
    // File upload limits
    UPLOAD: {
        MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
        ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp']
    }
};

// Helper function to get full URL for an endpoint
function getEndpointUrl(endpoint) {
    return BACKEND_CONFIG.BASE_URL + endpoint;
}

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BACKEND_CONFIG, getEndpointUrl };
}
