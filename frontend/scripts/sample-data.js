// Sample product data for testing
// This can be used to simulate API responses during development

const SAMPLE_PRODUCTS = {
  // Sample OCR Response
  ocrSample: {
    success: true,
    productName: "Chocolate Chip Cookies",
    extractedText: "INGREDIENTS: Wheat flour, Sugar, Chocolate chips (sugar, cocoa, soy lecithin), Palm oil, Eggs, Milk powder, Salt, Artificial vanilla flavor, Baking soda",
    ingredients: [
      "Wheat flour",
      "Sugar",
      "Chocolate chips (sugar, cocoa, soy lecithin)",
      "Palm oil",
      "Eggs",
      "Milk powder",
      "Salt",
      "Artificial vanilla flavor",
      "Baking soda"
    ],
    allergenWarnings: [
      "Contains gluten (wheat)",
      "Contains soy",
      "Contains lactose (milk)",
      "Contains artificial flavors"
    ],
    nutritionFacts: {
      servingSize: "30g (2 cookies)",
      calories: 150,
      protein: "2g",
      carbs: "20g",
      fat: "7g",
      sugar: "10g",
      sodium: "95mg"
    }
  },

  // Sample Barcode Response - Gluten-Free Product
  barcodeSample1: {
    success: true,
    barcode: "012345678901",
    productName: "Organic Almond Butter",
    brand: "Nature's Best",
    ingredients: [
      "Organic roasted almonds",
      "Sea salt"
    ],
    allergenWarnings: [
      "Contains tree nuts (almonds)",
      "May contain traces of peanuts"
    ],
    nutritionFacts: {
      servingSize: "32g (2 tbsp)",
      calories: 190,
      protein: "7g",
      carbs: "6g",
      fat: "17g",
      sugar: "1g",
      sodium: "75mg"
    },
    certifications: ["USDA Organic", "Non-GMO", "Gluten-Free"]
  },

  // Sample Barcode Response - Multiple Allergens
  barcodeSample2: {
    success: true,
    barcode: "098765432109",
    productName: "Seafood Pasta Sauce",
    brand: "Ocean Delights",
    ingredients: [
      "Tomatoes",
      "Shrimp",
      "Crab meat",
      "Olive oil",
      "Garlic",
      "White wine",
      "Cream",
      "Wheat flour",
      "Salt",
      "Spices"
    ],
    allergenWarnings: [
      "Contains seafood (shrimp, crab)",
      "Contains lactose (cream)",
      "Contains gluten (wheat flour)"
    ],
    nutritionFacts: {
      servingSize: "125g (1/2 cup)",
      calories: 120,
      protein: "8g",
      carbs: "10g",
      fat: "6g",
      sugar: "4g",
      sodium: "480mg"
    }
  },

  // Sample Barcode Response - Safe Product (No Allergens)
  barcodeSample3: {
    success: true,
    barcode: "111222333444",
    productName: "Organic Apple Juice",
    brand: "Pure Harvest",
    ingredients: [
      "Organic apple juice from concentrate",
      "Vitamin C (ascorbic acid)"
    ],
    allergenWarnings: [],
    nutritionFacts: {
      servingSize: "240ml (1 cup)",
      calories: 110,
      protein: "0g",
      carbs: "28g",
      fat: "0g",
      sugar: "24g",
      sodium: "10mg"
    },
    certifications: ["USDA Organic", "Non-GMO", "Vegan"]
  },

  // Sample Barcode Response - Artificial Ingredients
  barcodeSample4: {
    success: true,
    barcode: "555666777888",
    productName: "Rainbow Candy Mix",
    brand: "Sweet Treats",
    ingredients: [
      "Sugar",
      "Corn syrup",
      "Modified corn starch",
      "Citric acid",
      "Artificial flavors (strawberry, orange, lemon, lime, grape)",
      "Artificial colors (Red 40, Yellow 5, Blue 1, Yellow 6)",
      "Sodium citrate"
    ],
    allergenWarnings: [
      "Contains artificial colors",
      "Contains artificial flavors"
    ],
    nutritionFacts: {
      servingSize: "40g (about 15 pieces)",
      calories: 140,
      protein: "0g",
      carbs: "36g",
      fat: "0g",
      sugar: "28g",
      sodium: "15mg"
    }
  }
};

// Export for use in testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SAMPLE_PRODUCTS;
}

// Make available globally for browser testing
if (typeof window !== 'undefined') {
  window.SAMPLE_PRODUCTS = SAMPLE_PRODUCTS;
}
