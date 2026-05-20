import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "James Serritslev",
    template: "%s | James Serritslev",
  },
  description:
    "I build fast, content-managed websites for clients who care about design.",
  openGraph: {
    title: "James Serritslev",
    siteName: "James Serritslev",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "James Serritslev",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(dmSans.variable, dmSerif.variable)}>
      <body className="min-h-screen overflow-x-hidden bg-black font-sans text-white antialiased">
        {children}
      </body>
    </html>
  );
}
