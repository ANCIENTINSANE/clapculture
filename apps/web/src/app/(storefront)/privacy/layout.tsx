import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | CLAPCULTURE',
  description: 'How CLAPCULTURE handles and protects your personal data and privacy.',
  robots: { index: false, follow: true }
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
