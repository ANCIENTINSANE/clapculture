'use client';

import { useSyncExternalStore } from 'react';

export type AspectRatioType = 'portrait' | 'tall' | 'square' | 'landscape' | 'banner' | 'wide';

export interface TileBanner {
  id: string;
  title: string;
  subtitle?: string;
  tagline?: string;
  badge?: string;
  badgeColor?: 'lime' | 'amber' | 'cyan' | 'purple' | 'crimson' | 'white' | 'dark';
  imageUrl: string;
  link: string;
  ctaText?: string;
  price?: number;
  compareAtPrice?: number;
  aspectRatio?: AspectRatioType;
  active: boolean;
  order: number;
}

export interface HeroSlide {
  id: string;
  badge: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  desktopImage: string;
  mobileImage: string;
  active: boolean;
}

export interface HeroSideBanner {
  active: boolean;
  badge: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  ctaText: string;
}

export type SectionType = 'lineup' | 'star_collection' | 'featured_drops' | 'promo_bento' | 'custom_tiles';

export interface HomepageSectionConfig {
  id: string;
  type: SectionType;
  title: string;
  subtitle?: string;
  badge?: string;
  viewAllText?: string;
  viewAllLink?: string;
  layoutStyle?: 'grid-4' | 'grid-3' | 'grid-2' | 'carousel' | 'bento';
  active: boolean;
  order: number;
  tiles: TileBanner[];
}

export interface NewsletterConfig {
  active: boolean;
  title: string;
  subtitle: string;
  badge: string;
  stats: Array<{ value: string; label: string; highlight?: string }>;
}

export interface HomepageCMSData {
  hero: {
    active: boolean;
    slides: HeroSlide[];
    sideBanner: HeroSideBanner;
  };
  sections: HomepageSectionConfig[];
  newsletter: NewsletterConfig;
  lastUpdated: string;
}

export const DEFAULT_HOMEPAGE_CMS: HomepageCMSData = {
  hero: {
    active: true,
    slides: [
      {
        id: 'slide-1',
        badge: 'NEW DROP LIVE',
        titleLine1: 'BORN TO',
        titleLine2: 'STAND OUT',
        subtitle: 'CLAP CULTURE',
        description: 'Unapologetic streetwear for the modern rebel. Elevate your everyday fit with our latest exclusive collection.',
        primaryCtaText: 'SHOP NOW',
        primaryCtaLink: '/shop',
        secondaryCtaText: 'EXPLORE COLLECTIONS',
        secondaryCtaLink: '/collections',
        desktopImage: '6a7fa922002c9b023447',
        mobileImage: '6a7fa92400303d551b68',
        active: true,
      },
      {
        id: 'slide-2',
        badge: 'EXCLUSIVE EDITION',
        titleLine1: 'ICONIC',
        titleLine2: 'HEAVYWEIGHT',
        subtitle: 'REBEL ESSENTIALS',
        description: 'Precision cut bio-washed cotton engineered for durability, comfort, and uncompromising attitude.',
        primaryCtaText: 'EXPLORE DROPS',
        primaryCtaLink: '/shop',
        secondaryCtaText: 'VIEW LOOKBOOK',
        secondaryCtaLink: '/collections',
        desktopImage: '6a7fa926003c73611eef',
        mobileImage: '6a7fa926003c73611eef',
        active: true,
      },
      {
        id: 'slide-3',
        badge: 'LIMITED RUN',
        titleLine1: 'CINEMATIC',
        titleLine2: 'STREETWEAR',
        subtitle: 'LEGEND SERIES',
        description: 'Pay homage to iconic cinema legends with custom illustrated graphics and oversized silhouettes.',
        primaryCtaText: 'SHOP STAR EDITION',
        primaryCtaLink: '/shop?star=pawan-kalyan',
        secondaryCtaText: 'ALL HEROES',
        secondaryCtaLink: '/shop',
        desktopImage: '6a7fa92b001fdc8fc236',
        mobileImage: '6a7fa92b001fdc8fc236',
        active: true,
      }
    ],
    sideBanner: {
      active: true,
      badge: 'TRENDING NOW',
      title: 'OVERSIZED COLLECTION',
      description: 'Heavyweight cotton blanks engineered for maximum comfort and durability.',
      imageUrl: '6a7fa922002c9b023447',
      link: '/category/tees',
      ctaText: 'SHOP OVERSIZED',
    }
  },
  sections: [
    {
      id: 'section-lineup',
      type: 'lineup',
      title: 'EXPLORE THE LINEUP',
      subtitle: 'CATEGORIES',
      badge: 'CATEGORIES',
      viewAllText: 'VIEW ALL CATEGORIES',
      viewAllLink: '/shop',
      layoutStyle: 'grid-4',
      active: true,
      order: 1,
      tiles: [
        {
          id: 'tile-cat-1',
          title: 'TEES',
          subtitle: 'Heavyweight graphic blanks',
          tagline: 'HEAVYWEIGHT 240 GSM',
          badge: 'BESTSELLER',
          badgeColor: 'lime',
          imageUrl: '6a7fa922002c9b023447',
          link: '/category/tees',
          ctaText: 'EXPLORE TEES',
          aspectRatio: 'portrait',
          active: true,
          order: 1,
        },
        {
          id: 'tile-cat-2',
          title: 'OUTERWEAR',
          subtitle: 'Fleece hoodies & jackets',
          tagline: 'PREMIUM 380 GSM FLEECE',
          badge: 'WINTER DROP',
          badgeColor: 'cyan',
          imageUrl: '6a7fa926003c73611eef',
          link: '/category/outerwear',
          ctaText: 'EXPLORE HOODIES',
          aspectRatio: 'portrait',
          active: true,
          order: 2,
        },
        {
          id: 'tile-cat-3',
          title: 'BOTTOMS',
          subtitle: 'Tactical cargo utility',
          tagline: 'MULTI-POCKET RELAXED',
          badge: 'TRENDING',
          badgeColor: 'amber',
          imageUrl: '6a7fa92b001fdc8fc236',
          link: '/category/bottoms',
          ctaText: 'EXPLORE CARGOS',
          aspectRatio: 'portrait',
          active: true,
          order: 3,
        },
        {
          id: 'tile-cat-4',
          title: 'HEADWEAR',
          subtitle: 'Snapbacks & caps',
          tagline: 'STRUCTURED FIT',
          badge: 'NEW',
          badgeColor: 'purple',
          imageUrl: '6a7fa92400303d551b68',
          link: '/category/headwear',
          ctaText: 'EXPLORE CAPS',
          aspectRatio: 'portrait',
          active: true,
          order: 4,
        }
      ]
    },
    {
      id: 'section-star-collection',
      type: 'star_collection',
      title: 'EXPLORE STAR COLLECTION',
      subtitle: 'TOLLYWOOD LEGENDS',
      badge: 'TOLLYWOOD LEGENDS',
      viewAllText: 'VIEW ALL HERO EDITIONS',
      viewAllLink: '/shop',
      layoutStyle: 'carousel',
      active: true,
      order: 2,
      tiles: [
        {
          id: 'tile-star-1',
          title: 'Pawan Kalyan',
          subtitle: 'Power Star Collection',
          tagline: 'SENANI & OG ERA FITS',
          badge: '12 DROPS',
          badgeColor: 'lime',
          imageUrl: '6a7fa5f80010fcd2bc85',
          link: '/shop?star=pawan-kalyan',
          ctaText: 'VIEW COLLECTION',
          aspectRatio: 'tall',
          active: true,
          order: 1,
        },
        {
          id: 'tile-star-2',
          title: 'Mahesh Babu',
          subtitle: 'Superstar Collection',
          tagline: 'PRINCE SLEEK STREETWEAR',
          badge: '10 DROPS',
          badgeColor: 'lime',
          imageUrl: '6a7fa5f700082ba1bbc3',
          link: '/shop?star=mahesh-babu',
          ctaText: 'VIEW COLLECTION',
          aspectRatio: 'tall',
          active: true,
          order: 2,
        },
        {
          id: 'tile-star-3',
          title: 'Prabhas',
          subtitle: 'Rebel Star Collection',
          tagline: 'REBEL STAR HEAVYWEIGHT FITS',
          badge: '14 DROPS',
          badgeColor: 'lime',
          imageUrl: '6a7fa5fb001234ea8799',
          link: '/shop?star=prabhas',
          ctaText: 'VIEW COLLECTION',
          aspectRatio: 'tall',
          active: true,
          order: 3,
        },
        {
          id: 'tile-star-4',
          title: 'Allu Arjun',
          subtitle: 'Icon Star Collection',
          tagline: 'ICON STAR PUSHPA EDITION',
          badge: '15 DROPS',
          badgeColor: 'lime',
          imageUrl: '6a7fa5f5002dd6861328',
          link: '/shop?star=allu-arjun',
          ctaText: 'VIEW COLLECTION',
          aspectRatio: 'tall',
          active: true,
          order: 4,
        },
        {
          id: 'tile-star-5',
          title: 'Ram Charan',
          subtitle: 'Global Star Collection',
          tagline: 'GLOBAL STAR GAME CHANGER',
          badge: '12 DROPS',
          badgeColor: 'lime',
          imageUrl: '6a7fa5ff00162b33637d',
          link: '/shop?star=ram-charan',
          ctaText: 'VIEW COLLECTION',
          aspectRatio: 'tall',
          active: true,
          order: 5,
        },
        {
          id: 'tile-star-6',
          title: 'Jr NTR',
          subtitle: 'Man of Masses Collection',
          tagline: 'MAN OF MASSES DEVARA',
          badge: '11 DROPS',
          badgeColor: 'lime',
          imageUrl: '6a7fa6010011985f8642',
          link: '/shop?star=ntr',
          ctaText: 'VIEW COLLECTION',
          aspectRatio: 'tall',
          active: true,
          order: 6,
        }
      ]
    },
    {
      id: 'section-featured-drops',
      type: 'featured_drops',
      title: 'FEATURED DROPS',
      subtitle: 'CURATED SELECTION',
      badge: 'CURATED SELECTION',
      viewAllText: 'VIEW ALL DROPS',
      viewAllLink: '/shop',
      layoutStyle: 'carousel',
      active: true,
      order: 3,
      tiles: [
        {
          id: 'tile-drop-1',
          title: 'SUPERSTAR MAHESH BABU OVERSIZED TEE',
          subtitle: '320 GSM Heavyweight French Terry Cotton',
          badge: 'IN STOCK',
          badgeColor: 'lime',
          imageUrl: '6a7fa922002c9b023447',
          link: '/product/superstar-mahesh-babu-oversized-tee',
          ctaText: 'SHOP NOW',
          price: 699,
          compareAtPrice: 1299,
          aspectRatio: 'portrait',
          active: true,
          order: 1,
        },
        {
          id: 'tile-drop-2',
          title: 'POKIRI ICONIC OVERSIZED TEE',
          subtitle: '320 GSM Heavyweight Bio-Washed Cotton',
          badge: 'SOLD OUT',
          badgeColor: 'crimson',
          imageUrl: '6a7fa5f700082ba1bbc3',
          link: '/product/pokiri-iconic-oversized-tee',
          ctaText: 'SOLD OUT',
          price: 699,
          compareAtPrice: 1299,
          aspectRatio: 'portrait',
          active: true,
          order: 2,
        },
        {
          id: 'tile-drop-3',
          title: 'REBEL STAR DARLING OVERSIZED TEE',
          subtitle: '320 GSM Heavyweight Streetwear Fit',
          badge: 'SOLD OUT',
          badgeColor: 'crimson',
          imageUrl: '6a7fa5fb001234ea8799',
          link: '/product/rebel-star-darling-oversized-tee',
          ctaText: 'SOLD OUT',
          price: 699,
          compareAtPrice: 1299,
          aspectRatio: 'portrait',
          active: true,
          order: 3,
        },
        {
          id: 'tile-drop-4',
          title: 'ICON STAR AA RULE OVERSIZED TEE',
          subtitle: '320 GSM Heavyweight Drop-Shoulder Tee',
          badge: 'SOLD OUT',
          badgeColor: 'crimson',
          imageUrl: '/stock/aa-mockup1.webp',
          link: '/product/icon-star-aa-rule-oversized-tee',
          ctaText: 'SOLD OUT',
          price: 699,
          compareAtPrice: 1299,
          aspectRatio: 'portrait',
          active: true,
          order: 4,
        }
      ]
    },
    {
      id: 'section-promo-bento',
      type: 'promo_bento',
      title: 'SPECIAL EDITIONS & COLLABS',
      subtitle: 'LIMITED DROPS',
      badge: 'PROMO BENTO',
      viewAllText: 'SHOP ALL DROPS',
      viewAllLink: '/shop',
      layoutStyle: 'bento',
      active: true,
      order: 4,
      tiles: [
        {
          id: 'tile-promo-1',
          title: 'HEAVYWEIGHT OVERSIZED ESSENTIALS',
          subtitle: 'Crafted with 280 GSM premium French terry and custom silicone badges.',
          tagline: 'PREMIUM LINE',
          badge: 'TRENDING',
          badgeColor: 'lime',
          imageUrl: '6a7fa926003c73611eef',
          link: '/shop',
          ctaText: 'EXPLORE DROP',
          aspectRatio: 'wide',
          active: true,
          order: 1,
        },
        {
          id: 'tile-promo-2',
          title: 'VINTAGE GRAPHIC SERIES',
          subtitle: 'Hand-distressed streetwear graphics inspired by 90s cinema posters.',
          tagline: 'LIMITED EDITION',
          badge: 'EXCLUSIVE',
          badgeColor: 'amber',
          imageUrl: '6a7fa92b001fdc8fc236',
          link: '/shop',
          ctaText: 'SHOP SERIES',
          aspectRatio: 'square',
          active: true,
          order: 2,
        },
        {
          id: 'tile-promo-3',
          title: 'TACTICAL ACCESSORIES',
          subtitle: 'Utility crossbody bags, embroidered snapbacks, and socks.',
          tagline: 'EVERYDAY FIT',
          badge: 'NEW ARRIVAL',
          badgeColor: 'cyan',
          imageUrl: '6a7fa922002c9b023447',
          link: '/shop',
          ctaText: 'VIEW ACCESSORIES',
          aspectRatio: 'square',
          active: true,
          order: 3,
        }
      ]
    }
  ],
  newsletter: {
    active: true,
    title: 'JOIN THE CULTURE',
    subtitle: 'Exclusive drops, early access & more straight to your inbox.',
    badge: 'STAY AHEAD',
    stats: [
      { value: '2,000+', label: 'HAPPY FANS' },
      { value: '4.9/5', label: 'CUSTOMER RATING', highlight: '★★★★★' },
      { value: 'PAN INDIA', label: 'EXPRESS SHIPPING' }
    ]
  },
  lastUpdated: new Date().toISOString()
};

const STORAGE_KEY = 'cc_homepage_cms_v2';

export function getHomepageCMS(): HomepageCMSData {
  if (typeof window === 'undefined') return DEFAULT_HOMEPAGE_CMS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_HOMEPAGE_CMS;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.sections || !Array.isArray(parsed.sections)) {
      return DEFAULT_HOMEPAGE_CMS;
    }
    return parsed;
  } catch (e) {
    console.error('Failed to parse Homepage CMS from localStorage', e);
    return DEFAULT_HOMEPAGE_CMS;
  }
}

export function saveHomepageCMS(data: HomepageCMSData): void {
  if (typeof window === 'undefined') return;
  try {
    const payload = {
      ...data,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    window.dispatchEvent(new Event('homepage-cms-updated'));

    // Persist to Appwrite Database via API
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    fetch('/api/homepage', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    }).catch((err) => console.log('Database homepage save notice:', err));
  } catch (e) {
    console.error('Failed to save Homepage CMS to localStorage', e);
  }
}

export function resetHomepageCMS(): HomepageCMSData {
  if (typeof window === 'undefined') return DEFAULT_HOMEPAGE_CMS;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_HOMEPAGE_CMS));
    window.dispatchEvent(new Event('homepage-cms-updated'));

    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    fetch('/api/homepage', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(DEFAULT_HOMEPAGE_CMS),
    }).catch(() => {});
  } catch (e) {
    console.error('Failed to reset Homepage CMS', e);
  }
  return DEFAULT_HOMEPAGE_CMS;
}

let currentCMSData: HomepageCMSData = DEFAULT_HOMEPAGE_CMS;
if (typeof window !== 'undefined') {
  currentCMSData = getHomepageCMS();
}

function subscribeCMS(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const handleUpdate = () => {
    currentCMSData = getHomepageCMS();
    callback();
  };
  window.addEventListener('homepage-cms-updated', handleUpdate);
  window.addEventListener('storage', handleUpdate);

  // Background fetch from database API to ensure freshest data
  fetch('/api/homepage')
    .then((res) => (res.ok ? res.json() : null))
    .then((json) => {
      if (json && json.success && json.data && json.data.sections) {
        currentCMSData = json.data;
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(json.data));
        } catch {}
        callback();
      }
    })
    .catch(() => {});

  return () => {
    window.removeEventListener('homepage-cms-updated', handleUpdate);
    window.removeEventListener('storage', handleUpdate);
  };
}

function getCMSSnapshot(): HomepageCMSData {
  return currentCMSData;
}

function getCMSServerSnapshot(): HomepageCMSData {
  return DEFAULT_HOMEPAGE_CMS;
}

const emptySubscribe = () => () => {};

export function useHomepageCMS() {
  const data = useSyncExternalStore(subscribeCMS, getCMSSnapshot, getCMSServerSnapshot);
  const isLoaded = useSyncExternalStore(emptySubscribe, () => true, () => false);

  return {
    data,
    isLoaded,
    updateData: (newData: HomepageCMSData) => {
      currentCMSData = newData;
      saveHomepageCMS(newData);
    },
    resetData: () => {
      const reset = resetHomepageCMS();
      currentCMSData = reset;
    }
  };
}
