import type { Metadata } from "next";
import { Cormorant, Work_Sans, Courier_Prime } from "next/font/google";
import "./globals.css";

const display = Cormorant({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const body = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const mono = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = "https://www.meridianstudio.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Meridian | Çağdaş Kadın Giyim",
    template: "%s | Meridian",
  },
  description:
    "Meridian — sınırlı sayıda üretilen, mevsimsiz kadın giyim koleksiyonu. Güvenli ödeme, hesabınızdan sipariş takibi.",
  keywords: ["kadın giyim", "butik moda", "tasarım koleksiyon", "Meridian"],
  authors: [{ name: "Meridian Studio" }],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: siteUrl,
    siteName: "Meridian",
    title: "Meridian | Çağdaş Kadın Giyim",
    description: "Sınırlı sayıda üretilen, mevsimsiz kadın giyim koleksiyonu.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meridian | Çağdaş Kadın Giyim",
    description: "Sınırlı sayıda üretilen, mevsimsiz kadın giyim koleksiyonu.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="font-body text-ink antialiased">{children}</body>
    </html>
  );
}
