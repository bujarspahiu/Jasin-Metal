# Kitchen Industrial Manufacturing — Inox Solutions

## Project Overview

A professional bilingual (English / Albanian) e-commerce and custom manufacturing web platform for a stainless steel kitchen equipment company. The platform supports direct product sales, custom quote requests, a contact system, and a full admin panel.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Node.js + Express (server/index.js, port 3001)
- **Database**: PostgreSQL (Replit built-in)
- **State**: React Context (ShopContext, AuthContext)
- **Dev server**: Vite on port 5000, proxies `/api` to port 3001

## Running the App

```bash
npm run dev
```
This starts both the Express API (port 3001) and the Vite frontend (port 5000) concurrently.

## Architecture

```
src/
  components/
    pages/        # Page-level components (Home, Shop, Quote, Admin, etc.)
    ui/           # shadcn/ui base components
    AppLayout.tsx # Routing logic
    Header.tsx    # Navigation, language switcher
    Footer.tsx    # Footer with newsletter
  contexts/
    ShopContext.tsx  # Cart, wishlist, language, navigation
    AuthContext.tsx  # Authentication and role management
  lib/
    data.ts   # Product catalog, categories, translations (EN/SQ)
server/
  index.js  # Express API server with PostgreSQL
```

## Database Schema (PostgreSQL)

| Table | Purpose |
|-------|---------|
| `newsletter_subscribers` | Email subscribers from footer/forms |
| `quote_requests` | Custom manufacturing quote requests |
| `contact_messages` | Contact form messages |
| `orders` | Customer orders with JSONB items |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/subscribe` | Newsletter subscription |
| POST | `/api/quote` | Custom quote request |
| POST | `/api/contact` | Contact form |
| POST | `/api/orders` | Place an order |
| GET | `/api/admin/stats` | Dashboard statistics |
| GET | `/api/admin/quotes` | All quote requests |
| GET | `/api/admin/messages` | All contact messages |
| GET | `/api/admin/subscribers` | All subscribers |
| GET | `/api/health` | Health check |

## Admin Access

Demo credentials:
- `admin@kitchenmfg.com` / `admin123`
- `manager@kitchenmfg.com` / `manager123`

## Favicon & Branding

- Custom SVG favicon: `/public/favicon.svg` (diamond/inox geometric mark)
- OG image: uses product hero image from CDN
- No third-party platform references in UI or meta tags
