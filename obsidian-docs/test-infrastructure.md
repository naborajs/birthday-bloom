---
tags: [testing, vitest, e2e, mocks, quality-gates]
aliases: [test-infrastructure, testing, test-infra]
---

# Test Infrastructure & Vitest Architecture

[[DOCUMENTATION_INDEX|Back to Index]] | [[developer-guide|Developer Reference]] | [[pull-request-policy|Pull Request Policy]] | [[contributing|Contributor Guide]]

🌐 **Canonical Web Documentation**: [Test Infrastructure & Vitest Architecture](https://naborajs.me/projects/birthday-bloom/docs/test-infrastructure)

---

## 🧪 400+ Automated Tests Suite Architecture

Birthday Bloom relies on a rigorous test automation strategy executed via [Vitest](https://vitest.dev/):
- **Execution Speed**: 24 test suites running 470+ tests in under 5 seconds.
- **Coverage Domains**:
  1. **Zustand Store Hydration & Precedence**: Validating 3-tier hierarchy (URL Parameters > `.env.local` > Defaults).
  2. **URL Parameter Parsing & Sanitization**: Hex colors, character decoding, and alias mapping.
  3. **Multi-Language Dictionaries & Grapheme Clusters**: Ensuring zero broken diacritics or corrupted combining marks in Hindi, Bengali, and French.
  4. **Finite State Machine Transitions**: Verification of progression through `splash` → `unlock` → `intro` → `main`.
  5. **Sensory & Audio Resilience**: Gain scheduling, mute toggles, and safe audio state initialization.
  6. **Interactive Celebration Payoffs**: 3D cake cutting triggers, confetti bursts, quiz scoring, and balloon popping.

---

## 🛠️ JSDOM Mocking Strategies

Because Birthday Bloom leverages advanced browser APIs that do not exist natively in headless Node.js environments, we maintain robust mock layers:

### 1. Web Audio API Mocking
```typescript
class AudioContextMock {
  state: AudioContextState = 'suspended';
  createGain = () => ({
    gain: { value: 1, setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn() },
    connect: vi.fn(),
  });
  createBiquadFilter = () => ({
    frequency: { value: 1000 },
    connect: vi.fn(),
  });
  resume = vi.fn().mockResolvedValue(undefined);
  close = vi.fn().mockResolvedValue(undefined);
}
vi.stubGlobal('AudioContext', AudioContextMock);
```

### 2. WebGL Canvas & Context 2D
```typescript
HTMLCanvasElement.prototype.getContext = vi.fn((contextId: string) => {
  if (contextId === 'webgl' || contextId === 'experimental-webgl') {
    return {
      viewport: vi.fn(),
      clearColor: vi.fn(),
      clear: vi.fn(),
      enable: vi.fn(),
    };
  }
  return {
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
  };
});
```

### 3. ResizeObserver & Layout Observers
```typescript
global.ResizeObserver = class ResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
};
```

---

## 🚀 Running Test Suites Locally

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run all quality checks (types, lint, test, build)
npm run verify
```

---

## 🔍 Scope Boundaries

### What is Present:
- Vitest testing architecture and 470-test breakdown across domains.
- Full mocking strategy for Web Audio, WebGL, Canvas 2D, and ResizeObserver.
- Local test execution commands and quality metrics.

### What is NOT Present:
- Community governance policies (see [[code-of-conduct|Code of Conduct]]).
- Hosting provider pricing breakdowns (see [[deployment#Cloudflare-Pages-Walkthrough|Deployment Guide]]).
