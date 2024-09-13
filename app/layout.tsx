import type { Metadata } from "next";
import localFont from "next/font/local";
import { Open_Sans } from "next/font/google"; // Import Open Sans
import "./globals.css";
import HeaderNav from "@/components/ui/HeaderNav";
import Script from "next/script";
import Head from "next/head";
import Footer from "@/components/ui/Footer";

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

// Load Open Sans font
const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

// Define metadata using Next.js Metadata API
export const metadata: Metadata = {
  title: "Recycle.co.uk | Used Item Search Engine",
  description: "Find used objects from various marketplaces all at once.",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
    other: {
      rel: "mask-icon",
      url: "/icons/safari-pinned-tab.svg",
      color: "#5bbad5",
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
      <Head>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-MK0WETNJGT"
        strategy="afterInteractive"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MK0WETNJGT');
          `,
        }}
      />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${openSans.variable} antialiased min-h-screen flex flex-col`}
      >
        <main className="flex-grow">
          <HeaderNav />
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}