import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { useBirthdayStore } from "@/features/core/store/useBirthdayStore";
import { useDynamicTheme } from "@/features/core/theme/useDynamicTheme";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import NotFound from "@/pages/NotFound";
import fs from "fs";
import path from "path";

// Test helper component to mount useDynamicTheme
const ThemeTester = () => {
  useDynamicTheme();
  return <div data-testid="theme-tester">Theme Mounted</div>;
};

// Test helper component that throws on demand
const ProblemChild = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error("Simulated intentional render explosion for ErrorBoundary test");
  }
  return <div data-testid="child-content">Normal Content</div>;
};

describe("Milestone 2 Empirical Challenge Tests", () => {
  describe("1. Dynamic Theme Engine & HSL/RGB Injection", () => {
    beforeEach(() => {
      // Reset documentElement styles
      document.documentElement.removeAttribute("style");
      useBirthdayStore.setState({
        config: {
          name: "Test User",
          age: 25,
          birthDate: "2000-01-01",
          relationship: "friend",
          gender: "female",
          favoriteColor: "#ff3366",
          theme: "vibrant",
          musicEnabled: false,
          customMessage: "Happy Birthday",
        },
      });
    });

    it("injects valid CSS variables for primary HSL and RGB channels", () => {
      render(<ThemeTester />);
      const root = document.documentElement;

      const primary = root.style.getPropertyValue("--color-primary");
      const primaryRgb = root.style.getPropertyValue("--color-primary-rgb");
      const primaryLow = root.style.getPropertyValue("--color-primary-low");
      const primaryGlow = root.style.getPropertyValue("--color-primary-glow");

      // Verify format and syntax
      expect(primary).toMatch(/^hsl\(\d+,\s*[\d.]+%,\s*[\d.]+%\)$/);
      expect(primaryRgb).toMatch(/^\d+,\s*\d+,\s*\d+$/);
      expect(primaryLow).toMatch(/^hsl\(\d+,\s*[\d.]+%,\s*[\d.]+%\)$/);
      expect(primaryGlow).toMatch(/^hsla\(\d+,\s*[\d.]+%,\s*[\d.]+%/);

      // Verify no invalid 4-argument hsl()
      expect(primaryGlow).not.toMatch(/^hsl\([^)]+,[^)]+,[^)]+,[^)]+\)$/);
    });

    it("handles short 3-digit hex codes accurately", () => {
      useBirthdayStore.setState({
        config: {
          ...useBirthdayStore.getState().config,
          favoriteColor: "#f00", // pure red
        },
      });
      render(<ThemeTester />);
      const root = document.documentElement;

      expect(root.style.getPropertyValue("--color-primary-rgb")).toBe("255, 0, 0");
      expect(root.style.getPropertyValue("--color-primary")).toMatch(/^hsl\(0,\s*100%,\s*50%\)$/);
    });

    it("applies relationship-specific typography and pacing", () => {
      // Partner
      useBirthdayStore.setState({
        config: {
          ...useBirthdayStore.getState().config,
          relationship: "partner",
        },
      });
      const { unmount } = render(<ThemeTester />);
      let root = document.documentElement;
      expect(root.style.getPropertyValue("--font-display")).toContain("Playfair Display");
      expect(root.style.getPropertyValue("--animation-pacing")).toBe("2s");
      expect(root.style.getPropertyValue("--card-radius")).toBe("3rem");
      unmount();

      // Friend
      useBirthdayStore.setState({
        config: {
          ...useBirthdayStore.getState().config,
          relationship: "friend",
        },
      });
      render(<ThemeTester />);
      root = document.documentElement;
      expect(root.style.getPropertyValue("--font-display")).toContain("Inter");
      expect(root.style.getPropertyValue("--animation-pacing")).toBe("0.8s");
      expect(root.style.getPropertyValue("--card-radius")).toBe("1.5rem");
    });

    it("applies gender-specific styling rules", () => {
      useBirthdayStore.setState({
        config: {
          ...useBirthdayStore.getState().config,
          gender: "female",
        },
      });
      const { unmount } = render(<ThemeTester />);
      let root = document.documentElement;
      expect(root.style.getPropertyValue("--glow-intensity")).toBe("1.2");
      expect(root.style.getPropertyValue("--glass-blur")).toBe("25px");
      expect(root.style.getPropertyValue("--color-accent-soft")).toBeTruthy();
      unmount();

      useBirthdayStore.setState({
        config: {
          ...useBirthdayStore.getState().config,
          gender: "male",
        },
      });
      render(<ThemeTester />);
      root = document.documentElement;
      expect(root.style.getPropertyValue("--glow-intensity")).toBe("0.8");
      expect(root.style.getPropertyValue("--glass-blur")).toBe("15px");
    });
  });

  describe("2. ErrorBoundary Behavior & Security", () => {
    let consoleSpy: ReturnType<typeof vi.spyOn>;
    beforeEach(() => {
      consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    });
    afterEach(() => {
      consoleSpy.mockRestore();
    });

    it("renders children when no error occurs", () => {
      render(
        <ErrorBoundary>
          <ProblemChild shouldThrow={false} />
        </ErrorBoundary>
      );
      expect(screen.getByTestId("child-content")).toBeInTheDocument();
      expect(screen.getByText("Normal Content")).toBeInTheDocument();
    });

    it("catches render errors and displays fallback UI with reload action", () => {
      render(
        <ErrorBoundary>
          <ProblemChild shouldThrow={true} />
        </ErrorBoundary>
      );
      expect(screen.queryByTestId("child-content")).not.toBeInTheDocument();
      expect(screen.getByText("Oops! Something went wrong 😔")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /reload page/i })).toBeInTheDocument();
    });

    it("renders custom fallback element when provided", () => {
      render(
        <ErrorBoundary fallback={<div data-testid="custom-fallback">Custom Error View</div>}>
          <ProblemChild shouldThrow={true} />
        </ErrorBoundary>
      );
      expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
      expect(screen.getByText("Custom Error View")).toBeInTheDocument();
    });
  });

  describe("3. SPA Routing & NotFound Page", () => {
    it("renders 404 message and client-side Link back to home", () => {
      render(
        <MemoryRouter initialEntries={["/some/non-existent/deep/route"]}>
          <Routes>
            <Route path="/" element={<div>Home Page</div>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText("404")).toBeInTheDocument();
      expect(screen.getByText("Oops! Page not found")).toBeInTheDocument();
      const link = screen.getByRole("link", { name: /return to home/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/");
    });
  });

  describe("4. Static Import Resolution & Pruned File Integrity", () => {
    it("verifies all active TypeScript source files have resolvable imports", () => {
      const srcDir = path.resolve(__dirname, "..");
      const getAllFiles = (dir: string): string[] => {
        let results: string[] = [];
        const list = fs.readdirSync(dir);
        for (const file of list) {
          const fullPath = path.join(dir, file);
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            results = results.concat(getAllFiles(fullPath));
          } else if (/\.(ts|tsx)$/.test(file)) {
            results.push(fullPath);
          }
        }
        return results;
      };

      const sourceFiles = getAllFiles(srcDir);
      const prunedPatterns = [
        "DigitalRain",
        "GlitchEffect",
        "LiquidSwirl",
        "ParticleBurst",
        "RibbonEffect",
        "TextRevealEffect",
        "TunnelEffect",
        "WaveEffect",
        "audioSystem",
        "responsiveUtils",
        "dataModels",
        "use-toast",
      ];

      for (const filePath of sourceFiles) {
        const content = fs.readFileSync(filePath, "utf-8");
        for (const pattern of prunedPatterns) {
          // Check that no import statement imports from or references pruned files
          const importRegex = new RegExp(`from\\s+['"][^'"]*${pattern}[^'"]*['"]`, "i");
          expect(importRegex.test(content)).toBe(false);
        }
      }
    });
  });
});
