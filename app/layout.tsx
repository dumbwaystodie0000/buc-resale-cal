import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Property Calculator",
  description:
    "Calculate property investment returns and analyze real estate opportunities",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-oid="s61mlmx">
      <head data-oid="ww62mmi">
        <style data-oid="gduxlcd">{`
html {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
}
        `}</style>
      </head>
      <body className="" data-oid="ulpte7r">
        {children}
      </body>
    </html>
  );
}
