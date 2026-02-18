import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
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
        "docker dashboard",
        "server monitoring tool",
        "linux server monitoring",
        "docker container manager",
        "remote server monitoring",
        "server management tool",
        "real-time docker monitoring",
        "SSH server management tool",
        "self-hosted server monitoring",
        "lightweight docker dashboard",
        "open source server monitoring",
        "cpu memory disk monitoring",
        "linux uptime monitoring",
        "zent dashboard",
        "zent by lumiraq"
    ],
    authors: [{name: "Lumiraq Team", url: "https://lumiraq.com"}],
    creator: "Lumiraq",
    publisher: "Lumiraq",
    applicationName: "ZENT",
    category: "Technology",
    openGraph: {
        type: "website",
        title: {
            default: "Docker Dashboard & Linux Server Monitoring Tool | ZENT",
            template: "%s | ZENT by Lumiraq",
        },
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
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "ZENT",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Linux",
        url: "https://zent.lumiraq.com",
        description: "Real-time server monitoring and Docker container management via SSH.",
        author: {
            "@type": "Organization",
            name: "Lumiraq",
            url: "https://lumiraq.com",
        },
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
    };

    return (
        <html lang="en">
        <head>
            <link rel="canonical" href="https://zent.lumiraq.com" />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
        </head>
        <meta name="google-site-verification" content="l0mNt5Cd1QvOsWvEnMPq1A5mHCSvSxbt0gwFJzkrQx0" />
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        {children}
        </body>
        </html>
    );
}
