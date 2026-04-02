export interface FaqItem {
  question: string;
  answer: string;
}

/** Visible FAQ + FAQPage JSON-LD (keep in sync). Tone matches in-app copy. */
export const SEO_FAQ: FaqItem[] = [
  {
    question: "How does the audit work?",
    answer:
      "You paste a public URL. We call Google PageSpeed Insights and map the Lighthouse output into the same scores, filmstrip, metrics, and issue list you see on screen—no Chrome extension required.",
  },
  {
    question: "Does it cost anything?",
    answer:
      "Running a check from this site is free for you. Behind the scenes it uses Google’s PageSpeed API; you just need the page to be reachable on the public web.",
  },
  {
    question: "Is this the same as Search Console or real-user data?",
    answer:
      "Lab runs are simulated. When Google has Chrome UX Report data for your URL, we show that too—but Search Console is still where you track indexing, queries, and long-term trends.",
  },
];
