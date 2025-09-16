import { Geist_Mono, Outfit } from "next/font/google";

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const outfitFont = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: [ "100", "200", "300", "400", "500", "600", "700", "800", "900" ],
});
