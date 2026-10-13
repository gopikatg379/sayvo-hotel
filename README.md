# Stayvo Kochi

A Next.js hotel website for Stayvo Kochi by Maprani Group, with the supplied black, gold and white branding, local hotel photography, room tariffs, stay packages, WhatsApp enquiries, and the existing admin features.

## Run locally

```powershell
npm install
Copy-Item .env.example .env
```

Set the hotel MySQL connection in `.env`, plus a secure `AUTH_SECRET` and admin credentials. Configure the actual email, precise address, public site URL and social links when available. The supplied tariff chart’s phone and WhatsApp number are already the defaults.

```powershell
npx prisma generate
npx prisma db push
npm run prisma:seed
npm run dev
```

Open http://localhost:3000. Admin login is at http://localhost:3000/admin/login.

For a fresh database, `prisma db push` creates every table in the current schema, including review moderation and visitor tracking. The seed adds the configured admin and six room templates; it preserves existing records.

Development and production builds use Webpack because Turbopack compilation was stalling on the local Windows filesystem. Development compiles routes on demand, so first visits can take longer. To check normal visitor performance, run `npm.cmd run build`, then `npm.cmd start` with the development server stopped.

The seed uses `ADMIN_SEED_EMAIL` and `ADMIN_SEED_PASSWORD`. Defaults for a fresh setup are `admin@stayvokochi.com` / `ChangeMe123!`; change them before production. Existing admin accounts and package records are preserved. The current local environment retains its existing database and authentication settings.

Changing `.env` does not automatically change the database account used for login. After updating `ADMIN_SEED_EMAIL` or `ADMIN_SEED_PASSWORD`, run:

```powershell
npm.cmd run admin:sync
```

This creates the configured email if it is missing, or updates its password if it already exists. It hashes the password, verifies the saved credentials, and leaves other accounts and hotel content intact. If you change the email, the previous account remains available. Login at `/admin/login` using the updated values.

## Hotel content and admin

- `/rooms`: six room types and the three seasonal tariffs transcribed from the supplied chart.
- `/packages`: room/stay/tour catalog with category, location, budget and duration filters.
- Package details retain galleries, itineraries, inclusions, exclusions, hotel and transport information, SEO and WhatsApp enquiries.
- `/admin/packages`: add/edit/delete, images, featured status and public visibility. **Load Stayvo room templates** adds the six supplied rooms to the connected database without replacing existing entries. Repeated loads preserve edits.
- Existing dashboard statistics, enquiries, visitor tracking and review moderation remain available.
- Public package and approved-review data is cached for 60 seconds and expired after admin changes. Catalog filters share one lightweight database read, and package metadata and detail rendering reuse their data. Failed or stalled database reads are not cached; existing fallback behavior applies after at most five seconds per query.
- Navigation prefetches pages in production, shows a hotel loading screen when needed, and starts at the top. Visitor tracking runs when the browser is idle. The supplied logo is framed in a gold circle.
- The dashboard uses a lightweight SVG enquiry chart, grouped statistics queries, a loading screen and an eight-second statistics timeout. If the database fails, admin navigation remains available.
- Reviews before the Stayvo conversion on October 9, 2026 (India time) are excluded from the hotel homepage and review moderation. Legacy records remain in the database. All approved Stayvo reviews appear on the homepage, regardless of featured status. When there are none, visitors are invited to write the first review.
- The home availability form opens a WhatsApp enquiry with dates, guest count and room preference. The contact form saves stay details with the enquiry. Bookings are confirmed by the hotel team.

Hotel categories separate the new storefront from legacy travel packages. Before hotel records are created, public pages display the supplied room templates. Once the catalog exists, admin deletion and visibility settings take precedence. Database errors also fall back to the static templates; admin writes and saved enquiries require a working database.

Seasonal tariff data and room definitions are in `lib/hotel.json`. The tariff page reflects the supplied chart; package starting-price edits do not change that chart. Supplied entrance and rooftop photos are used as hotel ambience, since individual room photos were not provided. Replace package photos in admin as room photography becomes available.

## Image uploads and production

Admin file uploads use signed Cloudinary uploads authorized by an admin session. Configure `CLOUDINARY_URL`, or `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET`. Keep the API secret on the server. An optional `CLOUDINARY_UPLOAD_PRESET` (or the existing `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`) can be signed; unsigned upload whitelisting is not required. Existing gallery photos can be retained, removed and extended while editing. A cover image URL can also be entered manually.

Set the production site URL, secure database settings, admin password and auth secret. Run `npm run build` before deployment.
