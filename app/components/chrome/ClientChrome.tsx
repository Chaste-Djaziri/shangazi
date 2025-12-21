 "use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"
import HeaderSkeleton from "../skeletons/HeaderSkeleton"
import FooterSkeleton from "../skeletons/FooterSkeleton"

const Header = dynamic(() => import("../header/Header"), { ssr: false, suspense: true })
const Footer = dynamic(() => import("../footer/Footer"), { ssr: false, suspense: true })
const ScrollToTop = dynamic(() => import("../scroll-to-top/ScrollToTop"), {
  ssr: false,
  suspense: true,
})

export default function ClientChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={<HeaderSkeleton />}>
        <Header />
      </Suspense>
      {children}
      <Suspense fallback={<FooterSkeleton />}>
        <Footer />
      </Suspense>
      <Suspense fallback={null}>
        <ScrollToTop />
      </Suspense>
    </>
  )
}
