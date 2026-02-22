import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PhishX | AI-Powered Phishing Detector",
  description: "Unmask suspicious domains and protect your digital identity with PhishX's advanced heuristic and AI-driven threat intelligence.",
  keywords: ["phishing detector", "domain analyzer", "AI security", "cybersecurity", "threat intelligence"],
  authors: [{ name: "PhishX Team" }],
  openGraph: {
    title: "PhishX | AI-Powered Phishing Detector",
    description: "Unmask suspicious domains and protect your digital identity with PhishX's advanced threat intelligence.",
    url: "https://threatdetector.vercel.app",
    siteName: "PhishX",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PhishX Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PhishX | AI-Powered Phishing Detector",
    description: "Unmask suspicious domains and protect your digital identity with PhishX.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
