import { getSiteUrl, SITE_DESCRIPTION, SITE_NAME } from "@/helpers/site";

/** WebSite + Organization + WebApplication for rich results eligibility. */
export function buildPrimaryJsonLd(): Record<string, unknown> {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        url,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        inLanguage: "en",
        publisher: { "@id": `${url}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${url}/#organization`,
        name: SITE_NAME,
        url,
        logo: `${url}/icon`,
      },
      {
        "@type": "WebApplication",
        "@id": `${url}/#webapp`,
        name: SITE_NAME,
        url,
        description: SITE_DESCRIPTION,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web browser",
        browserRequirements:
          "Requires JavaScript. Audits use Google PageSpeed Insights.",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        isPartOf: { "@id": `${url}/#website` },
      },
    ],
  };
}
