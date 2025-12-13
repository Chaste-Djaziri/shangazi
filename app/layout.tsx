import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import ScrollToTop from "./components/scroll-to-top/ScrollToTop";

export const metadata: Metadata = {
  metadataBase: new URL("https://shangazi.rw"),
  title: {
    default: "Shangazi Emma Claudine | Rwandan Journalist & Content Creator",
    template: "%s | Shangazi Emma Claudine",
  },
  description:
    "Shangazi Emma Claudine is a prominent Rwandan journalist and content creator empowering youth through education, reproductive health counseling, and open dialogue. 482K+ YouTube subscribers, 30M+ views.",
  keywords: [
    "Shangazi Emma Claudine",
    "Emma Claudine",
    "Shangazi",
    "Shangazi Rwanda",
    "Emma Claudine Shangazi",
    "Rwandan journalist",
    "content creator",
    "reproductive health",
    "youth counseling",
    "Rwanda",
    "Kigali",
    "YouTube",
    "Imenye Nawe",
    "Rwandan media",
    "education",
    "relationships",
    "youth empowerment",
    "Rwandan culture",
  ],
  authors: [{ name: "Emma Claudine", url: "https://shangazi.rw" }],
  creator: "Emma Claudine",
  publisher: "Shangazi",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://shangazi.rw",
    siteName: "Shangazi Emma Claudine",
    title: "Shangazi Emma Claudine | Rwandan Journalist & Content Creator",
    description:
      "Empowering Rwandan youth through education, reproductive health counseling, and open dialogue. 482K+ YouTube subscribers, 30M+ views.",
    images: [
      {
        url: "/profile/about.png",
        width: 1200,
        height: 630,
        alt: "Emma Claudine - Shangazi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shangazi Emma Claudine | Rwandan Journalist & Content Creator",
    description:
      "Empowering Rwandan youth through education, reproductive health counseling, and open dialogue.",
    images: ["/profile/about.png"],
    creator: "@emmaclaudine1",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://shangazi.rw",
  },
  category: "Media & Journalism",
  classification: "Journalism, Education, Youth Counseling",
  other: {
    "contact:email": "info@shangazi.rw",
    "contact:phone_number": "+250788123456",
    "contact:locality": "Kigali",
    "contact:country_name": "Rwanda",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Emma Claudine",
    alternateName: "Shangazi",
    jobTitle: "Journalist & Content Creator",
    description:
      "Prominent Rwandan journalist and content creator with over 20 years of experience. Empowering Rwandan youth through education, reproductive health counseling, and open dialogue.",
    url: "https://shangazi.rw",
    image: "https://shangazi.rw/profile/about.png",
    email: "info@shangazi.rw",
    telephone: "+250788123456",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kigali",
      addressCountry: "RW",
    },
    sameAs: [
      "https://www.youtube.com/@emmaclaudine/videos",
      "https://www.facebook.com/emmaclaudine1",
      "https://www.tiktok.com/@emmaclaudine1",
      "https://www.instagram.com/emmaclaudine1/",
    ],
    knowsAbout: [
      "Reproductive Health",
      "Youth Counseling",
      "Education",
      "Relationships",
      "Rwandan Culture",
    ],
    alumniOf: {
      "@type": "Organization",
      name: "Media Professional",
    },
  };

  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Shangazi",
    alternateName: "Shangazi - Emma Claudine",
    url: "https://shangazi.rw",
    description:
      "Empowering Rwandan youth through education, reproductive health counseling, and open dialogue.",
    publisher: {
      "@type": "Person",
      name: "Emma Claudine",
    },
    inLanguage: "en-US",
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
        />
      </head>
      <body>
        <ThemeProvider>
          <Header />
          {children}
          <Footer />
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
