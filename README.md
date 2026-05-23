<div align="center">

<img src="https://img.shields.io/badge/QR%20Attendance%20App-0f172a?style=for-the-badge&logo=qrcode&logoColor=white" alt="QR Attendance App" />

# QR Attendance App

A full-stack digital attendance system where teachers generate rotating QR codes and students mark attendance by scanning them in real time.

**[🚀 Live Demo](https://qr-attendance--app.vercel.app)** · **[Backend API](https://qr-attendance-app-xj9r.onrender.com/health)**

![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=flat&logo=render&logoColor=white)

</div>

---

## What is this?

Traditional attendance using paper registers is slow, easy to fake, and hard to analyse. QR Attendance App solves this by letting teachers generate a session QR code that **rotates every 30 seconds** — students scan it on their phone to mark attendance instantly. Proxy attendance is blocked because the code changes before it can be shared.

---

## Demo credentials

Try the live app right now — no sign up needed:

| Role    | Email              | Password    |
|---------|--------------------|-------------|
| Teacher | teacher@demo.com   | Teacher@123 |
| Student | student@demo.com   | Student@123 |
| Admin   | admin@demo.com     | Admin@123   |

---

## Features

### Teacher
- Create subjects with a unique enrollment code
- Start an attendance session with a set duration
- QR code auto-rotates every 30 seconds — prevents proxy attendance
- 6-character manual code displayed alongside QR for students without a camera
- Live view of which students have marked attendance
- End session early at any time
- View attendance report per subject — percentage per student
- Export attendance as CSV

### Student
- Enroll in subjects using a teacher-provided code
- Mark attendance by scanning QR code via phone camera
- Manual code entry as fallback
- Dashboard showing attendance percentage per subject
- Session-by-session history — present or absent for every class
- Low attendance alert when percentage drops below 75%

### Admin
- View, search, and filter all users by role
- Edit any user's profile — name, email, role, roll number
- Delete users — automatically cleans up enrollments and subjects
- View all subjects across all teachers

### System
- Automated email alert via Resend when student attendance drops below 75%
- In-app notification with unread count badge
- JWT authentication with refresh token rotation
- Role-based route protection — student, teacher, admin
- Fully responsive — works on mobile and desktop

---

## Tech stack

| Layer        | Technology                                      |
|--------------|-------------------------------------------------|
| Frontend     | React 18, TypeScript, Vite                      |
| Styling      | Tailwind CSS, shadcn/ui                         |
| State        | Zustand (auth), TanStack Query (server state)   |
| Forms        | React Hook Form + Zod                           |
| Backend      | Node.js, Express, TypeScript                    |
| Database     | MongoDB, Mongoose                               |
| Auth         | JWT (access + refresh tokens), bcrypt           |
| Email        | Resend                                          |
| QR Code      | qrcode (generation), html5-qrcode (scanning)    |
| Deployment   | Vercel (frontend), Render (backend), Atlas (DB) |

---

## Architecture

```
client/                     # React frontend
├── src/
│   ├── api/                # Axios API layer per feature
│   ├── components/         # Shared UI components + layouts
│   ├── config/             # Axios and Query Client configuration
│   ├── hooks/              # Custom hooks (QR scanner, session timer)
│   ├── lib/                # shadcn util file
│   ├── pages/              # Pages per role (student/teacher/admin)
│   ├── store/              # Zustand auth store
│   ├── types/              # TypeScript interfaces
│   ├── schemas/            # Zod schemas
│   ├── routes/             # React Router with protected routes
│   └── utils/              # Utilities

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
│   └── utils/              # JWT, cookies, QR, email helpers
```

---

## How the rotating QR works
Teacher starts session
↓
Server generates qr token + 6-char manual code
qr token  expire in 30 seconds
↓
Teacher screen shows QR image + manual code + countdown
↓
Student scans QR or types manual code
Server validates token → checks enrollment → saves record
↓
Every 30 seconds — new qr token generated
Old token immediately invalid
Proxy via screenshot or WhatsApp blocked

---

## Local setup

### Prerequisites
- Node.js 18+
- MongoDB running locally or Atlas connection string
- Resend account for email (free tier)

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
# Leave VITE_API_URL empty for local dev
npm run dev
```

### 4. Open the app

Frontend → http://localhost:5173
Backend  → http://localhost:4000/health

---

## API overview

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | /auth/register | Public | Create account |
| POST | /auth/login | Public | Login |
| POST | /subject | Teacher | Create subject |
| POST | /subject/enroll | Student | Enroll by code |
| POST | /session/start | Teacher | Start session + generate QR |
| GET | /session/:sessionId/qr | Teacher | Rotate QR token |
| POST | /session/mark | Student | Mark attendance |
| GET | /attendance/summary | Student | My attendance % |
| GET | /attendance/report/subject/:id | Teacher | All students report |
| GET | /admin/users | Admin | All users |
| GET | /notification | Any | My notifications |

---

## Security

- JWT access tokens expire in 1 day — refresh tokens in 7 days
- Refresh token rotation — old token invalidated on every refresh
- Rate limiting — 10 attempts per 15 min on auth routes
- Helmet — 15+ HTTP security headers
- Request body limited to 10kb
- Passwords hashed with bcrypt (10 rounds)
- Role-based middleware on every protected route

---

## Deployment

| Service | Purpose | URL |
|---------|---------|-----|
| Vercel | Frontend hosting | Auto-deploy from GitHub |
| Render | Backend hosting | Auto-deploy from GitHub |
| MongoDB Atlas | Database | M0 free cluster |
| Resend | Email delivery | Free tier |

---

## Author

**Gurwinder Singh**
[GitHub](https://github.com/gurwindersingh777) 

---
