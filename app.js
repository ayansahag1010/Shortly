// ============================================
// Shortly — Frontend-Only URL Shortener
// Uses TinyURL API + QR Server API
// ============================================

// DOM Elements
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

// Store the current short URL
let currentShortUrl = '';

// ---- Toast Notification ----
function showToast(message, type) {
  toast.textContent = message;
  toast.className = 'toast ' + type + ' show';
  setTimeout(function () {
    toast.classList.remove('show');
  }, 3000);
}

// ---- Loading State ----
function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  submitBtn.innerHTML = isLoading
    ? '<i class="fas fa-spinner fa-spin"></i> Shortening...'
    : '<i class="fas fa-magic"></i> Shorten URL';
}

// ---- Form Submit ----
form.addEventListener('submit', async function (e) {
  e.preventDefault();
  var longUrl = urlInput.value.trim();

  if (!longUrl) {
    showToast('Please enter a URL', 'error');
    return;
  }

  setLoading(true);

  try {
    var response = await fetch(
      'https://tinyurl.com/api-create.php?url=' + encodeURIComponent(longUrl)
    );

    if (!response.ok) {
      throw new Error('Failed to shorten URL');
    }

    var shortUrl = await response.text();
    currentShortUrl = shortUrl;

    // Display result
    shortLink.href = shortUrl;
    shortLink.textContent = shortUrl;
    result.classList.remove('hidden');

    // Set QR code image
    qrImg.src =
      'https://api.qrserver.com/v1/create-qr-code/?data=' +
      encodeURIComponent(shortUrl) +
      '&size=250x250&color=2563EB';
    qrUrl.textContent = shortUrl;

    // Auto-copy to clipboard
    await navigator.clipboard.writeText(shortUrl);
    showToast('Short link created and copied!', 'success');

    // Reset input and scroll to result
    form.reset();
    urlInput.focus();
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (error) {
    console.error('Error:', error);
    showToast('Failed to shorten URL. Please try again.', 'error');
  } finally {
    setLoading(false);
  }
});

// ---- Copy Button ----
copyBtn.addEventListener('click', async function () {
  await navigator.clipboard.writeText(currentShortUrl);
  showToast('Copied to clipboard!', 'success');
});

// ---- Open Button ----
openBtn.addEventListener('click', function () {
  window.open(currentShortUrl, '_blank');
});

// ---- QR Code Button ----
qrBtn.addEventListener('click', function () {
  qrModal.classList.add('show');
});

// ---- Close QR Modal ----
qrClose.addEventListener('click', function () {
  qrModal.classList.remove('show');
});

qrModal.addEventListener('click', function (e) {
  if (e.target.classList.contains('modal-overlay')) {
    qrModal.classList.remove('show');
  }
});

// ---- Download QR Code ----
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

// ---- Focus URL input on load ----
document.addEventListener('DOMContentLoaded', function () {
  urlInput.focus();
});
