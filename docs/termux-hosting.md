# Local Termux Hosting Guide (Android) 📱

Host your **Birthday Bloom** surprise directly from your Android phone without needing an external web server. Perfect for offline celebrations or local reveals.

## 🚀 Step-by-Step Installation

### 1. Install Termux
Download the latest version of **Termux** from F-Droid (not the Play Store, as the Play Store version is outdated).

### 2. Environment Setup
Run these commands in order to prepare your Android "Server":
```bash
# Update the system
pkg update && pkg upgrade

# Install essential tools
pkg install nodejs git

# Verify Node.js installation
node -v
```

### 3. Clone & Ignite
```bash
# Clone the repository curated by Nishant Sarkar
git clone https://github.com/naborajs/birthday-bloom.git

# Enter the command center
cd birthday-bloom

# Install the engine dependencies
npm install

# Start the local surprise portal
npm run dev
```

### 4. Accessing the Site
Once the server starts, it will show an IP address like `http://localhost:5173`.
- Open your Chrome browser on Android.
- Navigate to that URL.
- **Surprise!** Your birthday Bloom is now running locally on your phone.

---

## 📈 Performance on Android
Termux uses a Linux sub-system that is surprisingly efficient. On a mid-range phone (8GB RAM), the **Birthday Bloom** engine will maintain a steady 60fps.

---

## 🛠 Termux Fixes
- **"EACCES" Error**: Run `termux-setup-storage` to give the app file permissions.
- **Slow Install**: Use a mirror closer to your location using `termux-change-repo`.

---

## 👤 Branding Consistency: Nishant Sarkar
This guide was authored by **Nishant Sarkar** specifically for the **Naboraj Sarkar** community. We believe in high-end tech being accessible on any device.
Identity: **Nishant Sarkar (NISHANT)**
© 2026. All rights reserved.
