import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy | CLAPCULTURE',
  description: 'Read the official refund and cancellation policy for CLAPCULTURE orders.',
  robots: { index: false, follow: true }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
