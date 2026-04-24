# Frontend Security System (Advanced + Practical)

Frontend security is not about “making things safe”.

It is about:
> reducing trust, controlling exposure, and limiting damage.

The browser is a hostile environment.
Assume:
- users can modify anything
- attackers can inspect everything
- nothing is hidden

---

## 1. 🧠 Core Security Mindset

### Golden Rules:

- Never trust the client ❌  
- Never expose secrets ❌  
- Always validate on backend ✅  
- Minimize attack surface ✅  

💡 Reality:
> Frontend security is about damage control, not full protection.

---

## 2. 🚨 XSS (Cross-Site Scripting) — Primary Threat

### Safe by Default (React)

```tsx
<div>{userInput}</div> // SAFE
````

React escapes content automatically.

---

### Dangerous Cases

#### 1. dangerouslySetInnerHTML

```tsx
// ❌ UNSAFE
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

### ✅ Fix

```tsx
import DOMPurify from "dompurify";

<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />
```

---

#### 2. Dynamic URLs

```tsx
// ❌ UNSAFE
<a href={userInput}>Click</a>
```

### ✅ Fix

```ts
const isSafeUrl = (url: string) =>
  url.startsWith("https://") || url.startsWith("http://");
```

---

#### 3. Inline Scripts / Eval

Never use:

* eval()
* new Function()
* inline script injection

---

## 3. 🔐 Environment Variables (CRITICAL)

### Truth:

> Everything in frontend env = PUBLIC

---

### ❌ Never Store:

* API secrets
* private keys
* JWT secrets
* database credentials

---

### ✅ Allowed:

* public API URLs
* Firebase public config
* Stripe publishable keys

---

### 🔥 Best Practice:

If secret is required:
→ use backend proxy

```ts
// ❌ BAD
fetch("https://api.secret.com?key=SECRET")

// ✅ GOOD
fetch("/api/proxy-endpoint")
```

---

## 4. 🧩 API & State Security

### Reality:

Frontend can be fully controlled by user.

---

### ❌ Never Trust:

* UI validation
* hidden fields
* disabled buttons
* client state (Redux/Zustand)

---

### ✅ Always:

* validate on backend
* sanitize inputs again
* enforce permissions server-side

---

### JWT Storage Strategy

| Method          | Risk Level        |
| --------------- | ----------------- |
| localStorage    | ❌ High (XSS risk) |
| sessionStorage  | ⚠️ Medium         |
| HttpOnly Cookie | ✅ Best            |

---

## 5. 🧨 Supply Chain Security (NPM)

### Risks:

* malicious packages
* outdated dependencies

---

### Rules:

* run `npm audit` regularly
* use trusted libraries only
* avoid random small packages
* commit lockfiles

---

### 🔥 Advanced Tip:

Use:

* `pnpm` (better dependency isolation)
* or `bun` for faster installs

---

## 6. 🛡️ Security Headers (Production)

Must configure during deployment.

### Essential Headers:

#### Content Security Policy (CSP)

```json
Content-Security-Policy: default-src 'self'; img-src 'self' https:;
```

Limits script/image sources.

---

#### X-Frame-Options

```json
X-Frame-Options: DENY
```

Prevents clickjacking.

---

#### HSTS

```json
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

Forces HTTPS.

---

## 7. 🔗 External Links Security

```tsx
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
```

Without this:
→ attacker can control `window.opener`

---

## 8. ⚡ Frontend Attack Surfaces

Always check:

* forms
* URL params
* query strings
* localStorage
* third-party scripts

---

## 9. 🧠 Secure Coding Patterns

### Input Sanitization Layer

Create reusable utility:

```ts
export const sanitizeInput = (input: string) => {
  return input.replace(/[<>]/g, "");
};
```

---

### Safe Fetch Wrapper

```ts
export const safeFetch = async (url: string, options = {}) => {
  return fetch(url, {
    credentials: "include",
    ...options,
  });
};
```

---

## 10. 🎯 Frontend Security Checklist

Before shipping:

* [ ] No secrets in frontend
* [ ] All inputs sanitized
* [ ] External links secured
* [ ] API calls proxied if needed
* [ ] CSP headers configured
* [ ] Dependencies audited

---

## 11. 🧩 Common Mistakes (Avoid)

* trusting frontend validation ❌
* exposing API keys ❌
* using dangerouslySetInnerHTML blindly ❌
* storing tokens in localStorage ❌
* ignoring headers ❌

---

## 🔥 FINAL RULE

If something is in frontend:

> assume it is public and modifiable

---

## 🎯 CREATOR MINDSET

You are not securing the frontend completely.

You are:

> reducing risk, limiting exposure, and protecting the system.

```