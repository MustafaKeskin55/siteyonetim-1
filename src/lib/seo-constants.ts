import type { Metadata } from "next";
import { getPublicSiteUrl } from "./site-url";
import { SITE_LOGO_PATH } from "./brand";

const siteUrl = getPublicSiteUrl();

export const defaultKeywords = [
  "apartman komşuluk ağı",
  "apartman sosyal portalı",
  "site yönetim sistemi",
  "kvkk uyumlu apartman yönetimi",
  "numarasız komşu ağı",
  "bina içi canlı anket ve oylama",
  "whatsapp yerine apartman uygulaması",
  "fotoğraflı arıza ve istek takibi",
  "apartman yönetim yazılımı",
  "dijital bina panosu",
  "site topluluğu yönetimi",
  "site yönetim programı %70 indirim",
  "istanbul apartman yönetimi",
  "ankara site yönetim sistemi",
  "izmir apartman sosyal ağı",
  "bursa bina yönetimi",
  "antalya site yönetim platformu",
  "türkiye geneli site yazılımı",
];

export function buildOrganizationJsonLd(): Record<string, unknown> {
  const name = "Site Yönetimi";
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name,
    alternateName: ["SiteYonetim", "Apartman Komşuluk Portalı", "Modern Site Yönetimi"],
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}${SITE_LOGO_PATH}`,
      width: 512,
      height: 512,
    },
    description:
      "WhatsApp karmaşasına son veren %100 KVKK numara gizliliği korumalı görsel komşuluk akışı, bina içi canlı anketler ve fotoğraflı arıza yönetim platformu.",
    knowsAbout: defaultKeywords,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      availableLanguage: ["Turkish", "English"],
      email: "destek@siteyonetim.keskindev.com",
      telephone: "+90-212-000-00-00",
      areaServed: "TR",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "İstanbul",
      addressRegion: "Marmara",
      addressCountry: "TR",
    },
    areaServed: [
      { "@type": "Country", name: "Türkiye" },
      { "@type": "City", name: "İstanbul" },
      { "@type": "City", name: "Ankara" },
      { "@type": "City", name: "İzmir" },
      { "@type": "City", name: "Bursa" },
      { "@type": "City", name: "Antalya" },
      { "@type": "City", name: "Kocaeli" },
      { "@type": "City", name: "Adana" },
    ],
  };
}

export function buildSoftwareApplicationJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${siteUrl}/#software`,
    name: "Site Yönetimi — Komşuluk Sosyal Ağı",
    applicationCategory: "SocialNetworkingApplication",
    operatingSystem: "Web, Android, iOS, Windows, macOS",
    description:
      "Telefon numaranızı komşularla paylaşmadan apartman duyurularını, görsel hikayeleri ve bina içi canlı anketleri tek uygulamada buluşturan modern dijital komşuluk portalı.",
    url: siteUrl,
    inLanguage: "tr-TR",
    featureList: [
      "KVKK %100 Gizli Numara Kalkanı",
      "Görsel Komşuluk Akışı ve Hikayeler",
      "Canlı Komşuluk Anketleri ve Oylamaları",
      "Fotoğraflı Ortak Alan Arıza Takibi",
      "PWA Mobil Ana Ekrana Ekleme Desteği",
      "Yönetici Onaylı Güvenli Sakin Kaydı",
    ],
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "TRY",
      lowPrice: "59",
      highPrice: "209",
      offerCount: "3",
      priceValidUntil: "2026-12-31",
      availability: "https://schema.org/InStock",
      description: "%70 Lansmana Özel İndirimli Açılış Fiyatları",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "280",
      bestRating: "5",
      worstRating: "1",
    },
  };
}

export function buildWebsiteJsonLd(): Record<string, unknown> {
  const name = "Site Yönetimi";
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name,
    url: siteUrl,
    inLanguage: "tr-TR",
    publisher: { "@type": "Organization", name, url: siteUrl },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/ozellikler?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildFAQJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Apartman sakinlerinin telefon numarası diğer komşular tarafından görülür mü?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Hayır. Site Yönetimi platformu %100 KVKK ve gizlilik odaklıdır. Komşularınız yalnızca daire numaranızı ve ad-soyadınızı görür. Telefon numaranız ve e-posta adresiniz diğer sakinlerle asla paylaşılmaz.",
        },
      },
      {
        "@type": "Question",
        name: "WhatsApp grupları yerine bu komşuluk ağını kullanmanın avantajları nelerdir?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "WhatsApp gruplarında numara ifşası, spam mesajlar ve kaybolan önemli duyurular yaşanırken; platformumuzda numara gizliliği, görsel komşuluk akışı, tek tıkla resmi bina anketleri ve fotoğraflı arıza bildirimleri düzenli şekilde yönetilir.",
        },
      },
      {
        "@type": "Question",
        name: "Fiyatlar nedir ve indirim geçerli mi?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Lansman kampanyamız kapsamında tüm paketlerimizde %70 indirim uygulanmıştır. Başlangıç paketi aylık ₺59, Profesyonel paket ₺109 ve Kurumsal paket ₺209'dur. Ayrıca lansmana özel 60 gün boyunca kredi kartı gerekmeden tamamen ücretsiz test edebilirsiniz.",
        },
      },
      {
        "@type": "Question",
        name: "Mobil uygulama mağazadan mı indirilir yoksa PWA mi?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sistemimiz tam PWA (Progressive Web App) standartlarındadır. Safari veya Chrome üzerinden 'Ana Ekrana Ekle' diyerek mağazalara gitmeden ve telefonunuzda yer kaplamadan saniyeler içinde uygulama olarak kullanabilirsiniz.",
        },
      },
      {
        "@type": "Question",
        name: "Apartman sakinleri sisteme nasıl katılır?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yöneticinin paylaştığı özel 'Site Katılım Kodu' veya davet bağlantısıyla sakinler saniyeler içinde ad-soyad ve daire numarasıyla kayıt olur. Yönetici onayının ardından tüm komşuluk akışına erişebilirler.",
        },
      },
    ],
  };
}

export function buildLocalBusinessJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#localbusiness`,
    name: "Site Yönetimi — Türkiye Apartman & Site Platformu",
    description:
      "İstanbul, Ankara, İzmir başta olmak üzere 81 ilde apartman ve site sakinlerine numarasız güvenli sosyal komşuluk ve yönetim çözümleri sunan yerli teknoloji platformu.",
    url: siteUrl,
    telephone: "+90-212-000-00-00",
    email: "destek@siteyonetim.keskindev.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Büyükdere Caddesi, Levent",
      addressLocality: "İstanbul",
      addressRegion: "Marmara",
      postalCode: "34394",
      addressCountry: "TR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "41.0082",
      longitude: "28.9784",
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: "İstanbul" },
      { "@type": "AdministrativeArea", name: "Ankara" },
      { "@type": "AdministrativeArea", name: "İzmir" },
      { "@type": "AdministrativeArea", name: "Bursa" },
      { "@type": "AdministrativeArea", name: "Antalya" },
      { "@type": "AdministrativeArea", name: "Kocaeli" },
      { "@type": "Country", name: "Türkiye" },
    ],
    currenciesAccepted: "TRY",
    paymentAccepted: "Kredi Kartı, Banka Kartı",
    priceRange: "₺59 - ₺209",
    openingHours: "Mo-Su 00:00-23:59",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "00:00",
        closes: "23:59",
      },
    ],
  };
}

/** Kök metadata ve OG/Twitter/GEO için ortak alanlar */
export function rootDefaultMetadata(): Metadata {
  const title = {
    default: "Site Yönetimi — Numarasız Komşuluk Ağı & Apartman Portalı",
    template: "%s | Site Yönetimi",
  };
  const description =
    "WhatsApp karmaşasına son! %100 KVKK numara gizliliği ile apartmanınızın özel sosyal ağı. Fotoğraflı komşu akışı, canlı bina anketleri, hikayeler ve arıza takibi tek platformda.";

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords: defaultKeywords,
    applicationName: "Site Yönetimi",
    category: "community",
    icons: {
      icon: [
        { url: SITE_LOGO_PATH, type: "image/png", sizes: "512x512" },
        { url: SITE_LOGO_PATH, type: "image/png", sizes: "any" },
      ],
      apple: [{ url: SITE_LOGO_PATH, sizes: "180x180", type: "image/png" }],
    },
    alternates: { canonical: siteUrl },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "tr_TR",
      url: siteUrl,
      siteName: "Site Yönetimi",
      title: title.default,
      description,
      images: [{ url: SITE_LOGO_PATH, width: 512, height: 512, alt: "Site Yönetimi Komşuluk Portalı" }],
    },
    twitter: {
      card: "summary_large_image",
      title: title.default,
      description,
      images: [SITE_LOGO_PATH],
    },
    other: {
      "geo.region": "TR-34",
      "geo.placename": "İstanbul, Türkiye",
      "geo.position": "41.0082;28.9784",
      "ICBM": "41.0082, 28.9784",
      "coverage": "Worldwide / Türkiye",
      "distribution": "Global",
      "rating": "General",
    },
  };
}
