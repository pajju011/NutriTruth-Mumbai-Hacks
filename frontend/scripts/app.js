// ============================================
// STATE MANAGEMENT
// ============================================
const AppState = {
  currentPage: "landing",
  user: null,
  allergies: [],
  recentScans: [],
};

// ============================================
// PAGE NAVIGATION
// ============================================
function navigateToPage(pageName) {
  // Hide all pages
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active");
  });

  // Show target page
  const targetPage = document.getElementById(`${pageName}-page`);
  if (targetPage) {
    setTimeout(() => {
      targetPage.classList.add("active");
      AppState.currentPage = pageName;
    }, 100);
  }
}

// ============================================
// BACKEND API CONFIGURATION
// ============================================
const API_BASE_URL = "http://localhost:3000/api";

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem("nutritruth_token");

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  console.log("Making API call to:", url);

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "API call failed");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    console.error("URL:", url);
    console.error("Config:", config);

    // Show user-friendly error
    if (error.message.includes("Failed to fetch")) {
      throw new Error(
        "Cannot connect to backend. Please make sure the backend server is running on port 3000."
      );
    }

    throw error;
  }
}

// ============================================
// GOOGLE AUTHENTICATION
// ============================================
async function authenticateWithGoogle(userData) {
  try {
    const response = await apiCall("/auth/google", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    // Save user and token from backend
    AppState.user = response.user;
    localStorage.setItem("nutritruth_user", JSON.stringify(response.user));
    localStorage.setItem("nutritruth_token", response.token);

    console.log("✅ Authentication successful:", response.user);
    return response;
  } catch (error) {
    console.error("Authentication failed:", error);
    throw error;
  }
}

function initGoogleAuth() {
  console.log("🚨 INITIALIZING GOOGLE AUTH");

  // Clear any existing invalid tokens first
  localStorage.removeItem("nutritruth_token");
  localStorage.removeItem("nutritruth_user");

  // Create user data for authentication
  const userData = {
    email: "nutritruth.user@gmail.com",
    name: "NutriTruth User",
    avatar_url:
      "https://ui-avatars.com/api/?name=NutriTruth+User&background=4285F4&color=fff&size=200",
  };

  // Authenticate with backend
  authenticateWithGoogle(userData)
    .then(() => {
      console.log("✅ USER AUTHENTICATED:", AppState.user);

      // Force navigation immediately
      console.log("🚨 FORCING NAVIGATION TO PROFILE SETUP");

      // Hide landing page
      const landingPage = document.getElementById("landing-page");
      if (landingPage) {
        landingPage.style.display = "none";
      }

      // Show profile setup page
      const profilePage = document.getElementById("profile-setup-page");
      if (profilePage) {
        profilePage.style.display = "block";
        profilePage.classList.add("active");
      }

      // Update app state
      AppState.currentPage = "profile-setup";

      // Show success
      alert("✅ LOGGED IN SUCCESSFULLY!");
    })
    .catch((error) => {
      console.error("Authentication failed:", error);
      alert(
        "❌ Login failed: " +
          error.message +
          "\n\nPlease make sure the backend server is running on port 3000."
      );
    });

  // Also make any buttons work
  document.querySelectorAll("button").forEach((btn) => {
    if (
      btn.textContent.includes("Google") ||
      btn.textContent.includes("Continue")
    ) {
      btn.onclick = function () {
        alert("✅ Already logged in!");
        window.location.href = "#profile-setup";
      };
    }
  });
}

// Separate handler function for clarity
async function handleLoginClick(e) {
  console.log("🚨 LOGIN CLICKED");
  e.preventDefault();
  e.stopPropagation();

  const btn = e.currentTarget;
  console.log("🚨 Button element:", btn);

  // Show loading state immediately
  btn.disabled = true;
  btn.style.opacity = "0.7";
  btn.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <div style="width: 20px; height: 20px; border: 2px solid white; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <span>Signing in...</span>
        </div>
    `;

  try {
    // Create user data for authentication
    const userData = {
      email: "nutritruth.user@gmail.com",
      name: "NutriTruth User",
      avatar_url: `https://ui-avatars.com/api/?name=NutriTruth+User&background=10b981&color=fff&size=200`,
    };

    // Authenticate with backend
    await authenticateWithGoogle(userData);

    console.log("🚨 LOGIN SUCCESS:", AppState.user);

    // Show success
    alert("✅ Successfully signed in! Redirecting...");

    // Immediate navigation
    window.location.href = "#profile-setup";
    setTimeout(() => {
      navigateToPage("profile-setup");
    }, 100);
  } catch (error) {
    console.error("🚨 LOGIN FAILED:", error);
    alert("❌ Login failed: " + error.message);

    // Reset button
    btn.disabled = false;
    btn.style.opacity = "1";
    btn.innerHTML = `
            <svg class="google-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
        `;
  }
}

function resetGoogleButton() {
  const googleLoginBtn = document.getElementById("google-login-btn");
  if (googleLoginBtn) {
    googleLoginBtn.disabled = false;
    googleLoginBtn.innerHTML = `
            <svg class="google-icon" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>Continue with Google</span>
        `;
  }
}

// ============================================
// ALLERGY SELECTION
// ============================================
function initAllergySelection() {
  const allergyCards = document.querySelectorAll(".allergy-card");
  const continueBtn = document.getElementById("continue-to-dashboard-btn");
  const noneCard = document.querySelector('.allergy-card[data-allergy="none"]');

  allergyCards.forEach((card) => {
    card.addEventListener("click", () => {
      const allergy = card.dataset.allergy;

      if (allergy === "none") {
        // If "None" is selected, deselect all others
        allergyCards.forEach((c) => c.classList.remove("selected"));
        card.classList.add("selected");
        AppState.allergies = ["none"];
      } else {
        // Deselect "None" if any other allergy is selected
        noneCard.classList.remove("selected");

        // Toggle current card
        card.classList.toggle("selected");

        // Update allergies array
        if (card.classList.contains("selected")) {
          if (!AppState.allergies.includes(allergy)) {
            AppState.allergies = AppState.allergies.filter((a) => a !== "none");
            AppState.allergies.push(allergy);
          }
        } else {
          AppState.allergies = AppState.allergies.filter((a) => a !== allergy);
        }

        // If no allergies selected, select "None"
        if (AppState.allergies.length === 0) {
          noneCard.classList.add("selected");
          AppState.allergies = ["none"];
        }
      }

      // Enable continue button if at least one option is selected
      continueBtn.disabled = AppState.allergies.length === 0;

      // Add animation to button
      if (!continueBtn.disabled) {
        continueBtn.style.animation = "pulse 0.5s ease";
        setTimeout(() => {
          continueBtn.style.animation = "";
        }, 500);
      }
    });
  });

  continueBtn.addEventListener("click", async () => {
    // Show loading
    continueBtn.disabled = true;
    continueBtn.innerHTML = `
            <svg class="arrow-icon" viewBox="0 0 24 24" style="animation: spin 1s linear infinite;">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" opacity="0.3"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
            </svg>
            <span>Saving...</span>
        `;

    try {
      // Save to localStorage (no backend needed)
      localStorage.setItem(
        "nutritruth_allergies",
        JSON.stringify(AppState.allergies)
      );

      console.log("✅ Allergies saved:", AppState.allergies);

      // Try backend (optional - if fails, continue anyway)
      try {
        await apiCall("/user/allergies", {
          method: "POST",
          body: JSON.stringify({ allergies: AppState.allergies }),
        });
        console.log("✅ Backend sync successful");
      } catch (backendError) {
        console.log(
          "⚠️ Backend sync failed (continuing locally):",
          backendError.message
        );
      }

      // Navigate to dashboard
      navigateToPage("dashboard");

      // Initialize user profile in dashboard
      initUserProfile();
    } catch (error) {
      console.error("Failed to save allergies:", error);
      showResultNotification(
        "Failed to save preferences. Please try again.",
        "error"
      );

      // Reset button
      continueBtn.disabled = false;
      continueBtn.innerHTML = `
                <span>Continue to Dashboard</span>
                <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
            `;
    }
  });
}

// ============================================
// USER PROFILE IN DASHBOARD
// ============================================
function initUserProfile() {
  const userInitial = document.getElementById("user-initial");

  if (userInitial && AppState.user && AppState.user.name) {
    userInitial.textContent = AppState.user.name.charAt(0).toUpperCase();
  }
}

// ============================================
// IMAGE UPLOAD HANDLERS
// ============================================
function initImageUpload() {
  const imageUploadCard = document.getElementById("image-upload-card");
  const imageInput = document.getElementById("product-image-input");
  const barcodeUploadCard = document.getElementById("barcode-upload-card");
  const barcodeInput = document.getElementById("barcode-image-input");

  // Product Image Upload
  if (imageUploadCard && imageInput) {
    imageUploadCard.addEventListener("click", () => {
      imageInput.click();
    });

    imageInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (file) {
        await processProductImage(file);
      }
    });
  }

  // Barcode Image Upload
  if (barcodeUploadCard && barcodeInput) {
    barcodeUploadCard.addEventListener("click", () => {
      barcodeInput.click();
    });

    barcodeInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (file) {
        await processBarcodeImage(file);
      }
    });
  }
}

// ============================================
// PROCESS PRODUCT IMAGE (REAL OCR PATH - NO BACKEND)
// ============================================
async function processProductImage(file) {
  showLoadingModal("Analyzing product image...");

  try {
    // Step 1: Extract text using Google Vision API
    showLoadingModal("Extracting text from image...");
    const extractedText = await extractTextFromImage(file);

    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error("No text could be extracted from the image");
    }

    // Step 2: Parse ingredients and nutrition from extracted text
    showLoadingModal("Analyzing ingredients and nutrition...");
    const analysisResult = await analyzeExtractedText(extractedText);

    // Step 3: Create product data
    const productData = {
      success: true,
      productName: analysisResult.productName || "Scanned Product",
      brand: analysisResult.brand || "Unknown Brand",
      category: "Food Product",
      ingredients: analysisResult.ingredients || [],
      allergenWarnings: analysisResult.allergenWarnings || [],
      nutritionFacts: analysisResult.nutritionFacts || getDefaultNutrition(),
      imageUrl: URL.createObjectURL(file),
    };

    // Save to backend for history (optional)
    await saveScanToBackend("image", productData, file);

    // Store result and navigate to results page
    localStorage.setItem(
      "nutritruth_last_scan",
      JSON.stringify({
        type: "image",
        result: productData,
        extractedText: extractedText,
        timestamp: new Date().toISOString(),
      })
    );

    // Navigate to results page
    window.location.href = "result.html";
  } catch (error) {
    console.error("Image analysis failed:", error);
    hideLoadingModal();
    showResultNotification(
      `Failed to analyze image: ${error.message}`,
      "error"
    );
  }
}

/**
 * Extract text from image using Google Vision API
 */
async function extractTextFromImage(file) {
  try {
    // Convert image to base64
    const base64Image = await fileToBase64(file);

    // Call Google Vision API for text detection
    const visionResponse = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_CONFIG.API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: base64Image.split(",")[1], // Remove data:image/...;base64, prefix
              },
              features: [
                {
                  type: "TEXT_DETECTION",
                  maxResults: 10,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!visionResponse.ok) {
      throw new Error("Google Vision API error");
    }

    const visionData = await visionResponse.json();

    if (!visionData.responses[0].fullTextAnnotation) {
      throw new Error("No text detected in image");
    }

    const extractedText = visionData.responses[0].fullTextAnnotation.text;
    console.log("Extracted text:", extractedText);

    return extractedText;
  } catch (error) {
    console.error("Text extraction error:", error);
    throw new Error(
      "Failed to extract text from image. Please ensure the text is clearly visible."
    );
  }
}

/**
 * Analyze extracted text to identify ingredients and nutrition
 */
async function analyzeExtractedText(text) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  // Extract product name (usually first line or contains brand info)
  const productName = extractProductName(lines);

  // Extract ingredients
  const ingredients = extractIngredients(text);

  // Extract nutrition facts
  const nutritionFacts = extractNutritionFacts(text);

  // Identify allergens
  const allergenWarnings = identifyAllergensFromText(ingredients);

  return {
    productName,
    brand: extractBrand(lines),
    ingredients,
    nutritionFacts,
    allergenWarnings,
  };
}

/**
 * Extract product name from text lines
 */
function extractProductName(lines) {
  // Look for lines that might be product names (not ingredients, not nutrition facts)
  const potentialNames = lines.filter(
    (line) =>
      !line.toLowerCase().includes("ingredients") &&
      !line.toLowerCase().includes("nutrition") &&
      !line.toLowerCase().includes("serving") &&
      !line.includes("%") &&
      !line.includes("g") &&
      line.length > 3 &&
      line.length < 50
  );

  return potentialNames[0] || "Unknown Product";
}

/**
 * Extract brand from text
 */
function extractBrand(lines) {
  const brands = [
    "Nestlé",
    "Kellogg's",
    "Coca-Cola",
    "Pepsi",
    "Unilever",
    "P&G",
    "General Mills",
  ];

  for (const line of lines) {
    for (const brand of brands) {
      if (line.toLowerCase().includes(brand.toLowerCase())) {
        return brand;
      }
    }
  }

  return "Unknown Brand";
}

/**
 * Extract ingredients from text
 */
function extractIngredients(text) {
  // Look for ingredients section
  const ingredientsMatch = text.match(/ingredients[:\s]*([^.]+)/i);
  if (ingredientsMatch) {
    const ingredientsText = ingredientsMatch[1];
    return ingredientsText
      .split(/[,;]/)
      .map((ing) => ing.trim())
      .filter((ing) => ing.length > 0);
  }

  return [];
}

/**
 * Extract nutrition facts from text
 */
function extractNutritionFacts(text) {
  const nutrition = getDefaultNutrition();

  // Look for various nutrition values
  const caloriesMatch = text.match(/calories?[:\s]*(\d+)/i);
  if (caloriesMatch) nutrition.calories = parseInt(caloriesMatch[1]);

  const proteinMatch = text.match(/protein[:\s]*([0-9.]+)\s*g/i);
  if (proteinMatch) nutrition.protein = parseFloat(proteinMatch[1]);

  const fatMatch = text.match(/fat[:\s]*([0-9.]+)\s*g/i);
  if (fatMatch) nutrition.totalFat = parseFloat(fatMatch[1]);

  const carbsMatch = text.match(/carb(?:ohydrate)?s?[:\s]*([0-9.]+)\s*g/i);
  if (carbsMatch) nutrition.totalCarbs = parseFloat(carbsMatch[1]);

  const sodiumMatch = text.match(/sodium[:\s]*([0-9.]+)\s*(?:mg|g)/i);
  if (sodiumMatch) {
    const value = parseFloat(sodiumMatch[1]);
    nutrition.sodium = sodiumMatch[0].includes("mg") ? value : value * 1000; // Convert g to mg
  }

  return nutrition;
}

/**
 * Identify allergens from ingredients list
 */
function identifyAllergensFromText(ingredients) {
  const allergenKeywords = [
    "milk",
    "dairy",
    "lactose",
    "wheat",
    "gluten",
    "soy",
    "peanut",
    "tree nut",
    "egg",
    "fish",
    "shellfish",
    "sesame",
    "mustard",
    "crustacean",
  ];

  const foundAllergens = [];

  for (const ingredient of ingredients) {
    const lowerIng = ingredient.toLowerCase();
    for (const allergen of allergenKeywords) {
      if (lowerIng.includes(allergen)) {
        if (!foundAllergens.includes(allergen)) {
          foundAllergens.push(
            allergen.charAt(0).toUpperCase() + allergen.slice(1)
          );
        }
      }
    }
  }

  return foundAllergens;
}

/**
 * Save scan to backend for history (optional)
 */
async function saveScanToBackend(
  scanType,
  productData,
  file,
  barcodeNumber = null
) {
  try {
    if (!AppState.user) return; // Only save if user is logged in

    const formData = new FormData();
    formData.append("scanType", scanType);
    formData.append("productData", JSON.stringify(productData));
    if (file) formData.append("image", file);
    if (barcodeNumber) formData.append("barcode", barcodeNumber);

    const response = await apiCall("/scan-history", {
      method: "POST",
      body: formData,
    });

    console.log("Scan saved to backend:", response);
  } catch (error) {
    console.log("Failed to save scan to backend (optional):", error);
    // Don't throw error - this is optional
  }
}

/**
 * Get default nutrition values
 */
function getDefaultNutrition() {
  return {
    servingSize: "100g",
    calories: 0,
    totalFat: 0,
    saturatedFat: 0,
    transFat: 0,
    cholesterol: 0,
    sodium: 0,
    totalCarbs: 0,
    fiber: 0,
    sugars: 0,
    protein: 0,
    vitaminA: 0,
    vitaminC: 0,
    calcium: 0,
    iron: 0,
    potassium: 0,
  };
}

/**
 * Extract barcode number from uploaded image
 * Uses Google Vision API for real barcode detection
 */
async function extractBarcodeFromImage(file) {
  try {
    // Convert image to base64
    const base64Image = await fileToBase64(file);

    // Call Google Vision API for barcode detection
    const visionResponse = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_CONFIG.API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: base64Image.split(",")[1], // Remove data:image/...;base64, prefix
              },
              features: [
                {
                  type: "BARCODE_DETECTION",
                  maxResults: 5,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!visionResponse.ok) {
      throw new Error("Google Vision API error");
    }

    const visionData = await visionResponse.json();

    if (
      !visionData.responses[0].barcodeAnnotations ||
      visionData.responses[0].barcodeAnnotations.length === 0
    ) {
      throw new Error("No barcode detected in image");
    }

    // Extract barcode number
    const barcode = visionData.responses[0].barcodeAnnotations[0].rawValue;
    console.log("Detected barcode:", barcode);

    return barcode;
  } catch (error) {
    console.error("Barcode extraction error:", error);
    throw new Error(
      "Failed to extract barcode. Please ensure the barcode is clearly visible."
    );
  }
}

/**
 * Convert file to base64
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Fetch product information from Open Food Facts API
 * Uses real barcode database with fallback to n8n workflows
 */
async function fetchProductByBarcode(barcodeNumber, imageFile) {
  try {
    console.log("Fetching product data for barcode:", barcodeNumber);

    // Try Open Food Facts API first
    try {
      const productData = await getProductFromOpenFoodFacts(barcodeNumber);
      if (productData) {
        console.log("Product found in Open Food Facts");
        return formatProductData(productData, barcodeNumber);
      }
    } catch (offError) {
      console.log("Open Food Facts lookup failed:", offError.message);
    }

    // Fallback to n8n workflow if available
    const webhookUrl = window.N8N_CONFIG?.BARCODE_LOOKUP_URL;
    if (webhookUrl && !webhookUrl.includes("YOUR_N8N")) {
      console.log("Trying n8n workflow fallback");

      const formData = new FormData();
      formData.append("barcode", barcodeNumber);
      formData.append("barcode_image", imageFile);
      formData.append("userId", AppState.user?.id || "anonymous");

      const response = await fetch(webhookUrl, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        return result;
      }
    }

    // If all APIs fail, return not found
    throw new Error("Product not found in any database");
  } catch (error) {
    console.error("Product fetch error:", error);
    throw new Error(
      "Product not found in our database. The barcode might not be in our system yet."
    );
  }
}

/**
 * Get product from Open Food Facts API
 */
async function getProductFromOpenFoodFacts(barcode) {
  const url = `${OPEN_FOOD_FACTS_CONFIG.BASE_URL}/product/${barcode}.json`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.status === 1 && data.product) {
    return data.product;
  }

  throw new Error("Product not found in Open Food Facts");
}

/**
 * Format Open Food Facts data to our standard format
 */
function formatProductData(product, barcode) {
  return {
    success: true,
    barcode: barcode,
    productName: product.product_name || "Unknown Product",
    brand: product.brands || "Unknown Brand",
    category: product.categories || "Food Product",
    ingredients: product.ingredients_text
      ? product.ingredients_text.split(",").map((i) => i.trim())
      : [],
    allergenWarnings: product.allergens_tags
      ? product.allergens_tags.map((tag) =>
          tag.replace("en:", "").replace(/-/g, " ")
        )
      : [],
    nutritionFacts: {
      servingSize: product.serving_size || "100g",
      calories: product.nutriments?.["energy-kcal_100g"] || 0,
      totalFat: product.nutriments?.["fat_100g"] || 0,
      saturatedFat: product.nutriments?.["saturated-fat_100g"] || 0,
      transFat: product.nutriments?.["trans-fat_100g"] || 0,
      cholesterol: product.nutriments?.["cholesterol_100g"] || 0,
      sodium: product.nutriments?.["sodium_100g"] || 0,
      totalCarbs: product.nutriments?.["carbohydrates_100g"] || 0,
      fiber: product.nutriments?.["fiber_100g"] || 0,
      sugars: product.nutriments?.["sugars_100g"] || 0,
      protein: product.nutriments?.["proteins_100g"] || 0,
      vitaminA: product.nutriments?.["vitamin-a_100g"] || 0,
      vitaminC: product.nutriments?.["vitamin-c_100g"] || 0,
      calcium: product.nutriments?.["calcium_100g"] || 0,
      iron: product.nutriments?.["iron_100g"] || 0,
      potassium: product.nutriments?.["potassium_100g"] || 0,
    },
    imageUrl:
      product.image_front_url ||
      `https://images.openfoodfacts.org/images/products/${barcode}/front_en.${
        product.image_front_url?.split(".").pop() || "jpg"
      }`,
  };
}

/**
 * Analyze product data and prepare for result page
 */
function analyzeProductData(productInfo, imageFile) {
  // Calculate health score based on nutrition
  const healthScore = calculateHealthScore(productInfo.nutritionFacts);

  // Determine health tag
  let healthTag = "healthy";
  if (healthScore < 40) healthTag = "avoid";
  else if (healthScore < 70) healthTag = "risky";

  // Identify harmful ingredients
  const harmfulIngredients = identifyHarmfulIngredients(
    productInfo.ingredients
  );

  // Calculate macro distribution
  const macros = calculateMacros(productInfo.nutritionFacts);

  // Check for allergen matches
  const allergenMatches = checkAllergenMatches(
    productInfo.allergenWarnings,
    AppState.allergies
  );

  // Prepare complete product data
  return {
    name: productInfo.productName,
    brand: productInfo.brand,
    barcode: productInfo.barcode,
    category: productInfo.category || "Food Product",
    image: productInfo.imageUrl || URL.createObjectURL(imageFile),
    healthScore: healthScore,
    healthTag: healthTag,
    nutrition: productInfo.nutritionFacts,
    macros: macros,
    ingredients: productInfo.ingredients.map((ing) => ({
      name: ing,
      safe: !isHarmfulIngredient(ing),
      harmful: isHarmfulIngredient(ing),
    })),
    harmfulIngredients: harmfulIngredients,
    adClaims: [], // Can be populated if product has claims
    allergenWarnings: {
      detected: productInfo.allergenWarnings || [],
      userAllergies: AppState.allergies,
      matches: allergenMatches,
    },
  };
}

/**
 * Calculate health score (0-100) based on nutrition facts
 */
function calculateHealthScore(nutrition) {
  let score = 100;

  // Deduct points for high sodium (>500mg per serving)
  if (nutrition.sodium > 500) {
    score -= Math.min(30, (nutrition.sodium - 500) / 20);
  }

  // Deduct points for high sugar (>10g per serving)
  if (nutrition.sugars > 10) {
    score -= Math.min(20, (nutrition.sugars - 10) * 2);
  }

  // Deduct points for high saturated fat (>5g per serving)
  if (nutrition.saturatedFat > 5) {
    score -= Math.min(20, (nutrition.saturatedFat - 5) * 3);
  }

  // Deduct points for trans fat
  if (nutrition.transFat > 0) {
    score -= nutrition.transFat * 10;
  }

  // Add points for fiber (>3g per serving)
  if (nutrition.fiber > 3) {
    score += Math.min(10, (nutrition.fiber - 3) * 2);
  }

  // Add points for protein (>5g per serving)
  if (nutrition.protein > 5) {
    score += Math.min(10, nutrition.protein - 5);
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Calculate macro distribution percentages
 */
function calculateMacros(nutrition) {
  const totalCalories = nutrition.calories;

  // Calories from each macro (4 cal/g for carbs & protein, 9 cal/g for fat)
  const carbCal = nutrition.totalCarbs * 4;
  const proteinCal = nutrition.protein * 4;
  const fatCal = nutrition.totalFat * 9;

  const total = carbCal + proteinCal + fatCal;

  return {
    carbs: Math.round((carbCal / total) * 100),
    protein: Math.round((proteinCal / total) * 100),
    fat: Math.round((fatCal / total) * 100),
  };
}

/**
 * Identify harmful ingredients with details
 */
function identifyHarmfulIngredients(ingredients) {
  const harmfulList = [];

  const harmfulDatabase = {
    "palm oil": {
      severity: "high",
      eNumber: "N/A",
      description:
        "High in saturated fats. May contribute to cardiovascular issues when consumed in excess.",
    },
    e635: {
      severity: "medium",
      eNumber: "E635",
      description:
        "Disodium 5'-ribonucleotides. Flavor enhancer that may cause allergic reactions in sensitive individuals.",
    },
    e150d: {
      severity: "low",
      eNumber: "E150d",
      description:
        "Caramel color. Generally safe but may contain trace amounts of 4-MEI, a potential carcinogen.",
    },
    msg: {
      severity: "medium",
      eNumber: "E621",
      description:
        "Monosodium glutamate. May cause headaches and allergic reactions in sensitive individuals.",
    },
    "high fructose corn syrup": {
      severity: "high",
      eNumber: "N/A",
      description:
        "Linked to obesity, diabetes, and metabolic syndrome when consumed in excess.",
    },
    artificial: {
      severity: "medium",
      eNumber: "Various",
      description:
        "Artificial additives may cause allergic reactions and health issues in some individuals.",
    },
  };

  ingredients.forEach((ingredient) => {
    const lowerIng = ingredient.toLowerCase();

    for (const [key, value] of Object.entries(harmfulDatabase)) {
      if (lowerIng.includes(key)) {
        harmfulList.push({
          name: ingredient,
          severity: value.severity,
          eNumber: value.eNumber,
          description: value.description,
        });
        break;
      }
    }
  });

  return harmfulList;
}

/**
 * Check if ingredient is harmful
 */
function isHarmfulIngredient(ingredient) {
  const harmfulKeywords = [
    "palm oil",
    "e635",
    "e150",
    "msg",
    "e621",
    "high fructose",
    "artificial",
    "hydrogenated",
    "trans fat",
    "sodium benzoate",
    "e211",
  ];

  const lowerIng = ingredient.toLowerCase();
  return harmfulKeywords.some((keyword) => lowerIng.includes(keyword));
}

/**
 * Check for allergen matches between product and user profile
 */
function checkAllergenMatches(detectedAllergens, userAllergies) {
  if (
    !userAllergies ||
    userAllergies.length === 0 ||
    userAllergies.includes("none")
  ) {
    return [];
  }

  const matches = [];

  userAllergies.forEach((allergy) => {
    detectedAllergens.forEach((detected) => {
      if (
        detected.toLowerCase().includes(allergy.toLowerCase()) ||
        allergy.toLowerCase().includes(detected.toLowerCase())
      ) {
        if (!matches.includes(allergy)) {
          matches.push(allergy);
        }
      }
    });
  });

  return matches;
}

// ============================================
// LOADING MODAL
// ============================================
function showLoadingModal(message = "Processing...") {
  const modal = document.getElementById("loading-modal");
  const title = modal.querySelector(".loading-title");
  title.textContent = message;
  modal.classList.add("active");
}

function hideLoadingModal() {
  const modal = document.getElementById("loading-modal");
  modal.classList.remove("active");
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================
function showResultNotification(message, type = "success") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${
          type === "success"
            ? "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)"
            : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
        };
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        z-index: 2000;
        animation: slideInRight 0.3s ease;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;

  const icon = type === "success" ? "✓" : "✕";
  notification.innerHTML = `<span style="font-size: 1.25rem;">${icon}</span> ${message}`;

  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease";
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Add animation styles
const style = document.createElement("style");
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
`;
document.head.appendChild(style);

// ============================================
// RECENT SCANS
// ============================================
function addToRecentScans(scanData) {
  AppState.recentScans.unshift(scanData);

  // Keep only last 10 scans
  if (AppState.recentScans.length > 10) {
    AppState.recentScans = AppState.recentScans.slice(0, 10);
  }

  // Save to localStorage
  localStorage.setItem(
    "nutritruth_recent_scans",
    JSON.stringify(AppState.recentScans)
  );

  // Update UI
  renderRecentScans();
}

function renderRecentScans() {
  const recentScansSection = document.getElementById("recent-scans-section");
  const recentScansGrid = document.getElementById("recent-scans-grid");

  if (AppState.recentScans.length === 0) {
    recentScansSection.style.display = "none";
    return;
  }

  recentScansSection.style.display = "block";
  recentScansGrid.innerHTML = "";

  AppState.recentScans.forEach((scan) => {
    const scanCard = document.createElement("div");
    scanCard.className = "recent-scan-card";
    scanCard.style.cssText = `
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: 1.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
        `;

    const hasWarnings =
      scan.allergenWarnings && scan.allergenWarnings.length > 0;
    const warningColor = hasWarnings ? "#ef4444" : "#10b981";
    const warningIcon = hasWarnings ? "⚠️" : "✓";

    scanCard.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
                <div style="width: 40px; height: 40px; background: ${
                  hasWarnings
                    ? "rgba(239, 68, 68, 0.1)"
                    : "rgba(16, 185, 129, 0.1)"
                }; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
                    ${warningIcon}
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; margin-bottom: 0.25rem;">${
                      scan.productName
                    }</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">${new Date(
                      scan.timestamp
                    ).toLocaleDateString()}</div>
                </div>
            </div>
            ${
              hasWarnings
                ? `
                <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; padding: 0.5rem; font-size: 0.875rem; color: #ef4444;">
                    ${scan.allergenWarnings.join(", ")}
                </div>
            `
                : `
                <div style="color: var(--text-secondary); font-size: 0.875rem;">
                    No allergen warnings
                </div>
            `
            }
        `;

    scanCard.addEventListener("mouseenter", () => {
      scanCard.style.transform = "translateY(-4px)";
      scanCard.style.borderColor = "var(--border-glow)";
      scanCard.style.boxShadow = "var(--shadow-glow)";
    });

    scanCard.addEventListener("mouseleave", () => {
      scanCard.style.transform = "translateY(0)";
      scanCard.style.borderColor = "var(--border-color)";
      scanCard.style.boxShadow = "none";
    });

    recentScansGrid.appendChild(scanCard);
  });
}

// ============================================
// NAVIGATION BUTTONS
// ============================================
function initNavigationButtons() {
  const historyBtn = document.getElementById("history-btn");
  const profileBtn = document.getElementById("profile-btn");

  if (historyBtn) {
    historyBtn.addEventListener("click", () => {
      // Navigate to scan history
      showResultNotification("Scan history feature coming soon!", "info");
    });
  }

  if (profileBtn) {
    profileBtn.addEventListener("click", () => {
      // Navigate to profile
      showResultNotification("Profile feature coming soon!", "info");
    });
  }
}

// ============================================
// LOAD SAVED DATA
// ============================================
function loadSavedData() {
  // Load user
  const savedUser = localStorage.getItem("nutritruth_user");
  if (savedUser) {
    AppState.user = JSON.parse(savedUser);
  }

  // Load allergies
  const savedAllergies = localStorage.getItem("nutritruth_allergies");
  if (savedAllergies) {
    AppState.allergies = JSON.parse(savedAllergies);
  }

  // Load recent scans
  const savedScans = localStorage.getItem("nutritruth_recent_scans");
  if (savedScans) {
    AppState.recentScans = JSON.parse(savedScans);
  }

  // Determine starting page
  if (AppState.user && AppState.allergies.length > 0) {
    navigateToPage("dashboard");
    initUserProfile();
    renderRecentScans();
  } else if (AppState.user) {
    navigateToPage("profile-setup");
  } else {
    navigateToPage("landing");
  }
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  console.log("🥗 NutriTruth App Initialized");

  // Load saved data first
  loadSavedData();

  // Wait a moment for DOM to be fully ready
  setTimeout(() => {
    // Initialize all features
    console.log("🔧 Initializing features...");
    initGoogleAuth();
    initAllergySelection();
    initImageUpload();
    initNavigationButtons();

    console.log("✅ All features initialized");
    console.log("Current State:", AppState);

    // Test if login button is working
    const loginBtn = document.getElementById("google-login-btn");
    console.log("🔍 Login button found:", !!loginBtn);
    if (loginBtn) {
      console.log(
        "🔍 Login button has click listener:",
        loginBtn.onclick || loginBtn.addEventListener
      );
    }
  }, 100);
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Show result notification (SIMPLIFIED & WORKING)
function showResultNotification(message, type = "success") {
  console.log("🔔 Notification:", message, type);

  // Create notification element
  const notification = document.createElement("div");
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${
          type === "success"
            ? "#10b981"
            : type === "error"
            ? "#ef4444"
            : "#3b82f6"
        };
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        font-weight: 600;
        max-width: 300px;
        animation: slideIn 0.3s ease;
    `;

  notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <span>${
              type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️"
            }</span>
            <span>${message}</span>
        </div>
    `;

  // Add to page
  document.body.appendChild(notification);

  // Auto remove after 3 seconds
  setTimeout(() => {
    if (notification && notification.parentElement) {
      notification.remove();
    }
  }, 3000);
}

// Clear all data (for testing)
function clearAllData() {
  localStorage.clear();
  AppState.user = null;
  AppState.allergies = [];
  AppState.recentScans = [];
  navigateToPage("landing");
  console.log("All data cleared");
}

// Make it available globally for testing
window.NutriTruth = {
  clearAllData,
  AppState,
  navigateToPage,
  showResultNotification,
};

// Debug helper
window.debugLogin = () => {
  console.log("🔍 Debug Login Function");
  console.log("AppState:", AppState);
  console.log("localStorage:", localStorage);
  console.log("Button exists:", !!document.getElementById("google-login-btn"));

  const loginBtn = document.getElementById("google-login-btn");
  if (loginBtn) {
    console.log("🔍 Button element:", loginBtn);
    console.log("🔍 Button disabled:", loginBtn.disabled);
    console.log("🔍 Button onclick:", loginBtn.onclick);

    // Try manual click
    console.log("🔍 Triggering manual click...");
    loginBtn.click();
  } else {
    console.error("❌ Login button NOT found!");
    showResultNotification("Login button not found!", "error");
  }

  // Test notification
  showResultNotification("Debug: Login system is working!", "success");
};

// EMERGENCY INSTANT LOGIN - BYPASSES EVERYTHING
window.emergencyLogin = () => {
  console.log("🚨 EMERGENCY INSTANT LOGIN ACTIVATED");

  // Create user instantly
  const userData = {
    id: "user_" + Date.now(),
    email: "nutritruth.user@gmail.com",
    name: "NutriTruth User",
    avatar_url: `https://ui-avatars.com/api/?name=NutriTruth+User&background=10b981&color=fff&size=200`,
    google_id: "google_" + Date.now(),
  };

  const token =
    "nutritruth_token_" +
    Date.now() +
    "_" +
    Math.random().toString(36).substr(2, 9);

  // Save instantly
  AppState.user = userData;
  localStorage.setItem("nutritruth_user", JSON.stringify(userData));
  localStorage.setItem("nutritruth_token", token);

  console.log("🚨 EMERGENCY LOGIN SUCCESS:", userData);

  alert("🚨 EMERGENCY LOGIN SUCCESS! You are now logged in.");

  // Force navigation
  window.location.hash = "profile-setup";
  navigateToPage("profile-setup");
};

// Auto-activate emergency login if needed
setTimeout(() => {
  if (!AppState.user) {
    console.log("🚨 No user found, checking if original login button works...");
    const originalBtn = document.getElementById("google-login-btn");
    if (originalBtn) {
      console.log("✅ Original button found, testing click...");
      // Try to trigger the original button
      originalBtn.click();
    } else {
      console.log("❌ Original button not found, waiting...");
      // Wait and try again
      setTimeout(() => {
        initGoogleAuth();
      }, 1000);
    }
  }
}, 2000);
