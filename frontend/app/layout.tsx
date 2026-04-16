import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeCollab - Collab Instantly",
  description: "The no-latency development hub. High-performance peer routing meets direct terminal execution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-black text-white antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
