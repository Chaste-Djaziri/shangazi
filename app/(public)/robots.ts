// app/(public)/robots.ts
import type { MetadataRoute } from "next";

const SITE_URL = "https://shangazi.rw";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Private SEC portal, account screens, API routes and CMS tools are not search results.
      disallow: [
        "/api/",
        "/admin/",
        "/studio/",
        "/login",
        "/signup",
        "/forgot-password",
        "/discover",
        "/articles",
        "/exclusive-courses",
        "/exclusive-videos",
        "/profile",
        "/settings",
        "/search",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
