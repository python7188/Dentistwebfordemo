import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import FeaturePopup from "@/components/FeaturePopup";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "TOOTHCARE — Premium Dental Hospital",
    template: "%s | TOOTHCARE Dental",
  },
  description:
    "TOOTHCARE is a premium dental hospital offering world-class dental implants, cosmetic dentistry, orthodontics, and emergency care. Book your appointment today.",
  keywords: [
    "best dentist near me",
    "dental implants",
    "cosmetic dentistry",
    "teeth whitening",
    "Invisalign",
    "emergency dentist",
    "family dentistry",
  ],
  openGraph: {
    title: "TOOTHCARE — Premium Dental Hospital",
    description:
      "World-class dental care in a calming, modern environment. Dental implants, cosmetic dentistry, orthodontics & more.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <FloatingCTA />
        <FeaturePopup />
      </body>
    </html>
  );
}
