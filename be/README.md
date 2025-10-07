# BOPI Backend

This directory contains the BOPI API server (TypeScript + Express + Prisma).

## Environment variables

Copy `.env.example` to `.env` and fill in values for local development.

Important variables (partial list):

- PORT - server port (default: 2000)
- NODE_ENV - `development` | `production` | `test`
- DATABASE_URL - Postgres connection string
- CORS_ORIGIN - allowed frontend origin(s)
- JWT_SECRET - JWT signing secret (required)
- JWT_EXPIRES_IN - token TTL (e.g. `7d`, `1h`, `30m`)

Dev convenience (development only):

None.
Cookie configuration (used for the auth cookie `bopi_token`):

- COOKIE_SAMESITE - `lax` | `strict` | `none` (default: `lax`)
    - Use `none` only if you need cross-site cookies (requires `COOKIE_SECURE=true` and HTTPS).
- COOKIE_SECURE - `true` | `false` (default: `true`)
    - Set to `false` for local HTTP development (e.g., `http://localhost:2000`).

## Running locally

1. Copy `.env.example` to `.env` and adjust values.
2. Install dependencies:

```bash
cd be
npm install
```

3. Run tests:

```bash
npm test
```

4. Start dev server:

```bash
npm run dev
```

## Notes

- For production, make sure `COOKIE_SECURE=true` and you serve the app over HTTPS.
- Consider storing JWT revocation data in Redis for multi-instance deployments (the current in-memory blacklist is ephemeral).
