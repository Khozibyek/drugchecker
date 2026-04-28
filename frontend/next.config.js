/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://jamison-skirtlike-cultivatedly.ngrok-free.dev/:path*",
      },
    ];
  },
};
module.exports = nextConfig;
