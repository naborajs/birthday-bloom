import { useEffect } from 'react';
import type { BirthdayConfig } from '../store/useBirthdayStore';
import { useTranslation } from '@/i18n';

interface MetaTagConfig {
  name?: string;
  property?: string;
  content: string;
}

const setMetaTag = (selector: string, attribute: 'name' | 'property', key: string, content: string) => {
  if (typeof document === 'undefined') return;
  let element = document.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
};

const setCanonicalLink = (href: string) => {
  if (typeof document === 'undefined') return;
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
};

const setDynamicJsonLd = (id: string, data: object) => {
  if (typeof document === 'undefined') return;
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data, null, 2);
};

/**
 * Custom hook to reactively synchronize Document Head, OpenGraph tags,
 * Twitter cards, canonical link, and JSON-LD structured data with active celebration state.
 */
export const useDynamicSEO = (config: BirthdayConfig) => {
  const { t, language, isBengali, isHindi, isFrench } = useTranslation();

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const rawName = config.name?.trim() || '';
    const age = config.age;
    const relationship = config.relationship || 'celebration';
    const sender = config.senderName?.trim();

    // 1. Dynamic Title
    let title: string;
    if (rawName) {
      const greeting = t('common.happyBirthday');
      title = `${greeting} ${rawName}! | Birthday Bloom`;
    } else {
      title = isFrench
        ? "Birthday Bloom | Site Magique de Célébration d'Anniversaire Cinématographique"
        : isBengali
          ? "Birthday Bloom | জাদুকরী ও আবেগঘন জন্মদিনের শুভেচ্ছা ওয়েবসাইট"
          : isHindi
            ? "Birthday Bloom | जादुई और भावनात्मक जन्मदिन का सरप्राइज"
            : "Birthday Bloom | Magical Cinematic Birthday Celebration Website";
    }
    document.title = title;

    // 2. Dynamic Description
    let description: string;
    if (rawName) {
      if (isFrench) {
        description = `Célébrez l'anniversaire de ${rawName} avec une expérience cinématographique magique : gâteau 3D, feux d'artifice, galerie de souvenirs et mots d'amour sur Birthday Bloom.`;
      } else if (isBengali) {
        description = `${rawName}-এর জন্মদিনে একটি জাদুকরী ও স্মরণীয় উপহার: ৩ডি কেক কাটা, আতশবাজি, ফটো গ্যালারি ও আবেগময় চিঠি নিয়ে Birthday Bloom।`;
      } else if (isHindi) {
        description = `${rawName} के जन्मदिन पर एक जादुई और यादगार तोहफा: 3D केक कटिंग, आतिशबाजी, फोटो गैलरी और दिल को छू लेने वाले संदेश के साथ Birthday Bloom।`;
      } else {
        description = `Celebrate ${rawName}'s birthday with a magical cinematic experience featuring 3D cake cutting, fireworks, custom photo memories, and heartfelt wishes on Birthday Bloom.`;
      }
    } else {
      description = isFrench
        ? "Vivez une célébration d'anniversaire cinématographique à couper le souffle avec des animations physiques, des récits émotionnels et des galeries photo personnalisées."
        : isBengali
          ? "পদার্থবিজ্ঞানের অ্যানিমেশন, আবেগময় গল্প, কাস্টম ফটো গ্যালারি এবং ভালোবাসায় তৈরি উৎসবের সমন্বয়ে একটি শ্বাসরুদ্ধকর জন্মদিনের ওয়েবসাইটের অভিজ্ঞতা নিন।"
          : isHindi
            ? "भौतिकी एनिमेशन, भावनात्मक कहानी, कस्टम फोटो गैलरी और प्यार से तैयार किए गए उत्सव के साथ एक लुभावनी जन्मदिन वेबसाइट का अनुभव करें।"
            : "Experience a breathtaking, cinematic birthday celebration website with physics animations, emotional storytelling, custom photo galleries, and festive interactions crafted with love.";
    }

    setMetaTag('meta[name="description"]', 'name', 'description', description);

    // 3. Dynamic Keywords
    const baseKeywords = [
      'birthday website',
      'animated birthday website',
      'birthday surprise',
      'cinematic birthday celebration',
      '3d cake cutting online',
      'birthday bloom',
      'naboraj sarkar',
    ];
    if (rawName) {
      baseKeywords.push(`${rawName} birthday`, `happy birthday ${rawName}`, `${relationship} birthday surprise`);
    }
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', baseKeywords.join(', '));

    // 4. OpenGraph Tags
    const ogTitle = rawName 
      ? `A Magical Birthday Surprise Just For ${rawName} ✨ — Birthday Bloom` 
      : 'A Magical Birthday Surprise Just For You ✨ — Birthday Bloom';
    
    const locale = isFrench ? 'fr_FR' : isBengali ? 'bn_BD' : isHindi ? 'hi_IN' : 'en_US';
    
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', ogTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:locale"]', 'property', 'og:locale', locale);

    const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://birthday-bloom.vercel.app/';
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', currentUrl);
    setCanonicalLink(currentUrl.split('#')[0]);

    // 5. Twitter Card Tags
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', ogTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);

    // 6. Dynamic JSON-LD Structured Data
    const dynamicSchema = {
      '@context': 'https://schema.org',
      '@type': 'SocialEvent',
      '@id': 'https://birthday-bloom.vercel.app/#celebration-event',
      name: rawName ? `${rawName}'s Birthday Celebration` : 'Birthday Bloom Celebration',
      description: description,
      url: currentUrl,
      eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      organizer: {
        '@type': 'Person',
        name: sender || 'Someone Special',
      },
      about: {
        '@type': 'Person',
        name: rawName || 'Celebrant',
      },
      inLanguage: language,
      isAccessibleForFree: true,
    };

    setDynamicJsonLd('birthday-bloom-dynamic-ldjson', dynamicSchema);

    // Update html lang attribute
    document.documentElement.lang = language || 'en';

  }, [config.name, config.age, config.relationship, config.senderName, language, t, isBengali, isHindi, isFrench]);
};
