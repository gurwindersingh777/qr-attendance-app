# QR Attendance App

> **Built to replace paper registers.** Teachers generate a QR code that rotates every 30 seconds — students scan to mark attendance instantly. Proxy attendance is blocked through two independent layers: time-based rotating QR codes and GPS location verification.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-18-339933?logo=nodedotjs)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?logo=vercel)](https://vercel.com)

<br/>

🚀 **[Live Demo](https://your-live-url.vercel.app)** &nbsp;·&nbsp; 📡 **[Backend API](https://your-api-url.onrender.com/health)**

<br/>

> ⚠️ The backend is hosted on Render's free tier — it may take **10–15 seconds to wake up** on first request. Subsequent requests are fast.

---

## Screenshots

### 🎓 Student

<img src="./docs/screenshots/student-subject-detail.png" width="49%"/> <img src="./docs/screenshots/student-dashboard.png" width="49%"/>

<img src="./docs/screenshots/student-scan.png" width="49%"/>

### 👨‍🏫 Teacher

<img src="./docs/screenshots/teacher-session.png" width="49%"/> <img src="./docs/screenshots/teacher-report.png" width="49%"/>

### 🛡️ Admin

<img src="./docs/screenshots/admin-panel.png" width="49%"/>

> 💡 **Tip for reviewers:** Use the demo credentials below to try the full flow — no sign-up needed.

---

## Demo Credentials

| Role    | Email               | Password     |
|---------|---------------------|--------------|
| Teacher | teacher@demo.com    | Teacher@123  |
| Student | student@demo.com    | Student@123  |
| Admin   | admin@demo.com      | Admin@123    |

---

## What Problem Does This Solve?

Traditional paper attendance has three core problems:

- **Slow** — calling names or signing sheets wastes 5–10 minutes per class
- **Proxy-prone** — a friend can sign for an absent student
- **Hard to analyse** — manual sheets don't give percentage breakdowns or alerts

This app solves all three with two independent anti-proxy layers:

- **Time-based** — QR code rotates every 30 seconds, so a screenshot is useless before it can be shared
- **Location-based** — GPS verification ensures the student is physically within 150 metres of the classroom

Both layers must pass for attendance to be marked.

---

## Features

### 👨‍🏫 Teacher
- Create subjects with a unique enrollment code
- Start an attendance session with a configurable duration
- QR code auto-rotates every **30 seconds** — blocks remote proxy attendance
- **6-character manual code** displayed alongside QR (fallback for students without a camera)
- GPS coordinates captured on session start — defines the classroom zone
- Live view of which students have marked attendance
- End session early at any time
- View attendance report per subject — percentage per student
- Export attendance as **CSV**

### 👨‍🎓 Student
- Enroll in subjects using a teacher-provided code
- Mark attendance by scanning QR code via phone camera
- Manual code entry as fallback
- Must be within **150 metres** of the classroom to mark attendance
- Clear error message if out of range or location permission is denied
- Dashboard showing attendance percentage per subject
- Session-by-session history — present or absent for every class
- **Low attendance alert** when percentage drops below 75%

### 🛡️ Admin
- View, search, and filter all users by role
- Edit any user's profile — name, email, role, roll number
- Delete users — automatically cleans up enrollments and subjects
- View all subjects across all teachers

### ⚙️ System
- Automated **email alert** via Resend when student attendance drops below 75%
- In-app notifications with unread count badge
- JWT authentication with **refresh token rotation**
- Role-based route protection — student, teacher, admin
- Fully responsive — works on mobile and desktop

---

## How It Works

```
Teacher starts session
        ↓
Teacher's browser captures GPS coordinates
Server stores location with the session
        ↓
Server generates QR token + 6-char manual code
QR token expires in 30 seconds
        ↓
Teacher screen shows QR image + manual code + countdown timer
        ↓
Student scans QR or types manual code
Student's browser captures GPS coordinates
        ↓
Server validates token → checks enrollment
Server calculates distance using Haversine formula
If distance > 150m  → rejected ❌  "You are Xm away from the classroom"
If distance ≤ 150m  → attendance marked ✅
        ↓
Every 30 seconds:
  — New QR token generated
  — Old token immediately invalidated
  — Proxy via screenshot or WhatsApp is blocked
```

**Why two layers?**
The rotating QR blocks remote proxies but someone physically nearby could still share the code in time. GPS verification closes that loophole — both checks must pass independently.

---

## Tech Stack

| Layer       | Technology                                       |
|-------------|--------------------------------------------------|
| Frontend    | React 18, TypeScript, Vite                       |
| Styling     | Tailwind CSS, shadcn/ui                          |
| State       | Zustand (auth), TanStack Query (server state)    |
| Forms       | React Hook Form + Zod                            |
| Backend     | Node.js, Express, TypeScript                     |
| Database    | MongoDB, Mongoose                                |
| Auth        | JWT (access + refresh tokens), bcrypt            |
| Email       | Resend                                           |
| QR Code     | `qrcode` (generation), `html5-qrcode` (scanning) |
| Geolocation | Browser Geolocation API, Haversine formula       |
| Deployment  | Vercel (frontend), Render (backend), Atlas (DB)  |

---

## Architecture

```
client/                     # React frontend
├── src/
│   ├── api/                # Axios API layer per feature
│   ├── components/         # Shared UI components + layouts
│   ├── config/             # Axios and Query Client configuration
│   ├── hooks/              # Custom hooks (QR scanner, session timer)
│   ├── pages/              # Pages per role (student/teacher/admin)
│   ├── store/              # Zustand auth store
│   ├── types/              # TypeScript interfaces
│   ├── schemas/            # Zod validation schemas
│   ├── routes/             # React Router with protected routes
│   └── utils/              # getLocation, helpers

server/                     # Node.js backend
├── src/
│   ├── config/             # Database connection
│   ├── constants/          # Status codes, paths
│   ├── controllers/        # Request handlers
│   ├── emails/             # Email templates
│   ├── middleware/         # Auth, roles, error handler, security
│   ├── models/             # Mongoose models
│   ├── routes/             # Express routers
│   ├── schemas/            # Zod validation schemas
│   ├── services/           # Business logic layer
│   ├── types/              # TypeScript types
│   └── utils/              # JWT, cookies, QR, location, email helpers
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB running locally or an [Atlas](https://www.mongodb.com/atlas) connection string
- [Resend](https://resend.com) account for email (free tier is sufficient)

### 1. Clone the repo

```bash
git clone https://github.com/gurwindersingh777/qr-attendance-app.git
cd qr-attendance-app
```

### 2. Setup the backend

```bash
cd server
npm install
cp .env.example .env
# Fill in your values in .env
npm run dev
```

### 3. Setup the frontend

```bash
cd client
npm install
cp .env.example .env
# Leave VITE_API_URL empty for local dev — it defaults to localhost:4000
npm run dev
```

### 4. Open the app

| Service  | URL                          |
|----------|------------------------------|
| Frontend | http://localhost:5173        |
| Backend  | http://localhost:4000/health |

---

## API Overview

| Method | Route                            | Access  | Description                 |
|--------|----------------------------------|---------|-----------------------------|
| POST   | `/auth/register`                 | Public  | Create account              |
| POST   | `/auth/login`                    | Public  | Login                       |
| POST   | `/subject`                       | Teacher | Create subject              |
| POST   | `/subject/enroll`                | Student | Enroll by code              |
| POST   | `/session/start`                 | Teacher | Start session + generate QR |
| GET    | `/session/:sessionId/qr`         | Teacher | Rotate QR token             |
| POST   | `/session/mark`                  | Student | Mark attendance             |
| GET    | `/attendance/summary`            | Student | My attendance %             |
| GET    | `/attendance/report/subject/:id` | Teacher | All students report         |
| GET    | `/admin/users`                   | Admin   | All users                   |
| GET    | `/notification`                  | Any     | My notifications            |

---

## Security

- JWT access tokens expire in **1 day** — refresh tokens in **7 days**
- **Refresh token rotation** — old token invalidated on every refresh
- **Rate limiting** — 10 attempts per 15 min on auth routes
- **Helmet** — 15+ HTTP security headers set automatically
- Request body limited to **10kb**
- Passwords hashed with **bcrypt** (10 rounds)
- Role-based middleware on every protected route
- **Two-layer anti-proxy system** — rotating QR (time-based) + GPS verification (location-based)
- Location distance calculated server-side using the Haversine formula — client cannot fake it

---

## Challenges & What I Learned

**Two-layer anti-proxy system** — The rotating QR blocks remote proxies but someone physically nearby could still screenshot and share it within 30 seconds. Adding GPS verification as a second layer closes that loophole — the server calculates distance using the Haversine formula and rejects the request if the student is more than 150 metres from the classroom. Two independent checks — time-based and location-based — make the system genuinely fraud-resistant.

**Token expiry race conditions** — When the QR token rotated exactly as a student was submitting, requests would fail with a false "invalid token" error. I solved this with a short overlap window: the server accepts the previous token for 2 seconds after rotation, making the UX seamless without meaningfully reducing security.

**Refresh token rotation** — Implementing silent token refresh with Axios interceptors while avoiding request queuing bugs taught me a lot about how auth flows work in production apps — race conditions when multiple requests fire simultaneously before a token is refreshed required a pending-promise pattern.

**Role-based architecture** — Designing a single Express backend that serves three completely different user experiences (student/teacher/admin) cleanly required thinking carefully about middleware layering and service separation early on.

---

## Deployment

| Service       | Purpose          | Notes                          |
|---------------|------------------|--------------------------------|
| Vercel        | Frontend hosting | Auto-deploys on push to `main` |
| Render        | Backend hosting  | Free tier — cold starts ~10–15s|
| MongoDB Atlas | Database         | M0 free cluster                |
| Resend        | Email delivery   | Free tier (3,000 emails/month) |

---

## Author

**Gurwinder Singh**
[GitHub](https://github.com/gurwindersingh777) 

