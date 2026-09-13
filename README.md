<div align="center">

# ⚡ Shortly

**A smart, modern URL shortener — built entirely in the browser.**

Shorten links, generate custom QR codes, detect unsafe URLs, clean trackers, and more.  
No backend. No signup. Just paste and go.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-▶%20Open-0D9488?style=for-the-badge&logo=github)](https://ayansahag1010.github.io/Shortly/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=000)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

<img src="assets/preview.png" alt="Shortly Preview" width="720" />

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔗 **Instant Shortening** | Shorten any URL in one click via TinyURL API |
| 🛡️ **Safety Scanner** | Detects phishing domains, suspicious TLDs, and IP-based URLs |
| 🧹 **URL Cleaner** | Strips UTM and tracking parameters automatically |
| 📦 **Bulk Mode** | Shorten up to 10 URLs at once |
| 🎨 **Custom QR Codes** | Pick colors, resize, and download as PNG |
| 🌙 **Dark Mode** | Toggle with persistent local storage preference |
| 📋 **Clipboard Detection** | Prompts to paste URLs copied from elsewhere |
| 🖼️ **Website Previews** | Shows a live screenshot of the destination page |
| 🔍 **Smart URL Preview** | Recognizes YouTube, GitHub, Instagram, Amazon & more |
| 📲 **Social Sharing** | One-click share to WhatsApp, X, Telegram, LinkedIn |
| 🖱️ **Drag & Drop** | Drop a URL anywhere on the page to shorten it |

---

## 🛠️ Tech Stack

- **HTML5** — Semantic, accessible markup
- **CSS3** — Custom properties, glassmorphism, dark mode, responsive grid
- **Vanilla JavaScript** — Zero dependencies, async/await
- **TinyURL API** — URL shortening
- **QR Server API** — QR code generation
- **Thum.io** — Website screenshot previews
- **Font Awesome 6** — Icon library
- **Google Fonts (Inter)** — Typography

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/ayansahag1010/Shortly.git

# Open in browser
cd Shortly
start index.html        # Windows
open index.html         # macOS
xdg-open index.html     # Linux
```

No build tools, no `npm install` — just open `index.html` and it works.

---

## 📁 Folder Structure

```
Shortly/
├── index.html          # Main page
├── style.css           # All styling (light + dark mode)
├── app.js              # Application logic
├── assets/
│   └── preview.png     # Project screenshot
└── README.md
```

---

## 🔮 Future Improvements & Shortly 2.0

Shortly 2.0 has been implemented as a complete enterprise-grade full-stack edition located in the [`Shortly-2.0/`](./Shortly-2.0) directory!

- 📊 **Real-Time Click Analytics & Dashboard** (Live counter, top-performing links, click logs)
- 📝 **Custom Aliases / Slugs** (e.g., `short.ly/my-cool-link`)
- 🕓 **Link Expiration Timers** (1-day, 7-day, 30-day, or permanent links)
- 🔒 **User Authentication & Private Dashboards** (JWT + Spring Security)
- 🎨 **Dynamic QR Code Studio** (Custom resolution, colors, and live PNG download)
- ☕ **Spring Boot 3 + React 19 + MySQL/H2 Architecture** (Base62 encoding, REST API)

Check out [`Shortly-2.0/README.md`](./Shortly-2.0/README.md) for full setup instructions, API documentation, and architecture diagrams.

---

## 👤 Author

**G Ayan Kumar Saha**  
[github.com/ayansahag1010](https://github.com/ayansahag1010)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
