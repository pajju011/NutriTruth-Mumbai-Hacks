// ============================================
// GOOGLE SIGN-IN / DEMO MODE
// ============================================

const GOOGLE_CLIENT_ID =
  "260430884397-9f63mcjq8a4kbu2m1r949nrf1r9deid4.apps.googleusercontent.com";

// ============================================
// INITIALIZATION
// ============================================
function initGoogleSignIn() {
  // Check if user is already logged in
  const savedUser = localStorage.getItem("nutritruth_user");
  if (savedUser) {
    console.log("✅ User already logged in");
    return;
  }

  // Check if demo mode - skip Google and use demo login
  if (window.N8N_CONFIG?.DEMO_MODE) {
    console.log("📌 Demo mode enabled - using demo login");
    setupDemoLogin();
    return;
  }

  // Try to load Google Sign-In
  loadGoogleSignIn();
}

// ============================================
// LOAD GOOGLE SIGN-IN LIBRARY
// ============================================
function loadGoogleSignIn() {
  const script = document.createElement("script");
  script.src = "https://accounts.google.com/gsi/client";
  script.async = true;
  script.defer = true;
  script.onload = initializeGoogleButton;
  script.onerror = () => {
    console.error("Failed to load Google Sign-In library");
    setupDemoLogin();
  };
  document.head.appendChild(script);
}

// ============================================
// INITIALIZE GOOGLE BUTTON
// ============================================
function initializeGoogleButton() {
  try {
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    const googleLoginBtn = document.getElementById("google-login-btn");
    if (googleLoginBtn) {
      googleLoginBtn.style.display = "none";

      const googleBtnContainer = document.createElement("div");
      googleBtnContainer.id = "google-btn-container";
      googleBtnContainer.style.cssText =
        "display: flex; flex-direction: column; align-items: center; gap: 10px; margin: 20px 0;";
      googleLoginBtn.parentNode.insertBefore(
        googleBtnContainer,
        googleLoginBtn
      );

      google.accounts.id.renderButton(googleBtnContainer, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        width: 280,
      });

      // Add demo login link below
      const demoLink = document.createElement("button");
      demoLink.textContent = "Skip - Continue as Demo User";
      demoLink.style.cssText =
        "background: none; border: none; color: #888; cursor: pointer; font-size: 14px; text-decoration: underline; margin-top: 10px;";
      demoLink.onclick = demoLogin;
      googleBtnContainer.appendChild(demoLink);
    }

    console.log("✅ Google Sign-In initialized");
  } catch (error) {
    console.error("Failed to initialize Google Sign-In:", error);
    setupDemoLogin();
  }
}

// ============================================
// SETUP DEMO LOGIN BUTTON
// ============================================
function setupDemoLogin() {
  const googleLoginBtn = document.getElementById("google-login-btn");
  if (googleLoginBtn) {
    googleLoginBtn.innerHTML = `
      <svg class="google-icon" viewBox="0 0 24 24" style="width: 20px; height: 20px; margin-right: 10px;">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      <span>Continue as Demo User</span>
    `;
    googleLoginBtn.style.display = "flex";
    googleLoginBtn.onclick = demoLogin;
  }
}

// ============================================
// DEMO LOGIN
// ============================================
function demoLogin() {
  const demoUser = {
    id: "demo-user-" + Date.now(),
    email: "demo@nutritruth.app",
    name: "Demo User",
    avatar_url: null,
  };

  AppState.user = demoUser;
  localStorage.setItem("nutritruth_user", JSON.stringify(demoUser));
  localStorage.setItem("nutritruth_token", "demo-token");

  if (typeof showResultNotification === "function") {
    showResultNotification("Signed in as Demo User", "success");
  }
  navigateToPage("profile-setup");
}

// ============================================
// HANDLE GOOGLE CREDENTIAL RESPONSE
// ============================================
async function handleCredentialResponse(response) {
  try {
    const payload = decodeJwtPayload(response.credential);

    const userData = {
      email: payload.email,
      name: payload.name,
      avatar_url: payload.picture,
      google_id: payload.sub,
      id_token: response.credential,
    };

    // Try backend auth
    try {
      const backendResponse = await apiCall("/auth/google", {
        method: "POST",
        body: JSON.stringify(userData),
      });

      AppState.user = backendResponse.user;
      localStorage.setItem(
        "nutritruth_user",
        JSON.stringify(backendResponse.user)
      );
      localStorage.setItem("nutritruth_token", backendResponse.token);
    } catch (backendError) {
      // Backend failed, use local user data
      const localUser = {
        id: userData.google_id,
        email: userData.email,
        name: userData.name,
        avatar_url: userData.avatar_url,
      };
      AppState.user = localUser;
      localStorage.setItem("nutritruth_user", JSON.stringify(localUser));
      localStorage.setItem("nutritruth_token", "local-token");
    }

    localStorage.setItem("nutritruth_google_user", JSON.stringify(userData));
    navigateToPage("profile-setup");
  } catch (error) {
    console.error("Google authentication failed:", error);
    showResultNotification("Sign-in failed. Try demo mode.", "error");
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
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return {};
  }
}

// ============================================
// SIGN OUT
// ============================================
function googleSignOut() {
  try {
    if (typeof google !== "undefined") {
      google.accounts.id.disableAutoSelect();
    }
  } catch (e) {}
  clearAllData();
}

// ============================================
// CHECK AUTH STATUS
// ============================================
function checkGoogleAuthStatus() {
  const savedGoogleUser = localStorage.getItem("nutritruth_google_user");
  if (savedGoogleUser) {
    try {
      return JSON.parse(savedGoogleUser);
    } catch (error) {}
  }
  return null;
}

// Export
window.GoogleAuth = {
  initGoogleSignIn,
  handleCredentialResponse,
  googleSignOut,
  checkGoogleAuthStatus,
  demoLogin,
};
