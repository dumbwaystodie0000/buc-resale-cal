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
    <html lang="en" data-oid="85jhk72">
      <head data-oid="9brt3--">
        <style data-oid="swu:.nu">{`
html {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
}
        `}</style>
      </head>
      <body className="" data-oid="9w-i-7">
        {children}
      </body>
    </html>
  );
}
