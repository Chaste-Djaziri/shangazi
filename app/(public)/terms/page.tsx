// app/(public)/terms/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import LegalPageLayout from "../../components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms for using the Shangazi website, educational content, community features and SEC Portal.",
  alternates: { canonical: "https://shangazi.rw/terms" },
};

const sections = [
  { id: "scope", label: "About these terms" },
  { id: "accounts", label: "Accounts & access" },
  { id: "content", label: "Content & guidance" },
  { id: "conduct", label: "Acceptable use" },
  { id: "submissions", label: "Your contributions" },
  { id: "third-party", label: "External services" },
  { id: "availability", label: "Availability & changes" },
  { id: "responsibility", label: "Responsibility" },
  { id: "contact", label: "Questions" },
];

export default function TermsPage() {
  return (
    <LegalPageLayout
      eyebrow="Website information"
      title="Terms of Use"
      description="These terms explain how you may access Shangazi Emma Claudine's website, articles, videos, learning materials and member portal."
      sections={sections}
    >
      <section id="scope">
        <h2>01. About these terms</h2>
        <p>These Terms of Use apply to the public website at <a href="https://shangazi.rw">shangazi.rw</a> and its connected SEC Portal services (together, the “Platform”), operated under the Shangazi Emma Claudine name. By accessing or using the Platform, you agree to comply with these terms and any applicable laws.</p>
        <p>If you disagree with the terms, please do not use the Platform. Our <Link href="/privacy">Privacy Policy</Link> describes how personal information is handled.</p>
      </section>

      <section id="accounts">
        <h2>02. Accounts and access</h2>
        <p>Some learning materials, videos and account features require sign-in. You are responsible for providing accurate account information, protecting your credentials and informing us if you believe someone has accessed your account without permission.</p>
        <p>Do not share another person&apos;s account or attempt to bypass access restrictions. We may restrict access when reasonably necessary to address abuse, security concerns or violations of these terms.</p>
        <p>You can manage available profile, password and deletion options in <Link href="/settings">Account Settings</Link> while signed in. Certain account operations may require identity or email verification.</p>
      </section>

      <section id="content">
        <h2>03. Educational content and guidance</h2>
        <p>Articles, videos, courses and discussions are provided for general educational and informational purposes. Topics may include relationships, wellbeing, reproductive health and personal development. Content does not replace individualized medical, mental-health, legal or other professional advice, diagnosis or treatment.</p>
        <p>For urgent or personal health or safety concerns, seek assistance from an appropriately qualified professional or emergency service. Decisions based on content remain your responsibility.</p>
        <p>Unless expressly stated otherwise, text, artwork, branding, videos and course materials belong to their respective rights holders. You may view them for personal, lawful use; reproduction, redistribution, scraping or commercial exploitation requires authorization or another valid legal basis.</p>
      </section>

      <section id="conduct">
        <h2>04. Acceptable use</h2>
        <p>Please use the Platform respectfully. You must not:</p>
        <ul>
          <li>Harass, threaten, impersonate or disclose another person&apos;s private information without authorization.</li>
          <li>Post unlawful, misleading, abusive, infringing or malicious material.</li>
          <li>Interfere with security systems, attempt unauthorized access, or deliberately disrupt the service.</li>
          <li>Upload malware, automate abusive traffic or misuse forms, communications or registration systems.</li>
          <li>Misrepresent affiliation with Shangazi or claim endorsements we have not provided.</li>
        </ul>
      </section>

      <section id="submissions">
        <h2>05. Testimonials and contributions</h2>
        <p>If you submit a testimonial, message, review or other contribution, you confirm that you have the right to share it and that it does not violate the rights of others. Approved testimonials may be shown publicly with the submitted name, text, rating and avatar, if provided.</p>
        <p>By submitting content for public display, you give us permission to host, reproduce and display that contribution as necessary to operate and present the relevant feature. You retain ownership of your original contribution. We may moderate, decline or remove material to protect users and maintain the Platform.</p>
        <p>Please avoid including sensitive health information or private details about other people in public submissions. To raise a concern about displayed content, <Link href="/contact">contact us</Link>.</p>
      </section>

      <section id="third-party">
        <h2>06. External links and services</h2>
        <p>The Platform may link to or embed content from external providers, including video services. Sign-in, email delivery, hosting and other technical functions may also rely on third parties. Their own terms and privacy notices may apply when you interact with their services.</p>
        <p>Links to third-party websites do not imply endorsement or control over their content, availability or practices.</p>
      </section>

      <section id="availability">
        <h2>07. Availability and changes</h2>
        <p>We aim to keep the Platform useful and accessible, but functionality and content may change, become temporarily unavailable or be removed. We may update these terms to reflect changes to the Platform or legal requirements. The date at the top identifies the version published on this page.</p>
        <p>If a significant change affects your use of the Platform, we will communicate it where appropriate. Continued use after revised terms take effect indicates acceptance to the extent permitted by applicable law.</p>
      </section>

      <section id="responsibility">
        <h2>08. Responsibility and applicable rights</h2>
        <p>The Platform is made available with reasonable care, but we cannot guarantee that every piece of information is complete, current, uninterrupted or error-free. Nothing in these terms excludes responsibilities or consumer rights that cannot legally be excluded.</p>
        <p>Any dispute or complaint will be handled in accordance with applicable law and relevant mandatory rights. These terms do not override protections available to you under that law.</p>
      </section>

      <section id="contact">
        <h2>09. Contact</h2>
        <p>For questions about these terms, content permissions or the Platform, email <a href="mailto:comms@shangazi.rw">comms@shangazi.rw</a> or use the <Link href="/contact">contact page</Link>.</p>
        <p>Shangazi Emma Claudine · Kigali, Rwanda.</p>
      </section>
    </LegalPageLayout>
  );
}
