# 🇧🇩 Birthday Bloom - সেটআপ গাইড (Setup Guide)

স্বাগতম! **Birthday Bloom** সেটআপ করা অত্যন্ত সহজ। এই গাইডটি অনুসরণ করে আপনার প্রিয়জনের জন্য একটি চমৎকার সারপ্রাইজ তৈরি করুন।

---

## 🚀 কুইক স্টার্ট (Quick Start)

### ১. প্রজেক্ট ডাউনলোড করুন
প্রথমে আপনার কম্পিউটারে প্রজেক্টটি নিয়ে আসুন:
```bash
git clone https://github.com/naborajs/birthday-bloom.git
cd birthday-bloom
```

### ২. ডিপেন্ডেন্সি ইনস্টল করুন (Install Dependencies)
প্রজেক্টটি চালানোর জন্য প্রয়োজনীয় ফাইলগুলি ইনস্টল করুন:
```bash
npm install
```

### ৩. কনফিগারেশন (Configuration)
প্রজেক্টটি আপনার প্রয়োজন মতো সাজাতে `.env.example` ফাইলটি কপি করে `.env` নামে সেভ করুন:
```bash
cp .env.example .env
```
এখন `.env` ফাইলটি খুলুন এবং তথ্য দিন:
- `VITE_BIRTHDAY_NAME`: কার জন্মদিন?
- `VITE_BIRTHDAY_AGE`: বয়স কত?
- `VITE_BIRTHDAY_GENDER`: male নাকি female?
- `VITE_BIRTHDAY_RELATIONSHIP`: partner, friend, নাকি family?

### ৪. প্রজেক্ট রান করুন (Run Project)
সব রেডি! এখন প্রজেক্টটি শুরু করুন:
```bash
npm run dev
```
এখন আপনার ব্রাউজারে `http://localhost:5173` ওপেন করুন।

---

## 🛠️ সাধারণ সমস্যা ও সমাধান (Troubleshooting)

| সমস্যা | সমাধান |
| :--- | :--- |
| **সাদা স্ক্রিন (Blank Screen)** | চেক করুন `.env` ফাইলে `VITE_BIRTHDAY_NAME` ঠিকমতো দেওয়া হয়েছে কি না। |
| **Error: npm not found** | আপনাকে **Node.js** ইনস্টল করতে হবে। [nodejs.org](https://nodejs.org) থেকে ডাউনলোড করুন। |
| **Animations Lag (অ্যানিমেশন স্লো হওয়া)** | চেক করুন আপনার ব্রাউজারটি আপডেট করা কি না। এটি GPU ব্যবহার করে। |

---

## ☁️ ডিপ্লয়মেন্ট (Deployment)

যদি আপনি এটি ইন্টারনেটে পাবলিশ করতে চান:
১. **GitHub** এ প্রজেক্টটি আপলোড করুন।
২. **Vercel** বা **Netlify** এ যান।
৩. আপনার রিপোজিটরি (Repository) কানেক্ট করুন।
৪. **Environment Variables** সেকশনে আপনার `.env` এর তথ্যগুলো দিয়ে দিন।
৫. "Deploy" বাটনে ক্লিক করুন।

---

**নবরাজ সরকার (Naboraj Sarkar - Naboraj Sarkar)** দ্বারা নির্মিত।
সাহায্যের জন্য যোগাযোগ করুন: [nishant.ns.business@gmail.com](mailto:nishant.ns.business@gmail.com)
