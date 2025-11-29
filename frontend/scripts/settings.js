/**
 * NutriTruth Settings Management
 */

const SettingsState = {
    notifications: {
        allergenAlerts: true,
        healthWarnings: true,
        newFeatures: false
    },
    display: {
        theme: 'dark',
        itemsPerPage: 12
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initSettings();
});

/**
 * Initialize settings page
 */
function initSettings() {
    loadSettings();
    renderSettings();
    updateDataStats();
}

/**
 * Load settings from localStorage
 */
function loadSettings() {
    const settingsStr = localStorage.getItem('nutritruth_settings');
    if (settingsStr) {
        const saved = JSON.parse(settingsStr);
        SettingsState.notifications = { ...SettingsState.notifications, ...saved.notifications };
        SettingsState.display = { ...SettingsState.display, ...saved.display };
    }
}

/**
 * Render settings UI
 */
function renderSettings() {
    // Update toggle switches
    const allergenToggle = document.querySelectorAll('.toggle-switch')[0];
    const healthToggle = document.querySelectorAll('.toggle-switch')[1];
    const featuresToggle = document.querySelectorAll('.toggle-switch')[2];

    if (SettingsState.notifications.allergenAlerts) allergenToggle.classList.add('active');
    if (SettingsState.notifications.healthWarnings) healthToggle.classList.add('active');
    if (SettingsState.notifications.newFeatures) featuresToggle.classList.add('active');

    // Update select inputs
    document.getElementById('theme-select').value = SettingsState.display.theme;
    document.getElementById('items-select').value = SettingsState.display.itemsPerPage;
}

/**
 * Toggle setting
 */
function toggleSetting(element, settingKey) {
    element.classList.toggle('active');
    
    switch(settingKey) {
        case 'allergen-alerts':
            SettingsState.notifications.allergenAlerts = element.classList.contains('active');
            break;
        case 'health-warnings':
            SettingsState.notifications.healthWarnings = element.classList.contains('active');
            break;
        case 'new-features':
            SettingsState.notifications.newFeatures = element.classList.contains('active');
            break;
    }
}

/**
 * Change setting
 */
function changeSetting(settingKey, value) {
    switch(settingKey) {
        case 'theme':
            SettingsState.display.theme = value;
            break;
        case 'items-per-page':
            SettingsState.display.itemsPerPage = parseInt(value);
            break;
    }
}

/**
 * Save settings
 */
function saveSettings() {
    localStorage.setItem('nutritruth_settings', JSON.stringify(SettingsState));
    showNotification('Settings saved successfully!', 'success');
}

/**
 * Reset settings
 */
function resetSettings() {
    openResetModal();
}

/**
 * Update data statistics
 */
function updateDataStats() {
    // Calculate data size
    let totalSize = 0;
    for (let key in localStorage) {
        if (key.startsWith('nutritruth_')) {
            totalSize += localStorage[key].length;
        }
    }
    const sizeInKB = (totalSize / 1024).toFixed(2);
    document.getElementById('data-size').textContent = `${sizeInKB} KB`;

    // Get scan count
    const scanHistory = localStorage.getItem('nutritruth_scan_history');
    const scanCount = scanHistory ? JSON.parse(scanHistory).length : 0;
    document.getElementById('scan-count').textContent = scanCount;

    // Get last scan date
    if (scanCount > 0) {
        const scans = JSON.parse(scanHistory);
        const lastScan = new Date(scans[0].scannedAt);
        document.getElementById('last-scan').textContent = lastScan.toLocaleDateString();
    }
}

/**
 * Export data as JSON
 */
function exportData() {
    const data = {};
    for (let key in localStorage) {
        if (key.startsWith('nutritruth_')) {
            data[key] = localStorage[key];
        }
    }

    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NutriTruth_Export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showNotification('Data exported successfully!', 'success');
}

/**
 * Download backup
 */
function downloadBackup() {
    const backup = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        data: {}
    };

    for (let key in localStorage) {
        if (key.startsWith('nutritruth_')) {
            backup.data[key] = localStorage[key];
        }
    }

    const backupStr = JSON.stringify(backup, null, 2);
    const blob = new Blob([backupStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `NutriTruth_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showNotification('Backup downloaded successfully!', 'success');
}

/**
 * Open help
 */
function openHelp() {
    window.open('USER_GUIDE.md', '_blank');
    showNotification('Opening help documentation...', 'info');
}

/**
 * Open privacy policy
 */
function openPrivacy() {
    showNotification('Privacy policy will be available soon!', 'info');
}

/**
 * Open clear data modal
 */
function openClearDataModal() {
    document.getElementById('clear-data-modal').classList.add('active');
}

/**
 * Close clear data modal
 */
function closeClearDataModal() {
    document.getElementById('clear-data-modal').classList.remove('active');
}

/**
 * Clear all data
 */
function clearAllData() {
    localStorage.clear();
    closeClearDataModal();
    showNotification('All data cleared!', 'success');
    setTimeout(() => {
        window.location.href = 'index.html#landing';
    }, 1500);
}

/**
 * Open reset modal
 */
function openResetModal() {
    document.getElementById('reset-modal').classList.add('active');
}

/**
 * Close reset modal
 */
function closeResetModal() {
    document.getElementById('reset-modal').classList.remove('active');
}

/**
 * Reset to default
 */
function resetToDefault() {
    SettingsState.notifications = {
        allergenAlerts: true,
        healthWarnings: true,
        newFeatures: false
    };
    SettingsState.display = {
        theme: 'dark',
        itemsPerPage: 12
    };
    
    localStorage.setItem('nutritruth_settings', JSON.stringify(SettingsState));
    renderSettings();
    closeResetModal();
    showNotification('Settings reset to default!', 'success');
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
        background: ${type === 'success' ? 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)' : type === 'error' ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'};
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
