import "@/styles/globals.css";

import { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";

import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { SessionProvider } from "@/providers/session-provider";

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
      <body className={cn("dark min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <SessionProvider>{children}</SessionProvider>
        <Toaster />
      </body>
    </html>
  );
}
