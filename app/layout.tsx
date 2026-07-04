import type { Metadata } from "next";
import { Fredoka, DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { MaterialProvider } from "@/components/md/MaterialProvider";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CreatorByte — Make money doing what you love",
  description:
    "Sell digital products, lock premium content and get paid. The creator monetization platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fredoka.variable} ${dmSans.variable}`}
    >
      <head>
        {/* Material Symbols powers <md-icon> glyphs */}
        {/* display=block is correct for icon fonts: avoids flashing raw ligature text */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font, @next/next/google-font-display -- App Router root layout applies to all routes; block is right for icon fonts */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
      </head>
      <body className="min-h-full">
        <ThemeProvider>
          <MaterialProvider>{children}</MaterialProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
