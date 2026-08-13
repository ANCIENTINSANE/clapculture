import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { OrderStoreProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "CLAPCULTURE - Premium Streetwear",
  description: "Premium streetwear for the rebels, the dreamers & the doers.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark antialiased">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&amp;family=Inter:wght@400;500;700&amp;family=Space+Grotesk:wght@700&amp;display=swap" rel="stylesheet" />
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
