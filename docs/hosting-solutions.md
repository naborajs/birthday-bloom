# ☁️ Hosting Solutions & 1-Click Deployment

This guide explains how to get your **Birthday Bloom** project live on the internet so you can share the link with the birthday person.

---

## ⚡ Option 1: Vercel (Recommended)
Vercel is the fastest and most reliable way to host this project.

1.  **Push to GitHub**: Create a repository and push your code.
2.  **Import to Vercel**: Go to [vercel.com](https://vercel.com) and click "Add New" -> "Project".
3.  **Environment Variables**: During the build step, find the "Environment Variables" section.
    *   Add `VITE_BIRTHDAY_NAME`, `VITE_BIRTHDAY_RELATIONSHIP`, etc.
4.  **Deploy**: Click deploy and wait 1 minute.
5.  **Fix 404 Error**: If you refresh and see a 404, go to project settings and set the "Build Command" to `npm run build` and "Output Directory" to `dist`.

---

## 🏢 Option 2: Netlify
Netlify is another great free option.

1.  **Connect Repo**: Connect your GitHub repo to Netlify.
2.  **Add `_redirects`**: Inside your `public` folder, create a file named `_redirects` and add this line:
    ```
    /*   /index.html   200
    ```
    This ensures that the page loads correctly when refreshed.
3.  **Env Vars**: Add your variables in the "Site Settings" -> "Environment Variables".

---

## 🛠️ Option 3: GitHub Pages
GitHub Pages is a bit more manual but free forever.

1.  **Install gh-pages**: `npm install gh-pages --save-dev`
2.  **Update `vite.config.ts`**: Set the `base` to your repo name:
    ```ts
    export default defineConfig({
      base: '/your-repo-name/',
      // ... rest
    })
    ```
3.  **Deploy Command**: Add `"deploy": "gh-pages -d dist"` to your `package.json` scripts.
4.  **Run**: `npm run build && npm run deploy`

---

## 🐞 Common Deployment Fixes

### Problem: "Environment Variables not working"
**Solution**: On Vercel/Netlify, you cannot just upload the `.env` file. You MUST enter the variables manually in their web dashboard settings.

### Problem: "Images are broken"
**Solution**: Ensure your images are inside the `public/` folder. If they are in `src/assets/`, they must be imported in React or they won't be bundled.

### Problem: "Build Failed: Module Not Found"
**Solution**: Check your file case-sensitivity. Ensure `CakeCutting.tsx` is imported as `CakeCutting` and not `cakecutting`.

---

**Naboraj Sarkar (NS CODEX)**
*Deployment Team* 🚀
