import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Policy | CLAPCULTURE',
  description: 'Delivery timelines, shipping rates, and order processing details for CLAPCULTURE.',
  robots: { index: false, follow: true }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
