---
tags: [seo, meta, search, sitemap, json-ld, sharing]
aliases: [seo-guide]
---

# 🔍 SEO, Social Reach & Generative Engine Optimization (GEO) Guide

Birthday Bloom implements a multi-layer, enterprise-grade SEO and viral distribution architecture designed to maximize organic visibility across search engines (Google, Bing, Yahoo, Yandex, DuckDuckGo), generative AI engines (ChatGPT Search, Perplexity, Claude, Gemini), and social messaging platforms (WhatsApp, X/Twitter, Telegram, Facebook, LinkedIn, iMessage).

---

## 🗺️ 1. Multilingual XML Sitemap (`public/sitemap.xml`)

### Sitemap Location
```
https://birthday-bloom.vercel.app/sitemap.xml
```

### Architecture & Standards
- **Standard Protocol:** `xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`
- **Multilingual Alternates:** `xmlns:xhtml="http://www.w3.org/1999/xhtml"` providing complete bi-directional `hreflang` alternates across **English (en)**, **Bengali (bn)**, **Hindi (hi)**, **French (fr)**, and **Default (x-default)**.
- **Image Sitemap:** `xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"` indexing preview visuals with geo-targeting captions.
- **Mobile First:** `<mobile:mobile/>` tag on all indexed entry points.

### Indexed Categories
1. **Application Root:** Main page with `1.0` priority and daily change frequency.
2. **Multilingual Hubs:** `/?lang=en`, `/?lang=bn`, `/?lang=hi`, `/?lang=fr` (`0.95` priority).
3. **10+ Relationship Archetypes:** Partner, Friend, Family, Brother, Sister, Mother, Father, Daughter, Son, Mentor, Colleague, Crush (`0.9 - 0.85` priority).
4. **Visual & Mood Themes:** Romantic, Fun, Energetic, Elegant, Playful, Nostalgic, Cosmic, Neon, Royal, Cute (`0.9 - 0.8` priority).

---

## 🤖 2. Robots Directives (`public/robots.txt`)

### Crawler Rules & Bot Allocation
```
https://birthday-bloom.vercel.app/robots.txt
```

1. **General Search Engines:**
   - `Googlebot`: Full indexing with `0` crawl delay.
   - `Googlebot-Image`: Full image indexing across `/assets/`, `.jpg`, `.png`, `.svg`.
   - `Bingbot`, `Applebot`, `DuckDuckBot`, `Baiduspider`, `YandexBot`: Allowed.

2. **Social Media & Messaging Previewers (Instant Rich Cards):**
   - `Twitterbot`, `facebookexternalhit`, `LinkedInBot`, `Discordbot`, `WhatsApp`, `TelegramBot`, `Slackbot`, `Pinterestbot`, `SkypeUriPreview`: 100% allowed to generate interactive link previews.

3. **Generative AI & LLM Search Crawlers (GEO):**
   - `GPTBot`, `ChatGPT-User`, `ClaudeBot`, `Claude-Web`, `PerplexityBot`, `Google-Extended`, `Amazonbot`, `cohere-ai`, `CCBot`: Full open discovery access to ingest architecture guides.

4. **Security & Blocked Scraping Bots:**
   - `MJ12bot`, `AhrefsBot`, `SemrushBot`, `PetalBot`: Blocked.
   - Private routes disallowed: `/admin/`, `/private/`, `/.env`, `/.git/`.

---

## 🏷️ 3. Dynamic Runtime SEO Manager (`useDynamicSEO.ts`)

Instead of relying solely on static HTML, Birthday Bloom features an active runtime SEO manager (`src/features/core/seo/useDynamicSEO.ts`) that reactively updates document tags when custom parameters or languages change:

- **Dynamic Document Title:**
  - English: `Happy Birthday Sophia! | Birthday Bloom`
  - Bengali: `শুভ জন্মদিন অনিন্দিতা! | Birthday Bloom`
  - Hindi: `जन्मदिन मुबारक राहुल! | Birthday Bloom`
  - French: `Joyeux Anniversaire Camille! | Birthday Bloom`
- **Dynamic Meta Description:** Culturally authentic celebration summary personalized with the celebrant's name, relationship, and language.
- **Dynamic OpenGraph Tags:** `og:title`, `og:description`, `og:locale` (`en_US`, `bn_BD`, `hi_IN`, `fr_FR`), and `og:url`.
- **Dynamic Twitter Cards:** `twitter:title`, `twitter:description`, `summary_large_image`.
- **Dynamic Canonical Link:** Self-referencing dynamic canonical URL.
- **Dynamic Schema.org JSON-LD:** Real-time `<script type="application/ld+json" id="birthday-bloom-dynamic-ldjson">` injecting `SocialEvent` structured data for the celebrant.

---

## 📊 4. Schema.org Structured Data (`index.html`)

Birthday Bloom embeds a rich Schema.org `@graph` providing search engines with structured machine-readable knowledge:

1. **`WebSite` Schema:** Site identification, multilingual support (`["en", "bn", "hi", "fr"]`), publisher info, and `SearchAction` search query routing.
2. **`WebApplication` Schema:** Software version (`3.1.0`), `EntertainmentApplication` category, 5-star aggregate rating (`4.9/5` from 320 reviews), free pricing offer, screenshot references, and feature list.
3. **`FAQPage` Schema:** 6 high-value search queries targeting Google Rich Snippet FAQ accordions:
   - *What is Birthday Bloom?*
   - *How do I create a personalized birthday surprise website?*
   - *Is Birthday Bloom free and open source?*
   - *What features are included in the birthday celebration?*
   - *Can I add custom photos, videos, and music?*
   - *Does Birthday Bloom work on mobile devices?*
4. **`HowTo` Schema:** Step-by-step 4-step tutorial on generating custom surprise URLs.
5. **`BreadcrumbList` Schema:** Structured hierarchy (Home → Templates → Celebrations).

---

## 🚀 5. Viral Sharing & Referral Engine (`ShareCelebrationModal.tsx`)

To accelerate reach organically, Birthday Bloom includes a built-in sharing and referral suite:
- **1-Click WhatsApp, X (Twitter), Telegram, Facebook, LinkedIn** direct sharing buttons with pre-filled localized copy and UTM tracking tags (`utm_source=share&utm_medium=social&utm_campaign=birthday_celebration`).
- **Interactive URL Customizer:** Any visitor can type a friend's name, choose a relationship archetype and language, and instantly generate a shareable URL.
- **Native Web Share API:** Leverages mobile OS native share sheets (`navigator.share`).

---

## ⚡ 6. Performance, Core Web Vitals & Caching (`vercel.json`)

1. **Preconnect Hints:** `<link rel="preconnect" href="https://fonts.googleapis.com">` and `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`.
2. **Static Asset Caching:**
   - `sitemap.xml`, `robots.txt`, `llms.txt`, `llms-full.txt`, `site.webmanifest`: `public, max-age=86400, stale-while-revalidate=604800`
   - Images and icons: `public, max-age=604800, stale-while-revalidate=2592000`
3. **Semantic `<noscript>` Fallback:** Full crawlable HTML content for search bots that do not execute JavaScript.

---

#obsidian #documentation #birthday-bloom #seo #geo #social #schema