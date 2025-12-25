# Easy to Cook Meals

A custom Next.js recipe platform for plant-based cooking, replacing WordPress + WP Recipe Maker.

## Features

- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS with custom brand colors
- Supabase for database and storage
- Full recipe management system
- SEO-optimized recipe schema

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account (optional for development)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Run the development server:
```bash
npm run dev
```

Open [http://localhost:8104](http://localhost:8104) to view the site.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public-facing pages
│   │   ├── page.tsx       # Homepage
│   │   ├── recipes/       # Recipe listing
│   │   └── [slug]/        # Individual recipe pages
│   ├── admin/             # Admin dashboard
│   └── api/               # API routes
│       └── recipes/       # Recipe CRUD endpoints
├── components/
│   ├── recipe/            # Recipe-specific components
│   ├── ui/                # Shared UI components
│   └── layout/            # Layout components
├── lib/
│   └── supabase.ts        # Supabase client
└── types/
    └── recipe.ts          # TypeScript type definitions
```

## Brand Colors

- **Primary (Cream)**: `#fbf4ed`
- **Accent (Coral)**: `#fb6a4a`
- **Text**: Warm grays

## Fonts

- **Headings**: Karla (Google Fonts)
- **Body**: Raleway (Google Fonts)

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Hosting**: Vercel (recommended)

## Database Setup

See `ARCHITECTURE.md` for the complete database schema. The schema includes tables for:

- Recipes (main recipe data)
- Ingredient groups
- Ingredients
- Instructions
- Nutrition facts
- Equipment
- User ratings

## Development

The project is configured to run on port **8104** (as per the port registry in ~/dev).

## License

ISC
