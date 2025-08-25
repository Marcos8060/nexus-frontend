import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { ReduxProvider } from "./providers";

export const metadata: Metadata = {
  title: "Nexus",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
