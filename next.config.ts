import type { NextConfig } from "next"
import type { RemotePattern } from "next/dist/shared/lib/image-config"

const remotePatterns: RemotePattern[] = [
  {
    protocol: "https",
    hostname: "cdn.sanity.io",
  },
  {
    protocol: "https",
    hostname: "lh3.googleusercontent.com",
  },
  {
    protocol: "https",
    hostname: "img.youtube.com",
  },
  {
    protocol: "http",
    hostname: "localhost",
  },
  {
    protocol: "https",
    hostname: "localhost",
  },
]

const nextConfig: NextConfig = {
  images: {
    // Vercel Services currently returns 404 for /_next/image on this deployment.
    // Let the browser request local and external image sources directly.
    unoptimized: true,
    remotePatterns,
  },
}

export default nextConfig
