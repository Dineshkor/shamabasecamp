import { Cormorant_Garamond, Plus_Jakarta_Sans, Playfair_Display, Caveat } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Shama Brews and Base — A Himalayan Village Retreat & Mountain Brews | Kumaon, Uttarakhand",
  description:
    "Escape to Shama Brews and Base, an eco-friendly nature retreat nestled at 2,100m in the Kumaon Himalayas. Experience artisanal mountain brews, stone cottages, Himalayan trails, village cuisine, and breathtaking mountain views in Shama Village, Bageshwar, Uttarakhand.",
  keywords: [
    "Shama Brews and Base",
    "Shama Basecamp",
    "Himalayan brews",
    "Kumaon Himalayas",
    "eco retreat",
    "nature stay",
    "Bageshwar",
    "Uttarakhand",
    "mountain retreat",
    "village homestay",
    "Himalayan tourism",
    "off-grid stay",
  ],
  openGraph: {
    title: "Shama Brews and Base — A Himalayan Village Retreat & Mountain Brews",
    description:
      "An eco-friendly nature retreat and mountain brews at 2,100m in the Kumaon Himalayas. Stone cottages, mountain views, village life.",
    type: "website",
    locale: "en_IN",
    siteName: "Shama Brews and Base",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${playfair.variable} ${caveat.variable} ${plusJakarta.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
