import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "口コミ収集アンケート",
    description: "店舗・事務所の口コミ収集をサポートするアンケートアプリケーションです。",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja">
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}
