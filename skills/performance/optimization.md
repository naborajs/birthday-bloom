# Frontend Performance Optimization

Performance is a feature. A beautiful app that stutters loses all its premium feel.

## 1. Asset Optimization

### Images
Images are usually the largest bottleneck.
*   **Format**: Use WebP or AVIF, not PNG/JPG. They offer superior compression.
*   **Sizing**: Never serve a 4000px image for a 400px container. Use the `srcSet` attribute or the `<picture>` tag to serve appropriately sized images based on the viewport.
*   **Aspect Ratio**: Always define `width` and `height` attributes to prevent Cumulative Layout Shift (CLS) while the image loads.

```html
<!-- Example of preventing CLS and using modern formats -->
<img 
  src="image.webp" 
  width="800" 
  height="600" 
  style="aspect-ratio: 800 / 600;" 
  alt="Description" 
/>
```

## 2. Lazy Loading & Code Splitting

Don't ship the entire application in one bundle.

### React.lazy
Split route-level components. If a user never visits the `/dashboard`, they shouldn't download the code for it.

```tsx
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Heavy component loaded only when needed
const CakeCuttingScene = lazy(() => import('./components/CakeCutting'));

export const App = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Routes>
      <Route path="/celebrate" element={<CakeCuttingScene />} />
    </Routes>
  </Suspense>
);
```

### Intersection Observer (Lazy Component Rendering)
Don't render complex DOM nodes (like heavy SVGs or video players) that are way below the fold. Use an Intersection Observer to render them only when they are about to scroll into view.

## 3. Managing Bundle Size (Vite)

Analyze what you are shipping to the client.

1.  Use `rollup-plugin-visualizer` in Vite to generate a treemap of your bundle.
2.  **Tree-shaking**: Ensure you are importing specifically.
    *   *Bad*: `import { x } from 'lodash';` (Might bundle all of lodash)
    *   *Good*: `import x from 'lodash/x';` or use `lodash-es`.
    *   (Note: Modern bundlers are getting better at tree-shaking barrel files, but specific imports are safer).

## 4. Animation Performance

Janky animations destroy UX. Target 60 FPS (16ms per frame).

1.  **The GPU is your friend**: Only animate `transform` and `opacity`.
    *   Moving an element with `transform: translateY(100px)` is handled by the GPU.
    *   Moving an element with `top: 100px` forces the CPU to recalculate the layout of the entire page on every single frame.
2.  **CSS Containment (`contain`)**: If you have a complex widget (like a chat box) with heavy internal animations, use CSS `contain: strict` or `contain: content`. This tells the browser that changes inside this element will not affect the layout of the rest of the page, drastically speeding up rendering.
3.  **Debouncing & Throttling**: Never run heavy calculations directly inside `onScroll` or `onMouseMove` event listeners. Throttle them (run once every X ms) or use `requestAnimationFrame`.

## 5. Avoiding React Re-renders

React rendering is fast, but DOM manipulation is slow.

*   Use React Developer Tools Profiler to find unnecessary re-renders.
*   **Memoization**: Use `React.memo` for heavy components that receive the same props. Use `useMemo` for expensive calculations. Use `useCallback` to prevent function recreation on every render, which breaks `React.memo` on child components.
*   **State Colocation**: Move state as far down the component tree as possible. If an input field causes the entire parent page to re-render on every keystroke, extract the input into its own component.
