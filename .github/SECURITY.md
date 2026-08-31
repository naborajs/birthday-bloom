# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 3.x     | ✅ Active          |
| 2.x     | ⚠️ Limited support |
| < 2.0   | ❌ Not supported   |

## Security Architecture & Best Practices

Birthday Bloom is a client-side single-page application (SPA). All `VITE_` environment variables and URL query parameters ship to the client browser and are **public by design**.

### Critical Guidelines:
1. **Never Store Secrets**: Do not store database connection strings, private API keys, payment tokens, or backend credentials in `VITE_` variables or URL parameters.
2. **XSS Shielding**: All user-supplied text (names, emotional letters, quiz answers) is rendered through React's native JSX escaping and validated without `dangerouslySetInnerHTML` to prevent Cross-Site Scripting (XSS).
3. **Automated Vulnerability Scanning**: Repository dependencies are continuously monitored via **GitHub Dependabot** and security advisory databases.

If you discover a security vulnerability that goes beyond these design constraints,
please report it privately:

- **Email**: nishant.ns.business@gmail.com
- **Subject**: "[Birthday Bloom Security] — brief description"

Do **not** report security vulnerabilities through public GitHub issues,
discussions, or pull requests.

### What to include

- A clear description of the issue
- Steps to reproduce
- Affected version(s)
- Potential impact
- Any suggested remediation (if known)

### Response timeline

You can expect:

1. **Acknowledgment** within 48 hours
2. An initial assessment within 5 business days
3. Regular updates until resolution

## Responsible Disclosure

We ask that you:

- Give us reasonable time to address the issue before public disclosure
- Do not exploit the vulnerability beyond demonstrating it
- Act in good faith to help keep Birthday Bloom and its users safe

## Scope

This policy covers the Birthday Bloom codebase at
[github.com/naborajs/birthday-bloom](https://github.com/naborajs/birthday-bloom).

It does **not** cover:

- Third-party dependencies (report those to their respective maintainers)
- Deployed instances you do not own
- Hosting platform vulnerabilities (Vercel, Netlify, etc.)

Thank you for helping keep Birthday Bloom safe.
