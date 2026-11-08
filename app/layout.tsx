import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://indianwok.ca"),
  title: "Indian Wok | Indian-Chinese food in Burnaby",
  description:
    "Family-run Indian-Chinese (Hakka) restaurant at 5212 Kingsway, Burnaby. Dinner Tuesday to Sunday.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-CA">
      <body>{children}</body>
    </html>
  );
}
