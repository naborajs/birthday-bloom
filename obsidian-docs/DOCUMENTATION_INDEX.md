---
tags: [index, home, overview]
aliases: [DOCUMENTATION_INDEX]
---

# Birthday Bloom v3.1 — Documentation Index

**Complete documentation guide for Birthday Bloom**, an env-first cinematic birthday surprise engine built with React, Framer Motion, and Tailwind CSS.

> **Note:** Duplicate and stale documentation has been consolidated. See this file for the current structure.

Repository: [naborajs/birthday-bloom](https://github.com/naborajs/birthday-bloom)

---

## Essential Docs

| Document | Purpose | Read Time |
|---|---|---|
| [[quick-start|quick-start.md]] | Get running in 5 minutes | 5 min |
| [[ENV_GUIDE|ENV_GUIDE.md]] | Full env customization reference with 15+ recipes | 15 min |
| [[setup-bengali|setup-bengali.md]] | Multi-Language Localization (Bengali / বাংলা) guide | 5 min |
| [[setup-hindi|setup-hindi.md]] | Multi-Language Localization (Hindi / हिन्दी) guide | 5 min |
| [[architecture|architecture.md]] | System architecture overview | 10 min |
| [[architecture-env|architecture-env.md]] | Environment variable lifecycle & store flow | 8 min |
| [[developer-guide|developer-guide.md]] | Component API reference and extension patterns | 15 min |
| [[family-system|family-system.md]] | Family template system | 10 min |
| [[Template-System-Deep-Dive|Template-System-Deep-Dive.md]] | Deep dive & extension guide for relationship templates | 10 min |
| [[template-architecture|template-architecture.md]] | Template and config architecture | 8 min |
| [[troubleshooting|troubleshooting.md]] | Common issues and solutions | 10 min |
| [[migration-guide|migration-guide.md]] | Version-by-version migration v1→v2→v3 | 8 min |
| [[deployment|deployment.md]] | All deployment options + testing checklists | 10 min |
| [[seo-guide|seo-guide.md]] | SEO, sitemap, meta tags optimization | 5 min |
| [[llm-access|llm-access.md]] | AI-first documentation guide | 5 min |

---

## By Use Case

### New to Birthday Bloom?

1. [[quick-start|quick-start.md]] — Install and run locally
2. [[ENV_GUIDE|ENV_GUIDE.md]] — Learn what you can customize
3. [[faq|faq.md]] — Common questions
4. Customize `.env.local` and restart

### Customizing for Someone

1. [[ENV_GUIDE|ENV_GUIDE.md]] — Full env reference with situation recipes
2. [[family-system|family-system.md]] — Family profile setup
3. [[template-architecture|template-architecture.md]] — How templates work
4. [[./.github/SUPPORT|SUPPORT.md]] — Getting help

### Contributing Code

1. [[./.github/CONTRIBUTING|CONTRIBUTING.md]] — Contribution workflow
2. [[styleguide|styleguide.md]] — Code conventions
3. [[architecture|architecture.md]] — System architecture
4. [[developer-guide|developer-guide.md]] — Developer reference
5. [[roadmap|roadmap.md]] — Planned features

### Deploying to Production

1. [[deployment|deployment.md]] — Deployment guide (Vercel, Netlify, AWS, mobile)
2. [[ENV_GUIDE|ENV_GUIDE.md]] — Environment variable setup
3. [[troubleshooting|troubleshooting.md]] — Deployment troubleshooting

### Troubleshooting

1. [[troubleshooting|troubleshooting.md]] — Common issues
2. [[ENV_GUIDE|ENV_GUIDE.md]] — Env configuration help
3. [[faq|faq.md]] — Frequently asked questions
4. [GitHub Issues](https://github.com/naborajs/birthday-bloom/issues) — Report bugs

---

## All Docs

### Root Docs

| File | Purpose |
|---|---|
| [[./CHANGELOG|CHANGELOG.md]] | Version history |
| [[./.github/PULL_REQUEST_POLICY|PULL_REQUEST_POLICY.md]] | Strict PR review and merge policy |
| [LICENSE](../LICENSE) | MIT License |

### Docs (Configuration & Customization)

| File | Purpose |
|---|---|
| [[ENV_GUIDE|ENV_GUIDE.md]] | Complete environment variable reference with 15+ recipes |
| [[env-configs|env-configs.md]] | Ready-to-use configuration recipes |
| [[family-system|family-system.md]] | Family template system |
| [[template-architecture|template-architecture.md]] | Template data flow and types |
| [[migration-guide|migration-guide.md]] | v1→v2→v3 migration |

### Docs (Development & Operations)

| File | Purpose |
|---|---|
| [[quick-start|quick-start.md]] | 5-minute setup guide |
| [[architecture|architecture.md]] | Architecture overview |
| [[developer-guide|developer-guide.md]] | Component API reference and extension patterns |
| [[styleguide|styleguide.md]] | Code, docs, and design conventions |
| [[roadmap|roadmap.md]] | Planned features |
| [[faq|faq.md]] | Frequently asked questions |
| [[troubleshooting|troubleshooting.md]] | Common issues and solutions |

### Docs (Deployment)

| File | Purpose |
|---|---|
| [[deployment|deployment.md]] | All deployment options + testing checklists |

### Docs (SEO & LLM)

| File | Purpose |
|---|---|
| [[seo-guide|seo-guide.md]] | SEO, sitemap, meta tags optimization |
| [[llm-access|llm-access.md]] | AI-first documentation guide |

### Docs (Localized)

| File | Language |
|---|---|
| [[setup-hindi|setup-hindi.md]] | हिंदी (Hindi) |
| [[setup-bengali|setup-bengali.md]] | বাংলা (Bengali) |

### GitHub & Community Docs

| File | Purpose |
|---|---|
| [[./.github/CONTRIBUTING|CONTRIBUTING.md]] | Contribution workflow |
| [[./.github/CODE_OF_CONDUCT|CODE_OF_CONDUCT.md]] | Community standards |
| [[./.github/SECURITY|SECURITY.md]] | Security policy |
| [[./.github/SUPPORT|SUPPORT.md]] | Support and contact |

---

## File Map

```
birthday-bloom/
├── .env.example              # Environment variables template
├── README.md                 # Project introduction
├── CHANGELOG.md              # Version history
├── LICENSE                   # MIT License
├── .github/
│   ├── CONTRIBUTING.md       # Contribution workflow
│   ├── CODE_OF_CONDUCT.md   # Community standards
│   ├── SECURITY.md          # Security policy
│   ├── SUPPORT.md           # Support and contact
│   ├── PULL_REQUEST_POLICY.md# Pull request policy
│   └── workflows/            # CI/CD automation
├── obsidian-docs/
│   ├── DOCUMENTATION_INDEX.md  # This file
│   ├── ENV_GUIDE.md            # Env customization reference
│   ├── env-configs.md          # Env configuration recipes
│   ├── quick-start.md          # Local dev setup guide
│   ├── architecture.md         # System architecture guide
│   ├── styleguide.md           # Code styles and guidelines
│   ├── roadmap.md              # Development roadmap
│   ├── faq.md                  # Frequently asked questions
│   ├── family-system.md        # Family templates
│   ├── template-architecture.md# Template architecture
│   ├── developer-guide.md      # Developer reference
│   ├── troubleshooting.md      # Troubleshooting
│   ├── migration-guide.md      # Migration guide
│   ├── deployment.md           # Deployment guide
│   ├── seo-guide.md            # SEO optimization
│   ├── llm-access.md           # LLM access documentation
│   ├── setup-hindi.md          # Hindi setup
│   └── setup-bengali.md        # Bengali setup
├── scripts/
│   ├── strip-comments.js     # TS comment stripper utility
│   └── strip-comments.cjs    # CommonJS version of the utility
```

---

## Consolidation Notes

The following files have been consolidated or removed:

| Deleted File | Merged Into |
|---|---|
| COMPLETE_SETUP_GUIDE.md | QUICK_START.md, ENV_GUIDE.md |
| API_REFERENCE.md | developer-guide.md |
| UPGRADE_SUMMARY.md | migration-guide.md |
| v2-upgrade-guide.md | migration-guide.md |
| customization.md | ENV_GUIDE.md |
| advanced-customization.md | ENV_GUIDE.md |
| configuration-examples.md | ENV_GUIDE.md |
| env-system.md | ENV_GUIDE.md |
| getting-started.md | QUICK_START.md |
| project-structure.md | architecture.md |
| animations.md | architecture.md |
| features-summary.md | developer-guide.md |
| hosting-solutions.md | deployment.md |
| hosting-aws.md | deployment.md |
| mobile-deployment.md | deployment.md |
| termux-hosting.md | deployment.md |
| deployment-testing.md | deployment.md |
| deployment-troubleshooting.md | deployment.md |
| seo.md | seo-guide.md |
| llm-guide.md | llm-access.md |
| advanced-fixes.md | Deleted (empty) |
| DOCUMENTATION_AUDIT.md | Deleted (internal audit) |

---

## Documentation Conventions

- **Env values** are shown as `VITE_EXAMPLE_NAME` with inline code formatting
- **File paths** are relative to the project root
- **Links** between docs use relative paths
- **Code examples** use TypeScript/JSX

---

## Contributing to Docs

1. Found an error? Open a [GitHub issue](https://github.com/naborajs/birthday-bloom/issues)
2. Suggest improvements via PR
3. When adding new env variables, update both `ENV_GUIDE.md` and `.env.example`
4. When adding new components, update `developer-guide.md` with the component table

---

**Made with ❤️ by Naboraj Sarkar**
*In the garden of the internet, may your digital memories always bloom.*


#obsidian #documentation #birthday-bloom #vault