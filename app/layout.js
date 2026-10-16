import "./globals.css";
import { siteConfig } from "@/lib/config";
import ScrollToTop from "@/components/ScrollToTop";
export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: "Stayvo Kochi | Comfort in the Heart of Kochi", template: "%s | Stayvo Kochi" },
  description: "Stay in central Kochi, within walking distance of South Railway Station, the Metro and Medical Trust Hospital. Near Cochin Shipyard, colleges and shopping, with rooms for couples and larger families.",
  openGraph: { title: "Stayvo Kochi", description: siteConfig.tagline, type: "website", url: siteConfig.url, images: ["/images/stayvo/entrance.jpeg"] },
  twitter: { card: "summary_large_image", title: "Stayvo Kochi", description: siteConfig.tagline, images: ["/images/stayvo/entrance.jpeg"] },
};
export default function RootLayout({ children }) { return <html lang="en" data-scroll-behavior="smooth"><body><ScrollToTop />{children}</body></html>; }
