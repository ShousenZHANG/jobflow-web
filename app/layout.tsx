import type { Metadata } from "next";
import {
  Instrument_Serif,
  JetBrains_Mono,
  Source_Sans_3,
} from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Source_Sans_3({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Italic serif display face used for the Hero title emphasis
// ("re-engineered.") and every deep-dive / section heading <em>.
// Matches Landing.html which loads Instrument Serif for the same purpose.
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.JOBLIT_WEB_URL ?? "https://www.joblit.tech"),
  title: {
    default: "Joblit Dashboard",
    template: "%s | Joblit",
  },
  description: "Job tracking and automated discovery dashboard.",
  // Next.js auto-discovers app/icon.svg + app/apple-icon.svg.
  // Setting an explicit shortcut + apple block keeps legacy crawlers
  // happy and overrides any cached default favicon (e.g. Vercel).
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: ["/icon.svg"],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
  },
};

export const viewport = {
  themeColor: "#047857",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
