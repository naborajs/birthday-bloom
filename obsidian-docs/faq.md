# Frequently Asked Questions

## General

### What is Birthday Bloom?
A cinematic, env-driven birthday surprise platform built with React, Framer Motion,
and Tailwind CSS. It generates a premium interactive experience that tells a story
— from intro to cake cutting to a heart tree finale — all customizable through
environment variables.

### Who is it for?
- **End users** who want to create a magical birthday surprise for someone special
- **Developers** who want to fork, customize, or contribute to an animation-heavy
  React project
- **Anyone** who wants a polished, open-source celebration microsite

### Is it free?
Yes. Birthday Bloom is MIT-licensed. Free to use, modify, and distribute.

## Customization

### How do I change the birthday person's name?
Set `VITE_BIRTHDAY_NAME` in `.env.local` or your hosting dashboard. No code edits needed.
See the [ENV_GUIDE.md](./docs/ENV_GUIDE.md).

### How do I add my own photos?
Set `VITE_PHOTO_1`, `VITE_PHOTO_2`, `VITE_PHOTO_3` (or use `VITE_PHOTOS` for unlimited)
with direct image URLs. See the [Photos section in ENV_GUIDE.md](./docs/ENV_GUIDE.md#photos).

### How do I change the theme/color?
Set `VITE_BIRTHDAY_COLOR` to any hex code and optionally `VITE_THEME` to
`romantic`, `fun`, `energetic`, `elegant`, `playful`, or `nostalgic`.

### How do I hide sections I don't want?
Use the `VITE_SHOW_*_SECTION` variables. Set any to `false` to hide that section.
See [Sections in ENV_GUIDE.md](./docs/ENV_GUIDE.md#sections).

### How do I make it accessible for older users?
Set `VITE_TEXT_SIZE=large`, `VITE_REDUCED_MOTION=true`,
`VITE_ANIMATION_INTENSITY=low`, and `VITE_PARTICLE_COUNT=8`.

### Can I add background music?
Yes. Set `VITE_SOUND_URL` to an MP3 URL. Video sharing platforms and direct MP3 links
both work.

## Setup & Development

### How do I run it locally?
```bash
git clone https://github.com/naborajs/birthday-bloom.git
cd birthday-bloom
npm install
cp .env.example .env.local
npm run dev
```

### What Node version do I need?
Node 18+ and npm 9+.

### The dev server shows a blank screen?
Most likely a missing env variable. Ensure `VITE_BIRTHDAY_NAME` is set in `.env.local`.
Check the browser console for errors.

### How do I build for production?
```bash
npm run build
npm run preview
```

## Deployment

### How do I deploy to Vercel?
1. Push to GitHub
2. Import into Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

See the [Deployment Guide](./docs/deployment.md).

### Environment variables work locally but not on Vercel?
You must add them in the Vercel project dashboard under Settings → Environment Variables.
Redeploy after adding them.

## Contributing

### How do I contribute?
See [CONTRIBUTING.md](./CONTRIBUTING.md). Bug fixes, documentation, UI polish,
accessibility improvements, and feature ideas are all welcome.

### I have an idea but I'm not a developer — can I still help?
Yes! Open a feature request, improve docs, report bugs, or share your experience.
All contributions are valued.

### Can I use this commercially?
Yes, the MIT License permits commercial use. Attribution is appreciated but not required.

## Troubleshooting

### Photos don't load?
Ensure URLs are direct image links (ending in `.jpg`, `.png`, `.webp`) and use HTTPS.
Avoid URLs that require authentication.

### Animations lag on mobile?
Set `VITE_ANIMATION_INTENSITY=low`, `VITE_PARTICLE_COUNT=10`, and
`VITE_REDUCED_MOTION=true`.

### The intro animation stops midway?
This is usually a timer issue. Check for env date formatting errors and ensure
`VITE_BIRTHDAY_DATE` is valid. Restart the dev server after fixing.

## Still have questions?
Open a [question issue](https://github.com/naborajs/birthday-bloom/issues/new?template=question.yml)
or check the [Support Guide](./SUPPORT.md).
