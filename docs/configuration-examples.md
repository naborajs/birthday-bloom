# 🎯 Configuration Examples & Best Practices

## Pre-Built Configuration Templates

### 1. Romantic Girlfriend (Vercel Deployment)

Perfect for: Boyfriend surprising girlfriend on her birthday

```env
# .env.local or Vercel Dashboard
VITE_BIRTHDAY_NAME=Sarah
VITE_BIRTHDAY_AGE=26
VITE_BIRTHDAY_GENDER=female
VITE_BIRTHDAY_RELATIONSHIP=partner
VITE_BIRTHDAY_COLOR=#FF1493
VITE_BIRTHDAY_CUSTOM_MESSAGE=My beautiful Sarah, thank you for being the love of my life. You light up every day with your smile. Have the most magical birthday ever! 💕
VITE_THEME=romantic
VITE_ANIMATION_INTENSITY=high
VITE_ANIMATION_SPEED=moderate
VITE_PHOTO_1=https://images.unsplash.com/photo-1530103043960-ef38714abb15?w=800
VITE_PHOTO_2=https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800
VITE_PHOTO_3=https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800
VITE_SOUND_URL=https://assets.mixkit.co/active_storage/music/2869/2869-preview.mp3
VITE_FAVORITE_EMOJIS=💖,✨,🌹,💝,❤️,💕,🎀,🌸
VITE_FAVORITE_COLOR=#FF69B4
VITE_TEXT_SIZE=normal
VITE_REDUCED_MOTION=false
```

**Vercel Deployment Steps:**
1. Fork repo on GitHub
2. Connect to Vercel
3. Add above environment variables
4. Deploy on push

---

### 2. Best Friend Party (Firebase Hosting)

Perfect for: Celebrating with best friend

```env
# .env.local for Firebase
VITE_BIRTHDAY_NAME=Alex
VITE_BIRTHDAY_AGE=24
VITE_BIRTHDAY_GENDER=male
VITE_BIRTHDAY_RELATIONSHIP=friend
VITE_BIRTHDAY_COLOR=#00FFFF
VITE_BIRTHDAY_CUSTOM_MESSAGE=Hey my bro! Another year older but still the same awesome person. Let's make this the best birthday ever! 🥳🍻
VITE_THEME=fun
VITE_ANIMATION_INTENSITY=high
VITE_ANIMATION_SPEED=fast
VITE_PARTICLE_COUNT=30
VITE_PHOTO_1=https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800
VITE_PHOTO_2=https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800
VITE_PHOTO_3=https://images.unsplash.com/photo-1507539803526-19b419cd3b5d?w=800
VITE_SOUND_URL=https://assets.mixkit.co/active_storage/music/2869/2869-preview.mp3
VITE_FAVORITE_EMOJIS=🎉,🍻,🔥,😎,⭐,🎊,🥳,🎈
VITE_FAVORITE_COLOR=#00FFFF
VITE_SHOW_SKIP_BUTTON=true
```

---

### 3. Mom's Birthday (Self-Hosted)

Perfect for: Family celebration, accessibility important

```env
# .env.local for self-hosted
VITE_BIRTHDAY_NAME=Mom
VITE_BIRTHDAY_AGE=58
VITE_BIRTHDAY_GENDER=female
VITE_BIRTHDAY_RELATIONSHIP=family
VITE_BIRTHDAY_COLOR=#FFD700
VITE_BIRTHDAY_CUSTOM_MESSAGE=Dear Mom,\n\nThank you for all your love, care, and sacrifices. We are so proud to be your children. Have the most wonderful birthday filled with joy and love!\n\nHappy Birthday! ❤️
VITE_THEME=elegant
VITE_ANIMATION_INTENSITY=medium
VITE_ANIMATION_SPEED=slow
VITE_PARTICLE_COUNT=15
VITE_PHOTO_1=https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800
VITE_PHOTO_2=https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800
VITE_PHOTO_3=https://images.unsplash.com/photo-1507539803526-19b419cd3b5d?w=800
VITE_SOUND_URL=https://assets.mixkit.co/active_storage/music/2869/2869-preview.mp3
VITE_FAVORITE_EMOJIS=❤️,👪,🌹,✨,💐,🎂,💕,🌟
VITE_FAVORITE_COLOR=#FFD700
VITE_TEXT_SIZE=large
VITE_REDUCED_MOTION=false
```

**Self-Hosting Steps:**
```bash
# Build
npm run build

# Upload to hosting provider
# Set environment variables on host
# Point domain to your host
```

---

### 4. Colleague Birthday (Mobile-Optimized)

Perfect for: Office celebration, mobile-first

```env
# .env.local - Mobile optimized
VITE_BIRTHDAY_NAME=John
VITE_BIRTHDAY_AGE=32
VITE_BIRTHDAY_GENDER=male
VITE_BIRTHDAY_RELATIONSHIP=colleague
VITE_BIRTHDAY_COLOR=#0047AB
VITE_BIRTHDAY_CUSTOM_MESSAGE=Happy Birthday John! Wishing you a fantastic year ahead filled with success and happiness. Cheers to another year with an amazing team member! 🎉
VITE_THEME=energetic
VITE_ANIMATION_INTENSITY=medium
VITE_ANIMATION_SPEED=moderate
VITE_PARTICLE_COUNT=12
VITE_PHOTO_1=https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800
VITE_PHOTO_2=https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800
VITE_PHOTO_3=https://images.unsplash.com/photo-1507539803526-19b419cd3b5d?w=800
VITE_SOUND_URL=
VITE_FAVORITE_EMOJIS=🎉,🎊,⭐,🚀,💼,✨
VITE_TEXT_SIZE=normal
VITE_REDUCED_MOTION=false
VITE_SHOW_SKIP_BUTTON=true
```

---

### 5. Kid's Birthday (Accessible)

Perfect for: Young children, accessible design

```env
# .env.local - Kid friendly
VITE_BIRTHDAY_NAME=Emma
VITE_BIRTHDAY_AGE=8
VITE_BIRTHDAY_GENDER=female
VITE_BIRTHDAY_RELATIONSHIP=family
VITE_BIRTHDAY_COLOR=#FF1493
VITE_BIRTHDAY_CUSTOM_MESSAGE=Happy Birthday Emma! 🎉\n\nYou are an amazing girl! Have so much fun today!
VITE_THEME=playful
VITE_ANIMATION_INTENSITY=high
VITE_ANIMATION_SPEED=fast
VITE_PARTICLE_COUNT=20
VITE_PHOTO_1=https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800
VITE_PHOTO_2=https://images.unsplash.com/photo-1530103043960-ef38714abb15?w=800
VITE_PHOTO_3=https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800
VITE_SOUND_URL=https://assets.mixkit.co/active_storage/music/2869/2869-preview.mp3
VITE_FAVORITE_EMOJIS=🎈,🎉,🎊,🦄,✨,💫,🌈,🎀
VITE_FAVORITE_COLOR=#FF1493
VITE_TEXT_SIZE=large
VITE_REDUCED_MOTION=false
```

---

## Best Practices

### 1. Environment Variables

**DO:**
- ✅ Use `.env.local` for local development
- ✅ Never commit `.env.local` to git
- ✅ Use hosting provider's dashboard for production
- ✅ Validate all variables before deployment

**DON'T:**
- ❌ Store sensitive info in code
- ❌ Commit `.env` files
- ❌ Use same env vars for all users
- ❌ Forget to add variables to hosting provider

### 2. Image Optimization

**Best Practices:**
```
Recommended Image Sizes:
- Photo 1: 800×600px (or larger)
- Photo 2: 800×600px (or larger)
- Photo 3: 800×600px (or larger)

Formats:
- Primary: WebP (best compression)
- Fallback: JPEG (universal support)

Services for hosting:
- Unsplash (free, reliable)
- Imgix (CDN optimization)
- AWS S3 + CloudFront (self-hosted)
```

### 3. Animation Tuning

**Mobile Devices:**
```env
VITE_ANIMATION_INTENSITY=medium
VITE_PARTICLE_COUNT=10-15
VITE_ANIMATION_SPEED=moderate
```

**Desktop Devices:**
```env
VITE_ANIMATION_INTENSITY=high
VITE_PARTICLE_COUNT=25-60
VITE_ANIMATION_SPEED=fast
```

### 4. Accessibility

**Always Include:**
- ✅ High contrast color combinations
- ✅ Larger text size for seniors
- ✅ Reduced motion option
- ✅ Keyboard navigation support

```env
# For seniors or accessibility needs
VITE_TEXT_SIZE=large
VITE_HIGH_CONTRAST=true
VITE_REDUCED_MOTION=true
```

### 5. Audio Management

**Current (v2.0):**
- Background music support
- Sound effect playback

**Future (v2.1+):**
- Birthday song integration
- Voice message feature
- Custom playlists

**Best Practice:**
```env
# Always provide a URL
VITE_SOUND_URL=https://your-audio-host.com/music.mp3

# Optional for future
VITE_SONG_URL=
VITE_VOICE_MESSAGE_URL=
```

### 6. Performance

**Build Optimization:**
```bash
# Always test production build locally
npm run build
npm run preview

# Check bundle size
npm run build -- --analyze
```

**Deployment Checklist:**
- [ ] Lighthouse score ≥ 90
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1

### 7. Testing Before Launch

**Mobile Testing:**
```bash
# Test on real devices
- iPhone (min iOS 14)
- Android (min Android 8)
- Tablet (landscape & portrait)

# Test network conditions
- WiFi (4G speeds)
- Slow 3G
- Offline mode

# Test interactions
- Touch events
- Scroll behavior
- Button responsiveness
```

---

## Troubleshooting Guide

### Build Issues

**Issue: "Cannot find module" error**
```bash
# Solution
rm -rf node_modules
npm install
npm run build
```

**Issue: Environment variables not loading**
```bash
# Check:
1. Variables start with VITE_
2. .env.local file exists
3. Dev server restarted
4. Vercel variables set in dashboard
```

### Runtime Issues

**Issue: Animations lag on mobile**
```env
# Solution
VITE_ANIMATION_INTENSITY=low
VITE_PARTICLE_COUNT=5
VITE_REDUCED_MOTION=true
```

**Issue: Audio doesn't play**
```env
# Check:
1. VITE_SOUND_URL is valid
2. URL is HTTPS (not HTTP)
3. CORS enabled on audio host
4. Browser allows autoplay
```

### Deployment Issues

**Issue: Old version showing after update**
```bash
# Solution: Clear cache
# Vercel: Automatic with content hash
# Manual: Cache-Control headers in index.html
```

---

## Monitoring Checklist

**Daily:**
- [ ] Check error logs
- [ ] Verify animations working
- [ ] Test on mobile device
- [ ] Check performance metrics

**Weekly:**
- [ ] Review analytics
- [ ] Check user feedback
- [ ] Performance trends
- [ ] Error pattern analysis

**Monthly:**
- [ ] Dependency updates
- [ ] Security audit
- [ ] Performance optimization
- [ ] Feature usage analysis

---

## Getting Help

- **GitHub Issues**: Report bugs
- **GitHub Discussions**: Ask questions
- **Documentation**: Check docs/ folder
- **Community**: Ask in relevant forums

---

**Remember: The person celebrating should have the best experience possible! 🎉**
