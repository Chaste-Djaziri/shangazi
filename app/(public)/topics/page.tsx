import Topics from "../components/topics/Topics";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Topics | Shangazi Emma Claudine",
  description:
    "Explore all focus areas covered by Shangazi Emma Claudine, from reproductive health and relationships to personal growth, family life, and guidance that feels personal.",
  keywords: [
    "Shangazi topics",
    "reproductive health",
    "relationships",
    "personal growth",
    "family guidance",
    "Shangazi Emma Claudine topics",
  ],
  alternates: {
    canonical: "https://shangazi.rw/topics",
  },
  openGraph: {
    title: "Our Focus | Shangazi Emma Claudine",
    description:
      "Browse the topics Shangazi covers through open dialogue, shared stories, and practical guidance.",
    url: "https://shangazi.rw/topics",
    type: "website",
    images: [
      {
        url: "/images/topics_1.png",
        width: 1200,
        height: 630,
        alt: "Topics covered by Shangazi Emma Claudine",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Focus | Shangazi Emma Claudine",
    description:
      "Explore Shangazi Emma Claudine's guidance topics and focus areas.",
    images: ["/images/topics_1.png"],
  },
};

export default function TopicsPage() {
  return (
    <main>
      <Topics />
    </main>
  );
}
