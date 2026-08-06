# Noodle

A small social network — post, like, comment, follow. Dark editorial UI, one-tap GitHub login.
Built as a portfolio demo.

Live demo: **TBD** (deploy with the steps below)

## Architecture

```
odin-book/
├── frontend/        React 18 + Vite + Tailwind (dark editorial design system)
├── api/             Express 5 + Prisma + PostgreSQL (Vercel serverless functions)
├── vercel.json      Build + rewrite rules for the single Vercel deployment
└── package.json     Root build script (vite build)
```

One Vercel project hosts everything: the static frontend **and** the API as serverless
functions under the same origin (`/api/*`). No CORS, no cold-start on a separate free tier,
no cross-site cookie problems — auth just works with a same-site httpOnly cookie.

| Layer    | Service      |
| -------- | ------------ |
| Frontend | Vercel (static, `frontend/dist`) |
| API      | Vercel (serverless function, `api/app.js`) |
| Database | Neon Postgres (Prisma ORM) |
| Uploads  | Cloudinary (avatars, post images) |
| Auth     | Local (bcrypt + JWT cookie) + GitHub OAuth |

## Features

- Post, like, comment, follow, search (posts + users)
- GitHub OAuth or local username/password login
- Profile editing (avatar upload → Cloudinary, bio)
- Seeded demo data: `demo` / `demo1234` (10 users, posts with images, likes, comments)

## Local development

```bash
# 1. Backend — needs a DATABASE_URL (Neon free tier works) and the env vars from api/.env.example
cd api
cp .env.example .env        # fill in DATABASE_URL, JWT_SECRET, GITHUB_*, CLOUDINARY_*
npm install                 # also runs prisma generate
npm run db:push             # create tables
npm run seed                # optional: demo data
npm run dev                 # http://localhost:8080

# 2. Frontend — proxies /api to localhost:8080
cd ../frontend
npm install
npm run dev                 # http://localhost:5173
```

## Deploying to Vercel

1. Create a **Neon** project (free tier) and copy its connection string → `DATABASE_URL`.
2. Import this repo on Vercel (root directory stays at repo root — `vercel.json` handles the build).
   No framework preset needed; the build command and output directory are already configured.
3. Add the environment variables from `api/.env.example` to the Vercel project:
   `DATABASE_URL`, `JWT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`,
   `GITHUB_CALLBACK_URL`, `FRONTEND_URL`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`,
   `CLOUDINARY_API_SECRET`.
   - `GITHUB_CALLBACK_URL` = `https://<your-project>.vercel.app/api/login/github/callback`
   - `FRONTEND_URL` = `https://<your-project>.vercel.app`
4. Create the tables + seed the demo data (one-time). Use a local run with the same `DATABASE_URL`,
   or via `vercel dev`: `cd api && npm run db:push && npm run seed`.
5. In GitHub Developer Settings → your OAuth app, set the Authorization callback URL to the
   `GITHUB_CALLBACK_URL` value.
6. Deploy. First page load may be a few seconds while the Neon database warms up — afterwards
   everything is fast.

> Old data in the previous Railway database is not migrated — this is demo data, re-seed instead.

## API surface

All endpoints require the JWT cookie except the auth entry points.

| Method | Path                        | Purpose                          |
| ------ | --------------------------- | -------------------------------- |
| GET    | `/api/user`                 | current user id                  |
| POST   | `/api/register`             | local signup                     |
| POST   | `/api/login/local`          | local login                      |
| GET    | `/api/login/github`         | GitHub OAuth redirect            |
| GET    | `/api/login/github/callback`| OAuth callback                   |
| POST   | `/api/logout`               | clear session                    |
| GET    | `/api/home-page`            | recent posts                     |
| GET    | `/api/follows-page`         | followed users                   |
| GET    | `/api/profile-page`         | own profile                      |
| GET    | `/api/user-page/user/:id`   | user info + posts + follow state |
| GET    | `/api/post-page/post/:id`   | post + comments + like state     |
| PUT    | `/api/follow/user/:id`      | toggle follow                    |
| PUT    | `/api/like/post/:id`        | toggle like                      |
| POST   | `/api/post`                 | create post (multipart)          |
| DELETE | `/api/post/:id`             | delete own post                  |
| POST   | `/api/comment/post/:id`     | comment on post                  |
| DELETE | `/api/comment/:id`          | delete own comment               |
| GET    | `/api/search/posts`         | search posts (`?searchKeyword=`) |
| GET    | `/api/search/users`         | search users (`?searchKeyword=`) |
| PUT    | `/api/profile/image`        | upload avatar (multipart)        |
| PUT    | `/api/profile/bio`          | update bio                       |
