import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Image from "next/image";
import CursorLight from "@/components/CursorLight";
import Header from "../components/Header";
import { CartProvider } from "@/context/CartContext";
import { siteDescription, siteName, siteUrl } from "@/lib/seo";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  applicationName: siteName,
  creator: siteName,
  publisher: siteName,
  category: "home decor",
  formatDetection: { telephone: false },
  keywords: [
    "MolD",
    "Mold",
    "mold",
    "mOld",
    "mOLd",
    "Mold Ecommerce",
    "Mol-D",
    "Mol D",
    "Estúdio Mol-D",
    "Estúdio Mol·D",
    "Bio Luz",
    "luminária 3D",
    "luminária personalizada",
    "impressão 3D",
    "decoração",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html
        lang="pt-br"
        className={`${poppins.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">
          <CartProvider>
            <Header />

            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@graph": [
                    {
                      "@type": "Organization",
                      name: siteName,
                      url: siteUrl.toString(),
                      logo: new URL(
                        "/logo_escrita.png",
                        siteUrl
                      ).toString(),
                      description: siteDescription,
                    },
                    {
                      "@type": "WebSite",
                      name: siteName,
                      url: siteUrl.toString(),
                      inLanguage: "pt-BR",
                    },
                  ],
                }),
              }}
            />

            <Image
              src="/fundo_hero.jpg"
              alt=""
              width={1920}
              height={1280}
              sizes="100vw"
              className="hero-image"
            />

            <CursorLight />

            {children}
          </CartProvider>

          <div className="noise-overlay" aria-hidden="true" />
        </body>
      </html>

      <Analytics />
      <SpeedInsights />
    </>
  );
}
