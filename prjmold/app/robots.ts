import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/about", "/products"],
      disallow: ["/api/", "/checkout/", "/orders/", "/manage/", "/signin"],
    },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}