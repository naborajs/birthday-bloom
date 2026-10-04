import "@testing-library/jest-dom";

Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => { },
        removeListener: () => { },
        addEventListener: () => { },
        removeEventListener: () => { },
        dispatchEvent: () => { },
    }),
});

window.HTMLMediaElement.prototype.play = () => Promise.resolve();
window.HTMLMediaElement.prototype.pause = () => { };
window.HTMLMediaElement.prototype.load = () => { };

class MockIntersectionObserver {
    readonly root: Element | Document | null = null;
    readonly rootMargin: string = '';
    readonly thresholds: ReadonlyArray<number> = [];
    observe(_target?: Element): void {}
    unobserve(_target?: Element): void {}
    disconnect(): void {}
    takeRecords(): IntersectionObserverEntry[] { return []; }
}

globalThis.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

const memoryStorage: Record<string, string> = {};
const mockLocalStorage = {
    getItem: (key: string) => memoryStorage[key] ?? null,
    setItem: (key: string, val: string) => { memoryStorage[key] = String(val); },
    removeItem: (key: string) => { delete memoryStorage[key]; },
    clear: () => { Object.keys(memoryStorage).forEach((k) => delete memoryStorage[k]); },
    get length() { return Object.keys(memoryStorage).length; },
    key: (index: number) => Object.keys(memoryStorage)[index] ?? null,
};

Object.defineProperty(globalThis, "localStorage", {
    writable: true,
    configurable: true,
    value: mockLocalStorage,
});

Object.defineProperty(window, "localStorage", {
    writable: true,
    configurable: true,
    value: mockLocalStorage,
});

