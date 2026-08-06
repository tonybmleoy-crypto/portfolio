# Anton Lopatin — Portfolio

Product designer portfolio, rebuilt as a standalone Next.js site (previously on Framer). RU/EN localized via `/` and `/en`.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Framer Motion (scroll animations)

## Structure

- `app/` — routes: `/` (RU home), `/en` (EN home), `/work/[slug]` and `/en/work/[slug]` (case studies)
- `lib/content/ru`, `lib/content/en` — all text content, per locale
- `components/` — Header, Footer, Hero, ProjectGrid, CaseStudyView, FadeIn
- `public/images/` — project images, downloaded from the original Framer site

Currently live case studies: **Fintrack**, **Rentag**, **7 Prudov dev**.
VODOKACHKA, Eyes Of Yokai and porrrrcha are shown on the home page as "coming soon" — add them the same way as the existing three (see below) whenever you're ready.

## Adding a new case study

1. Add RU content in `lib/content/ru/<slug>.ts` and EN content in `lib/content/en/<slug>.ts`, following the `CaseStudy` shape in `lib/types.ts`.
2. Register both in `lib/content/index.ts` (`caseStudies` map for each locale).
3. Add the project card to `lib/content/ru/home.ts` and `lib/content/en/home.ts`, and set `available: true`.
4. Drop the images in `public/images/<slug>/`.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploying

### 1. Push the code to GitHub

```bash
git init
git add .
git commit -m "Initial portfolio site"
```

Create a new empty repo on GitHub, then:

```bash
git remote add origin <your-repo-url>
git branch -M main
git push -u origin main
```

### 2. Deploy on Vercel (recommended, free)

1. Go to https://vercel.com and sign up/log in with GitHub.
2. Click **Add New → Project**, select this repo.
3. Framework preset is auto-detected as Next.js — leave defaults, click **Deploy**.
4. You'll get a live URL like `your-project.vercel.app` in about a minute.

### 3. Buy a domain

Buy it from any registrar — Namecheap, Cloudflare, Reg.ru, GoDaddy, etc. Cloudflare Registrar tends to be cheapest (sells at cost, no markup) but any registrar works equally well with Vercel.

### 4. Connect the domain to Vercel

1. In the Vercel project → **Settings → Domains**, enter your domain and click **Add**.
2. Vercel shows the DNS records you need (usually an `A` record for the root domain and a `CNAME` for `www`).
3. Go to your domain registrar's DNS settings and add those exact records.
4. Wait for DNS propagation (usually minutes, can take up to ~48h). Vercel auto-issues an SSL certificate once it verifies.

That's it — no Framer subscription, no platform lock-in, full control over the code.
