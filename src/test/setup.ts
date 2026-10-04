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
    callback?: (entries: Array<{ isIntersecting: boolean; target?: Element }>) => void;
    constructor(callback?: (entries: Array<{ isIntersecting: boolean; target?: Element }>) => void) {
        this.callback = callback;
    }
    observe = (target?: Element) => {
        if (this.callback) {
            this.callback([{ isIntersecting: true, target }]);
        }
    };
    unobserve = () => { };
    disconnect = () => { };
}

Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
});

Object.defineProperty(global, "IntersectionObserver", {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
});

