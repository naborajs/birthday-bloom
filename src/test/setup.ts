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
    private callback?: (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void;

    constructor(callback?: (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => void) {
        this.callback = callback;
    }

    observe(target?: Element): void {
        if (this.callback && target) {
            queueMicrotask(() => {
                if (this.callback) {
                    this.callback([{
                        isIntersecting: true,
                        target,
                        boundingClientRect: (target.getBoundingClientRect ? target.getBoundingClientRect() : {}) as DOMRectReadOnly,
                        intersectionRatio: 1,
                        intersectionRect: (target.getBoundingClientRect ? target.getBoundingClientRect() : {}) as DOMRectReadOnly,
                        rootBounds: null,
                        time: Date.now(),
                    }], this as unknown as IntersectionObserver);
                }
            });
        }
    }

    unobserve(_target?: Element): void {}
    disconnect(): void {
        this.callback = undefined;
    }
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

