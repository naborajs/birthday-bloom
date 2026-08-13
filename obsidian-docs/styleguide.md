# Birthday Bloom Style Guide

This document defines code, documentation, and design conventions for the
Birthday Bloom repository. Consistency helps contributors work confidently and
maintainers review efficiently.

## Code Style

### Naming Conventions

| Category | Convention | Example |
| --- | --- | --- |
| Components | PascalCase | `CakeCutting.tsx`, `PhotoGallery.tsx` |
| Hooks | camelCase with `use` prefix | `useBirthdayStore`, `useDynamicTheme` |
| Utilities | camelCase | `parseEnvString`, `fireConfetti` |
| Types/Interfaces | PascalCase | `BirthdayConfig`, `FamilyMemberProfile` |
| Env variables | UPPER_SNAKE_CASE with `VITE_` prefix | `VITE_BIRTHDAY_NAME` |
| Files | PascalCase for components, camelCase for utils | `HeartTree.tsx`, `responsiveUtils.ts` |
| Directories | kebab-case | `cinematic-story`, `family-templates` |

### TypeScript

- Prefer interfaces over types for object shapes
- Use explicit typing for function parameters and returns
- Avoid `any` — use `unknown` with proper narrowing
- Use `const` assertions for literal types
- Leverage union types over enums where the set is finite

```typescript
// Good
type Scene = 'storytelling' | 'fake-chat' | 'post-chat' | 'reveal-sequence' | 'done';

// Good
interface BirthdayConfig {
  name: string;
  age: number | null;
}
```

### Component Structure

- One component per file (except small tightly coupled utilities)
- Export the component as a named export
- Props should be typed inline or via interface
- Keep components focused on presentation; extract logic to hooks

```typescript
interface TypeWriterProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
}

export const TypeWriter = ({ text, speed = 45, onComplete }: TypeWriterProps) => {
  // ...
};
```

### State Management

- Read configuration via `useBirthdayStore()` — never read `import.meta.env` directly
- Local component state for UI concerns (open/close, selected item)
- Avoid prop drilling — either colocate or use store
- Timers should be stored in refs for cleanup on unmount

### CSS / Styling

- Use Tailwind utility classes for most styling
- Use CSS custom properties (injected by `useDynamicTheme`) for dynamic values
- Avoid inline `style` props except for dynamic runtime values
- Animation-related CSS can live in component files or `index.css`
- Prefer `translate3d` over `translate` for GPU-accelerated animations
- Use `backdrop-blur` and `shadow` for the cinematic glassmorphism look

### Accessibility

- Use semantic HTML (`<button>`, `<nav>`, `<section>`, `<h1>`–`<h6>`)
- Respect `prefers-reduced-motion` — `VITE_REDUCED_MOTION` maps to this
- Ensure interactive elements have visible focus states
- Use `aria-label` on icon-only buttons
- Text size should respect `VITE_TEXT_SIZE`

### Performance

- Avoid unnecessary re-renders (memoize when profiling indicates benefit)
- Be careful with particle counts — scale down on mobile
- Clean up intervals, timeouts, and event listeners in `useEffect` return
- Use `requestAnimationFrame` for continuous animations, not `setInterval`
- Images should be optimized (WebP preferred) and use `loading="lazy"`

## Documentation Style

### General Rules

- Write in plain English with a warm, helpful tone
- Start with the simplest explanation, then link to deeper docs
- Use `###` for sub-sections, not `##` sub-sub-sections
- Keep paragraphs short (3-5 sentences max)
- Use code blocks for commands, env examples, and code snippets

### Env Variable Documentation

When documenting an env variable in a table:

```markdown
| `VITE_BIRTHDAY_NAME` | string | `Riya` | The main displayed name. |
```

Columns: Variable name, type, example, purpose.

### Commands

Always use `bash` code blocks for commands:

````markdown
```bash
npm run dev
```
````

### Screenshots

Place in `src/assets/`. Reference with relative paths in docs.
Keep screenshots under 500 KB. WebP format is preferred.

## Commit Style

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add template-aware emoji trail system
fix: resolve mobile fireworks cleanup issue
docs: improve family system documentation
refactor: simplify birthday template configuration
perf: optimize particle rendering
chore: update dependencies
```

- Use the imperative mood ("add" not "added" / "adds")
- Keep the first line under 72 characters
- Reference issues in the body if applicable

## Pull Request Standards

- One PR per logical change
- Keep PRs focused and reviewable (under ~400 lines when possible)
- Include screenshots for UI changes
- Update docs when behavior changes
- Ensure the build passes before requesting review
