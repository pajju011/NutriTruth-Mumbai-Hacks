/**
 * NutriTruth Profile Management
 */

const ProfileState = {
    user: null,
    allergies: [],
    scanHistory: []
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initProfilePage();
});

/**
 * Initialize profile page
 */
function initProfilePage() {
    loadUserData();
    loadScanHistory();
    renderProfile();
    setupEventListeners();
}

/**
 * Load user data from localStorage
 */
function loadUserData() {
    const userStr = localStorage.getItem('nutritruth_user');
    const allergiesStr = localStorage.getItem('nutritruth_allergies');

    if (userStr) {
        ProfileState.user = JSON.parse(userStr);
    }

    if (allergiesStr) {
        ProfileState.allergies = JSON.parse(allergiesStr);
    }
}

/**
 * Load scan history
 */
function loadScanHistory() {
    const historyStr = localStorage.getItem('nutritruth_scan_history');
    if (historyStr) {
        ProfileState.scanHistory = JSON.parse(historyStr);
    }
}

/**
 * Render profile information
 */
function renderProfile() {
    if (!ProfileState.user) {
        window.location.href = 'index.html#landing';
        return;
    }

    const user = ProfileState.user;

    // Update header
    document.getElementById('profile-name').textContent = user.name || 'User';
    document.getElementById('profile-email').textContent = user.email || 'user@example.com';
    document.getElementById('profile-avatar').textContent = (user.name || 'U').charAt(0).toUpperCase();

    // Update form inputs
    document.getElementById('name-input').value = user.name || '';
    document.getElementById('email-input').value = user.email || '';
    document.getElementById('modal-name-input').value = user.name || '';

    // Update stats
    document.getElementById('stat-scans').textContent = ProfileState.scanHistory.length;
    document.getElementById('stat-saved').textContent = ProfileState.scanHistory.length;

    // Render allergies
    renderAllergies();
}

/**
 * Render allergies list
 */
function renderAllergies() {
    const container = document.getElementById('allergies-list');

    if (ProfileState.allergies.length === 0 || ProfileState.allergies.includes('none')) {
        container.innerHTML = '<p style="color: #a0aec0; grid-column: 1/-1;">No allergies or restrictions set.</p>';
        return;
    }

    container.innerHTML = ProfileState.allergies
        .map(allergy => `
            <div class="allergy-badge">
                <span>${allergy}</span>
                <button class="remove-btn" onclick="removeAllergy('${allergy}')">×</button>
            </div>
        `)
        .join('');
}

/**
 * Remove allergy
 */
function removeAllergy(allergy) {
    ProfileState.allergies = ProfileState.allergies.filter(a => a !== allergy);
    
    if (ProfileState.allergies.length === 0) {
        ProfileState.allergies = ['none'];
    }

    localStorage.setItem('nutritruth_allergies', JSON.stringify(ProfileState.allergies));
    renderAllergies();
    showNotification('Allergy removed successfully', 'success');
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    document.getElementById('edit-allergies-btn').addEventListener('click', () => {
        window.location.href = 'index.html#profile-setup';
    });

    document.getElementById('edit-profile-btn').addEventListener('click', openEditModal);
    document.getElementById('logout-btn').addEventListener('click', openLogoutModal);
}

/**
 * Open edit modal
 */
function openEditModal() {
    document.getElementById('edit-modal').classList.add('active');
}

/**
 * Close edit modal
 */
function closeEditModal() {
    document.getElementById('edit-modal').classList.remove('active');
}

/**
 * Save profile changes
 */
function saveProfileChanges() {
    const newName = document.getElementById('modal-name-input').value.trim();

    if (!newName) {
        showNotification('Name cannot be empty', 'error');
        return;
    }

    ProfileState.user.name = newName;
    localStorage.setItem('nutritruth_user', JSON.stringify(ProfileState.user));

    renderProfile();
    closeEditModal();
    showNotification('Profile updated successfully', 'success');
}

/**
 * Open logout modal
 */
function openLogoutModal() {
    document.getElementById('logout-modal').classList.add('active');
}

/**
 * Close logout modal
 */
function closeLogoutModal() {
    document.getElementById('logout-modal').classList.remove('active');
}

/**
 * Confirm logout
 */
function confirmLogout() {
    // Clear all user data
    localStorage.removeItem('nutritruth_user');
    localStorage.removeItem('nutritruth_token');
    localStorage.removeItem('nutritruth_allergies');
    localStorage.removeItem('nutritruth_google_user');

    // Redirect to landing page
    window.location.href = 'index.html#landing';
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animations
const style = document.createElement('style');
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
