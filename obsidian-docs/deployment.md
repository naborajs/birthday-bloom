# Deployment Guide

## 🚀 Deployment Guide

<p align="center">
  <a href="https://youtu.be/gwq1IaHXUn4">
    <img src="https://img.youtube.com/vi/gwq1IaHXUn4/maxresdefault.jpg"
         alt="Birthday Bloom - Complete Deployment Guide"
         width="900">
  </a>
</p>

<p align="center">
  <strong>🚀 Watch the Complete Deployment Guide</strong><br>
  Learn how to deploy <strong>Birthday Bloom</strong> step by step using <strong>Vercel</strong>. This guide covers everything from forking the GitHub repository, importing the project into Vercel, configuring environment variables, deploying your website, customizing it, and publishing updates. Perfect for beginners and experienced developers alike.
</p>

## Quick Deployment (Vercel Recommended)

Vercel is the native home for Vite-based projects and offers the easiest environment variable management.

### Step-by-Step Vercel Setup

1. **Push to GitHub** (public or private repository)
2. **Import in Vercel**: "Add New" → "Project" → select your repo
3. **Build Settings**: Vercel auto-detects Vite. Verify:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Node.js version: 18+ (see `.nvmrc`)
4. **Environment Variables**: Go to Project Settings → Environment Variables and add every `VITE_*` key from your `.env.local`
5. **Deploy**: Click deploy. Your site will be live in ~2 minutes
6. **Update after changes**: Change env values in the dashboard, then trigger a fresh deploy

### Vercel Tips

- The free tier is sufficient for personal birthday surprises
- Vercel automatically provides HTTPS and a CDN
- Use the generated `*.vercel.app` URL or add a custom domain
- For private surprises, keep the repo private and the URL unlisted
- If you see a 404 after refresh, go to project settings and confirm Build Command is `npm run build` and Output Directory is `dist`

### Vercel CLI

```bash
npm install -g vercel

# Deploy from command line
vercel deploy --prod

# Set environment variables
vercel env add VITE_BIRTHDAY_NAME "Sarah"
vercel env add VITE_BIRTHDAY_AGE "25"

# View logs
vercel logs --prod
```

---

## Netlify

1. Push to GitHub
2. Log into Netlify → "Add new site" → Import from GitHub
3. Build settings: `npm run build`, publish directory: `dist`
4. Go to Site configuration → Environment variables
5. Add every `VITE_*` key
6. Deploy

For SPA routing, add a `_redirects` file inside the `public/` folder:
```
/*    /index.html   200
```

### Netlify with `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = "dist"

[context.production.environment]
  VITE_BIRTHDAY_NAME = "Sarah"
  VITE_BIRTHDAY_AGE = "26"
  VITE_BIRTHDAY_RELATIONSHIP = "partner"
  VITE_BIRTHDAY_COLOR = "#FF1493"
  # Reserved for future theme hints; not currently parsed
  # VITE_THEME = "romantic"
```

---

## GitHub Pages

1. Install the deploy package:
   ```bash
   npm install gh-pages --save-dev
   ```
2. Update `vite.config.ts` to set the `base` path:
   ```ts
   export default defineConfig({
     base: '/your-repo-name/',
   })
   ```
3. Add scripts to `package.json`:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```
4. Deploy:
   ```bash
   npm run deploy
   ```

The site will be available at `https://yourusername.github.io/your-repo-name/`.

---

## AWS

### AWS Amplify

Amplify provides a CI/CD pipeline similar to Vercel.

1. **GitHub Connection**: Connect your repository in the Amplify Console
2. **Build Settings**: Ensure your `amplify.yml` includes:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
   ```
3. **Environment Variables**: Add `VITE_*` variables in the "Environment Variables" tab. These must be set BEFORE the build starts.
4. Use CloudFront to edge-cache animations for global performance

### AWS S3 + CloudFront (Advanced)

For maximum control and lower costs at high traffic:

**1. S3 Bucket**
- Create a bucket (e.g., `birthday-bloom-yourname`)
- Enable Static Website Hosting
- Upload the contents of your `dist/` folder

**2. CloudFront (CDN)**
- Create a CloudFront Distribution with the S3 bucket as origin
- Add an ACM certificate for your custom domain
- Enable "Redirect HTTP to HTTPS"

**3. Route 53**
- Create an "A" record pointing to your CloudFront distribution

**Deploy via CLI:**
```bash
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name/ \
  --delete \
  --cache-control "public, max-age=31536000, immutable"

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

**Optimization Tip:** Set `Cache-Control: max-age=31536000` for assets to ensure permanent caching on the user's device.

---

## Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init hosting

# Build and deploy
npm run build
firebase deploy

# Manage channels
firebase hosting:channel:list
```

**Setup steps:**
1. Create a Firebase project
2. Enable Hosting
3. Connect CLI with `firebase login`
4. Initialize with `firebase init`
5. Deploy with `firebase deploy`

Result: Live on Google's CDN with free SSL.

---

## Docker (Self-Hosted)

### Nginx variant (lightweight)

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t birthday-bloom .
docker run -p 80:80 birthday-bloom
```

Env values must be baked into the build — they are not runtime-configurable in this setup.

### Serve variant (with build args)

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

Build with environment variables:
```bash
docker build -t birthday-bloom \
  --build-arg VITE_BIRTHDAY_NAME=Guest \
  --build-arg VITE_BIRTHDAY_RELATIONSHIP=friend \
  --build-arg VITE_BIRTHDAY_COLOR=#FF6B6B \
  .

docker run -p 3000:3000 birthday-bloom
```

---

## Termux (Android)

Host the surprise directly from your Android phone without an external web server. Perfect for offline celebrations or local reveals.

### Installation

1. Download **Termux** from F-Droid (not Play Store — that version is outdated)
2. Run these setup commands:
   ```bash
   pkg update && pkg upgrade
   pkg install nodejs git
   node -v
   ```
3. Clone and start:
   ```bash
   git clone https://github.com/naborajs/birthday-bloom.git
   cd birthday-bloom
   npm install
   npm run dev
   ```
4. Open Chrome on your Android and navigate to `http://localhost:5173`

### Performance

Termux uses a Linux sub-system that is surprisingly efficient. On a mid-range phone (8GB RAM), the app will maintain a steady 60fps.

### Termux Fixes

- **EACCES error**: Run `termux-setup-storage` to give the app file permissions
- **Slow install**: Use `termux-change-repo` to select a mirror closer to your location

---

## Environment Variable Setup

All `VITE_*` variables must be set in the hosting platform's dashboard under Environment Variables. See [ENV_GUIDE.md](./ENV_GUIDE.md) for the complete list.

**Minimum required for a working experience**:
```env
VITE_BIRTHDAY_NAME=Riya
```

**Additional common variables**:
```env
VITE_BIRTHDAY_AGE=25
VITE_BIRTHDAY_RELATIONSHIP=partner
VITE_BIRTHDAY_COLOR=#FF6B6B
VITE_PHOTO_1=https://example.com/photo.jpg
```

**Pro tip for the perfect surprise:**
Ensure `VITE_BIRTHDAY_NAME` is set to bypass the setup screen and launch the cinematic intro instantly.

### Complete Variable Reference

| Variable | Type | Default | Purpose |
| --- | --- | --- | --- |
| `VITE_BIRTHDAY_NAME` | string | "YOU" | Birthday person's name |
| `VITE_BIRTHDAY_RELATIONSHIP` | enum | "friend" | Relationship type |
| `VITE_BIRTHDAY_COLOR` | hex | "#FF6B6B" | Primary color |
| `VITE_BIRTHDAY_GENDER` | enum | "other" | Gender for personalization |
| `VITE_BIRTHDAY_AGE` | number | null | Age for age-specific messages |
| `VITE_BIRTHDAY_DATE` | ISO date | null | Date of birth |
| `VITE_BIRTHDAY_INTERESTS` | csv | "" | Comma-separated interests |
| `VITE_BIRTHDAY_CUSTOM_MESSAGE` | string | "" | Custom birthday message |
| `VITE_BIRTHDAY_WISHER_NAME` | string | "" | Name of the message sender |
| `VITE_PHOTO_1` | URL | null | Photo gallery image 1 |
| `VITE_PHOTO_2` | URL | null | Photo gallery image 2 |
| `VITE_PHOTO_3` | URL | null | Photo gallery image 3 |
| `VITE_VIDEO_1` | URL | null | Video gallery item 1 |
| `VITE_BGM_URL` | URL | null | Background music URL |
| `VITE_ANIMATION_INTENSITY` | enum | "high" | low/medium/high |
| `VITE_DURATION` | `reserved` | "normal" | Reserved for future overall pacing control; not currently parsed. |
| `VITE_FINAL_VIDEO_URL` | URL | null | Special video at the end |
| `VITE_SPECIAL_MEMORIES` | csv | "" | Polaroid gallery items (format: "Title;url\|Title2;url2") |
| `VITE_PASSWORD_REQUIRED` | boolean | false | Force enable password lock |
| `VITE_PASSWORD` | string | "" | Manual password override |
| `VITE_PASSWORD_HINT` | string | "" | Custom hint for password |
| `VITE_PASSWORD_FORMAT` | enum | "MMDD" | Auto-generate password from birthdate |

---

## Build Commands

```bash
npm run build      # Production build to dist/
npm run preview    # Serve the production build locally
npm run build:dev  # Development build (no minification)
npm run test       # Run tests
npm run test:watch # Run tests in watch mode
```

### Local Testing Workflow

```bash
# 1. Development mode
npm run dev
# Starts at http://localhost:5000 with live reload

# 2. Production build
npm run build
# Builds to /dist with all optimizations

# 3. Preview production build
npm run preview
# Runs production build locally at http://localhost:4173
```

---

## Build Output Reference

The production build completes with the following typical output:

```
dist/index.html              2.27 kB (gzip: 0.90 kB)
dist/index.CnxrfwVg.css     87.78 kB (gzip: 14.87 kB)
dist/radix-ui.CoBoz6Cx.js   33.59 kB (gzip: 11.49 kB)
dist/framer-motion.B7EFmO9A.js 38.97 kB (gzip: 13.71 kB)
dist/index.CH7KMd4e.js      90.61 kB (gzip: 26.36 kB)
dist/vendor.9G4eQ2xM.js    372.09 kB (gzip: 120.89 kB)

Total Size: ~547 kB (gzip: ~188 kB)
Build Time: 4.80s
```

Target: < 200 kB gzipped total.

### Performance Optimization Tips

**1. Optimize Images**
- Use WebP format with JPEG fallback
- Compress with TinyPNG or ImageOptim
- Recommended size: 800x600px, keep under 50 kB per image
- Keep images inside the `public/` folder to avoid import issues

**2. Monitor Bundle Size**
```bash
npm run build -- --analyze
```

**3. Cache Strategy**
```
HTML: no-cache (immediate updates)
CSS/JS: max-age=31536000, immutable (cache forever)
Images: max-age=86400 (cache for 1 day)
```

**4. Network Optimization**
- Enable GZIP compression (automatic on Vercel/Netlify)
- Use CDN for image delivery
- Minimize HTTP requests
- Lazy load non-critical images

---

## Testing Checklist

### Local Network Testing

```bash
# Get your local IP
# macOS
ipconfig getifaddr en0
# Linux
hostname -I
# Windows
ipconfig

# Access from mobile on same network
# http://192.168.x.x:5000
```

### Using ngrok

```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Expose to internet
ngrok http 5000

# Access via mobile using the ngrok URL
# https://xxxx-xx-xxx-xx-xxx.ngrok.io
```

### Mobile Optimization Checklist

- [ ] Test on 3 different devices (iPhone, Android, tablet)
- [ ] Test on 2G/3G connection speed (Chrome DevTools -> Network tab)
- [ ] Verify all touch interactions work
- [ ] Check battery usage (run for 5 min)
- [ ] Verify responsive breakpoints
- [ ] Test in airplane mode
- [ ] Test after force refresh (Cmd+Shift+R / Ctrl+Shift+Delete)
- [ ] Test landscape and portrait orientations
- [ ] Test with reduced motion enabled
- [ ] Test text scaling

### Performance Benchmarks

| Metric | Target | Mobile | Tablet | Desktop |
|--------|--------|--------|--------|---------|
| First Contentful Paint | <1.5s | yes | yes | yes |
| Largest Contentful Paint | <2.5s | yes | yes | yes |
| Cumulative Layout Shift | <0.1 | yes | yes | yes |
| Memory Usage | <50MB | yes | yes | yes |
| CPU Usage (sustained) | <40% | yes | yes | yes |
| Frame Rate | 60 FPS | 50+ | 55+ | 60 |

### Slow Network Testing

1. Chrome DevTools -> Network tab
2. Select "Fast 3G" or "Slow 3G"
3. Reload page
4. Verify load time < 3 seconds

### Testing on Real Devices

**Wireless ADB (Android):**
```bash
# Enable developer mode on Android
# Enable USB Debugging (Settings -> Developer Options)

# Connect wirelessly
adb connect ANDROID_DEVICE_IP:5555

# Open Chrome DevTools -> Remote devices
```

**Safari Remote Inspector (iOS):**
```bash
# Connect iPhone to Mac
# iPhone: Settings -> Safari -> Advanced -> Web Inspector
# Mac: Safari -> Develop -> [Your iPhone]
```

**BrowserStack:** Visit www.browserstack.com, select a mobile device, and test your URL.

---

## Pre-Launch Verification Checklist

### Code Quality
- [ ] No TypeScript errors
- [ ] All imports resolved
- [ ] Components properly typed
- [ ] Error boundaries in place
- [ ] No console warnings

### Performance
- [ ] Gzip bundle size < 200 kB
- [ ] Code splitting implemented
- [ ] Vendor libraries separated
- [ ] CSS optimized
- [ ] Images optimized with hash naming

### Features
- [ ] All animation effects working
- [ ] All template themes available
- [ ] Audio system initialized
- [ ] Mobile responsive
- [ ] Accessibility features enabled
- [ ] Error boundaries active

### Deployment Verification
- [ ] Site loads in < 2 seconds
- [ ] CSS applies correctly
- [ ] All animations work smoothly (60fps)
- [ ] Audio plays (if enabled)
- [ ] No console errors
- [ ] No network errors
- [ ] Environment variables loaded correctly
- [ ] SSL certificate active
- [ ] CDN cache configured
- [ ] Lighthouse score >= 90
- [ ] Tested in incognito/private mode
- [ ] Tested on mobile (orientation change, touch, battery)

### Mobile Testing Required
- [ ] Test on iPhone (landscape/portrait)
- [ ] Test on Android (slow network)
- [ ] Test touch interactions
- [ ] Test with reduced motion
- [ ] Test text scaling

---

## Device-Specific Optimizations

### iPhone Configuration

```env
VITE_BIRTHDAY_NAME=Sarah
VITE_ANIMATION_INTENSITY=medium
VITE_PARTICLE_COUNT=12
# Reserved for future text scaling support; not currently parsed
# VITE_TEXT_SIZE=normal
# Reserved for future reduced-motion support; not currently parsed
# VITE_REDUCED_MOTION=false
```

**Test Devices:**
- iPhone 12 (6.1")
- iPhone 14 Pro (6.1")
- iPhone 15 (6.1")
- iPhone 15 Pro Max (6.7")

### Android Configuration

```env
VITE_BIRTHDAY_NAME=Alex
VITE_ANIMATION_INTENSITY=medium
VITE_PARTICLE_COUNT=15
# Reserved for future text scaling support; not currently parsed
# VITE_TEXT_SIZE=normal
# Reserved for future reduced-motion support; not currently parsed
# VITE_REDUCED_MOTION=false
```

**Test Devices:**
- Samsung Galaxy S21 (6.2")
- Google Pixel 7 (6.1")
- OnePlus 11 (6.7")
- Budget device (Redmi Note)

### Device Optimization by Scenario

**Mobile (low-end):**
```env
VITE_ANIMATION_INTENSITY=medium
VITE_PARTICLE_COUNT=12
# Reserved for future reduced-motion support; not currently parsed
# VITE_REDUCED_MOTION=true
```

**Desktop:**
```env
VITE_ANIMATION_INTENSITY=high
VITE_PARTICLE_COUNT=40
# Reserved for future reduced-motion support; not currently parsed
# VITE_REDUCED_MOTION=false
```

### Environment Setup Examples

**Example 1: Romantic Birthday (iPhone)**
```env
VITE_BIRTHDAY_NAME=Jennifer
VITE_BIRTHDAY_AGE=28
VITE_BIRTHDAY_GENDER=female
VITE_BIRTHDAY_RELATIONSHIP=partner
VITE_BIRTHDAY_COLOR=#FF1493
# Reserved for future theme hints; not currently parsed
# VITE_THEME=romantic
VITE_ANIMATION_INTENSITY=high
VITE_PARTICLE_COUNT=12
# Reserved for future text scaling support; not currently parsed
# VITE_TEXT_SIZE=normal
VITE_ANIMATION_SPEED=moderate
```

**Example 2: Fun Birthday (Android)**
```env
VITE_BIRTHDAY_NAME=Mike
VITE_BIRTHDAY_AGE=24
VITE_BIRTHDAY_GENDER=male
VITE_BIRTHDAY_RELATIONSHIP=friend
VITE_BIRTHDAY_COLOR=#00FFFF
# Reserved for future theme hints; not currently parsed
# VITE_THEME=fun
VITE_ANIMATION_INTENSITY=high
VITE_PARTICLE_COUNT=15
# Reserved for future text scaling support; not currently parsed
# VITE_TEXT_SIZE=normal
VITE_ANIMATION_SPEED=fast
```

**Example 3: Family Birthday (Accessible)**
```env
VITE_BIRTHDAY_NAME=Grandma
VITE_BIRTHDAY_AGE=75
VITE_BIRTHDAY_GENDER=female
VITE_BIRTHDAY_RELATIONSHIP=family
VITE_BIRTHDAY_COLOR=#FFD700
# Reserved for future theme hints; not currently parsed
# VITE_THEME=elegant
VITE_ANIMATION_INTENSITY=low
VITE_PARTICLE_COUNT=8
# Reserved for future text scaling support; not currently parsed
# VITE_TEXT_SIZE=large
# Reserved for future reduced-motion support; not currently parsed
# VITE_REDUCED_MOTION=true
```

### Common Mobile Issues & Fixes

**Viewport too zoomed:**
Verify in `index.html`:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

**Touch events not working:**
Use React event handlers:
```tsx
<div onClick={handler} onTouchStart={handler}>
  Touch me
</div>
```

**Font too small on mobile:**
```css
@media (max-width: 480px) {
  body { font-size: 14px; }
  h1 { font-size: 1.8rem; }
}
```

**Battery drains fast:**
```env
# Reserved for future reduced-motion support; not currently parsed
# VITE_REDUCED_MOTION=true
VITE_ANIMATION_INTENSITY=low
```

**App crashes on old devices:**
```bash
npm install core-js regenerator-runtime
```

---

## Common Deployment Issues

### Runtime Errors

| Error Message | Possible Cause | Solution |
| --- | --- | --- |
| Blank white screen | 1. Failed build 2. Missing critical env | Run `npm run dev` and check errors. Ensure `VITE_BIRTHDAY_NAME` is not empty |
| Name not changing | Missing env in hosting dashboard | Verify `VITE_BIRTHDAY_NAME` is set in the hosting platform's environment variables |
| TypeWriter is not defined | Missing import in `MainBirthday.tsx` | Ensure `import { TypeWriter } from "./TypeWriter"` is present |
| Balloons not moving | CSS animation missing | Ensure `index.css` contains `@keyframes balloon-rise` |
| Cake not splitting | SVG path error or ID mismatch | Ensure `cake-section` ID is present on the container |

### Visual & Audio Issues

| Issue | Solution |
| --- | --- |
| Audio doesn't autoplay | Browsers block audio until a click. Ensure the splash screen is enabled so the first click unlocks audio |
| Images/Photos blurry | Use high-quality image URLs and `object-cover` to prevent stretching |
| Animations laggy | Reduce `VITE_PARTICLE_COUNT` or disable `GlitchEffect` in config |
| Video not playing | Use the embed URL format for YouTube (`.../embed/VIDEO_ID`) |
| Photos not loading | Use direct HTTPS image URLs. Enable CORS on image server. Test URL in browser first |

### Build & Deploy Issues

| Problem | Fix |
| --- | --- |
| White screen | Check hosting build logs for "Module not found" errors |
| Animations jittery | Ensure production build (`npm run build`), not dev mode |
| Case-sensitivity errors | Windows/Mac ignore case — Linux servers don't. Check imports match filenames exactly |
| 404 on page refresh | Add a rewrite rule to redirect all routes to `index.html` (Vercel auto-handles; Netlify needs `_redirects`) |
| ENVs not working | Vite requires variables to start with `VITE_`. Verify in hosting dashboard after setting |
| Plugin: vite:react-swc error | Syntax error in a file (missing `}` or `,`). Check the line number in error output |
| Old version showing | Hard refresh (Ctrl+Shift+R). On Vercel/Netlify, content hashing handles cache busting |
| Environment variables not loading | Verify they start with `VITE_`, check hosting dashboard, redeploy after setting. On Vercel/Netlify you must enter them manually — uploading `.env` is not enough |

### Pro Tips

- Test your deployed surprise in **Incognito Mode** before sending the link
- If images are inside `src/assets/`, they must be imported in React — files in `public/` work by path
- Warnings about browserslist in console are safe to ignore

---

## Monitoring & Maintenance

### Post-Launch Checks

- [ ] Site is loading
- [ ] No console errors
- [ ] All features working
- [ ] Check error logs

### Daily Checks

- Monitor error logs
- Check performance metrics
- Verify all features working
- Monitor user feedback

### Weekly Analysis

- Traffic patterns
- Device type distribution
- Performance trends
- User engagement metrics

### Monthly Maintenance

```bash
npm update
npm audit
```

- Security check
- Performance optimization
- Review logs

### Success Criteria

- Site loads in < 2 seconds
- Lighthouse score >= 90
- Mobile responsive (tested on 3+ devices)
- No console errors
- Environment variables working
- All animations smooth (60fps)
- Audio plays without issues
- Error boundaries functioning
- HTTPS enabled
- CDN cache working

---

## Post-Deployment

- Check the live URL for blank screens (usually caused by missing env variables)
- Verify all photos and videos load
- Test on mobile devices
- Check Lighthouse scores (target: LCP < 1.2s, FID < 100ms, CLS < 0.1)
- Verify all animations work smoothly
- Check audio playback
- Verify responsive layout

---

## See Also

- [ENV_GUIDE.md](./ENV_GUIDE.md) — Environment variable reference
- [troubleshooting.md](./troubleshooting.md) — Common issues
- [QUICK_START.md](../QUICK_START.md) — 5-minute setup
- [developer-guide.md](./developer-guide.md) — Development workflow
