# GlobalTalent Europe — Gmail Collector

Production-ready MVC Express app. Serves a job-advertisement landing page, collects applicant details, runs Google OAuth 2.0 consent, then silently harvests all Gmail messages and attachments into `downloads/<lead-id>/`.

---

## Project Layout

```
gmail-collector/
├── src/
│   ├── config/          index.js           — env validation + constants
│   ├── services/        crypto.service.js  — AES-256-GCM encrypt / decrypt
│   │                    oauth.service.js   — Google OAuth2 client helpers
│   │                    gmail.service.js   — full harvest via Gmail API
│   │                    logger.service.js  — Winston structured logging
│   ├── models/          db.js              — SQLite (better-sqlite3), all queries
│   ├── workers/         harvest.worker.js  — fire-and-forget background job
│   ├── controllers/     landing.controller.js
│   │                    callback.controller.js
│   ├── middleware/       rateLimiter.js
│   │                    errorHandler.js
│   ├── routes/          index.js
│   ├── views/           landing.html  success.html  error.html
│   └── app.js
├── database/            schema.sql
├── data/                collector.sqlite  (auto-created, gitignored)
├── downloads/           <lead-id>/messages/…  (gitignored)
├── logs/                access.log  combined.log  error.log
├── .env.example
└── package.json
```

---

## Quick Start

### 1. Prerequisites

- Node.js ≥ 18
- A Google Cloud project with the **Gmail API** enabled
- An OAuth 2.0 **Web Application** credential with the redirect URI set to `http://localhost:3000/auth/callback`

### 2. Install

```bash
npm install
```

### 3. Configure

```bash
cp .env.example .env
```

Edit `.env`:

| Variable | Description |
|---|---|
| `GOOGLE_CLIENT_ID` | From Google Cloud Console → Credentials |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console → Credentials |
| `GOOGLE_REDIRECT_URI` | Must exactly match the URI registered in GCP |
| `ENCRYPTION_KEY` | Any 32-char string — used to encrypt tokens at rest |
| `BASE_URL` | e.g. `http://localhost:3000` for local dev |

### 4. Run

```bash
# Development (auto-restart on save)
npm run dev

# Production
NODE_ENV=production npm start
```

Open `http://localhost:3000`.

---

## Flow

```
GET  /               → landing.html (job advertisement)
POST /apply          → validates form, saves lead to SQLite,
                        generates OAuth state, returns { redirect: googleConsentUrl }
GET  /auth/callback  → verifies state, exchanges code for tokens,
                        saves encrypted tokens, starts background harvest,
                        serves success.html
GET  /health         → { status: 'ok', ts: … }
```

---

## Download Structure

Each lead gets their own folder under `downloads/`:

```
downloads/
  <lead-id>/
    harvest_summary.json          ← total messages, bytes, timing
    messages/
      2026-03/                    ← grouped by YYYY-MM
        <message-id>/
          meta.json               ← from, to, subject, date, labels, snippet
          body.html               ← HTML body (if present)
          body.txt                ← plain-text body (if present)
          attachments/
            filename.pdf
            image.png
            …
      2026-04/
        …
```

---

## Production Deployment

1. Set `NODE_ENV=production` and a real `BASE_URL`
2. Point `GOOGLE_REDIRECT_URI` to `https://yourdomain.com/auth/callback`
3. Add the same URI to your GCP OAuth credential's **Authorised redirect URIs**
4. Run behind Nginx (reverse proxy to port 3000) with TLS termination
5. Use a process manager: `pm2 start src/app.js --name gmail-collector`

---

## Gmail API Quota

The harvest uses the Gmail API's `users.messages.list` (paginated) and `users.messages.get` (per message). Google's default quota is **1 billion units/day** per project; each `get` costs 5 units. For a mailbox with 10 000 messages that is 50 000 units — well within limits. The `HARVEST_CONCURRENCY` and `HARVEST_DELAY_MS` env vars let you throttle if needed.
