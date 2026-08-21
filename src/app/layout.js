import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Shama Basecamp — A Himalayan Village Retreat | Kumaon, Uttarakhand",
  description:
    "Escape to Shama Basecamp, an eco-friendly nature retreat nestled at 2,100m in the Kumaon Himalayas. Experience stone cottages, Himalayan trails, village cuisine, and breathtaking mountain views in Shama Village, Bageshwar, Uttarakhand.",
  keywords: [
    "Shama Basecamp",
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
    title: "Shama Basecamp — A Himalayan Village Retreat",
    description:
      "An eco-friendly nature retreat at 2,100m in the Kumaon Himalayas. Stone cottages, mountain views, village life.",
    type: "website",
    locale: "en_IN",
    siteName: "Shama Basecamp",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${plusJakarta.variable}`}>
        {children}
      </body>
    </html>
  );
}
