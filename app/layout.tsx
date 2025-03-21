import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import "./globals.css";
import HeaderNav from "@/components/ui/HeaderNav";
import Footer from "@/components/ui/Footer";
import ConstructionBanner from "@/components/ui/ConstructionBanner";


// Define local fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Add Panton Black Caps font
const pantonBlackCaps = localFont({
  src: "./fonts/Panton-BlackCaps.otf",
  variable: "--font-panton-black-caps",
  weight: "900",
  display: "swap",
});

// Load Inter font for body text
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Define metadata using Next.js Metadata API
export const metadata: Metadata = {
  title: "Recycle.co.uk | Find Free & Pre-Loved Items",
  description: "Search multiple marketplaces at once for free and second-hand items. Find freebies, save money, and help the environment by giving pre-loved items a new home.",
  keywords: "free items, freebies, recycling, second-hand, used items, pre-loved, marketplace search, sustainable shopping, eco-friendly, reuse, free stuff",
  authors: [{ name: "Recycle.co.uk Team" }],
  openGraph: {
    title: "Recycle.co.uk | Find Free & Pre-Loved Items",
    description: "Search multiple marketplaces at once for free and second-hand items. Find freebies, save money, and help the environment by giving pre-loved items a new home.",
    url: "https://recycle.co.uk",
    siteName: "Recycle.co.uk",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Recycle.co.uk - Find free and pre-loved items across multiple marketplaces"
      }
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Recycle.co.uk | Find Free & Pre-Loved Items",
    description: "Search multiple marketplaces at once for free and second-hand items. Find freebies and help the environment.",
    images: ["/twitter-image.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
    other: {
      rel: "mask-icon",
      url: "/icons/safari-pinned-tab.svg",
      color: "#328665",
    },
  },
  manifest: "/icons/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${pantonBlackCaps.variable} font-body antialiased min-h-screen flex flex-col bg-recycling-pattern`}
      >
        <ConstructionBanner />
        <main className="flex-grow">
          <HeaderNav />
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
