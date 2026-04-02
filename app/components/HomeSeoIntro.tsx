import { SITE_NAME, SITE_PAGE_INTRO } from "@/helpers/site";

/** Server-rendered heading + lead; hero below carries the display headline (h2). */
export function HomeSeoIntro() {
  return (
    <header className="seo-intro">
      <h1 className="seo-intro__title">{SITE_NAME}</h1>
      <p className="seo-intro__lead">{SITE_PAGE_INTRO}</p>
    </header>
  );
}
