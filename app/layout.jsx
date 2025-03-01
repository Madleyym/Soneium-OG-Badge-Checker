import "./globals.css";

export const metadata = {
  title: "Soneium OG Badge Checker",
  description: "Check wallet eligibility for Soneium OG Badge",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Simplified meta tags for better compatibility */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
