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

export const metadata: Metadata = {
  title: {
    default: "James Serritslev — Developer Portfolio",
    template: "%s | James Serritslev",
  },
  description:
    "I build fast, content-managed websites for clients who care about design.",
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
