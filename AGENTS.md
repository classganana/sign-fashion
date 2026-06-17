<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

### Running in dev
```
npm run dev -- -p 3002
```
Requires `MONGODB_URI` in `.env.local` pointing to a running MongoDB (default: `mongodb://127.0.0.1:27017/sign-fashion`). Without it, database-backed routes gracefully no-op.

### Lint / Build
- `npm run lint` — ESLint (clean, no issues)
- `npm run build` — production build

### Key architecture
- Fullstack Next.js 15 app with API routes under `src/app/api/`
- Admin CMS at `/admin` (login, products, collections, media, merchandising, homepage)
- Storefront at `/` with cart (Zustand state, localStorage persistence)
- MongoDB via Mongoose for products, collections, homepage data
- Cloudinary integration for media (optional, degrades gracefully)
