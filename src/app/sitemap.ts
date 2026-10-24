import type { MetadataRoute } from "next";
import { getPublicSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getPublicSiteUrl();
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${base}/ozellikler`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/fiyatlandirma`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/kayit`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/hakkimizda`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/iletisim`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/destek`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/login`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/gizlilik-politikasi`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/kullanim-sartlari`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/sifremi-unuttum`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];

  return staticPages;
}
