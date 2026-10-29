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

## 📋 Resolved Vulnerabilities

### 2026-10-27 — Dev Dependency Updates (v3.7.1+)

| CVE / Advisory | Package | Severity | Fixed Version | Impact |
|---|---|---|---|---|
| GHSA-5gmw-xhrv-c9v3 | `tinypool` | Critical | vitest 4.1.12 | Prototype pollution → RCE in worker options |
| GHSA-85c8-ppgw-ccpr | `tinypool` | Critical | vitest 4.1.12 | Prototype pollution gadget in `run()` options |
| GHSA-698v-4r3x-3vcv | `vite` | High | vite 7.3.7+ | Windows `escapeCmdArgs()` missing `%` escaping |
| GHSA-r825-w8mm-5pxw | `vite` | Moderate | vite 7.3.7+ | Editor CLI flag misinterpretation → arbitrary command execution |
| GHSA-587h-7wmj-h5pm | `vite` | High | vite 7.3.7+ | `fs.existsSync()` bypass on Windows |
| GHSA-9jrq-w75r-8gcw | `vite` | Low | vite 7.3.7+ | Cross-origin script execution via custom middleware |
| GHSA-rq7h-c2jc-7f22 | `vite` | Moderate | vite 7.3.7+ | Path traversal outside `server.fs.allow` |
| GHSA-82fw-gwwq-j7x9 | `@vitest/mocker` | Moderate | vitest 4.1.12 | Path traversal / arbitrary file read via redirect mock |
| GHSA-qxg6-89mg-rqv8 | `@vitest/mocker` | Moderate | vitest 4.1.12 | Code injection via unauthenticated manual mock registration |

**Mitigation**: All affected packages are devDependencies (test/build tooling only). No production runtime exposure. Updated via `npm install vitest@4.1.12 vite@8.3.5 --save-dev`.

### Previous Resolution — 2026-10-21 (v3.7.0)

Resolved via npm overrides for:
- `brace-expansion` ^2.1.7
- `fflate` ^0.8.2
- `postcss-selector-parser` ^7.1.6
- `js-yaml` ^4.3.2
- `@humanfs/node` ^0.16.8

---

## 🔍 Scope Boundaries

### What is Present:
- Zero-Telemetry Invariant: Complete privacy guarantees and lack of third-party tracking.
- Passcode Architecture: Client-side validation mechanics, hints, and bypass behavior.
- Supported version matrix and responsible vulnerability disclosure process.

### What is NOT Present:
- Three.js lighting and shadow configurations (see [[Birthday-Components#Procedural-Lighting-and-Contact-Shadows|Birthday Components]]).
- Internationalization font fallbacks (see [[setup-hindi|Hindi]], [[setup-bengali|Bengali]], [[setup-french|French]]).
