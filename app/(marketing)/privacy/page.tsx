import type { Metadata } from "next";
import Link from "next/link";
import { Search, ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Privacy Policy — Joblit",
  description: "How Joblit collects, uses, and protects your data.",
};

export default async function PrivacyPolicyPage() {
  const t = await getTranslations("privacy");

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
            Joblit
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
          <h1>{t("title")}</h1>
          <p className="text-sm text-slate-500">
            {t("lastUpdated")}
          </p>

          <p>{t("intro")}</p>

          {/* Section 1 */}
          <h2>{t("s1Title")}</h2>

          <h3>{t("s1_1Title")}</h3>
          <p>{t("s1_1")}</p>

          <h3>{t("s1_2Title")}</h3>
          <p>{t("s1_2")}</p>

          <h3>{t("s1_3Title")}</h3>
          <p>{t("s1_3")}</p>

          <h3>{t("s1_4Title")}</h3>
          <p>{t("s1_4")}</p>

          <h3>{t("s1_5Title")}</h3>
          <p>{t("s1_5")}</p>

          {/* Section 2 */}
          <h2>{t("s2Title")}</h2>
          <p>{t("s2")}</p>

          {/* Section 3 */}
          <h2>{t("s3Title")}</h2>
          <p>{t("s3")}</p>

          {/* Section 4 */}
          <h2>{t("s4Title")}</h2>
          <p>{t("s4")}</p>

          {/* Section 5 */}
          <h2>{t("s5Title")}</h2>
          <p>{t("s5Intro")}</p>
          <ul>
            <li>{t("s5Google")}</li>
            <li>{t("s5Github")}</li>
            <li>{t("s5Vercel")}</li>
            <li>{t("s5Neon")}</li>
            <li>{t("s5Gemini")}</li>
            <li>{t("s5Latex")}</li>
          </ul>
          <p>{t("s5Note")}</p>

          {/* Section 6 */}
          <h2>{t("s6Title")}</h2>
          <p>{t("s6")}</p>

          {/* Section 7 */}
          <h2>{t("s7Title")}</h2>
          <p>{t("s7")}</p>

          {/* Section 8 */}
          <h2>{t("s8Title")}</h2>
          <p>{t("s8")}</p>

          {/* Section 9 */}
          <h2>{t("s9Title")}</h2>
          <p>{t("s9Intro")}</p>
          <ul>
            <li>{t("s9Gdpr")}</li>
            <li>{t("s9Ccpa")}</li>
            <li>{t("s9Aus")}</li>
          </ul>
          <p>{t("s9Exercise")}</p>

          {/* Section 10 */}
          <h2>{t("s10Title")}</h2>
          <p>{t("s10")}</p>

          {/* Section 11 */}
          <h2>{t("s11Title")}</h2>
          <p>{t("s11Intro")}</p>
          <ul>
            <li>{t("s11_1")}</li>
            <li>{t("s11_2")}</li>
            <li>{t("s11_3")}</li>
            <li>{t("s11_4")}</li>
            <li>{t("s11_5")}</li>
            <li>{t("s11_6")}</li>
          </ul>

          {/* Section 12 */}
          <h2>{t("s12Title")}</h2>
          <p>{t("s12")}</p>

          {/* Section 13 */}
          <h2>{t("s13Title")}</h2>
          <p>{t("s13")}</p>

          {/* Section 14 */}
          <h2>{t("s14Title")}</h2>
          <p>{t("s14")}</p>
          <p>
            <strong>Email:</strong>{" "}
            <a href={`mailto:${t("s14Email")}`}>{t("s14Email")}</a>
          </p>
        </article>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link href="/" className="flex items-center gap-1.5 font-semibold text-slate-900">
              <Search className="h-3.5 w-3.5 text-emerald-700" />
              Joblit
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
