# Venue — Event Discovery & Booking Platform

A full-stack web application where users can discover events across India, book seats, and manage their tickets. Organizers can create and manage their own events through a dedicated role and API.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Vite, Tailwind CSS, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT + bcrypt + OTP email verification |

---

## Project Structure

```
venue-event-platform/
├── frontend/       React/Vite app (user-facing UI)
└── backend/        Node/Express REST API + MongoDB
```

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally on port 27017 (or a MongoDB Atlas URI)

### 1 — Backend

```bash
cd backend
npm install

# Copy the env template and fill in your values
copy .env.example .env

# Seed the database with sample events and test users
npm run seed

# Start the dev server (hot-reload)
npm run dev
# → http://localhost:5000
```

### 2 — Frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

---

## Test Accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@venue.app | admin123 |
| Organizer | organizer@venue.app | organizer123 |
| Attendee | attendee@venue.app | attendee123 |

---

## Features

### For Attendees
- Browse & search events by city, category, or keyword
- View event details — venue, date, price, seats left
- Register / Login with email + OTP verification
- Book seats with per-attendee details
- Pay via UPI or card (mock gateway, real gateway ready to plug in)
- Download/view booking confirmation ticket
- Dashboard — upcoming bookings, booking history, cancel a booking
- Favourite events (persisted per user)
- Password reset via OTP email flow
- Dark mode — respects system preference, toggleable in navbar

### For Organizers
- Create events (draft or publish immediately)
- Edit event details, update seat count
- Cancel an event (auto-cancels all bookings)
- View attendee list per event

---

## API Overview

Base URL: `http://localhost:5000/api`

| Group | Endpoints |
|-------|-----------|
| Auth | `POST /auth/register` · `/auth/verify-otp` · `/auth/login` · `/auth/forgot-password` · `/auth/reset-password` |
| Profile | `GET /users/me` · `PATCH /users/me` · `POST /users/me/favorites/:id` |
| Events | `GET /events` · `GET /events/meta` · `GET /events/:id` |
| Bookings | `POST /bookings` · `GET /bookings/me` · `PATCH /bookings/:id/cancel` |
| Payments | `POST /payments` · `GET /payments/:id` |
| Organizer | `POST /organizer/events` · `PATCH /organizer/events/:id` · `PATCH /organizer/events/:id/cancel` · `GET /organizer/events/:id/attendees` |
| Team | `GET /team` |

---

## Environment Variables (backend/.env)

| Variable | Description |
|----------|-------------|
| `PORT` | Express port (default `5000`) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for signing JWTs — **change in production** |
| `JWT_EXPIRES_IN` | Token lifetime (default `7d`) |
| `OTP_EXPIRES_MIN` | OTP validity window in minutes (default `10`) |
| `CLIENT_URL` | Frontend URL for CORS (default `http://localhost:5173`) |
| `SMTP_*` | Nodemailer config — if not set, OTPs are printed to console |

---

## Pages & Routes (frontend)

| Route | Page |
|-------|------|
| `/` | Home |
| `/events` | Event listing — search, city & category filters |
| `/events/:id` | Event detail |
| `/events/:id/book` | Attendee details form |
| `/events/:id/payment` | UPI / Card payment |
| `/bookings/:id/confirmation` | Digital ticket |
| `/dashboard` | Bookings, favourites, account |
| `/login` · `/register` | Auth |
| `/forgot-password` → `/verify-otp` → `/reset-password` | Password recovery |
| `/contact` | Contact form & FAQ |
| `/team` | About & team |
