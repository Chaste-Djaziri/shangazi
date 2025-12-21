"use client"

import dynamic from "next/dynamic"
import HeaderSkeleton from "../skeletons/HeaderSkeleton"
import FooterSkeleton from "../skeletons/FooterSkeleton"

const Header = dynamic(() => import("../header/Header"), {
  ssr: false,
  loading: () => <HeaderSkeleton />,
})
const Footer = dynamic(() => import("../footer/Footer"), {
  ssr: false,
  loading: () => <FooterSkeleton />,
})
const ScrollToTop = dynamic(() => import("../scroll-to-top/ScrollToTop"), {
  ssr: false,
  loading: () => null,
})

export default function ClientChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <ScrollToTop />
    </>
  )
}
