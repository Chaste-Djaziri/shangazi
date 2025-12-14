import type { NextConfig } from "next";

const remotePatterns = [
  {
    protocol: "http",
    hostname: "localhost",
  },
  {
    protocol: "https",
    hostname: "localhost",
  },
];

const strapiEnvUrl =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? process.env.STRAPI_API_URL ?? process.env.STRAPI_URL
if (strapiEnvUrl) {
  try {
    const { hostname, protocol } = new URL(strapiEnvUrl)
    if (hostname) {
      remotePatterns.push({
        protocol: protocol.replace(":", ""),
        hostname,
      });
    }
  } catch (e) {
    console.warn("Invalid STRAPI URL in env; falling back to localhost for images.")
  }
}

const strapiCdnHosts = [
  "great-whisper-6e26941fa4.strapiapp.com",
  "great-whisper-6e26941fa4.media.strapiapp.com",
]

strapiCdnHosts.forEach((hostname) => {
  if (!remotePatterns.find((pattern) => pattern.hostname === hostname)) {
    remotePatterns.push({ protocol: "https", hostname })
  }
})

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // Cast for compatibility with differing Next.js versions/types in CI
    remotePatterns: remotePatterns as any,
  },
};

export default nextConfig;
