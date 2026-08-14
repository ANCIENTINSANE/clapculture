#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { Client, Databases } = require('node-appwrite');

function loadEnv() {
  const envPath = path.resolve(__dirname, '../apps/web/.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...values] = trimmed.split('=');
        if (key) {
          process.env[key.trim()] = values.join('=').trim().replace(/^["']|["']$/g, '');
        }
      }
    });
  }
}

loadEnv();

const ENDPOINT = process.env.APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID || '6a7dfa97003713198186';
const API_KEY = process.env.APPWRITE_API_KEY || '';
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'clapculture_db';

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);

const HOMEPAGE_CMS_DATA = {
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
        desktopImage: '/herobg1-desktop.png',
        mobileImage: '/herobg1-mobile.png',
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
        desktopImage: '/herobg2-desktop.png',
        mobileImage: '/herobg2-desktop.png',
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
        desktopImage: '/herobg3-desktop.png',
        mobileImage: '/herobg3-desktop.png',
        active: true,
      }
    ],
    sideBanner: {
      active: true,
      badge: 'TRENDING NOW',
      title: 'OVERSIZED COLLECTION',
      description: 'Heavyweight cotton blanks engineered for maximum comfort and durability.',
      imageUrl: '/herobg1-desktop.png',
      link: '/category/tees',
      ctaText: 'SHOP OVERSIZED',
    }
  },
  sections: [
    // 1. Explore The Lineup (Categories)
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
          tagline: 'HEAVYWEIGHT 240-320 GSM',
          badge: 'BESTSELLER',
          badgeColor: 'lime',
          imageUrl: '/herobg1-desktop.png',
          link: '/category/tees',
          ctaText: 'EXPLORE TEES',
          aspectRatio: 'portrait',
          active: true,
          order: 1,
        },
        {
          id: 'tile-cat-2',
          title: 'HOODIES & FLEECE',
          subtitle: 'Premium heavyweight outerwear',
          tagline: 'PREMIUM 380 GSM FLEECE',
          badge: 'WINTER DROP',
          badgeColor: 'cyan',
          imageUrl: '/herobg2-desktop.png',
          link: '/category/outerwear',
          ctaText: 'EXPLORE HOODIES',
          aspectRatio: 'portrait',
          active: true,
          order: 2,
        },
        {
          id: 'tile-cat-3',
          title: 'CARGO PANTS',
          subtitle: 'Tactical cargo utility',
          tagline: 'MULTI-POCKET RELAXED',
          badge: 'TRENDING',
          badgeColor: 'amber',
          imageUrl: '/herobg3-desktop.png',
          link: '/category/bottoms',
          ctaText: 'EXPLORE CARGOS',
          aspectRatio: 'portrait',
          active: true,
          order: 3,
        },
        {
          id: 'tile-cat-4',
          title: 'HEADWEAR',
          subtitle: 'Structured snapbacks & caps',
          tagline: 'EMBROIDERED STREETWEAR',
          badge: 'NEW',
          badgeColor: 'purple',
          imageUrl: '/herobg1-mobile.png',
          link: '/category/headwear',
          ctaText: 'EXPLORE CAPS',
          aspectRatio: 'portrait',
          active: true,
          order: 4,
        }
      ]
    },
    // 2. Explore Star Collection (Tollywood Legends)
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
          imageUrl: '/pawankalyan.jpeg',
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
          imageUrl: '/mahesh-babu.jpeg',
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
          imageUrl: '/prabhas.jpeg',
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
          imageUrl: '/allu-arjun.jpeg',
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
          imageUrl: '/ramcharan.jpeg',
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
          imageUrl: '/ntr.jpeg',
          link: '/shop?star=ntr',
          ctaText: 'VIEW COLLECTION',
          aspectRatio: 'tall',
          active: true,
          order: 6,
        }
      ]
    },
    // 3. Featured Drops
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
          imageUrl: '/stock/superstar-mockup1.webp',
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
          title: 'OG HUNGRY CHEETAH OVERSIZED TEE',
          subtitle: '320 GSM French Terry Blood-Red Typography',
          badge: 'IN STOCK',
          badgeColor: 'lime',
          imageUrl: '/stock/superstar-mockup1.webp',
          link: '/product/og-hungry-cheetah-oversized-tee',
          ctaText: 'SHOP NOW',
          price: 699,
          compareAtPrice: 1299,
          aspectRatio: 'portrait',
          active: true,
          order: 2,
        },
        {
          id: 'tile-drop-3',
          title: 'POKIRI ICONIC OVERSIZED TEE',
          subtitle: '320 GSM Heavyweight Bio-Washed Cotton',
          badge: 'SOLD OUT',
          badgeColor: 'crimson',
          imageUrl: '/stock/pokiri-mock1.webp',
          link: '/product/pokiri-iconic-oversized-tee',
          ctaText: 'SOLD OUT',
          price: 699,
          compareAtPrice: 1299,
          aspectRatio: 'portrait',
          active: true,
          order: 3,
        },
        {
          id: 'tile-drop-4',
          title: 'REBEL STAR DARLING OVERSIZED TEE',
          subtitle: '320 GSM Heavyweight Streetwear Fit',
          badge: 'SOLD OUT',
          badgeColor: 'crimson',
          imageUrl: '/stock/darling-mockup1.webp',
          link: '/product/rebel-star-darling-oversized-tee',
          ctaText: 'SOLD OUT',
          price: 699,
          compareAtPrice: 1299,
          aspectRatio: 'portrait',
          active: true,
          order: 4,
        },
        {
          id: 'tile-drop-5',
          title: 'PUSHPA THE RULE DROP SHOULDER TEE',
          subtitle: '320 GSM High-Density Screenprint Streetwear',
          badge: 'SOLD OUT',
          badgeColor: 'crimson',
          imageUrl: '/stock/aa-mockup3.webp',
          link: '/product/pushpa-the-rule-drop-shoulder-tee',
          ctaText: 'SOLD OUT',
          price: 699,
          compareAtPrice: 1299,
          aspectRatio: 'portrait',
          active: true,
          order: 5,
        },
        {
          id: 'tile-drop-6',
          title: 'POWER STAR SENANI VINTAGE TEE',
          subtitle: '320 GSM Senani Edition Vintage Streetwear',
          badge: 'IN STOCK',
          badgeColor: 'lime',
          imageUrl: '/stock/superstar-mockup2.webp',
          link: '/product/power-star-senani-vintage-tee',
          ctaText: 'SHOP NOW',
          price: 699,
          compareAtPrice: 1299,
          aspectRatio: 'portrait',
          active: true,
          order: 6,
        }
      ]
    },
    // 4. Promo Bento Grid
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
          subtitle: 'Crafted with 320 GSM premium French terry and custom silicone badges.',
          tagline: 'PREMIUM LINE',
          badge: 'TRENDING',
          badgeColor: 'lime',
          imageUrl: '/herobg2-desktop.png',
          link: '/shop',
          ctaText: 'EXPLORE DROP',
          aspectRatio: 'wide',
          active: true,
          order: 1,
        },
        {
          id: 'tile-promo-2',
          title: 'VINTAGE GRAPHIC SERIES',
          subtitle: 'Hand-distressed streetwear graphics inspired by iconic cinema legends.',
          tagline: 'LIMITED EDITION',
          badge: 'EXCLUSIVE',
          badgeColor: 'amber',
          imageUrl: '/herobg3-desktop.png',
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
          imageUrl: '/herobg1-desktop.png',
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
      { value: '10K+', label: 'STREETWEAR COMMUNITY' },
      { value: '320 GSM', label: 'HEAVYWEIGHT FRENCH TERRY' },
      { value: '100%', label: 'BIO-WASHED COTTON' }
    ]
  },
  lastUpdated: new Date().toISOString()
};

async function seedHomepage() {
  console.log('🚀 Seeding Homepage CMS in Appwrite Database...');
  const contentString = JSON.stringify(HOMEPAGE_CMS_DATA);

  try {
    // Check if doc exists
    let docExists = false;
    try {
      await databases.getDocument(DATABASE_ID, 'homepage_sections', 'homepage_config');
      docExists = true;
    } catch {}

    const docPayload = {
      title: 'Homepage Master Configuration',
      subtitle: 'Master CMS',
      type: 'homepage_config',
      content: contentString,
      order: 0,
    };

    if (docExists) {
      await databases.updateDocument(
        DATABASE_ID,
        'homepage_sections',
        'homepage_config',
        docPayload
      );
      console.log('✅ Updated homepage_config document in Appwrite database.');
    } else {
      await databases.createDocument(
        DATABASE_ID,
        'homepage_sections',
        'homepage_config',
        docPayload
      );
      console.log('✅ Created homepage_config document in Appwrite database.');
    }

    console.log(`🎉 Successfully seeded ${HOMEPAGE_CMS_DATA.sections.length} homepage sections:`);
    HOMEPAGE_CMS_DATA.sections.forEach(s => {
      console.log(`   - [${s.type}] ${s.title} (${s.tiles.length} tiles)`);
    });
  } catch (error) {
    console.error('❌ Error seeding homepage CMS:', error.message);
  }
}

seedHomepage();
