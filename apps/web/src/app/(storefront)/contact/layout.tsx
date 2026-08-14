import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | CLAPCULTURE',
  description: 'Get in touch with the CLAPCULTURE support team for order queries, collaborations, and assistance.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
