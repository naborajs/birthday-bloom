import { describe, it, expect, beforeEach, afterEach } from "vitest";
import React from "react";
import { render, act, cleanup } from "@testing-library/react";
import { parseBirthdayUrlParams } from "@/features/core/store/urlParams";
import { useDynamicSEO } from "@/features/core/seo/useDynamicSEO";
import { useBirthdayStore, type BirthdayConfig } from "@/features/core/store/useBirthdayStore";
import { ShareCelebrationModal } from "@/components/birthday/ShareCelebrationModal";

const SEOTestComponent: React.FC<{ config: BirthdayConfig }> = ({ config }) => {
  useDynamicSEO(config);
  return <div data-testid="seo-test">SEO Active</div>;
};

describe("Dynamic SEO, URL Parameters & Viral Sharing Test Suite", () => {
  const initialConfig = useBirthdayStore.getState().config;

  beforeEach(() => {
    document.title = "Initial Title";
    // Clear head metadata before each test
    const dynamicLd = document.getElementById("birthday-bloom-dynamic-ldjson");
    if (dynamicLd) dynamicLd.remove();
  });

  afterEach(() => {
    cleanup();
    useBirthdayStore.setState({ config: initialConfig });
  });

  describe("parseBirthdayUrlParams()", () => {
    it("parses full set of valid celebration query parameters", () => {
      const query = "?name=Sophia&rel=partner&lang=fr&age=28&sender=David&msg=Happy+Love&color=%23FF6B6B&speed=fast&sound=true";
      const parsed = parseBirthdayUrlParams(query);

      expect(parsed.name).toBe("Sophia");
      expect(parsed.relationship).toBe("partner");
      expect(parsed.language).toBe("fr");
      expect(parsed.age).toBe(28);
      expect(parsed.senderName).toBe("David");
      expect(parsed.customMessage).toBe("Happy Love");
      expect(parsed.favoriteColor).toBe("#FF6B6B");
      expect(parsed.animationSpeed).toBe("fast");
      expect(parsed.soundEffectsEnabled).toBe(true);
    });

    it("correctly maps relationship and template aliases", () => {
      expect(parseBirthdayUrlParams("?rel=romantic").relationship).toBe("partner");
      expect(parseBirthdayUrlParams("?rel=bestie").relationship).toBe("friend");
      expect(parseBirthdayUrlParams("?rel=brother").relationship).toBe("brother");
      expect(parseBirthdayUrlParams("?rel=mother").relationship).toBe("mother");
      expect(parseBirthdayUrlParams("?rel=mentor").relationship).toBe("mentor");
    });

    it("correctly normalizes multilingual codes", () => {
      expect(parseBirthdayUrlParams("?lang=hindi").language).toBe("hi");
      expect(parseBirthdayUrlParams("?lang=bangla").language).toBe("bn");
      expect(parseBirthdayUrlParams("?lang=francais").language).toBe("fr");
      expect(parseBirthdayUrlParams("?lang=english").language).toBe("en");
    });

    it("safely handles empty or malformed search queries", () => {
      expect(parseBirthdayUrlParams("")).toEqual({});
      expect(parseBirthdayUrlParams("?")).toEqual({});
      expect(parseBirthdayUrlParams("?age=invalid")).toEqual({});
    });
  });

  describe("useDynamicSEO Hook", () => {
    it("dynamically updates document title, description, and keywords for a personalized recipient", () => {
      const customConfig: BirthdayConfig = {
        ...initialConfig,
        name: "Sophia",
        age: 25,
        relationship: "partner",
        language: "en",
      };

      act(() => {
        render(<SEOTestComponent config={customConfig} />);
      });

      expect(document.title).toBe("Happy Birthday Sophia! | Birthday Bloom");

      const descMeta = document.querySelector('meta[name="description"]');
      expect(descMeta).not.toBeNull();
      expect(descMeta?.getAttribute("content")).toContain("Sophia");

      const kwMeta = document.querySelector('meta[name="keywords"]');
      expect(kwMeta).not.toBeNull();
      expect(kwMeta?.getAttribute("content")).toContain("Sophia birthday");
    });

    it("updates OpenGraph and Twitter tags dynamically", () => {
      const customConfig: BirthdayConfig = {
        ...initialConfig,
        name: "Elena",
        relationship: "friend",
        language: "fr",
      };

      act(() => {
        render(<SEOTestComponent config={customConfig} />);
      });

      const ogTitle = document.querySelector('meta[property="og:title"]');
      expect(ogTitle?.getAttribute("content")).toContain("Elena");

      const ogLocale = document.querySelector('meta[property="og:locale"]');
      expect(ogLocale?.getAttribute("content")).toBe("fr_FR");

      const twTitle = document.querySelector('meta[name="twitter:title"]');
      expect(twTitle?.getAttribute("content")).toContain("Elena");
    });

    it("injects dynamic Schema.org JSON-LD SocialEvent schema with recipient details", () => {
      const customConfig: BirthdayConfig = {
        ...initialConfig,
        name: "Rahul",
        senderName: "Priya",
        language: "hi",
      };

      act(() => {
        render(<SEOTestComponent config={customConfig} />);
      });

      const script = document.getElementById("birthday-bloom-dynamic-ldjson") as HTMLScriptElement;
      expect(script).not.toBeNull();
      const schema = JSON.parse(script.textContent || "{}");

      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("SocialEvent");
      expect(schema.name).toContain("Rahul");
      expect(schema.organizer.name).toBe("Priya");
      expect(schema.about.name).toBe("Rahul");
      expect(schema.inLanguage).toBe("hi");
    });
  });

  describe("ShareCelebrationModal Component", () => {
    it("renders modal when isOpen is true and contains viral share channels", () => {
      let modal: HTMLElement | null = null;
      act(() => {
        const result = render(<ShareCelebrationModal isOpen={true} onClose={() => {}} />);
        modal = result.container;
      });

      expect(modal).not.toBeNull();
      expect(document.body.textContent).toContain("Share Celebration");
      expect(document.body.textContent).toContain("WhatsApp");
      expect(document.body.textContent).toContain("Telegram");
      expect(document.body.textContent).toContain("Facebook");
      expect(document.body.textContent).toContain("LinkedIn");
    });
  });
});
