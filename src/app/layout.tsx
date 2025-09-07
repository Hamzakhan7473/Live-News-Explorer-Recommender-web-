import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Live News Explorer",
  description: "Personalized news with transparent ranking - powered by NYT APIs and LinUCB bandit algorithm",
  keywords: ["news", "personalization", "NYT", "recommendation", "transparency"],
  authors: [{ name: "Hamza Khan" }],
  openGraph: {
    title: "Live News Explorer",
    description: "Personalized news with transparent ranking",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
