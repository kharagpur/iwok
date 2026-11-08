import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/data/site";
import "./globals.css";

// Fraunces for headings, served from the site itself (no call to Google at visit time).
const fraunces = localFont({
  src: [
    { path: "../node_modules/@fontsource/fraunces/files/fraunces-latin-500-normal.woff2", weight: "500" },
    { path: "../node_modules/@fontsource/fraunces/files/fraunces-latin-700-normal.woff2", weight: "700" },
  ],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: "Indian Wok | Indian-Chinese food in Burnaby",
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: "Indian Wok | Indian-Chinese food in Burnaby",
    description: site.description,
    images: [{ url: "/images/og.jpg", width: 1200, height: 630, alt: "Dishes from Indian Wok" }],
    locale: "en_CA",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2f4a14",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-CA" className={fraunces.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
