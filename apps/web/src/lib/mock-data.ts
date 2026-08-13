import { Product, Collection, Category } from '@clapculture/shared';

export const STAR_COLLECTIONS = [
  {
    name: 'Pawan Kalyan',
    slug: 'pawan-kalyan',
    title: 'POWER STAR COLLECTION',
    tagline: 'SENANI & OG ERA FITS',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80',
    count: '12 DROPS'
  },
  {
    name: 'Mahesh Babu',
    slug: 'mahesh-babu',
    title: 'MAHESH BABU COLLECTION',
    tagline: 'PRINCE SLEEK STREETWEAR',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
    count: '10 DROPS'
  },
  {
    name: 'Prabhas',
    slug: 'prabhas',
    title: 'PRABHAS COLLECTION',
    tagline: 'REBEL STAR HEAVYWEIGHT FITS',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
    count: '14 DROPS'
  },
  {
    name: 'Allu Arjun',
    slug: 'allu-arjun',
    title: 'ALLU ARJUN COLLECTION',
    tagline: 'ICON STAR PUSHPA EDITION',
    image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=600&q=80',
    count: '15 DROPS'
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'OG SENANI OVERSIZED TEE',
    slug: 'og-senani-oversized-tee',
    price: 1499,
    compareAtPrice: 1999,
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80'],
    description: 'Pawan Kalyan Senani edition. 240 GSM bio-washed heavy cotton oversized graphic tee.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 50,
    badges: ['PAWAN KALYAN', 'NEW'],
    categoryId: 'c1'
  },
  {
    id: '2',
    name: 'POWER STAR HEAVYWEIGHT HOODIE',
    slug: 'power-star-heavyweight-hoodie',
    price: 2799,
    compareAtPrice: 3499,
    images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80'],
    description: 'Vintage high-density fleece hoodie homage to Power Star Pawan Kalyan.',
    sizes: ['M', 'L', 'XL'],
    stock: 25,
    badges: ['PAWAN KALYAN', 'BEST SELLER'],
    categoryId: 'c2'
  },
  {
    id: '3',
    name: 'PRINCE VINTAGE WASH TEE',
    slug: 'prince-vintage-wash-tee',
    price: 1399,
    compareAtPrice: 1899,
    images: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80'],
    description: 'Mahesh Babu sleek minimalism edition. Hand-washed acid grunge cotton fit.',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 40,
    badges: ['MAHESH BABU', 'NEW'],
    categoryId: 'c1'
  },
  {
    id: '4',
    name: 'SSMB CYBERPUNK CARGO PANTS',
    slug: 'ssmb-cyberpunk-cargo-pants',
    price: 2999,
    images: ['https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80'],
    description: 'Tactical cargo utility designed for modern rebels.',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 30,
    badges: ['MAHESH BABU'],
    categoryId: 'c3'
  },
  {
    id: '5',
    name: 'REBEL STAR SALAAR HOODIE',
    slug: 'rebel-star-salaar-hoodie',
    price: 2999,
    compareAtPrice: 3999,
    images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80'],
    description: 'Prabhas Salaar heavy-duty thermal fleece hoodie with custom back print.',
    sizes: ['M', 'L', 'XL', 'XXL'],
    stock: 35,
    badges: ['PRABHAS', 'LIMITED'],
    categoryId: 'c2'
  },
  {
    id: '6',
    name: 'PUSHPA ICON STAR TEE',
    slug: 'pushpa-icon-star-tee',
    price: 1399,
    compareAtPrice: 1799,
    images: ['https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80'],
    description: 'Allu Arjun Pushpa Rule edition. Bio-washed drop-shoulder streetwear tee.',
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 60,
    badges: ['ALLU ARJUN', 'BEST SELLER'],
    categoryId: 'c1'
  }
];

export const MOCK_COLLECTIONS: Collection[] = [
  { id: 'col1', name: 'New Drop', slug: 'new-drop', productIds: ['1', '3', '6'] },
  { id: 'col2', name: 'Pawan Kalyan Collection', slug: 'pawan-kalyan', productIds: ['1', '2'] },
  { id: 'col3', name: 'Mahesh Babu Collection', slug: 'mahesh-babu', productIds: ['3', '4'] },
  { id: 'col4', name: 'Prabhas Collection', slug: 'prabhas', productIds: ['5'] },
  { id: 'col5', name: 'Allu Arjun Collection', slug: 'allu-arjun', productIds: ['6'] },
  { id: 'col6', name: 'T-Shirts', slug: 't-shirts', productIds: ['1', '3', '6'] },
  { id: 'col7', name: 'Hoodies', slug: 'hoodies', productIds: ['2', '5'] },
  { id: 'col8', name: 'Best Sellers', slug: 'best-sellers', productIds: ['2', '6'] },
];

export const MOCK_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Tees', slug: 'tees' },
  { id: 'c2', name: 'Outerwear', slug: 'outerwear' },
  { id: 'c3', name: 'Bottoms', slug: 'bottoms' },
  { id: 'c4', name: 'Headwear', slug: 'headwear' }
];
