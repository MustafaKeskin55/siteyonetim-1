import type { MetadataRoute } from "next";
import { getPublicSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const base = getPublicSiteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/super-admin/", "/dashboard/", "/api/", "/sifre-sifirla", "/sifre-belirle"],
      },
      {
        userAgent: ["Googlebot", "Bingbot", "GPTBot", "PerplexityBot", "ClaudeBot", "Applebot"],
        allow: "/",
        disallow: ["/admin/", "/super-admin/", "/dashboard/", "/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
