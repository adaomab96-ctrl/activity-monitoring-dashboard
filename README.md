# Real-Time Activity Monitoring Dashboard

A live dashboard that tracks and broadcasts activity events in real time using WebSockets.

**Live Links**
- Frontend: https://activity-monitoring-app.netlify.app
- Backend API: https://activity-monitoring-dashboard-production.up.railway.app

---

## Stack

- **Frontend:** Next.js 16 (React 19), Tailwind CSS, Socket.io-client
- **Backend:** NestJS, Socket.io, Prisma ORM
- **Database:** PostgreSQL (Railway)
- **Deployment:** Railway (backend) + Netlify (frontend)

---

## Features

- Live activity feed — events appear instantly via WebSocket broadcast
- Simulate Event button — generates a random event from the frontend
- Notification module — logs in-app push notification channel on every event
- REST API for creating and querying events
- Notifications endpoint for in-app notification history

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/events` | Create a new event (also broadcasts via WebSocket) |
| `GET` | `/events` | Get all events, newest first |
| `GET` | `/events/latest` | Get 20 most recent events |
| `GET` | `/notifications` | Get all in-app notifications |

### POST /events — Request Body
```json
{
  "type": "LOGIN",
  "message": "User logged in from 192.168.1.1"
}
```
Event types: `LOGIN`, `ENTRY`, `ALERT`, `SYSTEM`

---

## Local Setup

### Prerequisites
- Node.js 18+
- PostgreSQL running locally
- npm

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env and set your DATABASE_URL
npm install
npx prisma migrate deploy
npx prisma db seed   # optional — loads sample data
npm run start:dev
```

Backend runs on `http://localhost:3001`

### Frontend

```bash
# In project root
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:3001
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

---

## Environment Variables

See `.env.example` (root) and `backend/.env.example` for all required values.

**Backend (`backend/.env`):**
```
DATABASE_URL=postgresql://user:password@localhost:5432/activity_monitor
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

**Frontend (`.env.local`):**
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## WebSocket Events

The backend emits `newEvent` on the `activity` namespace whenever a new event is created:

```json
{
  "id": 1,
  "eventType": "LOGIN",
  "message": "User logged in",
  "createdAt": "2026-07-30T08:00:00.000Z"
}
```

Frontend connects to `NEXT_PUBLIC_API_URL` and listens for `newEvent` to update the live feed.

---

## Notification Layer

Every event creation triggers the `NotificationsService`, which:
1. Saves an in-app notification record to the database
2. Logs which channel was used (in-app push, SMS, WhatsApp) to the console

Only the **in-app push** channel is implemented. SMS and WhatsApp are stubbed and logged as future channels.

---

## Postman Collection

Import `postman/activity-monitor.postman_collection.json` into Postman to test all endpoints. Set the `baseUrl` variable to your backend URL.

---

## Written Note

### 1. Structuring for iOS and Android (shared backend)

I would use **React Native with Expo** for the mobile apps, sharing the same NestJS backend with the web version. The reasoning: the backend already exposes a clean REST API and WebSocket interface — mobile clients consume those identically to the web frontend. Expo simplifies the build pipeline and allows over-the-air updates without App Store resubmissions.

The main architectural consideration is authentication and push notifications. The backend would need a device token registry (storing FCM/APNs tokens per user) and a notification service that routes to the right channel based on platform. The NestJS notification module is already structured for this — adding a `PUSH` channel alongside `IN_APP` is straightforward. Shared TypeScript types between the Next.js web app, React Native app, and NestJS backend (via a shared `types` package or monorepo) would reduce drift between platforms.

A monorepo (Turborepo or Nx) would be the right call at scale — one repo, three packages: `web`, `mobile`, `backend`, with shared types and API client code.

### 2. Choosing between push notification, SMS, and WhatsApp

The decision is driven by four factors: urgency, cost, user context, and reliability.

**In-app push** is free and immediate — use it for everything that only matters while the user has the app. It has zero marginal cost and should be the default channel.

**SMS** has a per-message cost (typically $0.01–$0.05 depending on region and provider) but has near-universal reach and doesn't require the app to be installed. Use it for high-urgency, time-sensitive events (security alerts, OTP, access verification) where the user may not have the app open.

**WhatsApp** (via Business API) sits between the two — higher engagement rates than SMS in markets where WhatsApp is dominant (Nigeria, Brazil, India), but it has session-based pricing and requires user opt-in. Use it for conversational notifications or markets where SMS open rates are low.

In a cost-conscious product: default to in-app push → fall back to WhatsApp in WhatsApp-dominant markets → fall back to SMS only for critical alerts where delivery confirmation matters. Avoid sending the same notification across all three channels simultaneously — that's the most common cost mistake.
