# 🚀 Deployment & 🛠️ Troubleshooting Guide

This guide provides step-by-step instructions for hosting your **Birthday Bloom v2.5** experience and solving common issues.

---

## 🌍 Hosting Your Surprise

Birthday Bloom is a modern React application built with Vite. It is best suited for static hosting platforms.

### 1. Vercel (Recommended 🌟)
Vercel is the easiest way to deploy. It automatically handles the single-page application (SPA) routing.

1.  **Fork/Push** your code to GitHub.
2.  Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3.  Import your repository.
4.  **Crucial Step**: Add your Environment Variables (see below).
5.  Click **Deploy**.

> [!IMPORTANT]
> Ensure you set `VITE_BIRTHDAY_NAME` in the environment variables to bypass the setup screen and launch the surprise instantly!

### 2. Netlify
1.  Connect your GitHub repo to Netlify.
2.  Set **Build Command**: `npm run build`
3.  Set **Publish Directory**: `dist`
4.  Add your `.env` variables in the **Site Settings > Environment Variables** section.
5.  **SPA Fix**: Create a file named `public/_redirects` with the content: `/* /index.html 200`.

### 3. GitHub Pages
1.  Install the deploy package: `npm install gh-pages --save-dev`
2.  Add `"homepage": "https://yourusername.github.io/your-repo-name"` to `package.json`.
3.  Add scripts: `"predeploy": "npm run build", "deploy": "gh-pages -d dist"`
4.  Run `npm run deploy`.

---

## 🔐 The "Perfect Surprise" Configuration

To make the surprise work automatically, populate these variables in your hosting provider's dashboard:

| Variable | Perfect Example | Result |
| :--- | :--- | :--- |
| `VITE_BIRTHDAY_NAME` | `"Nishant"` | Skips setup, starts intro for Nishant |
| `VITE_BIRTHDAY_RELATIONSHIP` | `"partner"` | Romantic theme & pink/red colors |
| `VITE_BIRTHDAY_INTERESTS` | `"cars, gaming, coding"` | Custom quiz & floating emojis |
| `VITE_FINAL_VIDEO_URL` | `"https://youtube.com/watch?v=..."` | Plays a special video at the very end |
| `VITE_SPECIAL_MEMORIES` | `"First Date;url|Our Trip;url"` | Shows a beautiful polaroid gallery |

---

## 🛠️ Troubleshooting (The Solution Bank)

If you encounter an error, find the solution below:

### 🚨 Runtime Errors

| Error Message | Possible Cause | Solution |
| :--- | :--- | :--- |
| **"TypeWriter is not defined"** | Missing import in `MainBirthday.tsx`. | Check imports and ensure `import { TypeWriter } from "./TypeWriter";` is present. |
| **Blank White Screen** | 1. Failed build.<br>2. Missing critical ENV. | 1. Run `npm run dev` and check for errors.<br>2. Ensure `VITE_BIRTHDAY_NAME` is not empty. |
| **"Balloons not moving"** | CSS Animation is missing. | Ensure `index.css` contains the `@keyframes balloon-rise` definition. |
| **"Cake not splitting"** | SVG path error or ID mismatch. | Ensure the `cake-section` ID is present on the container in `MainBirthday.tsx`. |

### 🎞️ Visual & Audio Issues

| Issue | Solution |
| :--- | :--- |
| **Audio doesn't autoplay** | Browsers block audio until a click occurs. Ensure the "Splash Screen" is enabled so the first click unlocks audio. |
| **Images/Photos blurry** | Ensure your image URLs are high quality and use `object-cover` to prevent stretching. |
| **Animations Laggy** | 1. Too many particles (reduce `VITE_PARTICLE_COUNT`).<br>2. Low-end device (Disable `GlitchEffect` in config). |
| **Video not playing** | Ensure you are using the "Embed" URL for YouTube (e.g., `.../embed/VIDEO_ID`). |

### 📦 Build & Deploy Issues

| Problem | Fix |
| :--- | :--- |
| **"Plugin: vite:react-swc error"** | Syntax error in a file (usually a missing `}` or `,`). Check the line number mentioned in the error. |
| **404 on Page Refresh** | (Vercel/Netlify) Add a rewrite rule to redirect all routes to `index.html`. |
| **ENVs not working** | Vite requires variables to start with `VITE_`. Ensure you didn't forget the prefix. |

---

## 💎 Pro-Tip for Creators
If you want to test your surprise perfectly before sending it:
1.  Open your browser's **Incognito Mode**.
2.  Paste your hosted URL.
3.  If it starts with the cinematic intro and uses the correct name, it's ready!

*For more support, reach out to **Naboraj Sarkar** via GitHub or Instagram.*
