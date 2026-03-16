// ============================================
// Shortly — Enhanced Frontend URL Shortener
// 10-Feature Upgrade
// ============================================

// ============================================
// DOM ELEMENTS
// ============================================
const form = document.getElementById('shortenForm');
const urlInput = document.getElementById('urlInput');
const result = document.getElementById('result');
const shortLink = document.getElementById('shortLink');
const copyBtn = document.getElementById('copyBtn');
const openBtn = document.getElementById('openBtn');
const qrBtn = document.getElementById('qrBtn');
const qrModal = document.getElementById('qrModal');
const qrImg = document.getElementById('qrImg');
const qrUrl = document.getElementById('qrUrl');
const qrClose = document.getElementById('qrClose');
const downloadQr = document.getElementById('downloadQr');
const submitBtn = document.getElementById('submitBtn');
const toast = document.getElementById('toast');

// New feature elements
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const urlPreview = document.getElementById('urlPreview');
const cleaningOptions = document.getElementById('cleaningOptions');
const cleanedPreview = document.getElementById('cleanedPreview');
const safetyWarning = document.getElementById('safetyWarning');
const safetyReason = document.getElementById('safetyReason');
const cancelShorten = document.getElementById('cancelShorten');
const continueShorten = document.getElementById('continueShorten');
const bulkForm = document.getElementById('bulkForm');
const bulkInput = document.getElementById('bulkInput');
const bulkSubmitBtn = document.getElementById('bulkSubmitBtn');
const bulkResults = document.getElementById('bulkResults');
const bulkList = document.getElementById('bulkList');
const bulkCount = document.getElementById('bulkCount');
const screenshotImg = document.getElementById('screenshotImg');
const screenshotPreview = document.getElementById('screenshotPreview');
const clipboardPopup = document.getElementById('clipboardPopup');
const clipboardAccept = document.getElementById('clipboardAccept');
const clipboardDismiss = document.getElementById('clipboardDismiss');
const clipboardText = document.getElementById('clipboardText');
const dropOverlay = document.getElementById('dropOverlay');

// QR customization
const qrColor = document.getElementById('qrColor');
const qrBg = document.getElementById('qrBg');
const qrSize = document.getElementById('qrSize');
const qrSizeLabel = document.getElementById('qrSizeLabel');

// State
let currentShortUrl = '';
let currentLongUrl = '';
let cleanedUrl = '';
let safetyCheckPassed = false;

// ============================================
// 1. TOAST NOTIFICATION (existing, preserved)
// ============================================
function showToast(message, type) {
  toast.textContent = message;
  toast.className = 'toast ' + type + ' show';
  setTimeout(function () {
    toast.classList.remove('show');
  }, 3000);
}

// ============================================
// 2. LOADING STATE (existing, preserved)
// ============================================
function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  submitBtn.innerHTML = isLoading
    ? '<i class="fas fa-spinner fa-spin"></i> Shortening...'
    : '<i class="fas fa-magic"></i> Shorten URL';
}

// ============================================
// FEATURE 6: DARK MODE TOGGLE
// ============================================
function initTheme() {
  var saved = localStorage.getItem('shortly-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

function updateThemeIcon(theme) {
  themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

themeToggle.addEventListener('click', function () {
  var current = document.documentElement.getAttribute('data-theme');
  var next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('shortly-theme', next);
  updateThemeIcon(next);
});

// ============================================
// FEATURE 1: SMART URL PREVIEW
// ============================================
var platformPatterns = [
  {
    name: 'YouTube',
    icon: 'fab fa-youtube',
    cssClass: 'youtube',
    pattern: /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/,
    getThumb: function (match) {
      return 'https://img.youtube.com/vi/' + match[1] + '/hqdefault.jpg';
    },
    getDetail: function (match) {
      return 'Video ID: ' + match[1];
    }
  },
  {
    name: 'Instagram',
    icon: 'fab fa-instagram',
    cssClass: 'instagram',
    pattern: /instagram\.com\/(p|reel|stories)\/([\w-]+)/,
    getDetail: function (match) {
      return match[1].charAt(0).toUpperCase() + match[1].slice(1) + ': ' + match[2];
    }
  },
  {
    name: 'Twitter / X',
    icon: 'fab fa-x-twitter',
    cssClass: 'twitter',
    pattern: /(?:twitter\.com|x\.com)\/([\w]+)\/status\/(\d+)/,
    getDetail: function (match) {
      return '@' + match[1] + ' — Tweet ' + match[2];
    }
  },
  {
    name: 'Amazon',
    icon: 'fab fa-amazon',
    cssClass: 'amazon',
    pattern: /amazon\.\w+\/.*(?:dp|product)\/([\w]+)/,
    getDetail: function (match) {
      return 'Product: ' + match[1];
    }
  },
  {
    name: 'GitHub',
    icon: 'fab fa-github',
    cssClass: 'github',
    pattern: /github\.com\/([\w-]+)\/([\w.-]+)/,
    getDetail: function (match) {
      return match[1] + '/' + match[2];
    }
  },
  {
    name: 'LinkedIn',
    icon: 'fab fa-linkedin',
    cssClass: 'linkedin',
    pattern: /linkedin\.com\/(?:in|company)\/([\w-]+)/,
    getDetail: function (match) {
      return 'Profile: ' + match[1];
    }
  },
  {
    name: 'Reddit',
    icon: 'fab fa-reddit',
    cssClass: 'reddit',
    pattern: /reddit\.com\/r\/([\w]+)/,
    getDetail: function (match) {
      return 'r/' + match[1];
    }
  }
];

function detectPlatform(url) {
  for (var i = 0; i < platformPatterns.length; i++) {
    var p = platformPatterns[i];
    var match = url.match(p.pattern);
    if (match) return { platform: p, match: match };
  }
  return null;
}

function showUrlPreview(url) {
  var detection = detectPlatform(url);
  if (!detection) {
    urlPreview.classList.add('hidden');
    return;
  }

  var p = detection.platform;
  var m = detection.match;
  var thumbHtml = '';

  if (p.getThumb) {
    thumbHtml = '<img class="preview-thumb" src="' + p.getThumb(m) + '" alt="Preview" />';
  }

  urlPreview.innerHTML =
    '<div class="preview-icon ' + p.cssClass + '">' +
      '<i class="' + p.icon + '"></i>' +
    '</div>' +
    '<div class="preview-info">' +
      '<div class="preview-platform">' + p.name + '</div>' +
      '<div class="preview-detail">' + p.getDetail(m) + '</div>' +
    '</div>' + thumbHtml;

  urlPreview.classList.remove('hidden');
}

// Listen for input changes to show preview
urlInput.addEventListener('input', function () {
  var url = urlInput.value.trim();
  if (url) {
    showUrlPreview(url);
    checkTrackingParams(url);
  } else {
    urlPreview.classList.add('hidden');
    cleaningOptions.classList.add('hidden');
  }
});

// ============================================
// FEATURE 3: URL CLEANING
// ============================================
var trackingParams = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'fbclid', 'gclid', 'gclsrc', 'dclid', 'msclkid',
  'mc_cid', 'mc_eid', 'ref', '_ga', 'yclid'
];

function cleanUrl(url) {
  try {
    var parsed = new URL(url);
    var removed = [];
    trackingParams.forEach(function (param) {
      if (parsed.searchParams.has(param)) {
        removed.push(param);
        parsed.searchParams.delete(param);
      }
    });
    return { cleaned: parsed.toString(), removed: removed };
  } catch (e) {
    return { cleaned: url, removed: [] };
  }
}

function checkTrackingParams(url) {
  var result = cleanUrl(url);
  if (result.removed.length > 0) {
    cleanedUrl = result.cleaned;
    cleanedPreview.textContent = '(removes: ' + result.removed.join(', ') + ')';
    cleaningOptions.classList.remove('hidden');
    // Default to original
    document.querySelector('input[name="urlChoice"][value="original"]').checked = true;
  } else {
    cleanedUrl = '';
    cleaningOptions.classList.add('hidden');
  }
}

function getSelectedUrl() {
  var choice = document.querySelector('input[name="urlChoice"]:checked');
  if (choice && choice.value === 'cleaned' && cleanedUrl) {
    return cleanedUrl;
  }
  return urlInput.value.trim();
}

// ============================================
// FEATURE 2: MALWARE / PHISHING DETECTION
// ============================================
var suspiciousTLDs = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.top', '.buzz', '.work'];
var suspiciousKeywords = ['login', 'signin', 'verify', 'secure', 'account', 'update', 'confirm', 'banking', 'password', 'wallet'];

function checkUrlSafety(url) {
  var reasons = [];

  try {
    var parsed = new URL(url);
    var hostname = parsed.hostname.toLowerCase();

    // Check: IP-based URL
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
      reasons.push('URL uses a raw IP address instead of a domain name');
    }

    // Check: suspicious TLD
    for (var i = 0; i < suspiciousTLDs.length; i++) {
      if (hostname.endsWith(suspiciousTLDs[i])) {
        reasons.push('Uses a frequently abused domain extension (' + suspiciousTLDs[i] + ')');
        break;
      }
    }

    // Check: deceptive subdomain (e.g., google.com.evil.tk)
    var parts = hostname.split('.');
    if (parts.length > 3) {
      var knownBrands = ['google', 'facebook', 'apple', 'microsoft', 'amazon', 'paypal', 'netflix'];
      for (var j = 0; j < knownBrands.length; j++) {
        if (parts[0] === knownBrands[j] || parts[1] === knownBrands[j]) {
          if (!hostname.endsWith(knownBrands[j] + '.com')) {
            reasons.push('Suspicious subdomain impersonating ' + knownBrands[j]);
            break;
          }
        }
      }
    }

    // Check: suspicious keywords in path
    var pathLower = parsed.pathname.toLowerCase() + parsed.search.toLowerCase();
    for (var k = 0; k < suspiciousKeywords.length; k++) {
      if (pathLower.includes(suspiciousKeywords[k]) && hostname.indexOf(suspiciousKeywords[k]) === -1) {
        reasons.push('Contains suspicious keyword: "' + suspiciousKeywords[k] + '"');
        break;
      }
    }

    // Check: very long URL (common in phishing)
    if (url.length > 500) {
      reasons.push('Unusually long URL (common in phishing attacks)');
    }

  } catch (e) {
    reasons.push('Invalid or malformed URL');
  }

  return reasons;
}

// ============================================
// FORM SUBMIT (upgraded with safety + cleaning)
// ============================================
form.addEventListener('submit', async function (e) {
  e.preventDefault();
  var longUrl = getSelectedUrl();

  if (!longUrl) {
    showToast('Please enter a URL', 'error');
    return;
  }

  // Safety check
  if (!safetyCheckPassed) {
    var issues = checkUrlSafety(longUrl);
    if (issues.length > 0) {
      safetyReason.textContent = issues.join('. ') + '.';
      safetyWarning.classList.remove('hidden');
      submitBtn.classList.add('hidden');
      return;
    }
  }

  // Reset safety state
  safetyCheckPassed = false;
  safetyWarning.classList.add('hidden');
  submitBtn.classList.remove('hidden');

  await shortenUrl(longUrl);
});

// Safety warning buttons
cancelShorten.addEventListener('click', function () {
  safetyWarning.classList.add('hidden');
  submitBtn.classList.remove('hidden');
  safetyCheckPassed = false;
});

continueShorten.addEventListener('click', async function () {
  safetyCheckPassed = true;
  safetyWarning.classList.add('hidden');
  submitBtn.classList.remove('hidden');
  var longUrl = getSelectedUrl();
  await shortenUrl(longUrl);
  safetyCheckPassed = false;
});

// Core shorten function (preserved + upgraded)
async function shortenUrl(longUrl) {
  setLoading(true);
  currentLongUrl = longUrl;

  try {
    var response = await fetch(
      'https://tinyurl.com/api-create.php?url=' + encodeURIComponent(longUrl)
    );

    if (!response.ok) throw new Error('Failed to shorten URL');

    var shortUrl = await response.text();
    currentShortUrl = shortUrl;

    // Display result
    shortLink.href = shortUrl;
    shortLink.textContent = shortUrl;
    result.classList.remove('hidden');

    // Website screenshot (Feature 9)
    screenshotImg.src = 'https://image.thum.io/get/width/600/' + encodeURIComponent(longUrl);
    screenshotPreview.style.display = 'block';

    // Set QR code with current customization settings
    updateQrCode();
    qrUrl.textContent = shortUrl;

    // Auto-copy
    try {
      await navigator.clipboard.writeText(shortUrl);
      showToast('Short link created and copied!', 'success');
    } catch (clipErr) {
      showToast('Short link created!', 'success');
    }

    // Reset form
    form.reset();
    urlPreview.classList.add('hidden');
    cleaningOptions.classList.add('hidden');
    urlInput.focus();
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  } catch (error) {
    console.error('Error:', error);
    showToast('Failed to shorten URL. Please try again.', 'error');
  } finally {
    setLoading(false);
  }
}

// ============================================
// FEATURE 4: BULK URL SHORTENER
// ============================================
var modeTabs = document.querySelectorAll('.mode-tab');

modeTabs.forEach(function (tab) {
  tab.addEventListener('click', function () {
    var mode = tab.dataset.mode;
    modeTabs.forEach(function (t) { t.classList.remove('active'); });
    tab.classList.add('active');

    if (mode === 'bulk') {
      form.classList.add('hidden');
      bulkForm.classList.remove('hidden');
      result.classList.add('hidden');
    } else {
      form.classList.remove('hidden');
      bulkForm.classList.add('hidden');
      bulkResults.classList.add('hidden');
    }
  });
});

bulkSubmitBtn.addEventListener('click', async function () {
  var lines = bulkInput.value.trim().split('\n').filter(function (line) {
    return line.trim().length > 0;
  });

  if (lines.length === 0) {
    showToast('Please enter at least one URL', 'error');
    return;
  }

  if (lines.length > 10) {
    showToast('Maximum 10 URLs at a time', 'warning');
    return;
  }

  // Set loading
  bulkSubmitBtn.disabled = true;
  bulkSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Shortening...';
  bulkList.innerHTML = '';
  bulkResults.classList.add('hidden');

  var successCount = 0;

  for (var i = 0; i < lines.length; i++) {
    var url = lines[i].trim();
    try {
      var response = await fetch(
        'https://tinyurl.com/api-create.php?url=' + encodeURIComponent(url)
      );
      if (!response.ok) throw new Error('Failed');
      var shortUrl = await response.text();
      successCount++;

      var item = document.createElement('div');
      item.className = 'bulk-item';
      item.innerHTML =
        '<div class="bulk-index">' + (i + 1) + '</div>' +
        '<a class="bulk-url" href="' + shortUrl + '" target="_blank">' + shortUrl + '</a>' +
        '<button class="bulk-copy" data-url="' + shortUrl + '"><i class="fas fa-copy"></i> Copy</button>';
      bulkList.appendChild(item);

    } catch (err) {
      var item = document.createElement('div');
      item.className = 'bulk-item';
      item.innerHTML =
        '<div class="bulk-index" style="background:var(--error)">' + (i + 1) + '</div>' +
        '<span style="color:var(--error);font-size:0.9rem">Failed: ' + url.substring(0, 40) + '...</span>';
      bulkList.appendChild(item);
    }
  }

  bulkCount.textContent = successCount;
  bulkResults.classList.remove('hidden');
  bulkResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Reset button
  bulkSubmitBtn.disabled = false;
  bulkSubmitBtn.innerHTML = '<i class="fas fa-magic"></i> Shorten All URLs';

  // Bulk copy event delegation
  bulkList.addEventListener('click', function (e) {
    var btn = e.target.closest('.bulk-copy');
    if (btn) {
      navigator.clipboard.writeText(btn.dataset.url);
      showToast('Copied!', 'success');
    }
  });

  showToast(successCount + ' links shortened!', 'success');
});

// ============================================
// FEATURE 5: QR CODE CUSTOMIZATION
// ============================================
function updateQrCode() {
  if (!currentShortUrl) return;
  var color = qrColor.value.replace('#', '');
  var bg = qrBg.value.replace('#', '');
  var size = qrSize.value;
  qrSizeLabel.textContent = size;

  qrImg.src =
    'https://api.qrserver.com/v1/create-qr-code/?data=' +
    encodeURIComponent(currentShortUrl) +
    '&size=' + size + 'x' + size +
    '&color=' + color +
    '&bgcolor=' + bg;
}

qrColor.addEventListener('input', updateQrCode);
qrBg.addEventListener('input', updateQrCode);
qrSize.addEventListener('input', updateQrCode);

// ============================================
// EXISTING BUTTONS (preserved)
// ============================================
copyBtn.addEventListener('click', async function () {
  await navigator.clipboard.writeText(currentShortUrl);
  showToast('Copied to clipboard!', 'success');
});

openBtn.addEventListener('click', function () {
  window.open(currentShortUrl, '_blank');
});

qrBtn.addEventListener('click', function () {
  updateQrCode();
  qrModal.classList.add('show');
});

qrClose.addEventListener('click', function () {
  qrModal.classList.remove('show');
});

qrModal.addEventListener('click', function (e) {
  if (e.target.classList.contains('modal-overlay')) {
    qrModal.classList.remove('show');
  }
});

downloadQr.addEventListener('click', async function () {
  try {
    var response = await fetch(qrImg.src);
    var blob = await response.blob();
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.download = 'shortly-qr-code.png';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    showToast('QR code downloaded!', 'success');
  } catch (error) {
    showToast('Failed to download QR code', 'error');
  }
});

// ============================================
// FEATURE 8: SOCIAL MEDIA SHARE BUTTONS
// ============================================
document.getElementById('shareWhatsApp').addEventListener('click', function () {
  window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent('Check this out: ' + currentShortUrl), '_blank');
});

document.getElementById('shareTwitter').addEventListener('click', function () {
  window.open('https://twitter.com/intent/tweet?url=' + encodeURIComponent(currentShortUrl) + '&text=' + encodeURIComponent('Check this out!'), '_blank');
});

document.getElementById('shareTelegram').addEventListener('click', function () {
  window.open('https://t.me/share/url?url=' + encodeURIComponent(currentShortUrl) + '&text=' + encodeURIComponent('Check this out!'), '_blank');
});

document.getElementById('shareLinkedIn').addEventListener('click', function () {
  window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(currentShortUrl), '_blank');
});

// ============================================
// FEATURE 7: CLIPBOARD AUTO DETECTION
// ============================================
var clipboardUrl = '';

async function checkClipboard() {
  try {
    var text = await navigator.clipboard.readText();
    if (text && isValidUrl(text) && text.length > 20) {
      clipboardUrl = text;
      clipboardText.textContent = 'Paste: ' + text.substring(0, 35) + '...';
      clipboardPopup.classList.remove('hidden');

      // Auto-dismiss after 6 seconds
      setTimeout(function () {
        clipboardPopup.classList.add('hidden');
      }, 6000);
    }
  } catch (e) {
    // Clipboard access denied — silently ignore
  }
}

function isValidUrl(str) {
  try {
    var url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

clipboardAccept.addEventListener('click', function () {
  urlInput.value = clipboardUrl;
  clipboardPopup.classList.add('hidden');
  showUrlPreview(clipboardUrl);
  checkTrackingParams(clipboardUrl);
  showToast('URL pasted from clipboard!', 'info');
});

clipboardDismiss.addEventListener('click', function () {
  clipboardPopup.classList.add('hidden');
});

// ============================================
// FEATURE 10: DRAG AND DROP URL INPUT
// ============================================
var dragCounter = 0;

document.addEventListener('dragenter', function (e) {
  e.preventDefault();
  dragCounter++;
  dropOverlay.classList.add('show');
});

document.addEventListener('dragleave', function (e) {
  e.preventDefault();
  dragCounter--;
  if (dragCounter <= 0) {
    dragCounter = 0;
    dropOverlay.classList.remove('show');
  }
});

document.addEventListener('dragover', function (e) {
  e.preventDefault();
});

document.addEventListener('drop', function (e) {
  e.preventDefault();
  dragCounter = 0;
  dropOverlay.classList.remove('show');

  // Extract URL from dropped data
  var droppedText = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain') || '';
  droppedText = droppedText.trim();

  if (droppedText && isValidUrl(droppedText)) {
    // Switch to single mode if in bulk
    modeTabs.forEach(function (t) { t.classList.remove('active'); });
    document.querySelector('[data-mode="single"]').classList.add('active');
    form.classList.remove('hidden');
    bulkForm.classList.add('hidden');

    urlInput.value = droppedText;
    showUrlPreview(droppedText);
    checkTrackingParams(droppedText);
    urlInput.focus();
    showToast('URL dropped!', 'info');
  } else {
    showToast('Please drop a valid URL', 'error');
  }
});

// Also support drag-drop directly on input
urlInput.addEventListener('dragover', function (e) {
  e.preventDefault();
  urlInput.classList.add('drag-over');
});

urlInput.addEventListener('dragleave', function () {
  urlInput.classList.remove('drag-over');
});

urlInput.addEventListener('drop', function (e) {
  e.preventDefault();
  urlInput.classList.remove('drag-over');
  var droppedText = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain') || '';
  droppedText = droppedText.trim();
  if (droppedText && isValidUrl(droppedText)) {
    urlInput.value = droppedText;
    showUrlPreview(droppedText);
    checkTrackingParams(droppedText);
  }
});

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function () {
  initTheme();
  urlInput.focus();

  // Clipboard detection after short delay
  setTimeout(checkClipboard, 800);
});
