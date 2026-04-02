import type { MetadataRoute } from "next";
import {
  BRAND_SHORT_NAME,
  BRAND_THEME_COLOR,
} from "@/helpers/brand";
import { SITE_DESCRIPTION, SITE_NAME } from "@/helpers/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: BRAND_SHORT_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: BRAND_THEME_COLOR,
    theme_color: BRAND_THEME_COLOR,
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
