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
  metadataBase: new URL("https://zent.lumiraq.com"),
  title: {
    default: "ZENT | Server Monitoring & Docker Management Dashboard",
    template: "%s | ZENT by Lumiraq",
  },
  description:
    "Monitor server resources, manage Docker containers, and control remote Linux servers via SSH in real time. A lightweight open-source server management dashboard by Lumiraq.",
  keywords: [
    "server monitoring",
    "server monitor",
    "docker management",
    "docker container manager",
    "SSH server management",
    "manage docker containers",
    "docker dashboard",
    "remote server monitoring",
    "linux server monitor",
    "server resources dashboard",
    "cpu monitoring",
    "memory usage monitor",
    "disk usage tracker",
    "uptime monitoring",
    "container management tool",
    "real-time server stats",
    "server management tool",
    "zent",
    "lumiraq",
    "zent dashboard",
  ],
  authors: [{ name: "Lumiraq Team", url: "https://lumiraq.com" }],
  creator: "Lumiraq",
  publisher: "Lumiraq",
  applicationName: "ZENT",
  category: "Technology",
  openGraph: {
    type: "website",
    url: "https://zent.lumiraq.com",
    title: "ZENT | Server Monitoring & Docker Management Dashboard",
    description:
      "Real-time server monitoring and Docker container management via SSH. A lightweight dashboard by Lumiraq.",
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
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
  alternates: {
    canonical: "https://zent.lumiraq.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://zent.lumiraq.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
