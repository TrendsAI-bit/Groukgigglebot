import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Grouk — Grok, but giggly",
  description: "A parody chat assistant that tries to make you laugh, then helps.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&family=Caveat:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen antialiased font-kalam">
        {children}
      </body>
    </html>
  );
}
