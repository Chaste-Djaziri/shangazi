type SkeletonBlockProps = {
  className?: string
}

export default function SkeletonBlock({ className }: SkeletonBlockProps) {
  return <div className={["skeleton", className].filter(Boolean).join(" ")} aria-hidden="true" />
}
