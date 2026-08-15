/**
 * One-time script to push the latest DEFAULT_HOMEPAGE_CMS to Appwrite.
 * Run: node apps/web/scripts/sync-homepage-cms.mjs
 */
import { Client, Databases } from 'node-appwrite';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Parse .env.local manually
const envFile = readFileSync(resolve(__dirname, '../.env.local'), 'utf-8');
envFile.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) return;
  const key = trimmed.slice(0, eqIdx).trim();
  const value = trimmed.slice(eqIdx + 1).trim();
  process.env[key] = value;
});

const endpoint = process.env.APPWRITE_ENDPOINT;
const projectId = process.env.APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const dbId = process.env.APPWRITE_DATABASE_ID || 'clapculture_db';

if (!endpoint || !projectId || !apiKey) {
  console.error('Missing Appwrite env vars');
  process.exit(1);
}

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
const databases = new Databases(client);

// Build the CMS payload inline (mirrors DEFAULT_HOMEPAGE_CMS from cms-store.ts)
const DEFAULT_HOMEPAGE_CMS = {
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
          id: 'tile-cat-1', title: 'TEES', subtitle: 'Heavyweight graphic blanks',
          tagline: 'HEAVYWEIGHT 240 GSM', badge: 'BESTSELLER', badgeColor: 'lime',
          imageUrl: '6a7fa922002c9b023447', link: '/category/tees', ctaText: 'EXPLORE TEES',
          aspectRatio: 'portrait', active: true, order: 1,
        },
        {
          id: 'tile-cat-2', title: 'OUTERWEAR', subtitle: 'Fleece hoodies & jackets',
          tagline: 'PREMIUM 380 GSM FLEECE', badge: 'WINTER DROP', badgeColor: 'cyan',
          imageUrl: '6a7fa926003c73611eef', link: '/category/outerwear', ctaText: 'EXPLORE HOODIES',
          aspectRatio: 'portrait', active: true, order: 2,
        },
        {
          id: 'tile-cat-3', title: 'BOTTOMS', subtitle: 'Tactical cargo utility',
          tagline: 'MULTI-POCKET RELAXED', badge: 'TRENDING', badgeColor: 'amber',
          imageUrl: '6a7fa92b001fdc8fc236', link: '/category/bottoms', ctaText: 'EXPLORE CARGOS',
          aspectRatio: 'portrait', active: true, order: 3,
        },
        {
          id: 'tile-cat-4', title: 'HEADWEAR', subtitle: 'Snapbacks & dad caps',
          tagline: 'SIGNATURE CAPS', badge: 'NEW', badgeColor: 'purple',
          imageUrl: '6a7fa922002c9b023447', link: '/category/headwear', ctaText: 'EXPLORE CAPS',
          aspectRatio: 'portrait', active: true, order: 4,
        }
      ]
    },
    {
      id: 'section-star-collection',
      type: 'star_collection',
      title: 'EXPLORE STAR COLLECTIONS',
      subtitle: 'TOLLYWOOD ICONS',
      badge: 'STAR POWER',
      viewAllText: 'VIEW ALL STARS',
      viewAllLink: '/collections',
      layoutStyle: 'grid-3',
      active: true,
      order: 2,
      tiles: [
        {
          id: 'tile-star-1', title: 'Pawan Kalyan', subtitle: 'Power Star Collection',
          tagline: 'SENANI & OG ERA FITS', badge: '8 DROPS', badgeColor: 'lime',
          imageUrl: '6a7fa5f80010fcd2bc85', link: '/shop?star=pawan-kalyan', ctaText: 'VIEW COLLECTION',
          aspectRatio: 'tall', active: true, order: 1,
        },
        {
          id: 'tile-star-2', title: 'Mahesh Babu', subtitle: 'Superstar Collection',
          tagline: 'PRINCE SLEEK STREETWEAR', badge: '10 DROPS', badgeColor: 'lime',
          imageUrl: '6a7fa5f700082ba1bbc3', link: '/shop?star=mahesh-babu', ctaText: 'VIEW COLLECTION',
          aspectRatio: 'tall', active: true, order: 2,
        },
        {
          id: 'tile-star-3', title: 'Prabhas', subtitle: 'Rebel Star Collection',
          tagline: 'REBEL STAR HEAVYWEIGHT FITS', badge: '14 DROPS', badgeColor: 'lime',
          imageUrl: '6a7fa5fb001234ea8799', link: '/shop?star=prabhas', ctaText: 'VIEW COLLECTION',
          aspectRatio: 'tall', active: true, order: 3,
        },
        {
          id: 'tile-star-4', title: 'Allu Arjun', subtitle: 'Icon Star Collection',
          tagline: 'ICON STAR PUSHPA EDITION', badge: '15 DROPS', badgeColor: 'lime',
          imageUrl: '6a7fa5f5002dd6861328', link: '/shop?star=allu-arjun', ctaText: 'VIEW COLLECTION',
          aspectRatio: 'tall', active: true, order: 4,
        },
        {
          id: 'tile-star-5', title: 'Ram Charan', subtitle: 'Global Star Collection',
          tagline: 'GLOBAL STAR GAME CHANGER', badge: '12 DROPS', badgeColor: 'lime',
          imageUrl: '6a7fa5ff00162b33637d', link: '/shop?star=ram-charan', ctaText: 'VIEW COLLECTION',
          aspectRatio: 'tall', active: true, order: 5,
        },
        {
          id: 'tile-star-6', title: 'Jr NTR', subtitle: 'Man of Masses Collection',
          tagline: 'MAN OF MASSES DEVARA', badge: '11 DROPS', badgeColor: 'lime',
          imageUrl: '6a7fa6010011985f8642', link: '/shop?star=ntr', ctaText: 'VIEW COLLECTION',
          aspectRatio: 'tall', active: true, order: 6,
        }
      ]
    },
    {
      id: 'section-featured-drops',
      type: 'featured_drops',
      title: 'FEATURED DROPS',
      subtitle: 'CURATED SELECTION',
      badge: 'CURATED SELECTION',
      viewAllText: 'SHOP ALL DROPS',
      viewAllLink: '/shop',
      layoutStyle: 'grid-4',
      active: true,
      order: 3,
      tiles: [
        {
          id: 'tile-drop-1', title: 'SUPERSTAR MAHESH BABU OVERSIZED TEE',
          subtitle: '320 GSM Heavyweight French Terry Cotton',
          badge: 'IN STOCK', badgeColor: 'lime',
          imageUrl: 'superstar-mockup1', link: '/product/superstar-mahesh-babu-oversized-tee',
          ctaText: 'SHOP NOW', price: 699, compareAtPrice: 1299,
          aspectRatio: 'portrait', active: true, order: 1,
        },
        {
          id: 'tile-drop-2', title: 'POKIRI ICONIC OVERSIZED TEE',
          subtitle: '320 GSM Heavyweight Bio-Washed Cotton',
          badge: 'SOLD OUT', badgeColor: 'crimson',
          imageUrl: 'pokiri-mock1', link: '/product/pokiri-iconic-oversized-tee',
          ctaText: 'SOLD OUT', price: 699, compareAtPrice: 1299,
          aspectRatio: 'portrait', active: true, order: 2,
        },
        {
          id: 'tile-drop-3', title: 'REBEL STAR DARLING OVERSIZED TEE',
          subtitle: '320 GSM Heavyweight Streetwear Fit',
          badge: 'SOLD OUT', badgeColor: 'crimson',
          imageUrl: 'darling-mockup1', link: '/product/rebel-star-darling-oversized-tee',
          ctaText: 'SOLD OUT', price: 699, compareAtPrice: 1299,
          aspectRatio: 'portrait', active: true, order: 3,
        },
        {
          id: 'tile-drop-4', title: 'ICON STAR AA RULE OVERSIZED TEE',
          subtitle: '320 GSM Heavyweight Drop-Shoulder Tee',
          badge: 'SOLD OUT', badgeColor: 'crimson',
          imageUrl: 'aa-mockup1', link: '/product/icon-star-aa-rule-oversized-tee',
          ctaText: 'SOLD OUT', price: 699, compareAtPrice: 1299,
          aspectRatio: 'portrait', active: true, order: 4,
        }
      ]
    }
  ],
  newsletter: {
    active: true,
    title: 'JOIN THE MOVEMENT',
    subtitle: 'GET 10% OFF YOUR FIRST ORDER',
    description: 'Sign up for exclusive drops, behind-the-scenes content, and members-only discounts.',
    badge: 'STAY AHEAD',
    stats: [
      { value: '2,000+', label: 'HAPPY FANS' },
      { value: '4.9/5', label: 'CUSTOMER RATING', highlight: '★★★★★' },
      { value: 'PAN INDIA', label: 'EXPRESS SHIPPING' }
    ]
  },
  lastUpdated: new Date().toISOString()
};

async function syncCMS() {
  const contentString = JSON.stringify(DEFAULT_HOMEPAGE_CMS);
  console.log('📦 Pushing updated DEFAULT_HOMEPAGE_CMS to Appwrite...');
  console.log(`   DB: ${dbId}, Collection: homepage_sections, Doc: homepage_config`);
  console.log(`   Payload size: ${(contentString.length / 1024).toFixed(1)} KB`);

  try {
    await databases.updateDocument(dbId, 'homepage_sections', 'homepage_config', {
      type: 'homepage_config',
      title: 'Homepage Configuration',
      content: contentString,
      order: 0,
    });
    console.log('✅ Updated existing homepage_config document.');
  } catch {
    try {
      await databases.createDocument(dbId, 'homepage_sections', 'homepage_config', {
        type: 'homepage_config',
        title: 'Homepage Configuration',
        content: contentString,
        order: 0,
      });
      console.log('✅ Created new homepage_config document.');
    } catch (err) {
      console.error('❌ Failed to create/update homepage_config:', err);
      process.exit(1);
    }
  }

  console.log('🎉 Done! The bootstrap API will now serve the updated CMS data.');
}

syncCMS();
