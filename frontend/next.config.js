/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://drugchecker-production-8cc0.up.railway.app/:path*",
      },
    ];
  },
};
module.exports = nextConfig;
