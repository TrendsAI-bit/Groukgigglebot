import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Grouk — Grok, but giggly",
  description: "A parody chat assistant that tries to make you laugh, then helps.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
