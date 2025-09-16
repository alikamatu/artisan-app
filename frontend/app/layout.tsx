import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Geist_Mono, Outfit } from "next/font/google";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const outfitFont = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: [ "100", "200", "300", "400", "500", "600", "700", "800", "900" ],
});

export const metadata: Metadata = {
  title: "Artisan - Connect with Skilled Artisans",
  description: "Artisan is the premier marketplace connecting clients with verified, skilled professionals. Find trusted artisans for any job, from home repairs to specialized services.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfitFont.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}