import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { OrderStoreProvider } from "@/lib/store";

export const metadata: Metadata = {
  metadataBase: new URL('https://clapculture.com'),
  title: {
    default: "CLAPCULTURE | Premium Streetwear",
    template: "%s | CLAPCULTURE"
  },
  description: "Premium streetwear for the rebels, the dreamers & the doers. Shop exclusive drops, oversized tees, hoodies, and headwear.",
  keywords: ["streetwear", "premium streetwear", "oversized tees", "streetwear brand india", "hypebeast", "tollywood streetwear", "luxury streetwear", "clapculture", "clap culture", "street fashion", "exclusive drops", "hoodies"],
  authors: [{ name: "ClapCulture" }],
  creator: "ClapCulture",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://clapculture.com",
    title: "CLAPCULTURE | Premium Streetwear",
    description: "Premium streetwear for the rebels, the dreamers & the doers. Shop exclusive drops, oversized tees, hoodies, and headwear.",
    siteName: "CLAPCULTURE",
    images: [{
      url: "/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "CLAPCULTURE Premium Streetwear"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: "CLAPCULTURE | Premium Streetwear",
    description: "Premium streetwear for the rebels, the dreamers & the doers.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark antialiased">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;700&family=Space+Grotesk:wght@700&display=swap"
        />
      </head>
      <body className="bg-background text-on-background font-body-sm overflow-x-hidden selection:bg-electric-lime selection:text-black min-h-full flex flex-col">
        <div className="noise-overlay"></div>
        <CartProvider>
          <OrderStoreProvider>
            {children}
            <CartDrawer />
          </OrderStoreProvider>
        </CartProvider>
      </body>
    </html>
  );
}
