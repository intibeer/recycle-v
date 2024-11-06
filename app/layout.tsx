import localFont from "next/font/local";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import HeaderNav from "@/components/ui/HeaderNav";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${openSans.variable} antialiased min-h-screen flex flex-col bg-print-pattern">`}
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
