# Contributing to Birthday Bloom 🌸

Welcome! We are thrilled that you're interested in contributing to Birthday Bloom. Whether you're a first-time contributor, a creative developer looking to build 3D WebGL scenes, or polishing UI and accessibility — you are welcome here!

👉 **[Read the Full Contributing Guide](.github/CONTRIBUTING.md)**

---

## 🚀 The 10-Minute Contributor Fast-Track

1. **Pick an Issue**: Browse open issues labeled [`good first issue`](https://github.com/naborajs/birthday-bloom/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) or [`help wanted`](https://github.com/naborajs/birthday-bloom/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22).
2. **Auto-Assign**: Comment `/assign` or "can I take this" on the issue. Our bot will assign you automatically!
3. **Local Setup**:
   ```bash
   # Clone the repo
   git clone https://github.com/naborajs/birthday-bloom.git
   cd birthday-bloom

   # Install dependencies
   npm install

   # Setup env template
   cp .env.example .env.local

   # Start dev server
   npm run dev
   ```
4. **Make Your Changes**: Follow our clean code conventions in [`obsidian-docs/styleguide.md`](obsidian-docs/styleguide.md).
5. **Verify Locally (All-in-One)**:
   ```bash
   npm run verify
   ```
   *(This runs `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build` in one command).*
6. **Open a Pull Request**: Submit your PR with a clear title following [Conventional Commits](https://www.conventionalcommits.org/).

---

## 🛠 Tech Stack Overview

- **Frontend Core**: React 18 (Concurrent Mode, client-side rendering) + TypeScript 5.8
- **3D WebGL & Physics**: Three.js + React Three Fiber + Drei + React Spring
- **Animation Engine**: Framer Motion 12+ & HTML5 Canvas 2D particle simulation
- **State Management**: Zustand 5+ (central store parsing URL query params & 53 env variables)
- **Styling**: Tailwind CSS 3.4 + Dynamic HSL Theme Variables
- **Testing**: Vitest 3+ (400+ automated tests)

---

## 📚 Essential Developer Documentation

- [Complete Architecture Guide](obsidian-docs/architecture.md)
- [Master Environment Variable Guide (53 Keys)](ENV_GUIDE.md)
- [URL Query Parameters Reference](obsidian-docs/URL-Parameters.md)
- [Developer Guide & Contributor Walkthroughs](obsidian-docs/developer-guide.md)
- [Pull Request Policy](.github/PULL_REQUEST_POLICY.md)
- [Code of Conduct](.github/CODE_OF_CONDUCT.md)
