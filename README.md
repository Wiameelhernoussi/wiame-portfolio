# Wiame El Hernoussi - Data & AI Engineering Portfolio & CMS

A complete, high-performance, animated professional portfolio website and private headless Content Management System (CMS) designed for **Wiame El Hernoussi**, final-year engineering student in Data & AI at EMSI Marrakech, actively seeking an end-of-studies internship (PFE) starting February 2027 in Morocco or internationally.

---

## 🎨 Visual Identity & Architecture
- **Palette**:
  - Majorelle Blue (`#2B3FA3` / dark: `#4D62CD`)
  - Saffron Accent (`#E9A21F` / dark: `#F5B842`)
  - Canvas Light (`#F5F6FB`) / Midnight Ink Dark (`#16193A`)
  - Surface Light (`#FFFFFF`) / Dark Surface (`#1E2246`)
- **Typography**:
  - Headings: `Bricolage Grotesque`
  - Body: `DM Sans`
- **Frontend Stack**: React 19 + TypeScript + Vite + Tailwind CSS + Framer Motion (respects `prefers-reduced-motion`) + React Router + Lucide Icons.
- **Backend Stack**: FastAPI (Python 3.12+), SQLAlchemy 2.0 ORM, Alembic migrations, Pydantic v2 schemas.
- **Database**: PostgreSQL (production / Docker) or SQLite (`portfolio.db` for instant local development).
- **Storage Layer**: Flexible file storage abstraction supporting both local disk (`uploads/`) and Cloudinary CDN for cloud deployment.
- **Security & Privacy**:
  - Password hashing with bcrypt.
  - JWT authentication with secure httpOnly cookie token refresh.
  - Rate limiting backed by persistent storage across multiple Uvicorn workers.
  - HTML & Markdown sanitization via `rehype-sanitize`.
  - Privacy-friendly analytics visit counter without third-party tracking cookies.
  - Contact form honeypot and rate limiting.

---

## 🚀 Quick Start (One Command with Docker)

Make sure Docker and Docker Compose are installed and running:

```bash
docker-compose up --build
```

- **Public Portfolio**: [http://localhost](http://localhost) (or port `80`)
- **Admin CMS**: [http://localhost/admin/login](http://localhost/admin/login)
- **FastAPI OpenAPI Swagger**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 💻 Local Development Setup (Without Docker)

### 1. Backend Setup
```bash
# Navigate to backend
cd backend

# Create and activate virtual environment (Windows PowerShell)
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Run database seed (creates tables, admin user, and Wiame's projects & profile)
python seed.py

# Start FastAPI server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Frontend Setup
```bash
# Navigate to frontend in a new terminal
cd frontend

# Install dependencies
npm install

# Start Vite dev server on port 3000 (proxies /api to backend:8000)
npm run dev -- --port 3000
```

- **Open in your browser**: [http://localhost:3000](http://localhost:3000)
- **Admin Portal**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## 🔑 Admin Console & Superuser Credentials

- **URL**: `http://localhost:3000/admin/login` (or `http://localhost/admin/login` in Docker)
- **Default Email**: `admin@wiameelhernoussi.com`
- **Default Password**: `ChangeMeNow123!`

*(You can modify these in `.env` or update your password directly from the admin dashboard).*

### How to Add / Update Your Profile Photo:
1. Log in to the Admin Console at `/admin/login`.
2. Click on **Profile & Photo** in the sidebar navigation.
3. In the **Profile Portrait Photo** card, click **Upload New Photo** and select your formal portrait (e.g., `assets/profile.png` or your preferred image).
4. The system automatically centers the face, optimizes the portrait to WebP format, and immediately applies it to the arch frame on the public homepage.
5. In the same view, you can upload your updated **CV (PDF)** and edit your bio, key figures, and contact details.

### How to Add or Edit Projects:
1. In the Admin sidebar, click **Projects**.
2. Click **+ Add New Project** or click the edit icon on any existing project.
3. Fill in the title, category, technologies, short description, and full Markdown documentation with live preview.
4. Upload cover images and gallery screenshots.
5. Toggle **Published** or **Featured** as desired, then click **Save Project**.

---

## ☁️ Production Deployment Guide (Free / Low Cost)

### Option A: Cloudinary for Image & CV Uploads
In production environments (such as Render, Railway, or Vercel) where local filesystems are ephemeral:
1. Create a free account at [Cloudinary](https://cloudinary.com/).
2. In your production environment variables (or `.env`), set:
   ```env
   STORAGE_BACKEND=cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

### Option B: Backend on Render or Railway
- Deploy `backend/` as a Python web service using Docker or Python runtime.
- Set build command: `pip install -r requirements.txt`
- Set start command: `python seed.py && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Add a managed PostgreSQL database and configure `DATABASE_URL`.

### Option C: Frontend on Vercel or Netlify
- Deploy `frontend/` as a static Vite build.
- Build command: `npm run build`
- Output directory: `dist`
- Set environment variable: `VITE_API_BASE_URL=https://your-backend-domain.com/api/v1`

---

## 🧪 Running Automated Tests

Run the full backend test suite covering security, rate limiting, models, storage adapters, and image processing:

```bash
backend\venv\Scripts\python -m pytest backend/tests -v
```

All 22 unit & integration tests pass with 100% success rate.
