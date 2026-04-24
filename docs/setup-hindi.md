# 🇮🇳 Birthday Bloom - सेटअप गाइड (Setup Guide)

स्वागत है! **Birthday Bloom** को सेटअप करना बहुत आसान है। इस गाइड का पालन करें और अपना खुद का बर्थडे सरप्राइज बनाएं।

---

## 🚀 क्विक स्टार्ट (Quick Start)

### 1. प्रोजेक्ट डाउनलोड करें
सबसे पहले प्रोजेक्ट को अपने कंप्यूटर पर लाएं:
```bash
git clone https://github.com/naborajs/birthday-bloom.git
cd birthday-bloom
```

### 2. डिपेंडेंसी इनस्टॉल करें (Install Dependencies)
प्रोजेक्ट चलाने के लिए ज़रूरी फाइल्स इनस्टॉल करें:
```bash
npm install
```

### 3. कॉन्फ़िगरेशन (Configuration)
प्रोजेक्ट को पर्सनलाइज करने के लिए `.env.example` फाइल को कॉपी करके `.env` नाम दें:
```bash
cp .env.example .env
```
अब `.env` फाइल खोलें और जानकारी भरें:
- `VITE_BIRTHDAY_NAME`: बर्थडे किसका है?
- `VITE_BIRTHDAY_AGE`: उम्र क्या है?
- `VITE_BIRTHDAY_GENDER`: male या female?
- `VITE_BIRTHDAY_RELATIONSHIP`: partner, friend, या family?

### 4. प्रोजेक्ट चलाएं (Run Project)
सब कुछ तैयार है! अब प्रोजेक्ट शुरू करें:
```bash
npm run dev
```
अब अपने ब्राउज़र में `http://localhost:5173` खोलें।

---

## 🛠️ सामान्य समस्याएं और समाधान (Troubleshooting)

| समस्या | समाधान |
| :--- | :--- |
| **Blank Screen (सफ़ेद स्क्रीन)** | चेक करें कि `.env` फाइल में `VITE_BIRTHDAY_NAME` भरा है या नहीं। |
| **Error: npm not found** | आपको **Node.js** इनस्टॉल करना होगा। [nodejs.org](https://nodejs.org) से डाउनलोड करें। |
| **Animations Lag (एनीमेशन अटकना)** | चेक करें कि आपका ब्राउज़र लेटेस्ट वर्जन का है। यह प्रोजेक्ट GPU का इस्तेमाल करता है। |

---

## ☁️ डिप्लॉयमेंट (Deployment)

अगर आप इसे इंटरनेट पर डालना चाहते हैं:
1. **GitHub** पर प्रोजेक्ट अपलोड करें।
2. **Vercel** या **Netlify** पर जाएं।
3. अपना रेपो (Repo) कनेक्ट करें।
4. **Environment Variables** में अपनी `.env` वाली जानकारी भरें।
5. "Deploy" बटन दबाएं।

---

**Naboraj Sarkar (NS CODEX)** द्वारा निर्मित।
मदद के लिए संपर्क करें: [nishant.ns.business@gmail.com](mailto:nishant.ns.business@gmail.com)
