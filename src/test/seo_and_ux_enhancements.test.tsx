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

    it("contains comprehensive and valid JSON-LD structured data with WebSite, WebApplication, FAQPage, HowTo, and BreadcrumbList schemas", () => {
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

      const faqPage = parsed["@graph"].find((item: { "@type": string }) => item["@type"] === "FAQPage");
      expect(faqPage).toBeDefined();
      expect(Array.isArray(faqPage.mainEntity)).toBe(true);
      expect(faqPage.mainEntity.length).toBeGreaterThanOrEqual(5);

      const howTo = parsed["@graph"].find((item: { "@type": string }) => item["@type"] === "HowTo");
      expect(howTo).toBeDefined();
      expect(Array.isArray(howTo.step)).toBe(true);

      const breadcrumbs = parsed["@graph"].find((item: { "@type": string }) => item["@type"] === "BreadcrumbList");
      expect(breadcrumbs).toBeDefined();
    });

    it("contains semantic crawlable noscript fallback", () => {
      expect(htmlContent).toContain("<noscript>");
      expect(htmlContent).toContain("<h1>Birthday Bloom");
      expect(htmlContent).toContain("3D Interactive Cake Cutting");
    });
  });

  describe("PWA Manifest Synchronization in public/site.webmanifest", () => {
    const manifestPath = path.resolve(process.cwd(), "public/site.webmanifest");
    const manifestContent = fs.readFileSync(manifestPath, "utf-8");
    const parsedManifest = JSON.parse(manifestContent);

    it("harmonizes theme_color, background_color, categories, and shortcuts", () => {
      expect(parsedManifest.theme_color).toBe("#1a0515");
      expect(parsedManifest.background_color).toBe("#1a0515");
      expect(parsedManifest.categories).toContain("entertainment");
      expect(Array.isArray(parsedManifest.shortcuts)).toBe(true);
      expect(parsedManifest.shortcuts.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("Robots.txt and Sitemap.xml Verification", () => {
    const robotsPath = path.resolve(process.cwd(), "public/robots.txt");
    const robotsContent = fs.readFileSync(robotsPath, "utf-8");

    it("robots.txt configures search engines, AI crawlers, and sitemap pointer", () => {
      expect(robotsContent).toContain("User-agent: Googlebot");
      expect(robotsContent).toContain("User-agent: GPTBot");
      expect(robotsContent).toContain("User-agent: ClaudeBot");
      expect(robotsContent).toContain("User-agent: PerplexityBot");
      expect(robotsContent).toContain("Sitemap: https://birthday-bloom.vercel.app/sitemap.xml");
    });

    const sitemapPath = path.resolve(process.cwd(), "public/sitemap.xml");
    const sitemapContent = fs.readFileSync(sitemapPath, "utf-8");

    it("sitemap.xml contains multilingual hreflang and archetypes", () => {
      expect(sitemapContent).toContain('xmlns:xhtml="http://www.w3.org/1999/xhtml"');
      expect(sitemapContent).toContain('hreflang="bn"');
      expect(sitemapContent).toContain('hreflang="hi"');
      expect(sitemapContent).toContain('hreflang="fr"');
      expect(sitemapContent).toContain("relationship=partner");
      expect(sitemapContent).toContain("relationship=friend");
      expect(sitemapContent).toContain("relationship=family");
    });
  });
});
