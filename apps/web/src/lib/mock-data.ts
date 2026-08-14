import { Product, Collection, Category } from '@clapculture/shared';

export const STAR_COLLECTIONS = [
  {
    name: 'Pawan Kalyan',
    slug: 'pawan-kalyan',
    title: 'POWER STAR COLLECTION',
    tagline: 'SENANI & OG ERA FITS',
    image: '/pawankalyan.jpeg',
    count: '6 DROPS'
  },
  {
    name: 'Mahesh Babu',
    slug: 'mahesh-babu',
    title: 'MAHESH BABU COLLECTION',
    tagline: 'SUPERSTAR & POKIRI EDITIONS',
    image: '/mahesh-babu.jpeg',
    count: '3 DROPS'
  },
  {
    name: 'Prabhas',
    slug: 'prabhas',
    title: 'PRABHAS COLLECTION',
    tagline: 'REBEL STAR & RAJA SAAB DROPS',
    image: '/prabhas.jpeg',
    count: '2 DROPS'
  },
  {
    name: 'Allu Arjun',
    slug: 'allu-arjun',
    title: 'ALLU ARJUN COLLECTION',
    tagline: 'ICON STAR & PUSHPA 2 EDITION',
    image: '/allu-arjun.jpeg',
    count: '2 DROPS'
  },
  {
    name: 'Ram Charan',
    slug: 'ram-charan',
    title: 'RAM CHARAN COLLECTION',
    tagline: 'GLOBAL STAR GAME CHANGER',
    image: '/ramcharan.jpeg',
    count: '4 DROPS'
  },
  {
    name: 'Jr NTR',
    slug: 'ntr',
    title: 'JR NTR COLLECTION',
    tagline: 'MAN OF MASSES DEVARA',
    image: '/ntr.jpeg',
    count: '4 DROPS'
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'SUPERSTAR MAHESH BABU OVERSIZED TEE',
    slug: 'superstar-mahesh-babu-oversized-tee',
    price: 699,
    compareAtPrice: 1299,
    images: ['/stock/superstar-mockup1.webp', '/stock/superstar-mockup2.webp'],
    description: '320 GSM French Terry heavyweight bio-washed cotton. Official Mahesh Babu Superstar drop-shoulder streetwear tee with high-density puff typography print.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 50,
    badges: ['MAHESH BABU', 'SUPERSTAR', 'IN STOCK', '320 GSM'],
    categoryId: 'c1'
  },
  {
    id: '2',
    name: 'POKIRI ICONIC OVERSIZED TEE',
    slug: 'pokiri-iconic-oversized-tee',
    price: 699,
    compareAtPrice: 1299,
    images: ['/stock/pokiri-mock1.webp', '/stock/pokiri-mock2.webp'],
    description: '320 GSM French Terry heavyweight bio-washed cotton. Mahesh Babu Pokiri era vintage wash oversized streetwear tee.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 0,
    badges: ['MAHESH BABU', 'POKIRI', 'SOLD OUT', '320 GSM'],
    categoryId: 'c1'
  },
  {
    id: '3',
    name: 'SSMB SIGNATURE VINTAGE TEE',
    slug: 'ssmb-signature-vintage-tee',
    price: 699,
    compareAtPrice: 1299,
    images: ['/stock/mb-b1.webp', '/stock/mb-b2.webp'],
    description: '320 GSM French Terry heavyweight bio-washed cotton. Mahesh Babu SSMB signature graphic drop-shoulder tee.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 0,
    badges: ['MAHESH BABU', 'SSMB', 'SOLD OUT', '320 GSM'],
    categoryId: 'c1'
  },
  {
    id: '4',
    name: 'REBEL STAR DARLING OVERSIZED TEE',
    slug: 'rebel-star-darling-oversized-tee',
    price: 699,
    compareAtPrice: 1299,
    images: ['/stock/darling-mockup1.webp', '/stock/darling-mockup2.webp'],
    description: '320 GSM French Terry heavyweight bio-washed cotton. Prabhas Darling era oversized streetwear tee with signature back drop print.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 0,
    badges: ['PRABHAS', 'REBEL STAR', 'SOLD OUT', '320 GSM'],
    categoryId: 'c1'
  },
  {
    id: '5',
    name: 'THE RAJA SAAB VINTAGE TEE',
    slug: 'the-raja-saab-vintage-tee',
    price: 699,
    compareAtPrice: 1299,
    images: ['/stock/rajasaab-mockup1.webp'],
    description: '320 GSM French Terry heavyweight bio-washed cotton. Prabhas The Raja Saab limited drop graphic streetwear tee.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 0,
    badges: ['PRABHAS', 'RAJA SAAB', 'SOLD OUT', '320 GSM'],
    categoryId: 'c1'
  },
  {
    id: '6',
    name: 'ICON STAR AA RULE OVERSIZED TEE',
    slug: 'icon-star-aa-rule-oversized-tee',
    price: 699,
    compareAtPrice: 1299,
    images: ['/stock/aa-mockup1.webp', '/stock/aa-mockup2.webp'],
    description: '320 GSM French Terry heavyweight bio-washed cotton. Allu Arjun AA Rule edition oversized drop-shoulder streetwear tee.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 0,
    badges: ['ALLU ARJUN', 'ICON STAR', 'SOLD OUT', '320 GSM'],
    categoryId: 'c1'
  },
  {
    id: '7',
    name: 'PUSHPA THE RULE DROP SHOULDER TEE',
    slug: 'pushpa-the-rule-drop-shoulder-tee',
    price: 699,
    compareAtPrice: 1299,
    images: ['/stock/aa-mockup3.webp', '/stock/aa-mockup5.webp'],
    description: '320 GSM French Terry heavyweight bio-washed cotton. Allu Arjun Pushpa 2 The Rule high-density graphic streetwear tee.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 0,
    badges: ['ALLU ARJUN', 'PUSHPA', 'SOLD OUT', '320 GSM'],
    categoryId: 'c1'
  }
];

export const MOCK_COLLECTIONS: Collection[] = [
  { id: 'col1', name: 'New Drop', slug: 'new-drop', productIds: ['1', '2', '3', '4', '5', '6', '7'] },
  { id: 'col2', name: 'Pawan Kalyan Collection', slug: 'pawan-kalyan', productIds: ['1'] },
  { id: 'col3', name: 'Mahesh Babu Collection', slug: 'mahesh-babu', productIds: ['1', '2', '3'] },
  { id: 'col4', name: 'Prabhas Collection', slug: 'prabhas', productIds: ['4', '5'] },
  { id: 'col5', name: 'Allu Arjun Collection', slug: 'allu-arjun', productIds: ['6', '7'] },
  { id: 'col6', name: 'Ram Charan Collection', slug: 'ram-charan', productIds: ['1'] },
  { id: 'col7', name: 'Jr NTR Collection', slug: 'ntr', productIds: ['1'] },
  { id: 'col8', name: 'T-Shirts', slug: 't-shirts', productIds: ['1', '2', '3', '4', '5', '6', '7'] },
  { id: 'col9', name: 'Best Sellers', slug: 'best-sellers', productIds: ['1'] },
];

export const MOCK_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Tees', slug: 'tees' },
  { id: 'c2', name: 'Outerwear', slug: 'outerwear' },
  { id: 'c3', name: 'Bottoms', slug: 'bottoms' },
  { id: 'c4', name: 'Headwear', slug: 'headwear' }
];
