---
tags: [security, privacy, telemetry, hashing, disclosure]
aliases: [security, security-model, privacy]
---

# Security Model & Privacy Guarantees

[[DOCUMENTATION_INDEX|Back to Index]] | [[architecture|System Architecture]] | [[URL-Parameters|URL Parameters]] | [[support|Community Support]]

🌐 **Canonical Web Documentation**: [Security Model & Privacy Guarantees](https://naborajs.me/projects/birthday-bloom/docs/security)

---

## 🛡️ Zero-Telemetry Invariant

Birthday Bloom is built upon an absolute **privacy-first, zero-telemetry invariant**:
- **Zero Third-Party Analytics**: No Google Analytics, no Meta Pixel, no Mixpanel, and no behavioral tracking scripts.
- **Zero Persistent Tracking Cookies**: Birthday Bloom does not set HTTP cookies or local tracking IDs for fingerprinting.
- **Zero External Databases**: The application is strictly stateless and runs 100% on the client. Personal names, private letters, and photo URLs are never logged to a remote server.
- **Zero Third-Party Ad Networks**: No advertising SDKs, trackers, or dynamic script injectors.

---

## 🔒 Passcode Architecture & Verification

To protect intimate birthday greetings, Birthday Bloom provides a client-side passcode gating system (`src/components/birthday/PasswordUnlock.tsx`):

### How the Lock Works:
1. **Configuration**: Senders specify a secret passcode via `VITE_PASSWORD` or the `?passcode=` / `?pin=` URL parameter.
2. **Format Hinting**: `VITE_PASSWORD_FORMAT` (e.g., `MMDD`, `YYYY`, `WORD`) renders interactive hint placeholders for the recipient.
3. **Client-Side Comparison**: Passcode validation occurs entirely in memory within the client execution thread. Failed attempts trigger shake animations and hint disclosures without network requests.
4. **Bypass Mechanics**: If `VITE_PASSWORD_REQUIRED=false` (or unset) and no URL passcode is supplied, the state machine smoothly auto-bypasses the lock screen directly to `intro`.

> [!WARNING]
> Because Birthday Bloom is a client-side static web application, environment variables prefixed with `VITE_` and URL query parameters are decoded in the browser. Do NOT use this passcode mechanism to store financial credentials, cryptographic secrets, or sensitive private keys.

---

## 🚨 Vulnerability Reporting & Responsible Disclosure

If you discover a security vulnerability or potential XSS vector, please report it privately:

- **Security Contact**: `nishant.ns.business@gmail.com`
- **Subject**: `[Birthday Bloom Security] — Brief Description`
- **Response Timeline**: Acknowledgment within 48 hours, initial assessment within 5 business days.

Please do **NOT** open public issues or public pull requests for unpatched security vulnerabilities.

---

## 🔍 Scope Boundaries

### What is Present:
- Zero-Telemetry Invariant: Complete privacy guarantees and lack of third-party tracking.
- Passcode Architecture: Client-side validation mechanics, hints, and bypass behavior.
- Supported version matrix and responsible vulnerability disclosure process.

### What is NOT Present:
- Three.js lighting and shadow configurations (see [[Birthday-Components#Procedural-Lighting-and-Contact-Shadows|Birthday Components]]).
- Internationalization font fallbacks (see [[setup-hindi|Hindi]], [[setup-bengali|Bengali]], [[setup-french|French]]).
