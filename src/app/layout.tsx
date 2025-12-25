import type { Metadata } from "next";
import { Fraunces, Source_Serif_4, Caveat } from "next/font/google";
import "./globals.css";
import Analytics from "@/components/Analytics";
import CookieBanner from "@/components/CookieBanner";

// Display font: Fraunces - warm editorial serif with personality (TrueBrew Design System)
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fraunces",
  display: "swap",
});

// Body font: Source Serif 4 - readable editorial serif (TrueBrew Design System)
const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-source-serif",
  display: "swap",
});

// Accent font: Caveat - handwritten warmth for Nora's personal touches
const caveat = Caveat({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://easytocookmeals.com'),
  title: {
    default: "Easy to Cook Meals - Vegan Recipes by Nora",
    template: "%s | Easy to Cook Meals"
  },
  description: "Discover authentic vegan recipes from Nora, a digital nomad chef traveling the world. Plant-based cooking made easy with Middle Eastern flavors, global inspiration, and stories from Tel Aviv to your kitchen.",
  keywords: [
    "vegan recipes",
    "plant-based cooking",
    "middle eastern food",
    "israeli cuisine",
    "authentic falafel",
    "vegan chef",
    "digital nomad recipes",
    "easy vegan meals",
    "mediterranean vegan",
    "travel inspired recipes"
  ],
  authors: [{ name: "Nora", url: "https://easytocookmeals.com/about" }],
  creator: "Nora",
  openGraph: {
    title: "Easy to Cook Meals - Vegan Recipes by Nora",
    description: "Plant-based recipes with heart, inspired by travels and traditions from Tel Aviv to kitchens around the world.",
    type: "website",
    locale: "en_US",
    url: "https://easytocookmeals.com",
    siteName: "Easy to Cook Meals",
    images: [
      {
        url: "/images/brand/logo.png",
        width: 400,
        height: 140,
        alt: "Easy to Cook Meals Logo"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Easy to Cook Meals - Vegan Recipes by Nora",
    description: "Plant-based recipes with heart, inspired by travels from around the world.",
    creator: "@easytocookmeals",
    images: ["/images/brand/logo.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${sourceSerif.variable} ${caveat.variable}`}>
      <body className="antialiased">
        <Analytics />
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
