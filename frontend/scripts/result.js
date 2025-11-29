/* ===================================
   NutriTruth Result Page Logic
   =================================== */

// Global State
const ResultState = {
  productData: null,
  userData: null,
  charts: {
    nutrientBar: null,
    macroPie: null,
  },
};

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  initResultPage();
});

/**
 * Initialize the result page
 */
function initResultPage() {
  // Load user data
  loadUserData();

  // Load product data from localStorage or URL params
  loadProductData();

  // Setup event listeners
  setupEventListeners();

  // Render all sections
  if (ResultState.productData) {
    hideLoadingOverlay();
    renderProductHeader();
    renderProductAnalysis();
    renderIngredientAnalysis();
    renderAdVerification();
    renderAllergyCheck();
  } else {
    // Show message if no scan data available
    hideLoadingOverlay();
    showNoScanDataMessage();
  }
}

/**
 * Show message when no scan data is available
 */
function showNoScanDataMessage() {
  const container = document.querySelector(".result-container");
  container.innerHTML = `
        <div style="text-align: center; padding: 4rem 2rem;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">📦</div>
            <h2 style="color: #fff; margin-bottom: 1rem;">No Scan Data Available</h2>
            <p style="color: #a0aec0; margin-bottom: 2rem;">
                Please scan a product first to see the analysis results.
            </p>
            <button onclick="window.location.href='index.html#dashboard'" 
                    style="background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); color: white; border: none; padding: 1rem 2rem; border-radius: 12px; font-size: 1rem; font-weight: 600; cursor: pointer;">
                Go to Dashboard
            </button>
            <br><br>
            <button onclick="window.NutriTruthResult.loadDemoData()" 
                    style="background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); color: white; border: none; padding: 1rem 2rem; border-radius: 12px; font-size: 1rem; font-weight: 600; cursor: pointer; margin-top: 1rem;">
                Load Demo Data
            </button>
        </div>
    `;
}

/**
 * Hide loading overlay
 */
function hideLoadingOverlay() {
  const overlay = document.getElementById("loading-overlay");
  if (overlay) {
    overlay.style.display = "none";
  }
}

/**
 * Load user data from localStorage
 */
function loadUserData() {
  const userStr = localStorage.getItem("nutritruth_user");
  const allergiesStr = localStorage.getItem("nutritruth_allergies");

  if (userStr) {
    ResultState.userData = JSON.parse(userStr);
    ResultState.userData.allergies = allergiesStr
      ? JSON.parse(allergiesStr)
      : [];

    // Update user info in header
    document.getElementById("user-name").textContent =
      ResultState.userData.name || "User";
    const avatar = document.getElementById("user-avatar");
    if (ResultState.userData.picture) {
      avatar.src = ResultState.userData.picture;
    } else {
      avatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        ResultState.userData.name || "User"
      )}&background=10b981&color=fff`;
    }
  }
}

/**
 * Load product data from localStorage
 */
function loadProductData() {
  // Try multiple sources for product data
  let productStr = localStorage.getItem("nutritruth_last_scan");

  if (productStr) {
    const scanData = JSON.parse(productStr);
    ResultState.productData = scanData.result || scanData;
  } else {
    // Fallback to old key
    productStr = localStorage.getItem("nutritruth_current_product");
    if (productStr) {
      ResultState.productData = JSON.parse(productStr);
    }
  }
}

/**
 * Load demo data for testing
 */
function loadDemoData() {
  ResultState.productData = {
    name: "Organic Granola Bar",
    brand: "Nature's Best",
    barcode: "012345678901",
    image:
      "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400&h=400&fit=crop",
    healthScore: 75,
    healthTag: "healthy", // healthy, risky, avoid
    nutrition: {
      calories: 150,
      totalFat: 6,
      saturatedFat: 1,
      transFat: 0,
      cholesterol: 0,
      sodium: 95,
      totalCarbs: 22,
      fiber: 3,
      sugars: 8,
      protein: 3,
      vitaminD: 0,
      calcium: 20,
      iron: 1.5,
      potassium: 100,
    },
    macros: {
      carbs: 58,
      protein: 8,
      fat: 34,
    },
    ingredients: [
      { name: "Whole Grain Oats", safe: true },
      { name: "Honey", safe: true },
      { name: "Almonds", safe: true },
      { name: "Brown Rice Syrup", safe: true },
      { name: "Dried Cranberries", safe: true },
      { name: "Sunflower Oil", safe: true },
      { name: "Natural Vanilla Flavor", safe: true },
      { name: "Sea Salt", safe: true },
      {
        name: "Soy Lecithin",
        safe: false,
        harmful: true,
        severity: "low",
        eNumber: "E322",
        description:
          "An emulsifier derived from soybeans. May cause allergic reactions in soy-sensitive individuals.",
      },
    ],
    harmfulIngredients: [
      {
        name: "Soy Lecithin",
        severity: "low",
        eNumber: "E322",
        description:
          "An emulsifier derived from soybeans. Generally recognized as safe, but may cause allergic reactions in individuals with soy sensitivity. Used to prevent ingredients from separating.",
      },
    ],
    adClaims: [
      {
        claim: "100% Natural Ingredients",
        truthScore: 85,
        explanation:
          "Most ingredients are natural, but 'natural vanilla flavor' may contain synthetic components. The claim is mostly accurate but not entirely precise.",
      },
      {
        claim: "High in Fiber",
        truthScore: 60,
        explanation:
          "Contains 3g of fiber per serving, which is moderate but not exceptionally high. The FDA defines 'high fiber' as 5g or more per serving.",
      },
    ],
    allergenWarnings: {
      detected: ["Soy"],
      userAllergies: ["Peanut", "Lactose"],
      matches: [],
    },
  };

  // Render with demo data
  renderProductHeader();
  renderProductAnalysis();
  renderIngredientAnalysis();
  renderAdVerification();
  renderAllergyCheck();
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Back button
  document.getElementById("back-btn").addEventListener("click", () => {
    window.location.href = "index.html#dashboard";
  });

  // Save report
  document
    .getElementById("save-report-btn")
    .addEventListener("click", saveReport);

  // Share button
  document.getElementById("share-btn").addEventListener("click", shareReport);

  // Scan another
  document.getElementById("scan-another-btn").addEventListener("click", () => {
    window.location.href = "index.html#dashboard";
  });
}

/**
 * Render product header
 */
function renderProductHeader() {
  const data = ResultState.productData;

  document.getElementById("product-name").textContent = data.name;
  document.getElementById("product-brand").textContent = data.brand;
  document.getElementById(
    "product-barcode"
  ).textContent = `Barcode: ${data.barcode}`;

  const productImage = document.getElementById("product-image");
  productImage.src = data.image;
  productImage.alt = data.name;
}

/**
 * Render Section 1: Product Analysis
 */
function renderProductAnalysis() {
  const data = ResultState.productData;

  // Health Score
  const healthTag = document.getElementById("health-tag");
  const healthScore = document.getElementById("health-score");

  healthTag.className = `health-tag ${data.healthTag}`;
  healthTag.textContent =
    data.healthTag.charAt(0).toUpperCase() + data.healthTag.slice(1);
  healthScore.textContent = `${data.healthScore}/100`;

  // Create charts
  createNutrientBarChart(data.nutrition);
  createMacroPieChart(data.macros);

  // Create nutrition table
  createNutritionTable(data.nutrition);
}

/**
 * Create nutrient bar chart
 */
function createNutrientBarChart(nutrition) {
  const ctx = document.getElementById("nutrient-bar-chart").getContext("2d");

  // Destroy existing chart if any
  if (ResultState.charts.nutrientBar) {
    ResultState.charts.nutrientBar.destroy();
  }

  const data = {
    labels: ["Sugar", "Sodium", "Total Carbs", "Total Fat", "Protein"],
    datasets: [
      {
        label: "Amount (g/mg)",
        data: [
          nutrition.sugars,
          nutrition.sodium,
          nutrition.totalCarbs,
          nutrition.totalFat,
          nutrition.protein,
        ],
        backgroundColor: [
          "rgba(239, 68, 68, 0.8)", // Sugar - red
          "rgba(245, 158, 11, 0.8)", // Sodium - orange
          "rgba(59, 130, 246, 0.8)", // Carbs - blue
          "rgba(139, 92, 246, 0.8)", // Fat - purple
          "rgba(16, 185, 129, 0.8)", // Protein - green
        ],
        borderColor: [
          "rgba(239, 68, 68, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(139, 92, 246, 1)",
          "rgba(16, 185, 129, 1)",
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const config = {
    type: "bar",
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          padding: 12,
          titleFont: {
            size: 14,
            weight: "bold",
          },
          bodyFont: {
            size: 13,
          },
          borderColor: "rgba(255, 255, 255, 0.2)",
          borderWidth: 1,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
          ticks: {
            color: "#a0aec0",
            font: {
              size: 12,
            },
          },
        },
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: "#a0aec0",
            font: {
              size: 12,
            },
          },
        },
      },
    },
  };

  ResultState.charts.nutrientBar = new Chart(ctx, config);
}

/**
 * Create macro pie chart
 */
function createMacroPieChart(macros) {
  const ctx = document.getElementById("macro-pie-chart").getContext("2d");

  // Destroy existing chart if any
  if (ResultState.charts.macroPie) {
    ResultState.charts.macroPie.destroy();
  }

  const data = {
    labels: ["Carbohydrates", "Protein", "Fat"],
    datasets: [
      {
        data: [macros.carbs, macros.protein, macros.fat],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)", // Carbs - blue
          "rgba(16, 185, 129, 0.8)", // Protein - green
          "rgba(139, 92, 246, 0.8)", // Fat - purple
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(139, 92, 246, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const config = {
    type: "doughnut",
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#a0aec0",
            font: {
              size: 13,
            },
            padding: 15,
            usePointStyle: true,
          },
        },
        tooltip: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          padding: 12,
          titleFont: {
            size: 14,
            weight: "bold",
          },
          bodyFont: {
            size: 13,
          },
          borderColor: "rgba(255, 255, 255, 0.2)",
          borderWidth: 1,
          callbacks: {
            label: function (context) {
              return `${context.label}: ${context.parsed}%`;
            },
          },
        },
      },
    },
  };

  ResultState.charts.macroPie = new Chart(ctx, config);

  // Update macro stats
  const macroStatsHTML = `
        <div class="macro-stat">
            <div class="macro-stat-label">Carbs</div>
            <div class="macro-stat-value">${macros.carbs}%</div>
        </div>
        <div class="macro-stat">
            <div class="macro-stat-label">Protein</div>
            <div class="macro-stat-value">${macros.protein}%</div>
        </div>
        <div class="macro-stat">
            <div class="macro-stat-label">Fat</div>
            <div class="macro-stat-value">${macros.fat}%</div>
        </div>
    `;
  document.getElementById("macro-stats").innerHTML = macroStatsHTML;
}

/**
 * Create nutrition table
 */
function createNutritionTable(nutrition) {
  const tbody = document.getElementById("nutrition-tbody");

  const nutrients = [
    {
      name: "Calories",
      amount: `${nutrition.calories} kcal`,
      dv: Math.round((nutrition.calories / 2000) * 100),
    },
    {
      name: "Total Fat",
      amount: `${nutrition.totalFat}g`,
      dv: Math.round((nutrition.totalFat / 78) * 100),
    },
    {
      name: "Saturated Fat",
      amount: `${nutrition.saturatedFat}g`,
      dv: Math.round((nutrition.saturatedFat / 20) * 100),
    },
    { name: "Trans Fat", amount: `${nutrition.transFat}g`, dv: 0 },
    {
      name: "Cholesterol",
      amount: `${nutrition.cholesterol}mg`,
      dv: Math.round((nutrition.cholesterol / 300) * 100),
    },
    {
      name: "Sodium",
      amount: `${nutrition.sodium}mg`,
      dv: Math.round((nutrition.sodium / 2300) * 100),
    },
    {
      name: "Total Carbohydrates",
      amount: `${nutrition.totalCarbs}g`,
      dv: Math.round((nutrition.totalCarbs / 275) * 100),
    },
    {
      name: "Dietary Fiber",
      amount: `${nutrition.fiber}g`,
      dv: Math.round((nutrition.fiber / 28) * 100),
    },
    {
      name: "Total Sugars",
      amount: `${nutrition.sugars}g`,
      dv: Math.round((nutrition.sugars / 50) * 100),
    },
    {
      name: "Protein",
      amount: `${nutrition.protein}g`,
      dv: Math.round((nutrition.protein / 50) * 100),
    },
  ];

  tbody.innerHTML = nutrients
    .map((nutrient) => {
      const dvClass =
        nutrient.dv > 20 ? "high" : nutrient.dv > 10 ? "medium" : "low";
      return `
            <tr>
                <td><strong>${nutrient.name}</strong></td>
                <td>${nutrient.amount}</td>
                <td>
                    ${nutrient.dv}%
                    <div class="daily-value-bar">
                        <div class="daily-value-fill ${dvClass}" style="width: ${Math.min(
        nutrient.dv,
        100
      )}%"></div>
                    </div>
                </td>
            </tr>
        `;
    })
    .join("");
}

/**
 * Render Section 2: Ingredient Analysis
 */
function renderIngredientAnalysis() {
  const data = ResultState.productData;
  const container = document.getElementById("harmful-ingredients-container");

  if (!data.harmfulIngredients || data.harmfulIngredients.length === 0) {
    // No harmful ingredients
    container.innerHTML = `
            <div class="no-harmful-message">
                <div class="no-harmful-icon">✅</div>
                <div class="no-harmful-text">No harmful or risky ingredients found.</div>
            </div>
        `;
  } else {
    // Display harmful ingredients
    container.innerHTML = data.harmfulIngredients
      .map(
        (ingredient) => `
            <div class="harmful-ingredient-card">
                <div class="ingredient-header">
                    <h5 class="ingredient-name">${ingredient.name}</h5>
                    <span class="severity-badge ${
                      ingredient.severity
                    }">${ingredient.severity.toUpperCase()}</span>
                </div>
                <p class="ingredient-description">${ingredient.description}</p>
                ${
                  ingredient.eNumber
                    ? `<span class="e-number">${ingredient.eNumber}</span>`
                    : ""
                }
            </div>
        `
      )
      .join("");
  }

  // Display all ingredients
  const ingredientsList = document.getElementById("all-ingredients-list");
  ingredientsList.innerHTML = data.ingredients
    .map(
      (ingredient) => `
        <span class="ingredient-tag ${ingredient.harmful ? "harmful" : "safe"}">
            ${ingredient.name}
        </span>
    `
    )
    .join("");
}

/**
 * Render Section 3: Advertisement Claim Verification
 */
function renderAdVerification() {
  const data = ResultState.productData;
  const container = document.getElementById("ad-claims-container");

  if (!data.adClaims || data.adClaims.length === 0) {
    // No ad claims
    container.innerHTML = `
            <div class="no-claims-message">
                <div class="no-claims-icon">ℹ️</div>
                <div class="no-claims-text">No ad claims found in this product.</div>
            </div>
        `;
  } else {
    // Display ad claims
    container.innerHTML = data.adClaims
      .map((claim) => {
        const scoreClass =
          claim.truthScore >= 75
            ? "high"
            : claim.truthScore >= 50
            ? "medium"
            : "low";
        return `
                <div class="claim-card">
                    <div class="claim-header">
                        <div class="claim-text">"${claim.claim}"</div>
                        <div class="truth-score">
                            <span class="truth-score-label">Truth Score:</span>
                            <span class="truth-score-value ${scoreClass}">${claim.truthScore}%</span>
                        </div>
                    </div>
                    <p class="claim-explanation">${claim.explanation}</p>
                </div>
            `;
      })
      .join("");
  }
}

/**
 * Render Section 4: Personalized Allergy Analysis
 */
function renderAllergyCheck() {
  const data = ResultState.productData;
  const container = document.getElementById("allergy-warnings-container");

  // Check if user has allergies set
  if (
    !ResultState.userData ||
    !ResultState.userData.allergies ||
    ResultState.userData.allergies.length === 0
  ) {
    // No allergies on profile
    container.innerHTML = `
            <div class="no-profile-message">
                <div class="no-profile-icon">ℹ️</div>
                <div class="no-profile-text">No personalized warnings. You have no allergies on your profile.</div>
                <p style="color: var(--color-text-secondary); margin-top: 1rem;">
                    <span class="update-profile-link" onclick="window.location.href='index.html#profile-setup'">
                        Update your profile
                    </span> to get personalized allergen warnings.
                </p>
            </div>
        `;
    return;
  }

  // Check for allergen matches
  const userAllergies = ResultState.userData.allergies;
  const detectedAllergens = data.allergenWarnings?.detected || [];

  // Find matches
  const matches = userAllergies.filter((allergy) =>
    detectedAllergens.some(
      (detected) =>
        detected.toLowerCase().includes(allergy.toLowerCase()) ||
        allergy.toLowerCase().includes(detected.toLowerCase())
    )
  );

  if (matches.length > 0) {
    // Allergens detected!
    container.innerHTML = `
            <div class="allergy-alert">
                <div class="allergy-alert-header">
                    <div class="allergy-icon">🚨</div>
                    <h4 class="allergy-title">Allergen Warning!</h4>
                </div>
                <p class="allergy-warning-text">This product contains allergens that match your profile:</p>
                <div class="allergen-list">
                    ${matches
                      .map(
                        (allergen) => `
                        <span class="allergen-badge">${allergen}</span>
                    `
                      )
                      .join("")}
                </div>
                <p class="allergy-warning-text" style="margin-top: 1rem; font-weight: 600;">
                    ⚠️ We strongly recommend avoiding this product.
                </p>
            </div>
        `;
  } else {
    // No allergens detected
    container.innerHTML = `
            <div class="no-allergy-message">
                <div class="no-allergy-icon">✅</div>
                <div class="no-allergy-text">This product does not contain your selected allergens.</div>
                <p style="color: var(--color-text-secondary); margin-top: 1rem;">
                    Your allergies: ${userAllergies.join(", ")}
                </p>
            </div>
        `;
  }
}

/**
 * Save report to localStorage
 */
function saveReport() {
  const data = ResultState.productData;

  // Get existing scan history
  let scanHistory = localStorage.getItem("nutritruth_scan_history");
  scanHistory = scanHistory ? JSON.parse(scanHistory) : [];

  // Add current scan
  scanHistory.unshift({
    ...data,
    scannedAt: new Date().toISOString(),
  });

  // Keep only last 50 scans
  scanHistory = scanHistory.slice(0, 50);

  // Save back to localStorage
  localStorage.setItem("nutritruth_scan_history", JSON.stringify(scanHistory));

  // Show success message
  showToast("Report saved successfully!", "success");
}

/**
 * Share report
 */
function shareReport() {
  const data = ResultState.productData;

  if (navigator.share) {
    navigator
      .share({
        title: `NutriTruth Analysis: ${data.name}`,
        text: `Check out this product analysis from NutriTruth! Health Score: ${data.healthScore}/100`,
        url: window.location.href,
      })
      .catch((err) => console.log("Share cancelled"));
  } else {
    // Fallback: copy link to clipboard
    navigator.clipboard.writeText(window.location.href);
    showToast("Link copied to clipboard!", "success");
  }
}

/**
 * Show toast notification
 */
function showToast(message, type = "info") {
  // Create toast element
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background: ${
          type === "success"
            ? "var(--gradient-primary)"
            : "var(--gradient-accent)"
        };
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: 600;
    `;

  document.body.appendChild(toast);

  // Remove after 3 seconds
  setTimeout(() => {
    toast.style.animation = "slideOut 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Add toast animations
const style = document.createElement("style");
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export for global access
window.NutriTruthResult = {
  state: ResultState,
  loadDemoData,
  saveReport,
  shareReport,
};
