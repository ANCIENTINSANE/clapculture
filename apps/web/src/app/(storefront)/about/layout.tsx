import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | CLAPCULTURE',
  description: 'Learn about the story behind CLAPCULTURE. We craft premium streetwear for the rebels, the dreamers, and the doers.',
  keywords: ['about clapculture', 'streetwear brand story', 'premium fashion brand india', 'clothing brand vision'],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
