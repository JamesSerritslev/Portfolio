import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import { HomeScrollGuard } from "@/components/HomeScrollGuard";
import { PageTransition } from "@/components/PageTransition";
import "./globals.css";
import { getMetadataBase } from "@/lib/site";
import { cn } from "@/lib/utils";

const ogImage = {
  url: "/opengraph.png",
  width: 1200,
  height: 630,
  alt: "James's Portfolio",
  type: "image/png",
} as const;

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: "James's Portfolio",
    template: "%s | James's Portfolio",
  },
  description:
    "I build fast, content-managed websites for clients who care about design.",
  openGraph: {
    title: "James's Portfolio",
    siteName: "James's Portfolio",
    type: "website",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "James's Portfolio",
    images: [ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(dmSans.variable, dmSerif.variable, "overflow-x-hidden")}>
      <body className="min-h-screen overflow-x-hidden bg-black font-sans text-white antialiased">
        <HomeScrollGuard />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
