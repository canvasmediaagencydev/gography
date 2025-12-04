import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://translate.google.com https://translate.googleapis.com https://translate-pa.googleapis.com https://www.youtube.com; frame-src https://translate.google.com https://translate.googleapis.com https://www.youtube.com https://www.youtube-nocookie.com; style-src 'self' 'unsafe-inline' https://translate.googleapis.com https://www.gstatic.com https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
