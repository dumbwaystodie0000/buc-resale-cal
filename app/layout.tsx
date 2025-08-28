import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BUC Resale Calculator",
  description:
    "Calculate property investment returns and analyze real estate opportunities",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-oid="s61mlmx">
      <body className="" data-oid="ulpte7r">
        {children}
      </body>
    </html>
  );
}
