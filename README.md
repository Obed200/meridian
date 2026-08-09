# The Meridian Post

A full digital newspaper platform built with Next.js (App Router), Prisma + SQLite, and Auth.js:

- Public site: masthead/nav, lead-story hero, category rails, article pages with image-forward
  layout, and reserved ad placements (leaderboard, in-feed, sidebar, in-article).
- Admin panel (`/admin`): Admins create Editor accounts; Editors write, upload images for, and
  publish/unpublish their own posts.
- Analytics dashboard: real page-view tracking (not mock data), charted with Recharts.

## Getting started

```bash
npm install
npx prisma migrate dev   # creates prisma/dev.db
npx prisma db seed       # 8 categories, 3 staff accounts, 14 sample articles with real images
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site, or
[http://localhost:3000/admin/login](http://localhost:3000/admin/login) for the newsroom.

### Seeded accounts

| Role   | Email                          | Password    |
|--------|---------------------------------|-------------|
| Admin  | admin@meridianpost.local        | Admin123!   |
| Editor | editor1@meridianpost.local      | Editor123!  |
| Editor | editor2@meridianpost.local      | Editor123!  |

As Admin you can create additional Editor accounts from **Editors** in the sidebar — a temporary
password is generated and shown once.

## Notes

- Data lives in `prisma/dev.db` (SQLite) and uploaded images in `public/uploads/` — both are
  gitignored since this is configured for local development.
- Uploaded hero images are resized and converted to WebP via `sharp` in
  `src/lib/actions/upload.ts`.
- Route protection for `/admin/*` is enforced in `src/proxy.ts` (Next.js 16's replacement for
  `middleware.ts`), with Admin-only sub-routes (`/admin/users`, `/admin/categories`) additionally
  gated.
