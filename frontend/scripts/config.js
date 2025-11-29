// N8N Webhook Configuration
// Replace these URLs with your actual n8n webhook endpoints from your team

const N8N_CONFIG = {
  // Webhook for OCR-based product image analysis
  OCR_WEBHOOK_URL: "YOUR_N8N_OCR_WEBHOOK_URL",

  // Webhook for barcode scanning and lookup
  BARCODE_WEBHOOK_URL: "YOUR_N8N_BARCODE_WEBHOOK_URL",

  // Webhook for product lookup (fallback from Open Food Facts)
  BARCODE_LOOKUP_URL: "YOUR_N8N_BARCODE_LOOKUP_URL",

  // Webhook for saving user preferences
  USER_PREFERENCES_WEBHOOK_URL: "YOUR_N8N_USER_PREFERENCES_WEBHOOK_URL",

  // API timeout in milliseconds
  TIMEOUT: 30000,

  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,

  // Feature flags
  USE_N8N_OCR: false, // Set to true when n8n OCR is ready
  USE_N8N_BARCODE: false, // Set to true when n8n barcode is ready
  USE_N8N_LOOKUP: false, // Set to true when n8n lookup is ready
};

// Google Vision API Configuration
// SECURITY WARNING: API keys should be stored in backend, not exposed in frontend!
const GOOGLE_VISION_CONFIG = {
  API_KEY: "", // REMOVED FOR SECURITY - Use backend API instead
  FEATURES: {
    TEXT_DETECTION: "TEXT_DETECTION",
    BARCODE_DETECTION: "BARCODE_DETECTION",
  },
};

// Open Food Facts API Configuration
const OPEN_FOOD_FACTS_CONFIG = {
  BASE_URL: "https://world.openfoodfacts.org/api/v0",
  TIMEOUT: 10000,
};

// Google OAuth Configuration
// SECURITY WARNING: Client secrets should NEVER be in frontend code!
const GOOGLE_CONFIG = {
  CLIENT_ID:
    "260430884397-9f63mcjq8a4kbu2m1r949nrf1r9deid4.apps.googleusercontent.com",
  CLIENT_SECRET: "", // REMOVED FOR SECURITY - Should only be in backend
  REDIRECT_URI: "http://localhost:8000/auth/callback",
  SCOPE: "email profile",
};

// Export for use in app.js
if (typeof module !== "undefined" && module.exports) {
  module.exports = N8N_CONFIG;
}
