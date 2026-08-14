import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | CLAPCULTURE',
  description: 'Terms of service and user agreements for shopping at CLAPCULTURE.',
  robots: { index: false, follow: true }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
