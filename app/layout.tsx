import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({ 
  weight: ['300', '400', '600'],
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Fahmid | Product Engineer & Designer",
  description: "Portfolio of Fahmid, a Product Engineer & Designer specializing in innovative solutions at the intersection of technology and design.",
  keywords: "Fahmid, Product Engineer, Designer, Blockchain, AI, NextJS, Portfolio",
  authors: [{ name: "Fahmid" }],
  openGraph: {
    title: "Fahmid | Product Engineer & Designer",
    description: "Innovative solutions at the intersection of technology and design",
    url: "https://fahmid.dev",
    siteName: "Fahmid's Portfolio",
    images: [
      {
        url: "/images/og-image.jpg", // Make sure to add this image to your public folder
        width: 1200,
        height: 630,
        alt: "Fahmid - Product Engineer & Designer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fahmid | Product Engineer & Designer",
    description: "Innovative solutions at the intersection of technology and design",
    creator: "@hellofahmid",
    images: ["/images/twitter-image.jpg"], // Make sure to add this image to your public folder
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        {children}
      </body>
    </html>
  );
}