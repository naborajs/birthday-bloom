# 📱 Mobile Deployment & Testing Guide

## Quick Start for Mobile

### 1. Testing Locally on Mobile

#### Using ngrok (recommended)
```bash
# Terminal 1: Start dev server
npm run dev

# Terminal 2: Expose to internet
ngrok http 5000

# Access via mobile using the provided URL
# https://xxxx-xx-xxx-xx-xxx.ngrok.io
```

#### Using local network
```bash
# Get your local IP
ipconfig getifaddr en0  # macOS
hostname -I            # Linux
ipconfig               # Windows

# Access from mobile on same network
http://192.168.x.x:5000
```

### 2. Mobile Optimization Checklist

**Before Deployment:**
- [ ] Test on 3 different devices
- [ ] Test on 2G/3G connection speed
- [ ] Verify all touch interactions work
- [ ] Check battery usage (run for 5 min)
- [ ] Verify responsive breakpoints
- [ ] Test in airplane mode
- [ ] Test after force refresh (Cmd+Shift+R / Ctrl+Shift+Delete)

---

## Device-Specific Configuration

### iPhone Configuration

```env
# Optimized for iPhone
VITE_BIRTHDAY_NAME=Sarah
VITE_ANIMATION_INTENSITY=medium
VITE_PARTICLE_COUNT=12
VITE_TEXT_SIZE=normal
VITE_REDUCED_MOTION=false
```

**Test Devices:**
- iPhone 12 (6.1")
- iPhone 14 Pro (6.1")
- iPhone 15 (6.1")
- iPhone 15 Pro Max (6.7")

### Android Configuration

```env
# Optimized for Android
VITE_BIRTHDAY_NAME=Alex
VITE_ANIMATION_INTENSITY=medium
VITE_PARTICLE_COUNT=15
VITE_TEXT_SIZE=normal
VITE_REDUCED_MOTION=false
```

**Test Devices:**
- Samsung Galaxy S21 (6.2")
- Google Pixel 7 (6.1")
- OnePlus 11 (6.7")
- Budget device (Redmi Note)

---

## Performance Benchmarks

### Target Metrics

| Metric | Target | Mobile | Tablet | Desktop |
|--------|--------|--------|--------|---------|
| First Contentful Paint | <1.5s | ✓ | ✓ | ✓ |
| Largest Contentful Paint | <2.5s | ✓ | ✓ | ✓ |
| Cumulative Layout Shift | <0.1 | ✓ | ✓ | ✓ |
| Memory Usage | <50MB | ✓ | ✓ | ✓ |
| CPU Usage (sustained) | <40% | ✓ | ✓ | ✓ |
| Frame Rate | 60 FPS | 50+ | 55+ | 60 |

### Testing Performance

```bash
# Using Lighthouse
npm run audit

# Using WebPageTest
# Visit: webpagetest.org
# Test: https://your-deployment-url

# Using DevTools
# Chrome DevTools → Performance tab → Record
```

---

## Network Optimization

### Slow Network Testing

**Chrome DevTools:**
1. F12 → Network tab
2. Select "Fast 3G" or "Slow 3G"
3. Reload page
4. Verify load time < 3 seconds

### Image Optimization

```bash
# Check image sizes
ls -lh public/assets/

# Use WebP with fallback
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="description">
</picture>
```

### Code Splitting

```typescript
// Automatic (handled by Vite)
// Animation components load separately
// Birthday components load separately
// UI components load separately
```

---

## Platform-Specific Hosting

### Vercel (Easiest)

```bash
# Deploy with one command
vercel deploy --prod

# Set environment variables
vercel env add VITE_BIRTHDAY_NAME "Sarah"
vercel env add VITE_BIRTHDAY_AGE "25"

# View analytics & logs
vercel logs --prod
```

### Firebase Hosting

```bash
# Setup
firebase init hosting

# Deploy
firebase deploy

# Check deployment
firebase hosting:list
```

### Netlify

```bash
# Deploy from git
# Connect GitHub repo to Netlify
# Set environment variables in dashboard
# Deploy on push automatically
```

### Self-Hosted (AWS S3 + CloudFront)

```bash
# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket/

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_ID \
  --paths "/*"
```

---

## Environment Setup Examples

### Example 1: Romantic Birthday (iPhone)

```env
# Romantic Template - Optimized for iPhone
VITE_BIRTHDAY_NAME=Jennifer
VITE_BIRTHDAY_AGE=28
VITE_BIRTHDAY_GENDER=female
VITE_BIRTHDAY_RELATIONSHIP=partner
VITE_BIRTHDAY_COLOR=#FF1493
VITE_THEME=romantic
VITE_ANIMATION_INTENSITY=high
VITE_PARTICLE_COUNT=12
VITE_TEXT_SIZE=normal
VITE_ANIMATION_SPEED=moderate
```

### Example 2: Fun Birthday (Android)

```env
# Fun Template - Optimized for Android
VITE_BIRTHDAY_NAME=Mike
VITE_BIRTHDAY_AGE=24
VITE_BIRTHDAY_GENDER=male
VITE_BIRTHDAY_RELATIONSHIP=friend
VITE_BIRTHDAY_COLOR=#00FFFF
VITE_THEME=fun
VITE_ANIMATION_INTENSITY=high
VITE_PARTICLE_COUNT=15
VITE_TEXT_SIZE=normal
VITE_ANIMATION_SPEED=fast
```

### Example 3: Family Birthday (Accessible)

```env
# Family Template - Accessible for all ages
VITE_BIRTHDAY_NAME=Grandma
VITE_BIRTHDAY_AGE=75
VITE_BIRTHDAY_GENDER=female
VITE_BIRTHDAY_RELATIONSHIP=family
VITE_BIRTHDAY_COLOR=#FFD700
VITE_THEME=elegant
VITE_ANIMATION_INTENSITY=low
VITE_PARTICLE_COUNT=8
VITE_TEXT_SIZE=large
VITE_REDUCED_MOTION=true
```

---

## Testing on Real Devices

### Wireless ADB (Android)

```bash
# Enable developer mode on Android
# Enable USB Debugging (Settings → Developer Options)

# Connect wirelessly
adb connect ANDROID_DEVICE_IP:5555

# Open Chrome DevTools
# Remote devices → Select your device
```

### Safari Remote Inspector (iOS)

```bash
# Connect iPhone to Mac
# iPhone: Settings → Safari → Advanced → Web Inspector
# Mac: Safari → Develop → [Your iPhone]

# Full DevTools access for debugging
```

### Using Browser Stack (Cloud Testing)

```bash
# Visit: www.browserstack.com
# Select mobile device
# Test URL
# Full device emulation and real device access
```

---

## Common Mobile Issues & Fixes

### Issue: Viewport too zoomed

**Cause:** Missing or incorrect viewport meta tag
**Fix:** Verify in index.html
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

### Issue: Touch events not working

**Cause:** Event listeners not properly attached
**Fix:** Use React event handlers
```tsx
<div onClick={handler} onTouchStart={handler}>
  Touch me
</div>
```

### Issue: Font too small on mobile

**Cause:** CSS doesn't account for mobile
**Fix:** Use media queries
```css
@media (max-width: 480px) {
  body { font-size: 14px; }
  h1 { font-size: 1.8rem; }
}
```

### Issue: Battery drains fast

**Cause:** Excessive animations or polling
**Fix:** Enable reduced motion or lower animation intensity
```env
VITE_REDUCED_MOTION=true
VITE_ANIMATION_INTENSITY=low
```

### Issue: App crashes on old devices

**Cause:** Incompatible JavaScript features
**Fix:** Check polyfills and browser support
```bash
npm install core-js regenerator-runtime
```

---

## Monitoring & Debugging

### Real-time Debugging

```javascript
// Enable debug mode
localStorage.setItem('DEBUG', 'birthday-bloom:*');

// Console logging
console.log('Birthday Name:', import.meta.env.VITE_BIRTHDAY_NAME);
console.log('Device Type:', getDeviceType());
console.log('Prefers Reduced Motion:', prefersReducedMotion());
```

### Error Tracking (Optional)

```typescript
// Add Sentry for error tracking
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
});
```

### Performance Monitoring

```typescript
// Log Core Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

---

## Pre-Launch Checklist

- [ ] All environment variables set
- [ ] Images optimized and cached
- [ ] Tested on at least 3 mobile devices
- [ ] Verified performance (Lighthouse score ≥90)
- [ ] Tested with slow network
- [ ] Accessibility tested (keyboard, screen reader)
- [ ] Error boundaries working
- [ ] Analytics configured
- [ ] Error tracking enabled
- [ ] SSL certificate active
- [ ] DNS properly configured
- [ ] CDN cache configured
- [ ] Tested in private/incognito mode
- [ ] QA sign-off obtained

---

## Post-Launch Monitoring

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

### Monthly Review
- Performance optimization opportunities
- Error patterns and fixes needed
- Feature usage analytics
- User feedback summary

---

**Happy deploying! 🚀**
