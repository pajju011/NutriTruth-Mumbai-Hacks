/**
 * NutriTruth Scan History Management
 */

const HistoryState = {
    allScans: [],
    filteredScans: [],
    currentPage: 1,
    itemsPerPage: 12,
    sortBy: 'recent',
    filterBy: 'all'
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initHistoryPage();
});

/**
 * Initialize history page
 */
function initHistoryPage() {
    loadScanHistory();
    renderStats();
    renderHistory();
    setupEventListeners();
}

/**
 * Load scan history from localStorage
 */
function loadScanHistory() {
    const historyStr = localStorage.getItem('nutritruth_scan_history');
    if (historyStr) {
        HistoryState.allScans = JSON.parse(historyStr);
        HistoryState.filteredScans = [...HistoryState.allScans];
    }
}

/**
 * Render statistics
 */
function renderStats() {
    const scans = HistoryState.allScans;
    
    document.getElementById('total-scans').textContent = scans.length;
    document.getElementById('healthy-count').textContent = scans.filter(s => s.healthTag === 'healthy').length;
    document.getElementById('risky-count').textContent = scans.filter(s => s.healthTag === 'risky').length;
    document.getElementById('avoid-count').textContent = scans.filter(s => s.healthTag === 'avoid').length;
}

/**
 * Render history grid
 */
function renderHistory() {
    const grid = document.getElementById('history-grid');
    const start = (HistoryState.currentPage - 1) * HistoryState.itemsPerPage;
    const end = start + HistoryState.itemsPerPage;
    const paginatedScans = HistoryState.filteredScans.slice(start, end);

    if (paginatedScans.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1;">
                <div class="empty-state">
                    <div class="empty-icon">📦</div>
                    <div class="empty-title">No Scans Found</div>
                    <p class="empty-text">You haven't scanned any products yet. Start scanning to build your history.</p>
                    <a href="index.html#dashboard" class="empty-btn">Go to Dashboard</a>
                </div>
            </div>
        `;
        document.getElementById('pagination').innerHTML = '';
        return;
    }

    grid.innerHTML = paginatedScans
        .map((scan, index) => `
            <div class="history-card" onclick="viewScan(${start + index})">
                <img src="${scan.image || 'https://via.placeholder.com/300x200?text=Product'}" alt="${scan.name}" class="card-image" />
                <div class="card-content">
                    <div class="card-title">${scan.name}</div>
                    <div class="card-brand">${scan.brand || 'Unknown Brand'}</div>
                    <div class="card-meta">
                        <div class="health-score">
                            <span class="score-badge ${scan.healthTag}">${scan.healthScore}/100</span>
                        </div>
                        <div class="card-date">${formatDate(scan.scannedAt)}</div>
                    </div>
                    <div class="card-actions">
                        <button class="action-btn" onclick="event.stopPropagation(); viewScan(${start + index})">View</button>
                        <button class="action-btn delete" onclick="event.stopPropagation(); deleteScan(${start + index})">Delete</button>
                    </div>
                </div>
            </div>
        `)
        .join('');

    renderPagination();
}

/**
 * Render pagination
 */
function renderPagination() {
    const totalPages = Math.ceil(HistoryState.filteredScans.length / HistoryState.itemsPerPage);
    const pagination = document.getElementById('pagination');

    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    let html = '';
    for (let i = 1; i <= totalPages; i++) {
        html += `
            <button class="page-btn ${i === HistoryState.currentPage ? 'active' : ''}" onclick="goToPage(${i})">
                ${i}
            </button>
        `;
    }
    pagination.innerHTML = html;
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    document.getElementById('search-input').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        HistoryState.filteredScans = HistoryState.allScans.filter(scan =>
            scan.name.toLowerCase().includes(query) ||
            scan.brand.toLowerCase().includes(query)
        );
        HistoryState.currentPage = 1;
        renderHistory();
    });

    document.getElementById('filter-btn').addEventListener('click', openFilterMenu);
    document.getElementById('sort-btn').addEventListener('click', openSortMenu);
    document.getElementById('clear-history-btn').addEventListener('click', clearAllHistory);
}

/**
 * Open filter menu
 */
function openFilterMenu() {
    const options = ['All Products', 'Healthy', 'Risky', 'Avoid'];
    const values = ['all', 'healthy', 'risky', 'avoid'];
    
    let html = '<div style="position: absolute; top: 100%; left: 0; background: #1a202c; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; z-index: 100; min-width: 150px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">';
    
    options.forEach((option, i) => {
        html += `
            <button onclick="filterBy('${values[i]}')" style="display: block; width: 100%; padding: 0.75rem 1rem; background: none; border: none; color: #a0aec0; text-align: left; cursor: pointer; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(16,185,129,0.1)'; this.style.color='#10b981';" onmouseout="this.style.background='none'; this.style.color='#a0aec0';">
                ${option}
            </button>
        `;
    });
    
    html += '</div>';
    
    const btn = document.getElementById('filter-btn');
    btn.insertAdjacentHTML('afterend', html);
    
    setTimeout(() => {
        document.addEventListener('click', closeMenus);
    }, 0);
}

/**
 * Open sort menu
 */
function openSortMenu() {
    const options = ['Most Recent', 'Oldest First', 'Highest Score', 'Lowest Score'];
    const values = ['recent', 'oldest', 'highest', 'lowest'];
    
    let html = '<div style="position: absolute; top: 100%; left: 0; background: #1a202c; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; z-index: 100; min-width: 150px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">';
    
    options.forEach((option, i) => {
        html += `
            <button onclick="sortBy('${values[i]}')" style="display: block; width: 100%; padding: 0.75rem 1rem; background: none; border: none; color: #a0aec0; text-align: left; cursor: pointer; transition: all 0.3s ease;" onmouseover="this.style.background='rgba(16,185,129,0.1)'; this.style.color='#10b981';" onmouseout="this.style.background='none'; this.style.color='#a0aec0';">
                ${option}
            </button>
        `;
    });
    
    html += '</div>';
    
    const btn = document.getElementById('sort-btn');
    btn.insertAdjacentHTML('afterend', html);
    
    setTimeout(() => {
        document.addEventListener('click', closeMenus);
    }, 0);
}

/**
 * Close menus
 */
function closeMenus(e) {
    if (!e.target.closest('.filter-btn') && !e.target.closest('.sort-btn')) {
        document.querySelectorAll('[style*="position: absolute"]').forEach(el => el.remove());
        document.removeEventListener('click', closeMenus);
    }
}

/**
 * Filter by health tag
 */
function filterBy(tag) {
    HistoryState.filterBy = tag;
    if (tag === 'all') {
        HistoryState.filteredScans = [...HistoryState.allScans];
    } else {
        HistoryState.filteredScans = HistoryState.allScans.filter(s => s.healthTag === tag);
    }
    HistoryState.currentPage = 1;
    renderHistory();
    closeMenus({ target: { closest: () => false } });
}

/**
 * Sort scans
 */
function sortBy(sortType) {
    HistoryState.sortBy = sortType;
    
    switch (sortType) {
        case 'recent':
            HistoryState.filteredScans.sort((a, b) => new Date(b.scannedAt) - new Date(a.scannedAt));
            break;
        case 'oldest':
            HistoryState.filteredScans.sort((a, b) => new Date(a.scannedAt) - new Date(b.scannedAt));
            break;
        case 'highest':
            HistoryState.filteredScans.sort((a, b) => b.healthScore - a.healthScore);
            break;
        case 'lowest':
            HistoryState.filteredScans.sort((a, b) => a.healthScore - b.healthScore);
            break;
    }
    
    HistoryState.currentPage = 1;
    renderHistory();
    closeMenus({ target: { closest: () => false } });
}

/**
 * Go to page
 */
function goToPage(page) {
    HistoryState.currentPage = page;
    renderHistory();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * View scan details
 */
function viewScan(index) {
    const scan = HistoryState.allScans[index];
    localStorage.setItem('nutritruth_last_scan', JSON.stringify({ result: scan }));
    window.location.href = 'result.html';
}

/**
 * Delete scan
 */
function deleteScan(index) {
    if (confirm('Are you sure you want to delete this scan?')) {
        HistoryState.allScans.splice(index, 1);
        localStorage.setItem('nutritruth_scan_history', JSON.stringify(HistoryState.allScans));
        HistoryState.filteredScans = [...HistoryState.allScans];
        renderStats();
        renderHistory();
        showNotification('Scan deleted successfully', 'success');
    }
}

/**
 * Clear all history
 */
function clearAllHistory() {
    if (confirm('Are you sure you want to delete all scan history? This action cannot be undone.')) {
        HistoryState.allScans = [];
        HistoryState.filteredScans = [];
        localStorage.removeItem('nutritruth_scan_history');
        renderStats();
        renderHistory();
        showNotification('All history cleared', 'success');
    }
}

/**
 * Format date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString();
    }
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
