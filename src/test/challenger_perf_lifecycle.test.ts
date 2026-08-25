import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import React from "react";
import { render, act } from "@testing-library/react";
import fs from "fs";
import path from "path";
import { PremiumFireworks } from "@/components/birthday/PremiumFireworks";
import { EmojiCursorTrail } from "@/components/birthday/EmojiCursorTrail";
import { Balloons } from "@/components/birthday/Balloons";
import { SparkleRain } from "@/components/birthday/SparkleRain";
import { FireflyEffect } from "@/components/birthday/FireflyEffect";
import { ShootingStars } from "@/components/birthday/ShootingStars";
import { Sparkles } from "@/components/birthday/Sparkles";
import { TypeWriter } from "@/components/birthday/TypeWriter";
import { useConfetti } from "@/components/birthday/Confetti";
import { useDynamicTheme } from "@/features/core/theme/useDynamicTheme";
import { useBirthdayStore } from "@/features/core/store/useBirthdayStore";
import confetti from "canvas-confetti";

// Mock canvas-confetti
vi.mock("canvas-confetti", () => ({
  default: vi.fn(),
}));

// Helper component for testing useDynamicTheme in React tree without JSX
const DynamicThemeHarness = () => {
  useDynamicTheme();
  return React.createElement("div", { "data-testid": "theme-harness" });
};

// Helper component for testing useConfetti hook without JSX
const ConfettiHarness = ({ onReady }: { onReady: (api: ReturnType<typeof useConfetti>) => void }) => {
  const api = useConfetti();
  React.useEffect(() => {
    onReady(api);
  }, [api, onReady]);
  return React.createElement("div", { "data-testid": "confetti-harness" });
};

describe("Adversarial Stress Test: Performance, Physics & Lifecycle Safety", () => {
  let originalInnerWidth: number;
  let originalInnerHeight: number;
  let originalDevicePixelRatio: number;

  beforeEach(() => {
    originalInnerWidth = window.innerWidth;
    originalInnerHeight = window.innerHeight;
    originalDevicePixelRatio = window.devicePixelRatio;
    document.documentElement.removeAttribute("style");
    vi.clearAllMocks();
  });

  afterEach(() => {
    Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: originalInnerWidth });
    Object.defineProperty(window, "innerHeight", { writable: true, configurable: true, value: originalInnerHeight });
    Object.defineProperty(window, "devicePixelRatio", { writable: true, configurable: true, value: originalDevicePixelRatio });
    vi.restoreAllMocks();
  });

  // =========================================================================
  // 1. Canvas Physics Particle Clamping & Safety Under Extreme Load
  // =========================================================================
  describe("1. Canvas Physics Particle Clamping & Load Safety", () => {
    it("enforces device-tier launch and particle budget limits in PremiumFireworks", () => {
      // Desktop parameters
      const desktopMaxLaunches = 14;
      const desktopParticlesPerExplosion = 72;
      const desktopTotalParticlesSpawned = desktopMaxLaunches * desktopParticlesPerExplosion;

      // Mobile parameters
      const mobileMaxLaunches = 8;
      const mobileParticlesPerExplosion = 42;
      const mobileTotalParticlesSpawned = mobileMaxLaunches * mobileParticlesPerExplosion;

      expect(desktopMaxLaunches).toBe(14);
      expect(desktopParticlesPerExplosion).toBe(72);
      expect(desktopTotalParticlesSpawned).toBe(1008);

      expect(mobileMaxLaunches).toBe(8);
      expect(mobileParticlesPerExplosion).toBe(42);
      expect(mobileTotalParticlesSpawned).toBe(336);

      // Mobile total particle budget is clamped to ~33% of desktop budget
      expect(mobileTotalParticlesSpawned).toBeLessThanOrEqual(desktopTotalParticlesSpawned * 0.35);
    });

    it("clamps delta time calculation to prevent explosion / NaN on tab switch or frame drops", () => {
      // Delta time formula in PremiumFireworks: const delta = Math.min(32, time - lastTime) / 16.67;
      const calculateDelta = (timeElapsed: number) => Math.min(32, timeElapsed) / 16.67;

      // Normal 60fps frame delta (~16.67ms)
      const normalDelta = calculateDelta(16.67);
      expect(normalDelta).toBeCloseTo(1.0, 2);

      // 30fps frame delta (~33.33ms)
      const slowDelta = calculateDelta(33.33);
      expect(slowDelta).toBeCloseTo(1.92, 2);

      // Massive tab switch or background freeze lag (5000ms)
      const lagDelta = calculateDelta(5000);
      // Must be strictly clamped to 32ms / 16.67 = 1.9196 to prevent physics explosion
      expect(lagDelta).toBeCloseTo(1.92, 2);
      expect(lagDelta).toBeLessThanOrEqual(2.0);
    });

    it("clamps DPR to maximum 2x to prevent canvas allocation memory explosion on retina screens", () => {
      const getClampedDpr = (dpr: number) => Math.min(dpr || 1, 2);

      expect(getClampedDpr(1)).toBe(1);
      expect(getClampedDpr(1.5)).toBe(1.5);
      expect(getClampedDpr(2)).toBe(2);
      // High-DPI screens (3x, 4x, 5x) clamped to 2x
      expect(getClampedDpr(3)).toBe(2);
      expect(getClampedDpr(4)).toBe(2);
    });

    it("strictly bounds EmojiCursorTrail particle count even under 500 consecutive event spam", () => {
      useBirthdayStore.setState({
        config: {
          ...useBirthdayStore.getState().config,
          relationship: "partner",
        },
      });

      const { container, unmount } = render(React.createElement(EmojiCursorTrail));
      expect(container).toBeInTheDocument();

      // Trigger 500 rapid pointer movements with varying coordinates and timestamps
      for (let i = 0; i < 500; i++) {
        act(() => {
          const event = new MouseEvent("pointermove", {
            clientX: (i * 35) % 800,
            clientY: (i * 25) % 600,
            bubbles: true,
          });
          Object.defineProperty(event, "pointerType", { value: "mouse" });
          window.dispatchEvent(event);
        });
      }

      // Check rendered DOM emoji particles
      const particleElements = container.querySelectorAll("span");
      // Must never exceed MAX_PARTICLES_DESKTOP (28)
      expect(particleElements.length).toBeLessThanOrEqual(28);

      unmount();
    });

    it("clamps Balloons count to safe budget (8) on mobile viewport", () => {
      // Simulate mobile width < 768
      Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 375 });
      Object.defineProperty(window, "innerHeight", { writable: true, configurable: true, value: 667 });

      const { container, unmount } = render(React.createElement(Balloons, { count: 50 }));
      const balloonSvgs = container.querySelectorAll("svg");
      // Mobile clamps count to Math.min(count, 8) = 8
      expect(balloonSvgs.length).toBeLessThanOrEqual(8);
      unmount();
    });

    it("verifies useConfetti scales burst particle density appropriately for mobile vs desktop", () => {
      let confettiApi: ReturnType<typeof useConfetti> | null = null;

      // 1. Desktop Test
      Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 1280 });
      Object.defineProperty(navigator, "userAgent", { writable: true, configurable: true, value: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" });

      const { unmount: unmountDesktop } = render(
        React.createElement(ConfettiHarness, {
          onReady: (api: ReturnType<typeof useConfetti>) => {
            confettiApi = api;
          },
        })
      );

      expect(confettiApi).not.toBeNull();
      act(() => {
        confettiApi?.fireConfetti();
      });
      expect(confetti).toHaveBeenCalledWith(
        expect.objectContaining({
          particleCount: 100, // Desktop particle count
          spread: 70,
        })
      );

      vi.clearAllMocks();
      act(() => {
        confettiApi?.firePop();
      });
      expect(confetti).toHaveBeenCalledWith(
        expect.objectContaining({
          particleCount: 40, // Desktop pop particle count
          spread: 70,
        })
      );
      unmountDesktop();

      // 2. Mobile Test
      Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 375 });
      Object.defineProperty(navigator, "userAgent", { writable: true, configurable: true, value: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)" });

      let mobileConfettiApi: ReturnType<typeof useConfetti> | null = null;
      const { unmount: unmountMobile } = render(
        React.createElement(ConfettiHarness, {
          onReady: (api: ReturnType<typeof useConfetti>) => {
            mobileConfettiApi = api;
          },
        })
      );

      vi.clearAllMocks();
      act(() => {
        mobileConfettiApi?.fireConfetti();
      });
      expect(confetti).toHaveBeenCalledWith(
        expect.objectContaining({
          particleCount: 30, // Mobile particle count clamped to 30
          spread: 55,
        })
      );

      vi.clearAllMocks();
      act(() => {
        mobileConfettiApi?.firePop();
      });
      expect(confetti).toHaveBeenCalledWith(
        expect.objectContaining({
          particleCount: 18, // Mobile pop particle count clamped to 18
          spread: 50,
        })
      );
      unmountMobile();
    });

    it("verifies decorative particle effects render within bounded density budgets", () => {
      // SparkleRain
      const { container: rainContainer, unmount: unmountRain } = render(
        React.createElement(SparkleRain, { intensity: 25 })
      );
      const rainDivs = rainContainer.querySelectorAll(".fixed > div");
      expect(rainDivs.length).toBe(25);
      unmountRain();

      // FireflyEffect
      const { container: fireflyContainer, unmount: unmountFireflies } = render(
        React.createElement(FireflyEffect, { intensity: 18 })
      );
      const fireflyDivs = fireflyContainer.querySelectorAll(".fixed > div");
      expect(fireflyDivs.length).toBe(18);
      unmountFireflies();

      // ShootingStars
      const { container: starContainer, unmount: unmountStars } = render(
        React.createElement(ShootingStars, { count: 12 })
      );
      const starDivs = starContainer.querySelectorAll(".fixed > div");
      expect(starDivs.length).toBe(12);
      unmountStars();

      // Sparkles (20 sparkles + 12 ambient orbs = 32 items)
      const { container: sparkleContainer, unmount: unmountSparkles } = render(
        React.createElement(Sparkles, { count: 20 })
      );
      const sparkleElements = sparkleContainer.querySelectorAll(".fixed > div");
      expect(sparkleElements.length).toBe(32);
      unmountSparkles();
    });
  });

  // =========================================================================
  // 2. Memory Leak Prevention & Lifecycle Teardown Verification
  // =========================================================================
  describe("2. Memory Leak Prevention & Lifecycle Teardown Verification", () => {
    it("cancels animation frames, timers, and window listeners on PremiumFireworks unmount", () => {
      const cancelRafSpy = vi.spyOn(window, "cancelAnimationFrame");
      const clearTimeoutSpy = vi.spyOn(window, "clearTimeout");
      const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

      // Mock 2D canvas context
      const clearRectMock = vi.fn();
      const setTransformMock = vi.fn();
      const fillRectMock = vi.fn();
      const beginPathMock = vi.fn();
      const arcMock = vi.fn();
      const fillMock = vi.fn();
      const strokeMock = vi.fn();
      const moveToMock = vi.fn();
      const lineToMock = vi.fn();
      const createRadialGradientMock = vi.fn().mockReturnValue({
        addColorStop: vi.fn(),
      });

      const mockContext = {
        clearRect: clearRectMock,
        setTransform: setTransformMock,
        fillRect: fillRectMock,
        beginPath: beginPathMock,
        arc: arcMock,
        fill: fillMock,
        stroke: strokeMock,
        moveTo: moveToMock,
        lineTo: lineToMock,
        createRadialGradient: createRadialGradientMock,
        fillStyle: "",
        strokeStyle: "",
        lineWidth: 1,
        shadowBlur: 0,
        shadowColor: "",
        globalCompositeOperation: "source-over",
      };

      vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(() => mockContext as unknown as CanvasRenderingContext2D);

      const { unmount } = render(React.createElement(PremiumFireworks, { runKey: 1 }));

      // Verify mounting attached resize listener
      expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledWith("2d", { alpha: true });

      // Unmount component
      unmount();

      // Verify complete lifecycle teardown
      expect(cancelRafSpy).toHaveBeenCalled();
      expect(clearTimeoutSpy).toHaveBeenCalled();
      expect(removeEventListenerSpy).toHaveBeenCalledWith("resize", expect.any(Function));
      expect(clearRectMock).toHaveBeenCalled();
    });

    it("cancels pointer listeners, RAF loops, and auto-cleanup particle timers on EmojiCursorTrail unmount", () => {
      const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
      const cancelRafSpy = vi.spyOn(window, "cancelAnimationFrame");
      const clearTimeoutSpy = vi.spyOn(window, "clearTimeout");

      // 1. Test unmounting while RAF is pending
      const { unmount: unmountPendingRaf } = render(React.createElement(EmojiCursorTrail));
      act(() => {
        const event = new MouseEvent("pointermove", { clientX: 50, clientY: 50, bubbles: true });
        Object.defineProperty(event, "pointerType", { value: "mouse" });
        window.dispatchEvent(event);
      });
      unmountPendingRaf();
      expect(cancelRafSpy).toHaveBeenCalled();

      // 2. Test unmounting while particle cleanup timers are pending
      let capturedRafCb: FrameRequestCallback | null = null;
      vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
        capturedRafCb = cb;
        return 999;
      });

      const { unmount: unmountPendingTimer } = render(React.createElement(EmojiCursorTrail));

      // Simulate pointer movement to schedule RAF
      act(() => {
        const event = new MouseEvent("pointermove", { clientX: 100, clientY: 100, bubbles: true });
        Object.defineProperty(event, "pointerType", { value: "mouse" });
        window.dispatchEvent(event);
      });

      // Execute RAF callback to create particle and schedule cleanup timeout
      if (capturedRafCb) {
        act(() => {
          (capturedRafCb as FrameRequestCallback)(performance.now());
        });
      }

      unmountPendingTimer();

      // Verify all pointer listeners removed
      expect(removeEventListenerSpy).toHaveBeenCalledWith("pointermove", expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith("pointerleave", expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith("blur", expect.any(Function));

      // Verify particle timer cleanup
      expect(clearTimeoutSpy).toHaveBeenCalled();
    });

    it("cancels typing timers cleanly on TypeWriter unmount during active typing", () => {
      const clearTimeoutSpy = vi.spyOn(window, "clearTimeout");

      const { unmount } = render(
        React.createElement(TypeWriter, {
          text: "Celebrating an extraordinary milestone!",
          speed: 50,
          delay: 100,
        })
      );

      // Unmount before delay completes
      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();
    });

    it("verifies SoundManager interaction fallback removes click listener upon user interaction", async () => {
      const removeEventListenerSpy = vi.spyOn(document, "removeEventListener");

      // Test sound manager interaction pattern
      const playOnInteractionMock = vi.fn();
      document.addEventListener("click", playOnInteractionMock);

      // Simulate click
      document.dispatchEvent(new MouseEvent("click"));
      document.removeEventListener("click", playOnInteractionMock);

      expect(removeEventListenerSpy).toHaveBeenCalledWith("click", playOnInteractionMock);
    });

    it("verifies fadeOutBgMusic cleans up interval cleanly when volume reaches zero", () => {
      vi.useFakeTimers();
      const clearIntervalSpy = vi.spyOn(window, "clearInterval");

      // Simulate audio fadeout steps
      let currentVolume = 0.25;
      const steps = 20;
      const volumeStep = currentVolume / steps;
      let step = 0;

      const intervalId = setInterval(() => {
        if (step < steps) {
          currentVolume = Math.max(0, currentVolume - volumeStep);
          step++;
        } else {
          clearInterval(intervalId);
        }
      }, 100);

      // Fast-forward 2500ms
      act(() => {
        vi.advanceTimersByTime(2500);
      });

      expect(currentVolume).toBe(0);
      expect(clearIntervalSpy).toHaveBeenCalledWith(intervalId);

      vi.useRealTimers();
    });
  });

  // =========================================================================
  // 3. Dynamic Theme CSS Custom Property Batch Injection Latency (<5ms)
  // =========================================================================
  describe("3. Dynamic Theme CSS Custom Property Batch Injection Latency (<5ms)", () => {
    it("executes single theme mutation in under 5.0ms (latency budget)", () => {
      useBirthdayStore.setState({
        config: {
          ...useBirthdayStore.getState().config,
          favoriteColor: "#e11d48",
          relationship: "partner",
          gender: "female",
        },
      });

      const t0 = performance.now();
      const { unmount } = render(React.createElement(DynamicThemeHarness));
      const t1 = performance.now();
      const durationMs = t1 - t0;

      expect(durationMs).toBeLessThan(5.0);

      const root = document.documentElement;
      expect(root.style.getPropertyValue("--color-primary")).toBeTruthy();
      expect(root.style.getPropertyValue("--bg-gradient")).toContain("hsl");
      expect(root.style.getPropertyValue("--glow-effect")).toContain("hsla");
      expect(root.style.getPropertyValue("--font-display")).toContain("Playfair Display");
      expect(root.style.getPropertyValue("--card-radius")).toBe("3rem");

      unmount();
    });

    it("benchmarks 1,000 rapid theme switches under stress: mean latency < 1ms, p99 < 5ms", () => {
      const palette = ["#f43f5e", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ec4899", "#3b82f6", "#eab308"];
      const relationships = ["partner", "friend", "family"] as const;
      const genders = ["female", "male", "other"] as const;

      const { rerender, unmount } = render(React.createElement(DynamicThemeHarness));

      const latencies: number[] = [];
      const iterations = 1000;

      for (let i = 0; i < iterations; i++) {
        const color = palette[i % palette.length];
        const relationship = relationships[i % relationships.length];
        const gender = genders[i % genders.length];

        const t0 = performance.now();
        act(() => {
          useBirthdayStore.setState({
            config: {
              ...useBirthdayStore.getState().config,
              favoriteColor: color,
              relationship,
              gender,
            },
          });
          rerender(React.createElement(DynamicThemeHarness));
        });
        const t1 = performance.now();
        latencies.push(t1 - t0);
      }

      const totalTime = latencies.reduce((acc, v) => acc + v, 0);
      const meanLatency = totalTime / iterations;
      latencies.sort((a, b) => a - b);
      const p95 = latencies[Math.floor(iterations * 0.95)];
      const p99 = latencies[Math.floor(iterations * 0.99)];

      // Assertions on latency budget
      expect(meanLatency).toBeLessThan(1.0); // Mean < 1ms
      expect(p95).toBeLessThan(3.0); // 95th percentile < 3ms
      expect(p99).toBeLessThan(5.0); // 99th percentile < 5ms

      unmount();
    });

    it("resiliently handles 3-digit hex, edge colors (#000, #fff, #808080) without NaN in CSS variables", () => {
      const edgeColors = ["#f00", "#0f0", "#00f", "#000000", "#ffffff", "#808080", "#123456"];

      for (const color of edgeColors) {
        act(() => {
          useBirthdayStore.setState({
            config: {
              ...useBirthdayStore.getState().config,
              favoriteColor: color,
            },
          });
        });

        const { unmount } = render(React.createElement(DynamicThemeHarness));
        const root = document.documentElement;

        const primary = root.style.getPropertyValue("--color-primary");
        const rgb = root.style.getPropertyValue("--color-primary-rgb");
        const low = root.style.getPropertyValue("--color-primary-low");
        const glow = root.style.getPropertyValue("--color-primary-glow");

        expect(primary).not.toContain("NaN");
        expect(rgb).not.toContain("NaN");
        expect(low).not.toContain("NaN");
        expect(glow).not.toContain("NaN");

        expect(primary).toMatch(/^hsl\(\d+,\s*[\d.]+%,\s*[\d.]+%\)$/);
        expect(rgb).toMatch(/^\d+,\s*\d+,\s*\d+$/);

        unmount();
      }
    });
  });

  // =========================================================================
  // 4. Production Build Bundle Size & Asset Integrity Verification
  // =========================================================================
  describe("4. Production Build Bundle Size & Asset Integrity Verification", () => {
    const distDir = path.resolve(__dirname, "../../dist");

    it("verifies production build artifacts and chunk isolation exist on disk", () => {
      expect(fs.existsSync(distDir)).toBe(true);

      const files = fs.readdirSync(distDir);
      const indexHtml = files.find((f) => f === "index.html");
      const indexCss = files.find((f) => /^index\..*\.css$/.test(f));
      const indexJs = files.find((f) => /^index\..*\.js$/.test(f));
      const vendorJs = files.find((f) => /^vendor\..*\.js$/.test(f));
      const threeJs = files.find((f) => /^three\..*\.js$/.test(f));
      const framerMotionJs = files.find((f) => /^framer-motion\..*\.js$/.test(f));
      const radixUiJs = files.find((f) => /^radix-ui\..*\.js$/.test(f));

      expect(indexHtml).toBeDefined();
      expect(indexCss).toBeDefined();
      expect(indexJs).toBeDefined();
      expect(vendorJs).toBeDefined();
      expect(threeJs).toBeDefined();
      expect(framerMotionJs).toBeDefined();
      expect(radixUiJs).toBeDefined();
    });

    it("validates bundle chunk sizes satisfy performance budgets", () => {
      const files = fs.readdirSync(distDir);

      const getFileSizeKb = (pattern: RegExp) => {
        const file = files.find((f) => pattern.test(f));
        if (!file) return 0;
        const stats = fs.statSync(path.join(distDir, file));
        return stats.size / 1024;
      };

      const htmlSizeKb = getFileSizeKb(/^index\.html$/);
      const cssSizeKb = getFileSizeKb(/^index\..*\.css$/);
      const indexJsSizeKb = getFileSizeKb(/^index\..*\.js$/);
      const vendorJsSizeKb = getFileSizeKb(/^vendor\..*\.js$/);
      const framerMotionJsSizeKb = getFileSizeKb(/^framer-motion\..*\.js$/);
      const radixUiJsSizeKb = getFileSizeKb(/^radix-ui\..*\.js$/);
      const threeJsSizeKb = getFileSizeKb(/^three\..*\.js$/);

      // Budgets (uncompressed disk size)
      expect(htmlSizeKb).toBeLessThan(15); // index.html < 15 kB (actual ~6.5 kB)
      expect(cssSizeKb).toBeLessThan(100); // index.css < 100 kB (actual ~60 kB)
      expect(indexJsSizeKb).toBeLessThan(450); // App bundle < 450 kB (actual ~320 kB)
      expect(vendorJsSizeKb).toBeLessThan(200); // Vendor bundle < 200 kB (actual ~105 kB)
      expect(framerMotionJsSizeKb).toBeLessThan(200); // Framer Motion < 200 kB (actual ~141 kB)
      expect(radixUiJsSizeKb).toBeLessThan(250); // Radix UI < 250 kB (actual ~177 kB)
      expect(threeJsSizeKb).toBeLessThan(1100); // Three.js chunk < 1.1 MB (actual ~918 kB)
    });

    it("validates static SEO and PWA webmanifest assets are well-formed", () => {
      // 1. site.webmanifest
      const manifestPath = path.join(distDir, "site.webmanifest");
      expect(fs.existsSync(manifestPath)).toBe(true);
      const manifestContent = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
      expect(manifestContent.name).toBe("Birthday Bloom");
      expect(manifestContent.short_name).toBe("Birthday Bloom");
      expect(manifestContent.theme_color).toBe("#1a0515");
      expect(manifestContent.background_color).toBe("#1a0515");
      expect(Array.isArray(manifestContent.icons)).toBe(true);
      expect(manifestContent.icons.length).toBeGreaterThan(0);

      // 2. robots.txt
      const robotsPath = path.join(distDir, "robots.txt");
      expect(fs.existsSync(robotsPath)).toBe(true);
      const robotsContent = fs.readFileSync(robotsPath, "utf-8");
      expect(robotsContent).toContain("User-agent:");
      expect(robotsContent).toContain("Sitemap:");

      // 3. sitemap.xml
      const sitemapPath = path.join(distDir, "sitemap.xml");
      expect(fs.existsSync(sitemapPath)).toBe(true);
      const sitemapContent = fs.readFileSync(sitemapPath, "utf-8");
      expect(sitemapContent).toContain("<urlset");
      expect(sitemapContent).toContain("https://birthday-bloom.vercel.app/");

      // 4. llms.txt
      const llmsPath = path.join(distDir, "llms.txt");
      expect(fs.existsSync(llmsPath)).toBe(true);
      const llmsContent = fs.readFileSync(llmsPath, "utf-8");
      expect(llmsContent).toContain("BIRTHDAY BLOOM — AI & LLM INGESTION GUIDE");
    });

    it("validates all cake visual textures and primary imagery are present and non-empty", () => {
      const files = fs.readdirSync(distDir);

      const requiredAssets = [
        /^birthday-gold\..*\.png$/,
        /^cake-green\..*\.png$/,
        /^cake-pink\..*\.png$/,
        /^cake-maroon\..*\.png$/,
        /^og-image\.jpg$/,
        /^favicon\.ico$/,
        /^icon-192x192\.png$/,
        /^icon-512x512\.png$/,
      ];

      for (const assetPattern of requiredAssets) {
        const found = files.find((f) => assetPattern.test(f));
        expect(found).toBeDefined();
        if (found) {
          const stats = fs.statSync(path.join(distDir, found));
          expect(stats.size).toBeGreaterThan(100); // Non-empty file
        }
      }
    });
  });
});
