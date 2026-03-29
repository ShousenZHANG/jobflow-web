import type { Metadata } from "next";
import Link from "next/link";
import { Search, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — Jobflow",
  description: "How Jobflow collects, uses, and protects your data.",
};

const LAST_UPDATED = "March 10, 2026";

export default function PrivacyPolicyPage() {
  return (
    <div className="marketing-edu relative min-h-[100dvh] overflow-hidden">
      <div className="edu-bg" aria-hidden="true" />

      <div className="relative z-[2] mx-auto w-full max-w-3xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <nav className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-slate-800 transition-colors hover:text-slate-900"
          >
            <Search className="h-4 w-4 text-emerald-700" />
            Jobflow
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </Link>
        </nav>

        <article className="prose prose-slate max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-h1:text-3xl prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-base prose-p:leading-relaxed prose-li:leading-relaxed prose-a:text-emerald-700 prose-a:no-underline hover:prose-a:underline">
          <h1>Privacy Policy</h1>
          <p className="text-sm text-slate-500">Last updated: {LAST_UPDATED}</p>

          <p>
            Jobflow (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates the Jobflow web application
            (the &quot;Service&quot;). This Privacy Policy explains how we collect, use, disclose, and
            safeguard your information when you use our Service. By accessing or using the Service, you
            agree to this Privacy Policy.
          </p>

          <h2>1. Information We Collect</h2>

          <h3>1.1 Account Information</h3>
          <p>
            When you sign in via Google or GitHub OAuth, we receive your name, email address, and
            profile avatar from the identity provider. We do not receive or store your passwords.
          </p>

          <h3>1.2 Job Data</h3>
          <p>
            The Service fetches publicly available job listings from third-party platforms on your
            behalf. These listings — including job title, company, location, and description — are
            stored in your account for your personal use.
          </p>

          <h3>1.3 User-Generated Content</h3>
          <p>
            You may create, upload, or edit resumes, cover letters, and application materials within
            the Service. This content is stored securely and associated with your account.
          </p>

          <h3>1.4 Usage Data</h3>
          <p>
            We automatically collect standard usage information such as browser type, device type,
            pages visited, and timestamps. This data is used solely for analytics and improving the
            Service.
          </p>

          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>To provide, operate, and maintain the Service</li>
            <li>To authenticate your identity and manage your account</li>
            <li>To generate tailored resumes and cover letters based on your profile and job listings</li>
            <li>To improve and optimize the Service</li>
            <li>To communicate with you about updates or issues related to the Service</li>
          </ul>

          <h2>3. Data Storage &amp; Security</h2>
          <p>
            Your data is stored in a PostgreSQL database hosted on{" "}
            <strong>Neon</strong> (neon.tech) and the application is deployed on{" "}
            <strong>Vercel</strong> (vercel.com). File attachments (PDFs, generated documents) are
            stored in <strong>Vercel Blob Storage</strong>. All data is transmitted over HTTPS/TLS
            encryption.
          </p>
          <p>
            While we implement commercially reasonable security measures, no method of electronic
            storage or transmission is 100% secure. We cannot guarantee absolute security of your data.
          </p>

          <h2>4. Third-Party Services</h2>
          <p>We use the following third-party services:</p>
          <ul>
            <li><strong>Google OAuth / GitHub OAuth</strong> — for authentication</li>
            <li><strong>Vercel</strong> — for hosting and serverless functions</li>
            <li><strong>Neon</strong> — for database hosting</li>
            <li><strong>OpenAI / AI providers</strong> — for generating resume and cover letter content (job descriptions and your profile data may be sent to AI providers for processing)</li>
          </ul>
          <p>
            Each third-party service operates under its own privacy policy. We encourage you to review
            their policies.
          </p>

          <h2>5. Data Retention</h2>
          <p>
            We retain your data for as long as your account is active. You may delete individual job
            records at any time through the Service. If you wish to delete your entire account and all
            associated data, please contact us.
          </p>

          <h2>6. Your Rights</h2>
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul>
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to or restrict processing of your data</li>
            <li>Data portability</li>
          </ul>
          <p>
            To exercise any of these rights, please contact us at the email address below.
          </p>

          <h2>7. Disclaimer of Liability</h2>
          <p>
            The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis. To the
            fullest extent permitted by applicable law:
          </p>
          <ul>
            <li>
              We make no warranties, express or implied, regarding the accuracy, completeness, or
              reliability of job listings fetched from third-party sources. Job data is sourced from
              public platforms and may be outdated, inaccurate, or incomplete.
            </li>
            <li>
              We are not responsible for any employment decisions, application outcomes, or
              consequences arising from your use of the Service.
            </li>
            <li>
              AI-generated content (resumes, cover letters) is provided as a starting point and should
              be reviewed and edited by you before submission. We are not liable for any errors or
              omissions in AI-generated content.
            </li>
            <li>
              We shall not be liable for any indirect, incidental, special, consequential, or punitive
              damages arising from your use of or inability to use the Service.
            </li>
            <li>
              We are not responsible for any data loss resulting from third-party service outages,
              including but not limited to Vercel, Neon, or AI provider downtime.
            </li>
          </ul>

          <h2>8. Children&apos;s Privacy</h2>
          <p>
            The Service is not intended for use by anyone under the age of 16. We do not knowingly
            collect personal information from children under 16.
          </p>

          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by
            posting the new policy on this page and updating the &quot;Last updated&quot; date. Your
            continued use of the Service after changes constitutes acceptance of the updated policy.
          </p>

          <h2>10. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy or wish to exercise your data rights,
            please contact us at:
          </p>
          <p>
            <strong>Email:</strong>{" "}
            <a href="mailto:privacy@jobflow.app">privacy@jobflow.app</a>
          </p>
        </article>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link href="/" className="flex items-center gap-1.5 font-semibold text-slate-900">
              <Search className="h-3.5 w-3.5 text-emerald-700" />
              Jobflow
            </Link>
            <span aria-hidden="true">&middot;</span>
            <Link href="/privacy" className="text-emerald-700">Privacy</Link>
            <span aria-hidden="true">&middot;</span>
            <Link href="/terms" className="hover:text-slate-900">Terms</Link>
            <span aria-hidden="true">&middot;</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
