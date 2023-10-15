"use cliet";

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
import { ThemeProvider } from "../providers/theme-provider";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "Lonca Store",
  description: "Lonca Store customer dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main className="flex min-h-screen flex-col items-center justify-between p-20">
            <Navbar />
            <div className="flex flex-col items-center justify-center flex-grow">
              {children}
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
