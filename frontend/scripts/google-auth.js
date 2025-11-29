// ============================================
// GOOGLE IDENTITY SERVICES (GIS) INTEGRATION
// ============================================

const GOOGLE_CLIENT_ID =
  "260430884397-9f63mcjq8a4kbu2m1r949nrf1r9deid4.apps.googleusercontent.com";

// ============================================
// GOOGLE SIGN-IN INITIALIZATION
// ============================================
function initGoogleSignIn() {
  // Check if user is already logged in
  const savedUser = localStorage.getItem("nutritruth_user");
  if (savedUser) {
    console.log(
      "✅ User already logged in, skipping Google Sign-In initialization"
    );
    return;
  }

  // Load Google Identity Services library
  const script = document.createElement("script");
  script.src = "https://accounts.google.com/gsi/client";
  script.async = true;
  script.defer = true;
  script.onload = initializeGoogleButton;
  script.onerror = () => {
    console.error("Failed to load Google Sign-In library");
    setupFallbackLogin();
  };
  document.head.appendChild(script);
}

// ============================================
// INITIALIZE GOOGLE BUTTON
// ============================================
function initializeGoogleButton() {
  try {
    // Initialize Google Sign-In
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    // Get the button container
    const googleLoginBtn = document.getElementById("google-login-btn");
    if (googleLoginBtn) {
      // Clear existing content and render Google button
      googleLoginBtn.style.display = "none";

      // Create a container for Google's rendered button
      const googleBtnContainer = document.createElement("div");
      googleBtnContainer.id = "google-btn-container";
      googleBtnContainer.style.cssText =
        "display: flex; justify-content: center; margin: 20px 0;";
      googleLoginBtn.parentNode.insertBefore(
        googleBtnContainer,
        googleLoginBtn
      );

      // Render the Google Sign-In button
      google.accounts.id.renderButton(googleBtnContainer, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        width: 280,
      });
    }

    console.log("✅ Google Sign-In button rendered");
  } catch (error) {
    console.error("Failed to initialize Google Sign-In:", error);
    setupFallbackLogin();
  }
}

// ============================================
// HANDLE CREDENTIAL RESPONSE (JWT from Google)
// ============================================
async function handleCredentialResponse(response) {
  try {
    console.log("Google credential received");

    // Decode the JWT to get user info
    const payload = decodeJwtPayload(response.credential);

    const userData = {
      email: payload.email,
      name: payload.name,
      avatar_url: payload.picture,
      google_id: payload.sub,
      id_token: response.credential,
    };

    console.log("Google user data:", userData);

    // Authenticate with backend
    const backendResponse = await apiCall("/auth/google", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    // Save user data and token
    AppState.user = backendResponse.user;
    localStorage.setItem(
      "nutritruth_user",
      JSON.stringify(backendResponse.user)
    );
    localStorage.setItem("nutritruth_token", backendResponse.token);
    localStorage.setItem("nutritruth_google_user", JSON.stringify(userData));

    // Navigate to profile setup
    navigateToPage("profile-setup");
  } catch (error) {
    console.error("Google authentication failed:", error);
    showResultNotification(
      "Failed to sign in with Google. Please try again.",
      "error"
    );
  }
}

// ============================================
// DECODE JWT PAYLOAD
// ============================================
function decodeJwtPayload(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return {};
  }
}

// ============================================
// FALLBACK LOGIN (Demo Mode)
// ============================================
function setupFallbackLogin() {
  const googleLoginBtn = document.getElementById("google-login-btn");
  if (googleLoginBtn) {
    googleLoginBtn.style.display = "flex";
    googleLoginBtn.onclick = () => {
      // Demo login for testing
      const demoUser = {
        id: "demo-user-" + Date.now(),
        email: "demo@nutritruth.app",
        name: "Demo User",
        avatar_url: null,
      };

      AppState.user = demoUser;
      localStorage.setItem("nutritruth_user", JSON.stringify(demoUser));
      localStorage.setItem("nutritruth_token", "demo-token");

      showResultNotification("Signed in as Demo User", "success");
      navigateToPage("profile-setup");
    };
  }
}

// ============================================
// GOOGLE SIGN-OUT
// ============================================
function googleSignOut() {
  google.accounts.id.disableAutoSelect();
  clearAllData();
}

// ============================================
// CHECK GOOGLE AUTH STATUS
// ============================================
function checkGoogleAuthStatus() {
  const savedGoogleUser = localStorage.getItem("nutritruth_google_user");
  if (savedGoogleUser) {
    try {
      const googleUser = JSON.parse(savedGoogleUser);
      console.log("Found saved Google user:", googleUser);
      return googleUser;
    } catch (error) {
      console.error("Error parsing saved Google user:", error);
    }
  }
  return null;
}

// Export functions for global access
window.GoogleAuth = {
  initGoogleSignIn,
  handleCredentialResponse,
  googleSignOut,
  checkGoogleAuthStatus,
};
