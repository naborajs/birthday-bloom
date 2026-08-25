import { describe, it, expect, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, act } from "@testing-library/react";
import fs from "fs";
import path from "path";
import Index from "@/pages/Index";
import { useBirthdayStore } from "@/features/core/store/useBirthdayStore";

describe("SEO, UX, and PWA Enhancements Test Suite", () => {
  const initialConfig = useBirthdayStore.getState().config;

  beforeEach(() => {
    document.title = "Initial Title";
    useBirthdayStore.setState({ config: { ...initialConfig } });
  });

  afterEach(() => {
    useBirthdayStore.setState({ config: initialConfig });
  });

  describe("Dynamic Document Title in Index.tsx", () => {
    it("updates document title with English greeting when name is set", () => {
      act(() => {
        useBirthdayStore.setState({
          config: {
            ...initialConfig,
            name: "Alice",
            language: "en",
          },
        });
      });

      act(() => {
        render(<Index />);
      });
      expect(document.title).toBe("Happy Birthday Alice! | Birthday Bloom");
    });

    it("updates document title with Bengali greeting when language is bn", () => {
      act(() => {
        useBirthdayStore.setState({
          config: {
            ...initialConfig,
            name: "অনিন্দিতা",
            language: "bn",
          },
        });
      });

      act(() => {
        render(<Index />);
      });
      expect(document.title).toBe("শুভ জন্মদিন অনিন্দিতা! | Birthday Bloom");
    });

    it("updates document title with Hindi greeting when language is hi", () => {
      act(() => {
        useBirthdayStore.setState({
          config: {
            ...initialConfig,
            name: "राहुल",
            language: "hi",
          },
        });
      });

      act(() => {
        render(<Index />);
      });
      expect(document.title).toBe("जन्मदिन मुबारक राहुल! | Birthday Bloom");
    });

    it("updates document title with French greeting when language is fr", () => {
      act(() => {
        useBirthdayStore.setState({
          config: {
            ...initialConfig,
            name: "Camille",
            language: "fr",
          },
        });
      });

      act(() => {
        render(<Index />);
      });
      expect(document.title).toBe("Joyeux Anniversaire Camille! | Birthday Bloom");
    });

    it("falls back to default title when name is empty or whitespace", () => {
      act(() => {
        useBirthdayStore.setState({
          config: {
            ...initialConfig,
            name: "   ",
            language: "en",
          },
        });
      });

      act(() => {
        render(<Index />);
      });
      expect(document.title).toBe("Birthday Bloom | Magical Cinematic Birthday Celebration Website");
    });
  });

  describe("index.html SEO, Social, and JSON-LD Verification", () => {
    const indexPath = path.resolve(process.cwd(), "index.html");
    const htmlContent = fs.readFileSync(indexPath, "utf-8");

    it("contains canonical link tag", () => {
      expect(htmlContent).toContain('<link rel="canonical" href="https://birthday-bloom.vercel.app/" />');
    });

    it("contains OpenGraph locale and alternate language tags", () => {
      expect(htmlContent).toContain('<meta property="og:locale" content="en_US" />');
      expect(htmlContent).toContain('<meta property="og:locale:alternate" content="hi_IN" />');
      expect(htmlContent).toContain('<meta property="og:locale:alternate" content="bn_BD" />');
      expect(htmlContent).toContain('<meta property="og:locale:alternate" content="fr_FR" />');
    });

    it("contains Twitter creator and image alt tags", () => {
      expect(htmlContent).toContain('<meta name="twitter:creator" content="@NSGAMMING699" />');
      expect(htmlContent).toContain('<meta name="twitter:image:alt" content="Birthday Bloom Celebration Preview" />');
    });

    it("contains comprehensive and valid JSON-LD structured data with dual WebSite and WebApplication schemas", () => {
      const jsonLdMatch = htmlContent.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
      expect(jsonLdMatch).not.toBeNull();
      const rawJson = jsonLdMatch![1].trim();
      const parsed = JSON.parse(rawJson);

      expect(parsed["@context"]).toBe("https://schema.org");
      expect(Array.isArray(parsed["@graph"])).toBe(true);

      const webSite = parsed["@graph"].find((item: { "@type": string }) => item["@type"] === "WebSite");
      expect(webSite).toBeDefined();
      expect(webSite.url).toBe("https://birthday-bloom.vercel.app/");
      expect(webSite.inLanguage).toContain("en");
      expect(webSite.inLanguage).toContain("bn");
      expect(webSite.inLanguage).toContain("hi");
      expect(webSite.inLanguage).toContain("fr");

      const webApp = parsed["@graph"].find((item: { "@type": string }) => item["@type"] === "WebApplication");
      expect(webApp).toBeDefined();
      expect(webApp.name).toBe("Birthday Bloom");
      expect(webApp.genre).toBe("Celebration & Entertainment");
      expect(webApp.browserRequirements).toBeDefined();
      expect(webApp.featureList.length).toBeGreaterThan(0);
      expect(webApp.inLanguage).toContain("en");
      expect(webApp.offers).toBeDefined();
      expect(webApp.author).toBeDefined();
    });
  });

  describe("PWA Manifest Synchronization in public/site.webmanifest", () => {
    const manifestPath = path.resolve(process.cwd(), "public/site.webmanifest");
    const manifestContent = fs.readFileSync(manifestPath, "utf-8");
    const parsedManifest = JSON.parse(manifestContent);

    it("harmonizes theme_color and background_color to #1a0515", () => {
      expect(parsedManifest.theme_color).toBe("#1a0515");
      expect(parsedManifest.background_color).toBe("#1a0515");
    });
  });
});
