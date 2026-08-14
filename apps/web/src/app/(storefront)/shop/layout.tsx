import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop All | CLAPCULTURE Premium Streetwear',
  description: 'Explore the full collection of CLAPCULTURE streetwear. Exclusive oversized tees, hoodies, headwear, and limited drops.',
  keywords: ['shop streetwear', 'oversized t-shirts', 'streetwear drops', 'premium clothing', 'hypebeast fashion', 'buy streetwear online india'],
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
