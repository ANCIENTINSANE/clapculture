import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Star Collections | CLAPCULTURE',
  description: 'Explore curated drops and premium star collections from CLAPCULTURE. Hand-picked streetwear sets for the bold.',
  keywords: ['streetwear collections', 'curated outfits', 'exclusive drops', 'hype fashion collections', 'clapculture star collections'],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
