# 🚀 Getting Started with NS CODEX Birthday Bloom

Welcome to the **NS CODEX** Cinematic Engine. You are about to build a premium, digital surprise that pushes the boundaries of web interactivity. This guide will take you from a fresh clone to a production-ready cinematic launch.

---

## 🏁 The 5-Minute Launch

### 1. Prerequisite Check
Ensure you have the following installed on your machine:
- **Node.js**: v18.0.0 or higher (LTS recommended).
- **npm**: v9.0.0 or higher.
- **Git**: For version control and deployment.

### 2. Installation & Boot
```bash
# Clone the repository
git clone https://github.com/naborajs/birthday-bloom.git
cd birthday-bloom

# Install dependencies with NS CODEX precision
npm install

# Start the dev server
npm run dev
```

### 3. The "Secret" Personalization
This engine is designed for **Zero-Config Launch**. It skips all setup wizards and starts the experience immediately using your environment variables.

1. Create a `.env` file in the root.
2. Add the mandatory variables:
   ```env
   VITE_BIRTHDAY_NAME="Naboraj"
   VITE_BIRTHDAY_RELATIONSHIP="friend"
   VITE_BIRTHDAY_COLOR="#FF6B6B"
   ```
3. Restart your dev server to apply the secrets.

---

## 🛡️ Error Handling & Troubleshooting (Pre-Flight)

Before you send the link, run these checks to ensure a flawless experience.

### Common Runtime Errors
| Issue | Cause | Fix |
| :--- | :--- | :--- |
| **Blank Screen** | Missing `VITE_BIRTHDAY_NAME` | Ensure your `.env` contains the mandatory name variable. |
| **Animations Stutter** | High memory usage / Large images | Keep photos under 500KB and avoid heavy background processes. |
| **No Sound** | Browser Autoplay Policy | The engine requires a "Splash" interaction. Ensure the user clicks the "Start" button. |

### Diagnostic Mode
If things look wrong, check the browser console (`F12` -> `Console`). The NS CODEX engine logs its state machine transitions. If a scene fails to load, it will be logged there with a specific error code.

---

## 🎭 Design Philosophy: The CODEX Standard

Every "Bloom" instance should feel bespoke. When configuring your instance, keep these **NS CODEX** standards in mind:

1. **Color Harmony**: Use a color that matches the recipient's personality. Our engine will automatically generate glows and gradients based on your hex code.
2. **Pacing**: Don't rush the narrative. The default timings are optimized for emotional impact.
3. **Typography**: If you modify fonts, ensure they support the `italic` and `bold` variants used in the kinetic typography layers.

---

## 📖 Deep Dive Documentation
- [🇮🇳 सेटअप गाइड (Hindi)](./setup-hindi.md)
- [🇧🇩 সেটআপ গাইড (Bengali)](./setup-bengali.md)
- [🛠️ Advanced Fixes & Troubleshooting](./advanced-fixes.md)
- [☁️ Hosting & Deployment Solutions](./hosting-solutions.md)
- [⚙️ Full Configuration Guide](./ENV_GUIDE.md)
- [🏛️ System Architecture](./architecture.md)
- [🎥 Animation Principles](./animations.md)

---
*“In the garden of the internet, may your digital memories always bloom.”* 🌸
