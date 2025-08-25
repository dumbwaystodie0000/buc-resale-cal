import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-oid="-0agul3">
      <head data-oid="uy_hn2r">
        <style data-oid="kxp9861">{`
html {
  font-family: ${roboto.style.fontFamily};
  --font-roboto: ${roboto.variable};
}
        `}</style>
      </head>
      <body className={roboto.className} data-oid="dhkhh_n">
        {children}
      </body>
    </html>
  );
}
