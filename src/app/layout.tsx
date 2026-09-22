import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#f2ebd9",
};

export const metadata: Metadata = {
  title: {
    default: "Club Nonna",
    template: "%s · Club Nonna",
  },
  description:
    "Programa de visitas de Los Pastes de Nonna en Oaxaca de Juárez. Junta 5 visitas y llévate un paste de regalo.",
  applicationName: "Club Nonna",
  metadataBase: new URL("https://club.lospastesdenona.com"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    title: "Club Nonna",
    statusBarStyle: "default",
  },
  other: {
    "msapplication-TileColor": "#f2ebd9",
    "msapplication-TileImage": "/mstile-150x150.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-MX"
      className={`${sourceSans.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-cream font-sans text-navy">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
