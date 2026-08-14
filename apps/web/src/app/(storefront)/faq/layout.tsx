import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ | CLAPCULTURE',
  description: 'Frequently asked questions about orders, sizing, drops, and payments at CLAPCULTURE.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
