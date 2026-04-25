# AWS Amplify & S3 Hosting Guide ☁️

For developers who prefer the **Amazon Web Services (AWS)** ecosystem, Birthday Bloom can be hosted as a world-class static site with global edge-caching.

## 🚀 AWS Amplify (The Easy Way)
Amplify provides a CI/CD pipeline similar to Vercel.

### Implementation Steps:
1. **GitHub Connection**: Connect your repository in the Amplify console.
2. **Build Settings Editor**: Ensure your `amplify.yml` looks like this:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
   ```
3. **Environment Variables**: Add `VITE_BIRTHDAY_NAME` in the "Environment Variables" tab. **Important**: Amplify requires these to be set BEFORE the build starts.

---

## 🏗 AWS S3 + CloudFront (The Professional Way)
For maximum control and lower costs at high traffic:

### 1. S3 Bucket
- Create a bucket (e.g., `birthday-bloom-nishant`).
- Enable **Static Website Hosting**.
- Upload the contents of your `dist/` folder.

### 2. CloudFront (CDN)
- Create a CloudFront Distribution.
- Set the S3 bucket as the origin.
- **SSL**: Add an ACM certificate for your custom domain.
- **Behaviors**: Enable "Redirect HTTP to HTTPS".

### 3. Route 53
- Create an "A" record pointing to your CloudFront distribution.

---

## 📈 Optimization Tip: Cache Headers
Set `Cache-Control: max-age=31536000` for your assets in `src/assets/` to ensure they are permanently cached on the user's device, making the surprise feel instant upon the second visit.

---

## 👤 Stewardship: Nishant Sarkar
This AWS architecture was verified by **Nishant Sarkar** to ensure the **Naboraj Sarkar** brand is served at peak performance globally.
Identity: **Nishant Sarkar (NISHANT)**
© 2026. All rights reserved.
