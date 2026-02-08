// DOM Elements
const form = document.getElementById('shortenForm');
const result = document.getElementById('result');
const shortLink = document.getElementById('shortLink');
const copyBtn = document.getElementById('copyBtn');
const openBtn = document.getElementById('openBtn');
const shareBtn = document.getElementById('shareBtn');
const qrBtn = document.getElementById('qrBtn');
const statsBtn = document.getElementById('statsBtn');
const qrModal = document.getElementById('qrModal');
const qrImg = document.getElementById('qrImg');
const qrUrl = document.getElementById('qrUrl');
const qrClose = document.getElementById('qrClose');
const toast = document.getElementById('toast');
const recentList = document.getElementById('recentList');
const loading = document.getElementById('loading');
const emptyState = document.getElementById('emptyState');
const refreshRecentBtn = document.getElementById('refreshRecent');
const submitBtn = document.getElementById('submitBtn');
const clickCount = document.getElementById('clickCount');
const totalLinks = document.getElementById('totalLinks');
const totalClicks = document.getElementById('totalClicks');
const activeLinks = document.getElementById('activeLinks');

// Chart
const miniCtx = document.getElementById('miniChart').getContext('2d');
let miniChart = null;
let currentShortCode = '';

// Toast System
function showToast(message, type = 'info') {
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Loading States
function setFormLoading(isLoading) {
  submitBtn.disabled = isLoading;
  submitBtn.innerHTML = isLoading 
    ? '<i class="fas fa-spinner fa-spin"></i> Creating...'
    : '<i class="fas fa-magic"></i> Create Short Link';
}

// Load Recent Links
async function loadRecent() {
  loading.classList.remove('hidden');
  recentList.innerHTML = '';
  emptyState.classList.add('hidden');
  
  try {
    const response = await fetch('/api/recent?limit=10');
    if (!response.ok) throw new Error('Failed to load');
    
    const data = await response.json();
    loading.classList.add('hidden');
    
    if (data.length === 0) {
      emptyState.classList.remove('hidden');
      return;
    }
    
    data.forEach(item => {
      const linkItem = document.createElement('div');
      linkItem.className = 'recent-item card';
      
      linkItem.innerHTML = `
        <div class="recent-item-content">
          <div class="item-header">
            <a href="/${item.short_code}" target="_blank" class="short-url-display">
              <i class="fas fa-link"></i>
              <span>${location.host}/${item.short_code}</span>
            </a>
            <div class="item-meta">
              <span class="click-count">
                <i class="fas fa-chart-line"></i>
                ${item.clicks || 0} clicks
              </span>
              ${item.protected ? '<span class="protected-badge"><i class="fas fa-lock"></i> Protected</span>' : ''}
              ${item.ttl_days ? `<span class="expiry-badge"><i class="fas fa-clock"></i> ${item.ttl_days}d</span>` : ''}
            </div>
          </div>
          
          ${item.description ? `
            <div class="item-description">
              <i class="fas fa-align-left"></i>
              ${escapeHtml(item.description)}
            </div>
          ` : ''}
          
          ${item.tags ? `
            <div class="item-tags">
              ${item.tags.split(',').map(tag => `
                <span class="tag">
                  <i class="fas fa-tag"></i>
                  ${escapeHtml(tag.trim())}
                </span>
              `).join('')}
            </div>
          ` : ''}
          
          <div class="item-actions">
            <button class="action-btn" data-code="${item.short_code}" data-action="copy" title="Copy URL">
              <i class="fas fa-copy"></i>
            </button>
            <button class="action-btn" data-code="${item.short_code}" data-action="qr" title="QR Code">
              <i class="fas fa-qrcode"></i>
            </button>
            <button class="action-btn" data-code="${item.short_code}" data-action="stats" title="View Stats">
              <i class="fas fa-chart-bar"></i>
            </button>
            <button class="action-btn" data-code="${item.short_code}" data-action="open" title="Open Link">
              <i class="fas fa-external-link-alt"></i>
            </button>
          </div>
        </div>
      `;
      
      recentList.appendChild(linkItem);
    });
    
    // Add event listeners
    document.querySelectorAll('.recent-item .action-btn').forEach(btn => {
      btn.addEventListener('click', handleRecentAction);
    });
    
    loadDashboardStats();
    
  } catch (error) {
    console.error('Error loading recent links:', error);
    loading.classList.add('hidden');
    showToast('Failed to load recent links', 'error');
  }
}

// Handle Recent Item Actions
async function handleRecentAction(e) {
  const code = e.currentTarget.dataset.code;
  const action = e.currentTarget.dataset.action;
  
  switch (action) {
    case 'copy':
      await navigator.clipboard.writeText(`${location.origin}/${code}`);
      showToast('Copied to clipboard!', 'success');
      break;
      
    case 'qr':
      showQRCode(code);
      break;
      
    case 'stats':
      await showStats(code);
      break;
      
    case 'open':
      window.open(`/${code}`, '_blank');
      break;
  }
}

// Show QR Code
function showQRCode(code) {
  const url = `${location.origin}/${code}`;
  qrUrl.textContent = url;
  qrImg.src = `/qr/${code}`;
  qrModal.classList.add('show');
}

// Load Dashboard Stats
async function loadDashboardStats() {
  try {
    const response = await fetch('/api/recent?limit=100');
    const data = await response.json();
    
    if (data.length > 0) {
      const totalLinksCount = data.length;
      const totalClicksCount = data.reduce((sum, item) => sum + (item.clicks || 0), 0);
      const activeLinksCount = data.filter(item => {
        if (!item.ttl_days) return true;
        const created = new Date(item.created_at);
        const expire = new Date(created.getTime() + item.ttl_days * 24 * 60 * 60 * 1000);
        return new Date() < expire;
      }).length;
      
      totalLinks.textContent = totalLinksCount;
      totalClicks.textContent = totalClicksCount.toLocaleString();
      activeLinks.textContent = activeLinksCount;
    }
  } catch (error) {
    console.error('Error loading dashboard stats:', error);
  }
}

// Show Stats
async function showStats(code) {
  try {
    const response = await fetch(`/api/stats/${code}?days=7`);
    const data = await response.json();
    
    const labels = [];
    const points = [];
    const days = 7;
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().slice(0, 10);
      labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      const row = data.rows.find(r => r.day === key);
      points.push(row ? row.cnt : 0);
    }
    
    if (miniChart) miniChart.destroy();
    
    miniChart = new Chart(miniCtx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Clicks',
          data: points,
          borderColor: '#2563EB',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: 'index',
            intersect: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { precision: 0 }
          }
        }
      }
    });
    
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
  } catch (error) {
    console.error('Error loading stats:', error);
    showToast('Failed to load statistics', 'error');
  }
}

// Form Submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  setFormLoading(true);
  
  const url = document.getElementById('url').value.trim();
  const custom = document.getElementById('custom').value.trim();
  const ttl = document.getElementById('ttl').value;
  const tags = document.getElementById('tags').value.trim();
  const description = document.getElementById('description').value.trim();
  const password = document.getElementById('password').value;
  
  const body = { url };
  if (custom) body.custom = custom;
  if (ttl) body.ttl_days = parseInt(ttl);
  if (tags) body.tags = tags;
  if (description) body.description = description;
  if (password) body.password = password;
  
  try {
    const response = await fetch('/api/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create short link');
    }
    
    // Success
    currentShortCode = data.short;
    const shortUrl = data.url;
    shortLink.href = shortUrl;
    shortLink.textContent = shortUrl;
    
    // Get metadata
    try {
      const metaResponse = await fetch(`/api/link/${currentShortCode}`);
      if (metaResponse.ok) {
        const meta = await metaResponse.json();
        clickCount.querySelector('span').textContent = meta.clicks || 0;
      }
    } catch (e) {
      console.error('Error loading metadata:', e);
    }
    
    result.classList.remove('hidden');
    await navigator.clipboard.writeText(shortUrl);
    showToast('Short link created and copied!', 'success');
    
    // Set QR
    qrUrl.textContent = shortUrl;
    qrImg.src = `/qr/${currentShortCode}`;
    
    // Initial chart
    drawInitialChart();
    
    await loadRecent();
    
    form.reset();
    document.getElementById('url').focus();
    
    // Scroll to result
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
  } catch (error) {
    console.error('Form submission error:', error);
    showToast(error.message, 'error');
  } finally {
    setFormLoading(false);
  }
});

// Draw Initial Chart
function drawInitialChart() {
  if (miniChart) miniChart.destroy();
  
  miniChart = new Chart(miniCtx, {
    type: 'line',
    data: {
      labels: ['New'],
      datasets: [{
        data: [0],
        borderColor: '#2563EB',
        borderWidth: 2,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { display: false },
        y: { display: false }
      }
    }
  });
}

// Button Event Listeners
copyBtn.addEventListener('click', async () => {
  await navigator.clipboard.writeText(shortLink.href);
  showToast('Copied to clipboard!', 'success');
});

openBtn.addEventListener('click', () => {
  window.open(shortLink.href, '_blank');
});

shareBtn.addEventListener('click', async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Shortened URL',
        url: shortLink.href
      });
    } catch (err) {
      if (err.name !== 'AbortError') {
        await navigator.clipboard.writeText(shortLink.href);
        showToast('Link copied to clipboard', 'info');
      }
    }
  } else {
    await navigator.clipboard.writeText(shortLink.href);
    showToast('Link copied to clipboard', 'success');
  }
});

qrBtn.addEventListener('click', () => {
  qrModal.classList.add('show');
});

statsBtn.addEventListener('click', () => {
  if (currentShortCode) {
    showStats(currentShortCode);
  }
});

qrClose.addEventListener('click', () => {
  qrModal.classList.remove('show');
});

document.getElementById('downloadQr').addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = `qr-${currentShortCode || 'code'}.png`;
  link.href = qrImg.src;
  link.click();
  showToast('QR code downloaded!', 'success');
});

refreshRecentBtn.addEventListener('click', loadRecent);

qrModal.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    qrModal.classList.remove('show');
  }
});

// Utility
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadRecent();
  document.getElementById('url').focus();
});