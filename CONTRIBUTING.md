# Contributing to Shortly & Shortly 2.0 ⚡

Thank you for your interest in contributing to Shortly! We welcome contributions ranging from bug fixes, documentation improvements, UI enhancements, to new features.

---

## 🛠️ Development Setup

### 1. Fork & Clone
```bash
git clone https://github.com/<your-username>/Shortly.git
cd Shortly
git checkout -b feature/my-new-feature
```

### 2. Shortly 1.0 (Client-Side)
- No build tools required! Simply open `index.html` in your browser.
- Edit `index.html`, `style.css`, or `app.js` and refresh your browser to test.

### 3. Shortly 2.0 (Full-Stack)

#### Backend (Spring Boot 3 + Java 17):
```bash
cd Shortly-2.0/backend
./mvnw clean test              # Run unit & integration tests
./mvnw spring-boot:run         # Launch development server on http://localhost:8080
```

#### Frontend (React 19 + Vite):
```bash
cd Shortly-2.0/frontend/shortly-react
npm install
npm run dev                    # Launch dev server on http://localhost:5173
npm run build                  # Verify production build
```

---

## 📋 Code Standards

- **Backend**:
  - Maintain Clean Architecture (Controller ➔ Service ➔ Repository).
  - Add unit tests for new business logic in `src/test/java/`.
  - Follow standard Java naming conventions and use Lombok where applicable.
- **Frontend**:
  - Keep components modular and reusable in `src/components/`.
  - Adhere to CSS custom properties defined in `index.css`.
  - Ensure dark and light themes render consistently.

---

## 🚀 Submitting a Pull Request

1. Commit your changes with clear, descriptive commit messages (e.g., `feat: add export to CSV feature` or `fix: resolve alias collision edge case`).
2. Push your branch:
   ```bash
   git push origin feature/my-new-feature
   ```
3. Open a Pull Request on GitHub against the `main` branch.
4. Ensure all CI automated checks pass.

---

## 📄 Code of Conduct

Please be respectful, collaborative, and constructive when engaging with issues and discussions.
