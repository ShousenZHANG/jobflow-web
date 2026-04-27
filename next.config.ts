import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "react-markdown",
      "@tanstack/react-query",
      "@tanstack/react-virtual",
      "@radix-ui/react-dialog",
      "@radix-ui/react-select",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-popover",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-toast",
    ],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // GitHub owner avatars (`https://github.com/{user}.png` 302 redirects to
      // `avatars.githubusercontent.com`). The optimizer follows the redirect,
      // but the lint/runtime hostname check uses the original URL — list both.
      { protocol: "https", hostname: "github.com", pathname: "/**" },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
      // YouTube video thumbnails used on the discover page.
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/**" },
      // User-uploaded resume photos served from Vercel Blob.
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        pathname: "/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
