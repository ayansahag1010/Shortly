# Shortly 2.0 — Enterprise-Grade Full-Stack URL Shortener

Shortly 2.0 is a complete rebuild of the original Shortly URL Shortener as a modern, full-stack application built with **React 19**, **Spring Boot 3**, and **MySQL/H2**.

---

## 🚀 Features

- **⚡ Lightning-Fast Shortening**: Generates clean, compact Base62 short links (e.g. `http://localhost:8080/x7K9pQ`).
- **🏷️ Custom Aliases**: Set custom readable slugs (e.g. `my-project`).
- **⏱️ URL Expiration**: Create temporary short links with automatic expiration (1 day, 7 days, 30 days, or never).
- **📊 Real-Time Analytics & Dashboard**:
  - Live click counter incremented on every redirection.
  - Total links created, total clicks tracked, and top-performing link metrics.
  - Recent activity tracking.
- **📱 Dynamic QR Code Generator**:
  - Downloadable high-resolution QR codes.
  - Live customizable foreground and background colors and sizes.
- **🔒 Authentication & Private Link Management**:
  - Stateless JWT authentication with Spring Security & BCrypt.
  - Private URL history table with search, instant clipboard copy, open, and delete confirmation.
- **🎨 Glassmorphism UI & Dark Mode**:
  - Full theme toggle (Dark / Light mode).
  - Responsive mobile navigation bar with hamburger menu.
  - Toast notifications and input validation.

---

## 🏛️ Architecture & Tech Stack

```
   React 19 Frontend (Vite)
              │
              ▼  (REST API / JSON / JWT Bearer)
   Spring Boot 3 Web Layer (UrlController, AuthController, RedirectController)
              │
              ▼
   Service Layer (UrlServiceImpl, AuthServiceImpl)
              │
              ▼
   Repository Layer (UrlRepository, UserRepository via Spring Data JPA)
              │
              ▼
   MySQL / H2 Relational Database
```

### Frontend Stack:
- **Framework**: React 19 + Vite
- **Routing**: React Router v7
- **Styling**: Vanilla CSS3 (Custom design system, glassmorphism, responsive)
- **QR Codes**: `qrcode.react`
- **Icons**: FontAwesome 6

### Backend Stack:
- **Framework**: Spring Boot 3.4.3
- **Language**: Java 17 / 21+
- **Security**: Spring Security 6 + JJWT (JSON Web Token) + BCrypt
- **Persistence**: Spring Data JPA / Hibernate
- **Database**: MySQL (Production profile) / H2 In-Memory (Dev fallback)
- **Validation**: Jakarta Validation API
- **Testing**: JUnit 5 + Mockito

---

## 📂 Project Structure

```
Shortly-2.0/
├── frontend/
│   └── shortly-react/
│       ├── src/
│       │   ├── components/       # Reusable components (Navbar, Hero, UrlForm, UrlResult, QrModal, StatsCard, etc.)
│       │   ├── pages/            # Page views (Home, History, Dashboard, Login, Register, About, NotFound, Expired)
│       │   ├── context/          # State providers (AuthContext, ThemeContext, ToastContext)
│       │   ├── services/         # API clients (urlService, authService)
│       │   ├── App.jsx           # Routes and provider wrappers
│       │   └── index.css         # Complete glassmorphism design system
│       ├── index.html
│       └── package.json
│
├── backend/
│   ├── src/main/java/com/example/shortly/
│   │   ├── config/               # SecurityConfig, JwtUtil, JwtAuthFilter, CorsConfig
│   │   ├── controller/           # UrlController, AuthController, RedirectController
│   │   ├── dto/                  # Request & Response DTOs
│   │   ├── exception/            # Custom exceptions & GlobalExceptionHandler
│   │   ├── model/                # Url & User JPA Entities
│   │   ├── repository/           # UrlRepository & UserRepository
│   │   ├── service/              # UrlService, AuthService & Implementations
│   │   └── ShortlyApplication.java
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── application-mysql.properties
│   ├── src/test/java/com/example/shortly/
│   └── pom.xml
└── README.md
```

---

## 🛠️ Getting Started

### 1. Running the Backend

#### Using Embedded Database (H2 - Instant start):
```bash
cd Shortly-2.0/backend
.\mvnw.cmd spring-boot:run
```
Backend will start on `http://localhost:8080`.
H2 Console is available at `http://localhost:8080/h2-console`.

#### Using MySQL:
1. Ensure MySQL is running on `localhost:3306`.
2. Run with MySQL profile:
```bash
cd Shortly-2.0/backend
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=mysql
```

---

### 2. Running the Frontend

```bash
cd Shortly-2.0/frontend/shortly-react
npm install
npm run dev
```
Frontend will start on `http://localhost:5173`.

---

## 📡 REST API Documentation

### URL Management
- `POST /api/urls` — Create shortened URL (Anonymous or Authenticated)
  ```json
  {
    "originalUrl": "https://example.com/very-long-url",
    "customAlias": "my-alias",
    "expiresIn": "SEVEN_DAYS"
  }
  ```
- `GET /api/urls` — Get list of URLs (Authenticated user's links or recent)
- `GET /api/urls/{id}` — Get single URL details
- `DELETE /api/urls/{id}` — Delete shortened link
- `GET /api/urls/stats` — Get aggregate metrics & top-performing links
- `GET /{shortCode}` — Resolves short code, increments click count, and redirects (302 Found) to destination

### Authentication
- `POST /api/auth/register` — Register new user account
  ```json
  {
    "name": "Alex Smith",
    "email": "alex@example.com",
    "password": "password123"
  }
  ```
- `POST /api/auth/login` — Login and receive JWT token
  ```json
  {
    "email": "alex@example.com",
    "password": "password123"
  }
  ```

---

## 🧪 Running Tests

### Backend JUnit & Mockito Tests:
```bash
cd Shortly-2.0/backend
.\mvnw.cmd test
```

### Frontend Production Build:
```bash
cd Shortly-2.0/frontend/shortly-react
npm run build
```
