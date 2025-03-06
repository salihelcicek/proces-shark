import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar5 } from "@/pagecomponents/HomeNav";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider  } from "@/components/ThemesProvider";
import  Sidebar  from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ProcessShark",
  description: "Mission tracking app",
  icons: {
    icon: "/favicon.png", // ✅ Public klasöründeki favicon'a doğrudan erişiyoruz
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300`}
      >
        <ThemeProvider>
        <Navbar5 />
        <Sidebar/>
        <Toaster position="bottom-left" />
        {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
