// ============================================
// REAL GOOGLE OAUTH 2.0 INTEGRATION
// ============================================

const GOOGLE_CONFIG = {
    CLIENT_ID: '260430884397-9f63mcjq8a4kbu2m1r949nrf1r9deid4.apps.googleusercontent.com',
    CLIENT_SECRET: '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',
    REDIRECT_URI: 'http://localhost:8000/auth/callback',
    SCOPE: 'email profile',
    API_KEY: 'AIzaSyBU6xOROwHeB-GXsjd50C1HT0XJCJP5s1o'
};

// ============================================
// GOOGLE SIGN-IN INITIALIZATION
// ============================================
function initGoogleSignIn() {
    // Load Google Sign-In library
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/platform.js';
    script.onload = () => {
        gapi.load('auth2', () => {
            gapi.auth2.init({
                client_id: GOOGLE_CONFIG.CLIENT_ID,
                cookiepolicy: 'single_host_origin',
                scope: GOOGLE_CONFIG.SCOPE
            });
            
            // Render Google Sign-In button
            gapi.signin2.render('google-login-btn', {
                'onsuccess': handleGoogleSignIn,
                'onfailure': handleGoogleSignInError,
                'theme': 'dark',
                'size': 'large',
                'longtitle': true,
                'width': 300,
                'height': 50
            });
        });
    };
    document.head.appendChild(script);
}

// ============================================
// HANDLE GOOGLE SIGN-IN SUCCESS
// ============================================
async function handleGoogleSignIn(googleUser) {
    try {
        // Show loading state
        const googleLoginBtn = document.getElementById('google-login-btn');
        googleLoginBtn.disabled = true;
        googleLoginBtn.innerHTML = `
            <svg class="google-icon" viewBox="0 0 24 24" style="animation: spin 1s linear infinite;">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" opacity="0.3"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>
            </svg>
            <span>Signing in...</span>
        `;

        // Get user profile information
        const profile = googleUser.getBasicProfile();
        const authResponse = googleUser.getAuthResponse();
        
        const userData = {
            email: profile.getEmail(),
            name: profile.getName(),
            avatar_url: profile.getImageUrl(),
            google_id: profile.getId(),
            access_token: authResponse.access_token,
            id_token: authResponse.id_token
        };

        console.log('Google user data:', userData);

        // Authenticate with backend
        const response = await apiCall('/auth/google', {
            method: 'POST',
            body: JSON.stringify(userData)
        });

        // Save user data and token
        AppState.user = response.user;
        localStorage.setItem('nutritruth_user', JSON.stringify(response.user));
        localStorage.setItem('nutritruth_token', response.token);
        localStorage.setItem('nutritruth_google_user', JSON.stringify(userData));

        // Navigate to profile setup
        navigateToPage('profile-setup');

    } catch (error) {
        console.error('Google authentication failed:', error);
        showResultNotification('Failed to sign in with Google. Please try again.', 'error');
        resetGoogleButton();
    }
}

// ============================================
// HANDLE GOOGLE SIGN-IN ERROR
// ============================================
function handleGoogleSignInError(error) {
    console.error('Google Sign-In error:', error);
    showResultNotification('Google Sign-In failed. Please try again.', 'error');
    resetGoogleButton();
}

// ============================================
// RESET GOOGLE BUTTON
// ============================================
function resetGoogleButton() {
    const googleLoginBtn = document.getElementById('google-login-btn');
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

// ============================================
// GOOGLE SIGN-OUT
// ============================================
function googleSignOut() {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
        console.log('User signed out from Google');
        clearAllData();
    });
}

// ============================================
// CHECK GOOGLE AUTH STATUS
// ============================================
function checkGoogleAuthStatus() {
    const savedGoogleUser = localStorage.getItem('nutritruth_google_user');
    if (savedGoogleUser) {
        try {
            const googleUser = JSON.parse(savedGoogleUser);
            console.log('Found saved Google user:', googleUser);
            return googleUser;
        } catch (error) {
            console.error('Error parsing saved Google user:', error);
        }
    }
    return null;
}

// ============================================
// UPDATE GOOGLE BUTTON HTML
// ============================================
function updateGoogleButtonHTML() {
    const googleLoginBtn = document.getElementById('google-login-btn');
    if (googleLoginBtn) {
        googleLoginBtn.innerHTML = `
            <div class="g-signin2" data-onsuccess="handleGoogleSignIn" data-onfailure="handleGoogleSignInError" 
                 data-theme="dark" data-size="large" data-longtitle="true" data-width="300" data-height="50">
            </div>
        `;
    }
}

// Export functions for global access
window.GoogleAuth = {
    initGoogleSignIn,
    handleGoogleSignIn,
    handleGoogleSignInError,
    googleSignOut,
    checkGoogleAuthStatus,
    updateGoogleButtonHTML
};
