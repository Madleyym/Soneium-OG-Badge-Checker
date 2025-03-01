import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Soneium OG Badge Checker",
  description: "Check if your wallet is eligible for the Soneium OG Badge",
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-icon.png" }],
  },
  // Add viewport information back to metadata
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Ensure favicon is loaded explicitly */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>{children}</body>
    </html>
  );
}
