import "@/styles/globals.css";

import { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";

import { cn } from "@/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "FTask Management",
  description: "Manage and participate in projects easily.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("dark min-h-screen bg-background font-sans antialiased", fontSans.variable)}>{children}</body>
    </html>
  );
}
