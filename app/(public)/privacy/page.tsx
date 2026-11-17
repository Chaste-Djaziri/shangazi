// app/(public)/privacy/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import LegalPageLayout from "../../components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Shangazi Emma Claudine handles account data, learning progress, contact messages, newsletter signups and testimonials.",
  alternates: { canonical: "https://shangazi.rw/privacy" },
};

const sections = [
  { id: "overview", label: "Who we are" },
  { id: "collect", label: "Information collected" },
  { id: "use", label: "How information is used" },
  { id: "sharing", label: "Providers & disclosures" },
  { id: "public", label: "Public contributions" },
  { id: "storage", label: "Storage, security & retention" },
  { id: "choices", label: "Your rights & choices" },
  { id: "cookies", label: "Cookies & external media" },
  { id: "children", label: "Children & sensitive information" },
  { id: "changes", label: "Policy updates" },
  { id: "contact", label: "Privacy contact" },
];

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      eyebrow="Your information"
      title="Privacy Policy"
      description="This policy describes the information handled when you visit Shangazi, contact the team, subscribe to updates, submit testimonials or use your SEC Portal account."
      sections={sections}
    >
      <section id="overview">
        <h2>01. Who we are</h2>
        <p>This policy relates to the Shangazi Emma Claudine website and connected SEC Portal at <a href="https://shangazi.rw">shangazi.rw</a>. Shangazi operates from Kigali, Rwanda. For privacy questions, requests or complaints, contact <a href="mailto:comms@shangazi.rw">comms@shangazi.rw</a>.</p>
        <p>The Platform provides educational articles and videos, course-progress features, account management, contact forms, newsletters and a moderated testimonials feature.</p>
      </section>

      <section id="collect">
        <h2>02. Information we handle</h2>
        <p>The type of information depends on how you interact with the Platform:</p>
        <ul>
          <li><strong>Account information:</strong> name, email address, profile image (if available), account identifiers and authentication/session information used for sign-in.</li>
          <li><strong>Learning activity:</strong> the courses and modules you open or complete, relevant timestamps and the last module visited while signed in.</li>
          <li><strong>Messages:</strong> name, email address, subject and the contents of messages submitted through the contact form.</li>
          <li><strong>Newsletter signups:</strong> email address and optional name supplied when subscribing.</li>
          <li><strong>Testimonials:</strong> submitted name, text, rating, optional avatar and an associated account identifier when provided through a signed-in account.</li>
          <li><strong>Technical information:</strong> the information necessarily processed by web servers, browsers and authentication providers to deliver the website, maintain sessions, protect access and diagnose issues.</li>
        </ul>
        <p>Please avoid submitting sensitive health details, identification documents or other people&apos;s private information unless a specific secure process requests them.</p>
      </section>

      <section id="use">
        <h2>03. Why information is used</h2>
        <p>We use information to provide access to requested content, authenticate and manage accounts, remember course progress, respond to messages, administer newsletter subscriptions, review and display approved testimonials, maintain website security, and address technical or compliance issues.</p>
        <p>The reasons for processing information may vary by activity, including providing a requested service, handling a voluntary submission, maintaining security and meeting applicable obligations. Where consent is required for a specific activity, you may withdraw it through the available controls or by contacting us, subject to applicable requirements.</p>
      </section>

      <section id="sharing">
        <h2>04. Service providers and disclosures</h2>
        <p>Some features depend on external technology providers. The current application uses <strong>Neon Auth</strong> for user authentication, <strong>Neon/PostgreSQL</strong> for application data such as course progress and testimonials, <strong>Sanity</strong> to manage editorial content, and <strong>Resend</strong> to deliver contact messages and manage newsletter contacts.</p>
        <p>Hosting, infrastructure and embedded content providers may also process technical information needed to deliver their services. We may disclose information when required by applicable law, to protect the Platform or its users, or as part of a properly managed service transition.</p>
        <p>Depending on provider infrastructure, data may be processed or stored outside Rwanda. The availability of particular legal safeguards, contractual arrangements and locations should be confirmed with the relevant providers.</p>
      </section>

      <section id="public">
        <h2>05. Public content and testimonials</h2>
        <p>Testimonial submissions are reviewed before publication. Approved testimonials may display the name, contribution, rating and optional avatar submitted with them. Do not include information you would not want visible to others.</p>
        <p>For a correction or removal request concerning a published testimonial, please <Link href="/contact">contact the Shangazi team</Link> and identify the contribution in question.</p>
      </section>

      <section id="storage">
        <h2>06. Storage, security and retention</h2>
        <p>We use authentication controls and application-level access checks to help protect accounts and learning records. No online system can guarantee absolute security. If you believe your account has been compromised, change your password where supported and notify us.</p>
        <p>Information may remain stored for as long as needed to operate the feature for which it was collected, handle outstanding requests or comply with applicable obligations. Different record types and third-party providers may follow different retention processes. We do not publish a specific deletion deadline here because retention schedules have not yet been confirmed across all systems.</p>
        <p>Deleting an authentication account does not, by itself, guarantee that related records in every separate application database or email service are immediately erased. If you want removal of associated learning records, testimonials or newsletter data, contact us so the relevant systems can be reviewed.</p>
      </section>

      <section id="choices">
        <h2>07. Your rights and choices</h2>
        <p>Depending on the law that applies to you, you may be able to request access to your information, correction, deletion, restriction, objection, portability or withdrawal of consent where applicable. We may need to verify your identity before acting on a request.</p>
        <ul>
          <li><strong>Profile and account:</strong> use <Link href="/settings">Account Settings</Link> to request profile or email changes, change a password where available, revoke sessions or initiate account deletion.</li>
          <li><strong>Newsletter:</strong> use any unsubscribe control supplied in newsletter communications or request removal through our contact address.</li>
          <li><strong>Testimonials or course progress:</strong> contact us to request a review, correction or removal of records in separate application systems.</li>
          <li><strong>Questions or complaints:</strong> email <a href="mailto:comms@shangazi.rw">comms@shangazi.rw</a> with your concern.</li>
        </ul>
        <p>We will assess requests in accordance with applicable legal obligations and explain if a specific request cannot be fulfilled in full.</p>
      </section>

      <section id="cookies">
        <h2>08. Cookies, sessions and external media</h2>
        <p>Sign-in features typically require browser cookies or similar storage to maintain a secure session. Embedded videos and links to external platforms, including YouTube or Vimeo where used, may be governed by those providers&apos; own privacy practices.</p>
        <p>Your browser may provide controls for cookies and site storage, but blocking essential session storage can prevent account features from working. Any future non-essential analytics or advertising tracking should be disclosed and handled through the appropriate controls before use.</p>
      </section>

      <section id="children">
        <h2>09. Children and sensitive subjects</h2>
        <p>Shangazi covers topics that may involve relationships and reproductive health. The website is educational and is not intended to collect sensitive personal disclosures through open testimonial or contact channels. Younger visitors should use the Platform with appropriate guidance where required.</p>
        <p>If you believe a child&apos;s information has been submitted inappropriately, please contact us to request review and appropriate action.</p>
      </section>

      <section id="changes">
        <h2>10. Changes to this policy</h2>
        <p>We may revise this policy as the Platform, service providers or applicable requirements change. The “Last updated” date at the top identifies the current published version. Where appropriate, important changes will also be communicated through the Platform.</p>
      </section>

      <section id="contact">
        <h2>11. Contact about privacy</h2>
        <p>Send privacy requests or questions to <a href="mailto:comms@shangazi.rw">comms@shangazi.rw</a>, or use the <Link href="/contact">contact page</Link>.</p>
        <p>Shangazi Emma Claudine · Kigali, Rwanda.</p>
      </section>
    </LegalPageLayout>
  );
}
