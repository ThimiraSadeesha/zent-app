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
  title: "ZENT | Server Monitoring & Docker Management",
  description:
    "Monitor server resources, manage Docker containers, and control remote servers via SSH in real time. A lightweight server management dashboard by Lumiraq.",
  keywords: [
    "server monitoring",
    "docker management",
    "SSH management",
    "server manager",
    "monitor server",
    "manage docker containers",
    "docker dashboard",
    "remote server monitoring",
    "server resources",
    "cpu monitoring",
    "memory usage",
    "disk usage",
    "uptime monitoring",
    "zent",
    "lumiraq",
    "server dashboard",
    "linux server monitor",
    "container management",
  ],
  authors: [{ name: "Lumiraq Team" }],
  creator: "Lumiraq",
  openGraph: {
    type: "website",
    title: "ZENT | Server Monitoring & Docker Management",
    description:
      "Real-time server monitoring and Docker container management via SSH. Built by Lumiraq.",
    siteName: "ZENT",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZENT | Server Monitoring & Docker Management",
    description:
      "Real-time server monitoring and Docker container management via SSH. Built by Lumiraq.",
  },
  robots: {
    index: true,
    follow: true,
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
