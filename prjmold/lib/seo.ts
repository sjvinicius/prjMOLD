import type { Metadata } from "next";

export const siteName = "Mol·D";
export const siteDescription =
  "Luminárias e objetos de design criados em 3D para transformar ambientes em refúgios de bem-estar.";
export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
);

export function createPageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      siteName,
      locale: "pt_BR",
      title,
      description,
      images: [{
        url: "/fundo_hero.jpg",
        width: 1920,
        height: 1080,
        alt: "Luminária Mol·D em um ambiente acolhedor",
      }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/fundo_hero.jpg"],
    },
  };
}