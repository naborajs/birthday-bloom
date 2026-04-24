# 🔐 Environment Logic & Secret Hydration

The **Birthday Bloom** engine uses a secret-first hydration model. This means all personalization data is injected into the application state *before* the user even sees the first pixel.

## ⚙️ How Hydration Works

1. **Initialization**: On boot, the `useBirthdayStore` hook parses all environment variables starting with `VITE_BIRTHDAY_*`.
2. **Persistence**: These values are stored in a reactive **Zustand** store.
3. **Bypass Logic**: If `VITE_BIRTHDAY_NAME` is present, the application automatically sets `isConfigured: true`, effectively skipping the setup wizard and starting the cinematic intro immediately.

## 📝 Full List of Secret Variables

| Key | Example Value | Use Case |
| :--- | :--- | :--- |
| `VITE_BIRTHDAY_NAME` | `"Nishant"` | Personalized greetings throughout. |
| `VITE_BIRTHDAY_RELATIONSHIP` | `"partner"` | Sets the **Template Type** (Partner, Friend, Family). |
| `VITE_BIRTHDAY_AGE` | `25` | Injected into the storytelling lines. |
| `VITE_BIRTHDAY_COLOR` | `#FF6B6B` | Drives the global theme, glows, and gradients. |
| `VITE_CUSTOM_MESSAGE` | `"Stay awesome!"` | Revealed in the final grand message card. |

## 🧪 Verification
To check if your environment is correctly loaded:
1. Ensure your `.env` file exists in the project root.
2. Ensure you have restarted your dev server (`npm run dev`) after creating the file.
3. Open the browser console; the app will log "Personalization Loaded" if successful.

---

## 🔒 Security Note
Since these are client-side variables (`VITE_`), they will be visible in the browser's network tab. Do not store sensitive passwords or private API keys here. Use this strictly for UI personalization.
