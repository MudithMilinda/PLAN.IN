# PLAN.IN Frontend User Guide

This guide explains how to install and run the product for a local demonstration, including minimum platform requirements and day-to-day operation.

## 1. Minimum Platform Specification

- OS: macOS, Windows 10/11, or Linux
- CPU: Dual-core 64-bit processor (Intel i5/Ryzen 5 or equivalent)
- RAM: 8 GB minimum (16 GB recommended)
- Storage: At least 2 GB free space
- Runtime: Node.js 20 LTS or newer
- Package manager: npm 10+ (bundled with recent Node.js)
- Browser: Latest Chrome, Edge, Safari, or Firefox
- Network: Internet connection required for third-party services (Clerk, Supabase, OpenAI, Google OAuth, Resend, Telegram)

## 2. System Overview

The product has two apps that run together:

- Frontend (`frontend/new-project`): Next.js web app, default port `3000`
- Backend (`backend`): Express API server, default port `5000`

For a full demo, both services must be running.

## 3. Installation for Demonstration

### Step 1: Clone and open the project

```bash
git clone <your-repository-url>
cd PLAN.IN
```

### Step 2: Install backend dependencies

```bash
cd backend
npm install
```

### Step 3: Install frontend dependencies

```bash
cd ../frontend/new-project
npm install
```

## 4. Environment Configuration

Create environment files from templates below.

### `backend/.env`

```env
PORT=5000
FRONTEND_URL=http://localhost:3000

SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

OPENAI_API_KEY=your_openai_api_key

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/auth/google/callback

TELEGRAM_BOT_TOKEN=your_telegram_bot_token
RESEND_API_KEY=your_resend_api_key
```

### `frontend/new-project/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 5. Run the System

Open two terminals from the project root.

### Terminal A: Start backend

```bash
cd backend
npm run dev
```

Expected: backend starts on `http://localhost:5000`

### Terminal B: Start frontend

```bash
cd frontend/new-project
npm run dev
```

Expected: frontend starts on `http://localhost:3000`

## 6. How to Use / Operate

1. Open `http://localhost:3000` in your browser.
2. Sign in using Clerk authentication.
3. Navigate to the calendar/content features from the UI.
4. Create or manage events/content plans.
5. Use integrations (Google Calendar, Telegram, email subscription, AI generation) if the related API keys are configured.

## 7. Basic Operational Checks

- Frontend health: page loads at `http://localhost:3000`
- Backend health: opening `http://localhost:5000/` returns `Server is running!`
- API connectivity: frontend actions that fetch data complete without network errors

## 8. Common Demo Issues

- `Port already in use`: change `PORT` in backend `.env` and update `NEXT_PUBLIC_API_URL` in frontend `.env.local`
- `401/403 auth errors`: verify Clerk keys are valid and match the project
- `Failed API requests`: confirm backend is running and `NEXT_PUBLIC_API_URL` is correct
- OAuth callback issues: ensure `GOOGLE_REDIRECT_URI` exactly matches your Google Console setting
- Service integration failures: verify third-party keys (OpenAI/Supabase/Resend/Telegram)

## 9. Production Notes

This guide is for local demonstration. For production:

- Use secure secret management (do not commit `.env` files)
- Enable HTTPS
- Configure CORS and allowed origins properly
- Rotate and scope API keys
- Add monitoring and backups
