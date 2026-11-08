import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/data/site";
import "./globals.css";

// Bricolage Grotesque for headings, served from the site itself (no call to Google at visit time).
const bricolage = localFont({
  src: [
    { path: "../node_modules/@fontsource/bricolage-grotesque/files/bricolage-grotesque-latin-600-normal.woff2", weight: "600" },
    { path: "../node_modules/@fontsource/bricolage-grotesque/files/bricolage-grotesque-latin-800-normal.woff2", weight: "800" },
  ],
  variable: "--font-bricolage",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  keywords: [
    "Indian Chinese food Burnaby",
    "Indian Chinese food Vancouver",
    "Hakka food",
    "Indo-Chinese restaurant",
    "Indian Wok",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.description,
    images: [{ url: "/images/og.jpg", width: 1200, height: 630, alt: "Masala Chicken at Indian Wok" }],
    locale: "en_CA",
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description, images: ["/images/og.jpg"] },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#b3131b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-CA" className={bricolage.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
