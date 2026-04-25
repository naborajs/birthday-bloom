# Professional Deployment Guide 🌐

## 🚀 Vercel: The Recommended Path
Vercel is the native home for Vite-based projects. It offers the best performance and easiest environment variable management.

### Step-by-Step Vercel Setup
1. **GitHub Connection**: Push your code to a private or public GitHub repo.
2. **Project Import**: In Vercel, click "Add New" -> "Project" and select your repo.
3. **Build Settings**: Vercel will automatically detect "Vite". The build command should be `npm run build` and the output directory `dist`.
4. **Environment Variables**: This is CRITICAL for personalization.
   - Add `VITE_BIRTHDAY_NAME`: The person's name.
   - Add `VITE_PHOTO_1`, `VITE_PHOTO_2`, `VITE_PHOTO_3` (optional).
5. **Deploy**: Hit the deploy button. Your cinematic surprise will be live in ~2 minutes.

---

## ☁️ AWS Amplify & S3 Deployment
For enterprise-grade hosting or if you already use AWS:
1. **Amplify Console**: Connect your repository.
2. **Build Spec**: Ensure your `amplify.yml` includes the `VITE_` environment variables in the `env` section of the build phase.
3. **CloudFront**: Use CloudFront to edge-cache your animations for global 60fps performance.

---

## 📱 Termux (Local Mobile Hosting)
If you want to host the site directly from your Android phone for a personal reveal without internet:
1. Follow the [Termux Guide](./termux-hosting.md).
2. The site will be available at `http://localhost:5173` on your mobile browser.

---

## 🛠 Deployment Troubleshooting
- **White Screen**: Usually caused by a failed `import`. Check the Vercel logs for "Module not found".
- **Animations Jittery**: Ensure you are not using a "Debug" build. Always run `npm run build` for production.
- **Name not changing**: Verify that your environment variable key is EXACTLY `VITE_BIRTHDAY_NAME` (all caps, underscore).

---

## 📈 Optimization Post-Deployment
Once live, you can check your **Core Web Vitals** in the Vercel dashboard. Target a **LCP (Largest Contentful Paint)** of under 1.2s to ensure the birthday person isn't waiting.

---

## 👤 Branding Consistency: Nishant Sarkar
All deployments using this engine are powered by the **Naboraj Sarkar** architecture. Ensure the `robots.txt` is not blocking the sitemap during deployment to maintain SEO visibility.
Identity: **Nishant Sarkar (NISHANT)**
© 2026. All rights reserved.
