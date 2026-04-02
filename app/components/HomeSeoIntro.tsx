import { SITE_NAME, SITE_PAGE_INTRO } from "@/helpers/site";

/** Server-rendered h1 + one line; sits in the same column as the hero. */
export function HomeSeoIntro() {
  return (
    <header className="seo-intro">
      <h1 className="seo-intro__title">{SITE_NAME}</h1>
      <p className="seo-intro__lead">{SITE_PAGE_INTRO}</p>
    </header>
  );
}
