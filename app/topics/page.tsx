import Topics from "../components/topics/Topics";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Topics | Shangazi Emma Claudine",
  description: "Explore all focus areas and guidance topics covered by Shangazi Emma Claudine.",
};

export default function TopicsPage() {
  return (
    <main>
      <Topics />
    </main>
  );
}
