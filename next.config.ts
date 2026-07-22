import type { NextConfig } from "next";

/**
 * Next.js configuration.
 *
 * Kept intentionally lean for the current stage. Security headers are applied
 * globally; image optimization is enabled with modern formats. Anything added
 * here later (redirects, rewrites, i18n) should stay declarative so the config
 * remains readable as the product grows.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  // HSTS only takes effect over HTTPS (ignored on localhost). A tuned,
  // nonce-based Content-Security-Policy is the recommended next step — see
  // README "Security" — and is intentionally omitted here rather than shipped
  // untuned, which would break Next.js's inline hydration scripts.
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
