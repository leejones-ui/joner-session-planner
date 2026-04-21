import type { Metadata, Viewport } from "next";
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://joner-session-planner.vercel.app";

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Joner Session Planner",
    template: "%s, Joner Session Planner",
  },
  description: "AI session planning for football coaches. Prompt, generate, diagram, share.",
  applicationName: "Joner Session Planner",
  authors: [{ name: "Joner Football", url: "https://jonerfootball.com" }],
  creator: "Joner Football",
  openGraph: {
    type: "website",
    siteName: "Joner Session Planner",
    title: "Joner Session Planner",
    description: "AI session planning for football coaches. Built by Joner Football.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Joner Session Planner",
    description: "AI session planning for football coaches. Built by Joner Football.",
    creator: "@jonerfootball",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
