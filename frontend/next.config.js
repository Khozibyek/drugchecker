/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "/tmp/next-build",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8000/:path*",
      },
      {
        source: "/drugs/:path*",
        destination: "http://127.0.0.1:8000/drugs/:path*",
      },
    ];
  },
  allowedDevOrigins: ["*"],
};
module.exports = nextConfig;
