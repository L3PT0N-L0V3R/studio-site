import { BRAND } from "@/lib/brand";

export function StructuredData() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: BRAND.name,
      url: BRAND.url,
    },
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: BRAND.name,
      url: BRAND.url,
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
