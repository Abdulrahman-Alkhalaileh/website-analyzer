import { NextRequest, NextResponse } from "next/server";

const CATEGORIES = [
  "performance",
  "seo",
  "accessibility",
  "best-practices",
] as const;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const strategy = searchParams.get("strategy");
  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  const key = process.env.GOOGLE_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "Server is missing GOOGLE_API_KEY" },
      { status: 500 }
    );
  }

  const endpoint = new URL(
    "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"
  );
  endpoint.searchParams.set("url", url);
  endpoint.searchParams.set("key", key);
  for (const c of CATEGORIES) {
    endpoint.searchParams.append("category", c);
  }

  if (strategy === "desktop" || strategy === "mobile") {
    endpoint.searchParams.set("strategy", strategy);
  }

  const response = await fetch(endpoint.toString());
  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(data, { status: response.status });
  }

  return NextResponse.json(data);
}
