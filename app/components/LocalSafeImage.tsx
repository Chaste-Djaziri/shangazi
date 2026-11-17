// app/components/LocalSafeImage.tsx
import Image, { type ImageProps } from "next/image";

/**
 * Serve local /public assets directly when Next.js image optimization returns
 * a missing endpoint on a Vercel Services deployment. Remote images continue
 * using Next.js/Vercel optimization.
 */
export default function LocalSafeImage(props: ImageProps) {
  const isLocalPublicAsset =
    typeof props.src === "string" && props.src.startsWith("/") && !props.src.startsWith("//");

  return <Image {...props} unoptimized={props.unoptimized || isLocalPublicAsset} />;
}
