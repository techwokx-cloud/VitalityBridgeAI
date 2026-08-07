import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VitalityBridge — AI for life's real moments",
  description:
    "VitalityBridge helps you navigate the moments in life that don't come with instructions. Talk through what's happening, understand it, and find your next step.",
  keywords: [
    "AI companion",
    "life navigation",
    "relationships",
    "family",
    "mental wellness",
  ],
  openGraph: {
    title: "VitalityBridge",
    description: "AI for life's real moments",
    url: "https://vitalitybridge.app",
    siteName: "VitalityBridge",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
