# Quick Start

Get Birthday Bloom running locally in 5 minutes.

---

## Prerequisites

- Node.js 18+ ([.nvmrc](./.nvmrc): 20)
- npm 9+
- Git (latest)

Verify your environment:

```bash
node -v
npm -v
git --version
```

---

## Setup

```bash
# 1. Clone the repository
git clone https://github.com/naborajs/birthday-bloom.git
cd birthday-bloom

# 2. Install dependencies
npm install

# 3. Copy the env template
cp .env.example .env.local

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:5000`.

**PowerShell users**:
```bash
npm.cmd run dev
```

### Creating Your First Bloom

At minimum, set the recipient's name, relationship, and theme color:

```env
VITE_BIRTHDAY_NAME="Naboraj"
VITE_BIRTHDAY_RELATIONSHIP="friend"
VITE_BIRTHDAY_COLOR="#FF6B6B"
```

Supported relationship templates include:

```
friend, brother, sister, father, mother, grandfather, grandmother,
guardian, partner, boyfriend, girlfriend, custom
```

> Most customizations can be completed without editing source code.
> Check [ENV_GUIDE.md](./docs/ENV_GUIDE.md) before modifying components.

### Using Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_BIRTHDAY_NAME=Guest
ARG VITE_BIRTHDAY_RELATIONSHIP=friend
ARG VITE_BIRTHDAY_COLOR=#FF6B6B
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g http-server
COPY --from=0 /app/dist ./dist
EXPOSE 8080
CMD ["http-server", "dist", "-p", "8080"]
```

```bash
docker build -t birthday-bloom .
docker run -p 8080:8080 birthday-bloom
```

---

## Personalize It

Edit `.env.local` with your own values. Here are real-world examples:

### Sample .env.local for a Partner

```env
VITE_BIRTHDAY_NAME=Riya
VITE_BIRTHDAY_AGE=25
VITE_BIRTHDAY_RELATIONSHIP=partner
VITE_BIRTHDAY_COLOR=#FF1493
VITE_BIRTHDAY_CUSTOM_MESSAGE=You make every moment magical.
VITE_BIRTHDAY_WISHER_NAME=Your Love
VITE_BIRTHDAY_INTERESTS=photography,travel,music
VITE_PHOTO_1=https://example.com/photo1.jpg
VITE_PHOTO_2=https://example.com/photo2.jpg
VITE_BGM_URL=https://example.com/song.mp3
```

### Sample .env.local for a Sibling

```env
VITE_BIRTHDAY_NAME=Raj
VITE_BIRTHDAY_AGE=22
VITE_BIRTHDAY_RELATIONSHIP=brother
VITE_BIRTHDAY_COLOR=#0047AB
VITE_BIRTHDAY_GENDER=male
VITE_BIRTHDAY_DATE=2004-03-15
VITE_BIRTHDAY_CUSTOM_MESSAGE=Proud of the man you've become.
VITE_BIRTHDAY_WISHER_NAME=Your Sister
VITE_ANIMATION_INTENSITY=high
VITE_DURATION=extended
VITE_SHOW_CAKE_SECTION=true
VITE_SHOW_VIDEO_SECTION=true
```

### All Configuration Options

| Variable | Type | Default | Purpose |
|---|---|---|---|
| `VITE_BIRTHDAY_NAME` | string | "YOU" | Birthday person's name |
| `VITE_BIRTHDAY_RELATIONSHIP` | enum | "friend" | Relationship type |
| `VITE_BIRTHDAY_COLOR` | hex | "#FF6B6B" | Primary theme color |
| `VITE_BIRTHDAY_GENDER` | enum | "other" | Gender for personalization |
| `VITE_BIRTHDAY_AGE` | number | -- | Age for age-specific messages |
| `VITE_BIRTHDAY_DATE` | ISO date | -- | Date of birth |
| `VITE_BIRTHDAY_INTERESTS` | csv | "" | Comma-separated interests |
| `VITE_BIRTHDAY_CUSTOM_MESSAGE` | string | "" | Custom birthday message |
| `VITE_BIRTHDAY_WISHER_NAME` | string | "" | Name of the message sender |
| `VITE_PHOTO_1`..`VITE_PHOTO_3` | URL | -- | Photo gallery images |
| `VITE_VIDEO_1` | URL | -- | Video gallery item |
| `VITE_BGM_URL` | URL | -- | Background music |
| `VITE_ANIMATION_INTENSITY` | enum | "high" | low / medium / high |
| `VITE_DURATION` | enum | "normal" | quick / normal / extended |
| `VITE_FINAL_VIDEO_URL` | URL | -- | Final surprise video |
| `VITE_PASSWORD_REQUIRED` | boolean | false | Enable password lock |
| `VITE_PASSWORD` | string | "" | Manual password override |
| `VITE_PASSWORD_HINT` | string | "" | Password hint text |
| `VITE_PASSWORD_FORMAT` | enum | "MMDD" | Auto-generate password format |

For the complete list of 40+ variables, see [ENV_GUIDE.md](./docs/ENV_GUIDE.md).

**Restart the dev server** after making changes for them to take effect.

---

## Family Templates

Birthday Bloom includes dedicated templates for different relationships. Activate them via environment variables:

```env
VITE_BIRTHDAY_RELATIONSHIP=sister
VITE_FAMILY_MEMBER_TYPE=sister
VITE_FAMILY_PREFERRED_NAME=Pri
VITE_FAMILY_CLOSENESS=10
```

The family system provides 15 content sections per template, covering personality, interests, memories, sibling bond, and more. For the full reference, see [family-system.md](./docs/family-system.md).

---

## Verify It Works

1. The splash screen appears with "A Special Surprise Awaits..."
2. Tap anywhere -- the cinematic intro begins
3. The intro flows through storytelling -> fake chat -> reveal sequence
4. The main dashboard shows with hero, interest icons, message card, wishes, and sections
5. All content reflects your env values (name, color, relationship tone)
6. Interactive cake cutting, fireworks, music player, and memory gallery all load
7. The final surprise video plays at the end (if configured)

### Pre-Launch Checklist

- [ ] Application builds successfully (`npm run build`)
- [ ] No console errors
- [ ] Photos load correctly
- [ ] Videos play correctly
- [ ] Mobile layout tested
- [ ] Environment variables configured
- [ ] Audio tested
- [ ] Relationship template verified

---

## Build for Production

```bash
npm run build
npm run preview
```

The `dist/` folder is ready to deploy to any static hosting (Vercel, Netlify, AWS S3, Docker). See the [Deployment Guide](./docs/deployment.md) for platform-specific instructions.

---

## Test

```bash
npm run test
npm run lint
```

---

## Troubleshooting

### Blank Screen

Check console for errors (F12). Verify `VITE_BIRTHDAY_NAME` is set and `.env.local` exists in the root directory. Restart the dev server:

```bash
npm run dev
```

### Environment Changes Not Updating

You must restart the dev server after modifying `.env.local`:

```bash
npm run dev
```

### Animations Stutter

Reduce animation intensity:

```env
VITE_ANIMATION_INTENSITY="low"
VITE_DURATION="quick"
```

### Photos Not Loading

Verify URLs are public and correct. Check CORS headers on the image server. Test with simple Unsplash URLs first. Keep images under 500 KB.

### No Sound / Audio Does Not Play

Modern browsers block autoplay until user interaction. Click the "Start" button to trigger playback. Verify `VITE_BGM_URL` is a valid audio URL.

For more help, see the full [Troubleshooting Guide](./docs/troubleshooting.md).

---

## What's Next

| Guide | What It Covers |
|---|---|
| [ENV_GUIDE.md](./docs/ENV_GUIDE.md) | All 40+ configuration options |
| [Deployment Guide](./docs/deployment.md) | Deploy to Vercel, Netlify, AWS, Docker |
| [Family System](./docs/family-system.md) | Brother, Sister, and custom family templates |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Codebase overview and project structure |
| [Developer Guide](./docs/developer-guide.md) | Component reference, API, and extension |
| [Troubleshooting Guide](./docs/troubleshooting.md) | Common issues and solutions |
| [FAQ.md](./FAQ.md) | Frequently asked questions |
| [Complete Setup Guide](./docs/COMPLETE_SETUP_GUIDE.md) | Full reference with data models and API docs |
