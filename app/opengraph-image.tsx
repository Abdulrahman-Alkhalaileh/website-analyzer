import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/helpers/site";

export const runtime = "edge";

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0B0B0B",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 48,
        }}
      >
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "#fff",
            textAlign: "center",
            letterSpacing: "-0.02em",
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            fontSize: 26,
            color: "rgba(255,255,255,0.72)",
            marginTop: 20,
            textAlign: "center",
            maxWidth: 920,
            lineHeight: 1.35,
          }}
        >
          Free PageSpeed Insights and Lighthouse scores
        </div>
      </div>
    ),
    { ...size }
  );
}
