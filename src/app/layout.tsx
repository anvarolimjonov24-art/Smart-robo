import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/context/I18nContext";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
    title: "Smart-Robo - SaaS Platform",
    description: "Advanced E-commerce SaaS solution for Telegram",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="uz">
            <body className={inter.className}>
                <I18nProvider>
                    {children}
                </I18nProvider>
            </body>
        </html>
    );
}
