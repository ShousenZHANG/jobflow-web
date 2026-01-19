import "@testing-library/jest-dom/vitest";

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (!("ResizeObserver" in globalThis)) {
  (
    globalThis as typeof globalThis & {
      ResizeObserver: typeof ResizeObserverMock;
    }
  ).ResizeObserver = ResizeObserverMock;
}

Object.defineProperty(window, "scrollTo", {
  value: () => {},
  writable: true,
});

// jsdom does not implement Element.scrollTo
if (!Element.prototype.scrollTo) {
  (
    Element.prototype as Element & {
      scrollTo: (options?: ScrollToOptions) => void;
    }
  ).scrollTo = () => {};
}

Object.defineProperty(window, "matchMedia", {
  value: () => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
  writable: true,
});
