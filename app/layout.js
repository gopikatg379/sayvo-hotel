import "./globals.css";
import { siteConfig } from "@/lib/config";
import ScrollToTop from "@/components/ScrollToTop";
export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: "Stayvo Kochi | Comfort in the Heart of Kochi", template: "%s | Stayvo Kochi" },
  description: "A welcoming Kochi hotel by Maprani Group. Explore double rooms and family suites, seasonal rates, stay packages and WhatsApp enquiries.",
  openGraph: { title: "Stayvo Kochi", description: siteConfig.tagline, type: "website", url: siteConfig.url, images: ["/images/stayvo/entrance.jpeg"] },
  twitter: { card: "summary_large_image", title: "Stayvo Kochi", description: siteConfig.tagline, images: ["/images/stayvo/entrance.jpeg"] },
};
export default function RootLayout({ children }) { return <html lang="en" data-scroll-behavior="smooth"><body><ScrollToTop />{children}</body></html>; }
