import type { Metadata } from "next";

export const siteName = "Mol·D";

export const siteDescription =
    "Luminárias e objetos de design criados em 3D para transformar ambientes em refúgios de bem-estar.";

export const siteUrl = new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
);

export function createPageMetadata(
    title: string,
    description: string,
    path: string,
): Metadata {
    const pageUrl = new URL(path, siteUrl).toString();
    const imageUrl = new URL("/fundo_hero.jpg", siteUrl).toString();

    return {
        title,
        description,

        alternates: {
            canonical: pageUrl,
        },

        openGraph: {
            type: "website",
            url: pageUrl,
            siteName,
            locale: "pt_BR",
            title,
            description,
            images: [
                {
                    url: imageUrl,
                    width: 1920,
                    height: 1080,
                    alt: "Luminária Mol·D em um ambiente acolhedor",
                },
            ],
        },

        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [imageUrl],
            site: "@mold"
        },
    };
}