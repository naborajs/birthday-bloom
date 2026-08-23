---
tags: [index, home, overview, documentation, i18n]
aliases: [DOCUMENTATION_INDEX, index]
---

# Birthday Bloom v3.1 — Documentation Index

[[quick-start|Quick Start]] | [[ENV_GUIDE|Env Customization Guide]] | [[setup-hindi|Hindi Guide]] | [[setup-bengali|Bengali Guide]] | [[architecture-env|Env Architecture]] | [[deployment|Deployment Guide]]

**Complete documentation suite for Birthday Bloom**, an env-first cinematic birthday surprise engine built with React 19, TypeScript 5.8, Framer Motion, Tailwind CSS, and Zustand.

Repository: [naborajs/birthday-bloom](https://github.com/naborajs/birthday-bloom)

---

## 🌟 Essential Guides

| Document | Purpose | Read Time |
|---|---|---|
| [[quick-start|quick-start.md]] | Get running locally in 5 minutes with zero code changes | 5 min |
| [[ENV_GUIDE|ENV_GUIDE.md]] | Exhaustive environment variable reference with 15+ real-world recipes | 15 min |
| [[setup-hindi|setup-hindi.md]] | Multi-Language Localization (Hindi / हिन्दी) setup, Indic typography & recipes | 5 min |
| [[setup-bengali|setup-bengali.md]] | Multi-Language Localization (Bengali / বাংলা) setup, Indic typography & recipes | 5 min |
| [[architecture|architecture.md]] | Finite state machine, scene timeline, and system architecture | 10 min |
| [[architecture-env|architecture-env.md]] | Environment variable lifecycle, Zustand store hydration & normalization | 8 min |
| [[developer-guide|developer-guide.md]] | Component API reference, hooks, and extension patterns | 15 min |
| [[family-system|family-system.md]] | Dedicated family templates (brother, sister, parents, grandparents, etc.) | 10 min |
| [[Template-System-Deep-Dive|Template-System-Deep-Dive.md]] | Deep dive & extension guide for relationship templates & tone engines | 10 min |
| [[template-architecture|template-architecture.md]] | Template and config architecture data flow | 8 min |
| [[troubleshooting|troubleshooting.md]] | Common issues, audio autoplay, mobile viewport and animation fixes | 10 min |
| [[migration-guide|migration-guide.md]] | Version-by-version migration v1 → v2 → v3 | 8 min |
| [[deployment|deployment.md]] | Production deployment on Vercel, Netlify, AWS, Docker & mobile checklists | 10 min |
| [[seo-guide|seo-guide.md]] | SEO, sitemap, Open Graph, and meta tag optimization | 5 min |
| [[llm-access|llm-access.md]] | AI-first documentation guide and context ingestion | 5 min |

---

## 🎯 Documentation by Use Case

### 1. New to Birthday Bloom?
1. [[quick-start|quick-start.md]] — Install dependencies and run locally.
2. [[ENV_GUIDE|ENV_GUIDE.md]] — Learn all customizable settings.
3. [[faq|faq.md]] — Frequently asked questions.
4. Copy `.env.example` to `.env.local` and restart the dev server.

### 2. Customizing for a Specific Person or Language
1. **Language Setup**:
   - English (Default): [[quick-start|quick-start.md]]
   - Hindi (हिन्दी): [[setup-hindi|setup-hindi.md]]
   - Bengali (বাংলা): [[setup-bengali|setup-bengali.md]]
2. **Relationships & Tone**:
   - Partner / Romantic: [[ENV_GUIDE#Romantic-Partner|ENV_GUIDE.md]]
   - Sibling / Brother / Sister: [[family-system|family-system.md]]
   - Parents & Grandparents: [[ENV_GUIDE#Father-or-Mother|ENV_GUIDE.md]]
   - Friend / Bestie: [[ENV_GUIDE#Best-Friend|ENV_GUIDE.md]]
3. [[Template-System-Deep-Dive|Template-System-Deep-Dive.md]] — Cultural tone engines and letter generation.

### 3. Contributing & Code Development
1. [[./.github/CONTRIBUTING|CONTRIBUTING.md]] — Contribution workflow & branching rules.
2. [[styleguide|styleguide.md]] — TypeScript, CSS, and component conventions.
3. [[architecture|architecture.md]] — Runtime finite state machine.
4. [[developer-guide|developer-guide.md]] — Component API, hooks, and utilities.
5. [[roadmap|roadmap.md]] — Planned features and improvements.

### 4. Deploying to Production
1. [[deployment|deployment.md]] — Vercel, Netlify, AWS S3, and Docker deployment steps.
2. [[ENV_GUIDE|ENV_GUIDE.md]] — Hosting environment variables configuration.
3. [[troubleshooting|troubleshooting.md]] — Pre-launch checklist & production troubleshooting.

---

## 📂 All Documentation Categories

### Root & Community Docs
- `README.md` — Project overview, architecture, and video guides.
- `CHANGELOG.md` — Version history and release notes.
- `.github/CONTRIBUTING.md` — Contribution workflow.
- `.github/CODE_OF_CONDUCT.md` — Community standards.
- `.github/SECURITY.md` — Security and vulnerability reporting.
- `.github/SUPPORT.md` — Getting help and support channels.
- `.github/PULL_REQUEST_POLICY.md` — Pull request review and quality policy.

### Configuration & Localization Docs
- [[ENV_GUIDE|ENV_GUIDE.md]] — 40+ environment variables and situation recipes.
- [[setup-hindi|setup-hindi.md]] — Dedicated Hindi (हिन्दी) setup and Devanagari typography.
- [[setup-bengali|setup-bengali.md]] — Dedicated Bengali (বাংলা) setup and Eastern Nagari typography.
- [[env-configs|env-configs.md]] — Pre-built `.env.local` templates.
- [[family-system|family-system.md]] — 15-section family template system.
- [[template-architecture|template-architecture.md]] — Data model architecture.
- [[Template-System-Deep-Dive|Template-System-Deep-Dive.md]] — Emotional narrative and tone generators.

### Development & Architecture Docs
- [[quick-start|quick-start.md]] — 5-minute setup guide.
- [[architecture|architecture.md]] — Finite state machine and runtime orchestration.
- [[architecture-env|architecture-env.md]] — Env parsing, type coercion, and Zustand store hydration.
- [[developer-guide|developer-guide.md]] — Component APIs, props, and hook signatures.
- [[styleguide|styleguide.md]] — Code, design token, and CSS rules.
- [[roadmap|roadmap.md]] — Feature pipeline and future milestones.
- [[faq|faq.md]] — Common questions and answers.
- [[troubleshooting|troubleshooting.md]] — Comprehensive troubleshooting guide.
- [[migration-guide|migration-guide.md]] — Migration paths across versions.

### Deployment & Operations Docs
- [[deployment|deployment.md]] — Vercel, Netlify, AWS, Docker, and mobile deployment.
- [[seo-guide|seo-guide.md]] — Meta tags, Open Graph, and sitemaps.
- [[llm-access|llm-access.md]] — AI-first documentation and context ingestion.

---

## 🗺️ File Map

```
birthday-bloom/
├── .env.example                # Exhaustive environment variables template
├── README.md                   # Project introduction and video guides
├── CHANGELOG.md                # Version history
├── LICENSE                     # MIT License
├── llm.txt                     # AI-friendly root developer map
├── .github/
│   ├── CONTRIBUTING.md         # Contribution workflow
│   ├── CODE_OF_CONDUCT.md     # Community standards
│   ├── SECURITY.md            # Security policy
│   ├── SUPPORT.md             # Support and contact
│   ├── PULL_REQUEST_POLICY.md # Pull request policy
│   └── workflows/              # CI/CD automation
├── obsidian-docs/
│   ├── DOCUMENTATION_INDEX.md  # Central documentation index (this file)
│   ├── ENV_GUIDE.md            # Env customization reference & recipes
│   ├── env-configs.md          # Env configuration recipes
│   ├── quick-start.md          # Local dev setup guide
│   ├── setup-hindi.md          # Hindi setup & Devanagari typography
│   ├── setup-bengali.md        # Bengali setup & Eastern Nagari typography
│   ├── architecture.md         # System architecture guide
│   ├── architecture-env.md     # Env lifecycle & Zustand store hydration
│   ├── styleguide.md           # Code styles and guidelines
│   ├── roadmap.md              # Development roadmap
│   ├── faq.md                  # Frequently asked questions
│   ├── family-system.md        # Family templates
│   ├── template-architecture.md# Template architecture
│   ├── Template-System-Deep-Dive.md # Template deep dive
│   ├── developer-guide.md      # Developer reference
│   ├── troubleshooting.md      # Troubleshooting
│   ├── migration-guide.md      # Migration guide
│   ├── deployment.md           # Deployment guide
│   ├── seo-guide.md            # SEO optimization
│   └── llm-access.md           # LLM access documentation
├── public/
│   └── llms.txt                # Public LLM context index
└── src/                        # Application source code
    ├── components/birthday/    # Interactive scenes & components
    ├── features/core/          # Zustand store, dynamic theme & family models
    ├── i18n/                   # Multi-language translation engine & locales
    └── config/                 # Templates, wishes & emoji kits
```

---

## 💡 Documentation Conventions

- **Env values** are shown as `VITE_EXAMPLE_NAME` with inline code formatting.
- **File paths** are relative to the project root.
- **Links** between docs use Obsidian wikilinks `[[filename|Title]]`.
- **Code examples** use TypeScript and TSX.

---

**Made with ❤️ by Naboraj Sarkar**
*In the garden of the internet, may your digital memories always bloom.*

#obsidian #documentation #birthday-bloom #vault #index