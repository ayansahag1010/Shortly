var form = document.getElementById('shortenForm');
var urlInput = document.getElementById('urlInput');
var result = document.getElementById('result');
var shortLink = document.getElementById('shortLink');
var copyBtn = document.getElementById('copyBtn');
var openBtn = document.getElementById('openBtn');
var qrBtn = document.getElementById('qrBtn');
var qrModal = document.getElementById('qrModal');
var qrImg = document.getElementById('qrImg');
var qrUrl = document.getElementById('qrUrl');
var qrClose = document.getElementById('qrClose');
var downloadQr = document.getElementById('downloadQr');
var submitBtn = document.getElementById('submitBtn');
var toast = document.getElementById('toast');
var themeToggle = document.getElementById('themeToggle');
var themeIcon = document.getElementById('themeIcon');
var urlPreview = document.getElementById('urlPreview');
var cleaningOptions = document.getElementById('cleaningOptions');
var cleanedPreview = document.getElementById('cleanedPreview');
var safetyWarning = document.getElementById('safetyWarning');
var safetyReason = document.getElementById('safetyReason');
var cancelShorten = document.getElementById('cancelShorten');
var continueShorten = document.getElementById('continueShorten');
var bulkForm = document.getElementById('bulkForm');
var bulkInput = document.getElementById('bulkInput');
var bulkSubmitBtn = document.getElementById('bulkSubmitBtn');
var bulkResults = document.getElementById('bulkResults');
var bulkList = document.getElementById('bulkList');
var bulkCount = document.getElementById('bulkCount');
var screenshotImg = document.getElementById('screenshotImg');
var screenshotPreview = document.getElementById('screenshotPreview');
var clipboardPopup = document.getElementById('clipboardPopup');
var clipboardAccept = document.getElementById('clipboardAccept');
var clipboardDismiss = document.getElementById('clipboardDismiss');
var clipboardText = document.getElementById('clipboardText');
var dropOverlay = document.getElementById('dropOverlay');
var qrColor = document.getElementById('qrColor');
var qrBg = document.getElementById('qrBg');
var qrSize = document.getElementById('qrSize');
var qrSizeLabel = document.getElementById('qrSizeLabel');

var currentShortUrl = '';
var currentLongUrl = '';
var cleanedUrl = '';
var safetyCheckPassed = false;

// Toast
function showToast(msg, type) {
  toast.textContent = msg;
  toast.className = 'toast ' + type + ' show';
  setTimeout(function() { toast.classList.remove('show'); }, 3000);
}

// Loading state
function setLoading(on) {
  submitBtn.disabled = on;
  submitBtn.innerHTML = on
    ? '<span class="btn-content"><i class="fas fa-spinner fa-spin"></i> Shortening...</span>'
    : '<span class="btn-content"><i class="fas fa-wand-magic-sparkles"></i> Shorten URL</span>';
}

// Dark mode
function initTheme() {
  var saved = localStorage.getItem('shortly-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  themeIcon.className = saved === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

themeToggle.addEventListener('click', function() {
  var cur = document.documentElement.getAttribute('data-theme');
  var next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('shortly-theme', next);
  themeIcon.className = next === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
});

// Platform detection
var platforms = [
  { name:'YouTube', icon:'fab fa-youtube', css:'youtube', re:/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/, thumb:function(m){return 'https://img.youtube.com/vi/'+m[1]+'/hqdefault.jpg'}, detail:function(m){return 'Video ID: '+m[1]} },
  { name:'Instagram', icon:'fab fa-instagram', css:'instagram', re:/instagram\.com\/(p|reel|stories)\/([\w-]+)/, detail:function(m){return m[1].charAt(0).toUpperCase()+m[1].slice(1)+': '+m[2]} },
  { name:'Twitter / X', icon:'fab fa-x-twitter', css:'twitter', re:/(?:twitter\.com|x\.com)\/([\w]+)\/status\/(\d+)/, detail:function(m){return '@'+m[1]+' — Tweet '+m[2]} },
  { name:'Amazon', icon:'fab fa-amazon', css:'amazon', re:/amazon\.\w+\/.*(?:dp|product)\/([\w]+)/, detail:function(m){return 'Product: '+m[1]} },
  { name:'GitHub', icon:'fab fa-github', css:'github', re:/github\.com\/([\w-]+)\/([\w.-]+)/, detail:function(m){return m[1]+'/'+m[2]} },
  { name:'LinkedIn', icon:'fab fa-linkedin', css:'linkedin', re:/linkedin\.com\/(?:in|company)\/([\w-]+)/, detail:function(m){return 'Profile: '+m[1]} },
  { name:'Reddit', icon:'fab fa-reddit', css:'reddit', re:/reddit\.com\/r\/([\w]+)/, detail:function(m){return 'r/'+m[1]} }
];

function showUrlPreview(url) {
  for (var i = 0; i < platforms.length; i++) {
    var p = platforms[i];
    var m = url.match(p.re);
    if (m) {
      var thumbHtml = p.thumb ? '<img class="preview-thumb" src="'+p.thumb(m)+'" alt="Preview"/>' : '';
      urlPreview.innerHTML = '<div class="preview-icon '+p.css+'"><i class="'+p.icon+'"></i></div><div class="preview-info"><div class="preview-platform">'+p.name+'</div><div class="preview-detail">'+p.detail(m)+'</div></div>'+thumbHtml;
      urlPreview.classList.remove('hidden');
      return;
    }
  }
  urlPreview.classList.add('hidden');
}

urlInput.addEventListener('input', function() {
  var url = urlInput.value.trim();
  if (url) { showUrlPreview(url); checkTracking(url); }
  else { urlPreview.classList.add('hidden'); cleaningOptions.classList.add('hidden'); }
});

// URL cleaning
var trackParams = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','fbclid','gclid','gclsrc','dclid','msclkid','mc_cid','mc_eid','ref','_ga','yclid'];

function cleanUrl(url) {
  try {
    var u = new URL(url); var removed = [];
    trackParams.forEach(function(p) { if (u.searchParams.has(p)) { removed.push(p); u.searchParams.delete(p); } });
    return { cleaned: u.toString(), removed: removed };
  } catch(e) { return { cleaned: url, removed: [] }; }
}

function checkTracking(url) {
  var r = cleanUrl(url);
  if (r.removed.length > 0) {
    cleanedUrl = r.cleaned;
    cleanedPreview.textContent = '(removes: ' + r.removed.join(', ') + ')';
    cleaningOptions.classList.remove('hidden');
    document.querySelector('input[name="urlChoice"][value="original"]').checked = true;
  } else {
    cleanedUrl = '';
    cleaningOptions.classList.add('hidden');
  }
}

function getSelectedUrl() {
  var c = document.querySelector('input[name="urlChoice"]:checked');
  return (c && c.value === 'cleaned' && cleanedUrl) ? cleanedUrl : urlInput.value.trim();
}

// Safety check
var badTLDs = ['.tk','.ml','.ga','.cf','.gq','.xyz','.top','.buzz','.work'];
var badWords = ['login','signin','verify','secure','account','update','confirm','banking','password','wallet'];

function checkSafety(url) {
  var reasons = [];
  try {
    var u = new URL(url); var h = u.hostname.toLowerCase();
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(h)) reasons.push('URL uses a raw IP address');
    for (var i = 0; i < badTLDs.length; i++) if (h.endsWith(badTLDs[i])) { reasons.push('Frequently abused domain extension ('+badTLDs[i]+')'); break; }
    var parts = h.split('.');
    if (parts.length > 3) {
      var brands = ['google','facebook','apple','microsoft','amazon','paypal','netflix'];
      for (var j = 0; j < brands.length; j++) if ((parts[0]===brands[j]||parts[1]===brands[j]) && !h.endsWith(brands[j]+'.com')) { reasons.push('Suspicious subdomain impersonating '+brands[j]); break; }
    }
    var path = (u.pathname + u.search).toLowerCase();
    for (var k = 0; k < badWords.length; k++) if (path.includes(badWords[k]) && h.indexOf(badWords[k])===-1) { reasons.push('Suspicious keyword: "'+badWords[k]+'"'); break; }
    if (url.length > 500) reasons.push('Unusually long URL');
  } catch(e) { reasons.push('Invalid URL'); }
  return reasons;
}

// Form submit
form.addEventListener('submit', async function(e) {
  e.preventDefault();
  var longUrl = getSelectedUrl();
  if (!longUrl) { showToast('Please enter a URL', 'error'); return; }
  if (!safetyCheckPassed) {
    var issues = checkSafety(longUrl);
    if (issues.length > 0) {
      safetyReason.textContent = issues.join('. ') + '.';
      safetyWarning.classList.remove('hidden');
      submitBtn.classList.add('hidden');
      return;
    }
  }
  safetyCheckPassed = false;
  safetyWarning.classList.add('hidden');
  submitBtn.classList.remove('hidden');
  await shortenUrl(longUrl);
});

cancelShorten.addEventListener('click', function() {
  safetyWarning.classList.add('hidden');
  submitBtn.classList.remove('hidden');
  safetyCheckPassed = false;
});

continueShorten.addEventListener('click', async function() {
  safetyCheckPassed = true;
  safetyWarning.classList.add('hidden');
  submitBtn.classList.remove('hidden');
  await shortenUrl(getSelectedUrl());
  safetyCheckPassed = false;
});

async function shortenUrl(longUrl) {
  setLoading(true);
  currentLongUrl = longUrl;
  try {
    var resp = await fetch('https://tinyurl.com/api-create.php?url=' + encodeURIComponent(longUrl));
    if (!resp.ok) throw new Error('Failed');
    var shortUrl = await resp.text();
    currentShortUrl = shortUrl;
    shortLink.href = shortUrl;
    shortLink.textContent = shortUrl;
    result.classList.remove('hidden');
    screenshotImg.src = 'https://image.thum.io/get/width/600/' + encodeURIComponent(longUrl);
    screenshotPreview.style.display = '';
    updateQrCode();
    qrUrl.textContent = shortUrl;
    try { await navigator.clipboard.writeText(shortUrl); showToast('Link created and copied!', 'success'); }
    catch(e) { showToast('Link created!', 'success'); }
    form.reset();
    urlPreview.classList.add('hidden');
    cleaningOptions.classList.add('hidden');
    urlInput.focus();
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch(err) {
    showToast('Failed to shorten URL. Try again.', 'error');
  } finally { setLoading(false); }
}

// Mode tabs
document.querySelectorAll('.tab').forEach(function(tab) {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.tab').forEach(function(t){ t.classList.remove('active'); });
    tab.classList.add('active');
    if (tab.dataset.mode === 'bulk') {
      form.classList.add('hidden'); bulkForm.classList.remove('hidden'); result.classList.add('hidden');
    } else {
      form.classList.remove('hidden'); bulkForm.classList.add('hidden'); bulkResults.classList.add('hidden');
    }
  });
});

// Bulk shortener
bulkSubmitBtn.addEventListener('click', async function() {
  var lines = bulkInput.value.trim().split('\n').filter(function(l){ return l.trim().length > 0; });
  if (lines.length === 0) { showToast('Enter at least one URL', 'error'); return; }
  if (lines.length > 10) { showToast('Maximum 10 URLs at a time', 'warning'); return; }
  bulkSubmitBtn.disabled = true;
  bulkSubmitBtn.innerHTML = '<span class="btn-content"><i class="fas fa-spinner fa-spin"></i> Shortening...</span>';
  bulkList.innerHTML = '';
  bulkResults.classList.add('hidden');
  var count = 0;
  for (var i = 0; i < lines.length; i++) {
    var url = lines[i].trim();
    try {
      var resp = await fetch('https://tinyurl.com/api-create.php?url=' + encodeURIComponent(url));
      if (!resp.ok) throw new Error();
      var short = await resp.text();
      count++;
      var el = document.createElement('div'); el.className = 'bulk-item';
      el.innerHTML = '<div class="bulk-index">'+(i+1)+'</div><a class="bulk-url" href="'+short+'" target="_blank">'+short+'</a><button class="bulk-copy" data-url="'+short+'"><i class="fas fa-copy"></i> Copy</button>';
      bulkList.appendChild(el);
    } catch(e) {
      var el = document.createElement('div'); el.className = 'bulk-item';
      el.innerHTML = '<div class="bulk-index" style="background:var(--error)">'+(i+1)+'</div><span style="color:var(--error);font-size:.85rem">Failed: '+url.substring(0,40)+'...</span>';
      bulkList.appendChild(el);
    }
  }
  bulkCount.textContent = count;
  bulkResults.classList.remove('hidden');
  bulkResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  bulkSubmitBtn.disabled = false;
  bulkSubmitBtn.innerHTML = '<span class="btn-content"><i class="fas fa-wand-magic-sparkles"></i> Shorten All</span>';
  bulkList.addEventListener('click', function(e) { var btn = e.target.closest('.bulk-copy'); if (btn) { navigator.clipboard.writeText(btn.dataset.url); showToast('Copied!', 'success'); } });
  showToast(count + ' links shortened!', 'success');
});

// QR customization
function updateQrCode() {
  if (!currentShortUrl) return;
  var c = qrColor.value.replace('#',''), b = qrBg.value.replace('#',''), s = qrSize.value;
  qrSizeLabel.textContent = s;
  qrImg.src = 'https://api.qrserver.com/v1/create-qr-code/?data='+encodeURIComponent(currentShortUrl)+'&size='+s+'x'+s+'&color='+c+'&bgcolor='+b;
}
qrColor.addEventListener('input', updateQrCode);
qrBg.addEventListener('input', updateQrCode);
qrSize.addEventListener('input', updateQrCode);

// Buttons
copyBtn.addEventListener('click', async function() { await navigator.clipboard.writeText(currentShortUrl); showToast('Copied!', 'success'); });
openBtn.addEventListener('click', function() { window.open(currentShortUrl, '_blank'); });
qrBtn.addEventListener('click', function() { updateQrCode(); qrModal.classList.add('show'); });
qrClose.addEventListener('click', function() { qrModal.classList.remove('show'); });
qrModal.addEventListener('click', function(e) { if (e.target.classList.contains('modal-backdrop')) qrModal.classList.remove('show'); });

downloadQr.addEventListener('click', async function() {
  try {
    var resp = await fetch(qrImg.src); var blob = await resp.blob(); var u = URL.createObjectURL(blob);
    var a = document.createElement('a'); a.download = 'shortly-qr.png'; a.href = u; a.click();
    URL.revokeObjectURL(u); showToast('QR downloaded!', 'success');
  } catch(e) { showToast('Download failed', 'error'); }
});

// Social sharing
document.getElementById('shareWhatsApp').addEventListener('click', function() { window.open('https://api.whatsapp.com/send?text='+encodeURIComponent('Check this out: '+currentShortUrl),'_blank'); });
document.getElementById('shareTwitter').addEventListener('click', function() { window.open('https://twitter.com/intent/tweet?url='+encodeURIComponent(currentShortUrl)+'&text='+encodeURIComponent('Check this out!'),'_blank'); });
document.getElementById('shareTelegram').addEventListener('click', function() { window.open('https://t.me/share/url?url='+encodeURIComponent(currentShortUrl)+'&text='+encodeURIComponent('Check this out!'),'_blank'); });
document.getElementById('shareLinkedIn').addEventListener('click', function() { window.open('https://www.linkedin.com/sharing/share-offsite/?url='+encodeURIComponent(currentShortUrl),'_blank'); });

// Clipboard detection
var clipUrl = '';
async function checkClip() {
  try {
    var t = await navigator.clipboard.readText();
    if (t && isUrl(t) && t.length > 20) {
      clipUrl = t;
      clipboardText.textContent = 'Paste: ' + t.substring(0,35) + '...';
      clipboardPopup.classList.remove('hidden');
      setTimeout(function() { clipboardPopup.classList.add('hidden'); }, 6000);
    }
  } catch(e) {}
}
function isUrl(s) { try { var u = new URL(s); return u.protocol==='http:'||u.protocol==='https:'; } catch(e) { return false; } }
clipboardAccept.addEventListener('click', function() { urlInput.value = clipUrl; clipboardPopup.classList.add('hidden'); showUrlPreview(clipUrl); checkTracking(clipUrl); showToast('URL pasted!', 'info'); });
clipboardDismiss.addEventListener('click', function() { clipboardPopup.classList.add('hidden'); });

// Drag and drop
var dragCount = 0;
document.addEventListener('dragenter', function(e) { e.preventDefault(); dragCount++; dropOverlay.classList.add('show'); });
document.addEventListener('dragleave', function(e) { e.preventDefault(); dragCount--; if (dragCount<=0) { dragCount=0; dropOverlay.classList.remove('show'); } });
document.addEventListener('dragover', function(e) { e.preventDefault(); });
document.addEventListener('drop', function(e) {
  e.preventDefault(); dragCount=0; dropOverlay.classList.remove('show');
  var txt = (e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain') || '').trim();
  if (txt && isUrl(txt)) {
    document.querySelectorAll('.tab').forEach(function(t){t.classList.remove('active')});
    document.querySelector('[data-mode="single"]').classList.add('active');
    form.classList.remove('hidden'); bulkForm.classList.add('hidden');
    urlInput.value = txt; showUrlPreview(txt); checkTracking(txt); urlInput.focus(); showToast('URL dropped!', 'info');
  } else { showToast('Drop a valid URL', 'error'); }
});
urlInput.addEventListener('dragover', function(e) { e.preventDefault(); urlInput.classList.add('drag-over'); });
urlInput.addEventListener('dragleave', function() { urlInput.classList.remove('drag-over'); });
urlInput.addEventListener('drop', function(e) {
  urlInput.classList.remove('drag-over');
  var txt = (e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain') || '').trim();
  if (txt && isUrl(txt)) { urlInput.value = txt; showUrlPreview(txt); checkTracking(txt); }
});

// Init
document.addEventListener('DOMContentLoaded', function() {
  initTheme();
  urlInput.focus();
  setTimeout(checkClip, 800);
});
