import { JsonLd } from "@/components/seo/JsonLd";
import { SEO_FAQ } from "@/helpers/seo-faq";
import { getSiteUrl } from "@/helpers/site";

function faqJsonLd() {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SEO_FAQ.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
    url,
  };
}

/** Server-rendered FAQ section + FAQPage structured data. */
export function HomeSeoFaq() {
  return (
    <>
      <JsonLd data={faqJsonLd()} />
      <section
        className="seo-faq"
        aria-labelledby="seo-faq-heading"
      >
        <h2 id="seo-faq-heading" className="seo-faq__title">
          Common questions
        </h2>
        <dl className="seo-faq__list">
          {SEO_FAQ.map((item) => (
            <div key={item.question} className="seo-faq__item">
              <dt className="seo-faq__q">{item.question}</dt>
              <dd className="seo-faq__a">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
