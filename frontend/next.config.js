/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 生产环境：API 请求直接走同域 /api（Vercel serverless functions）
  // 开发环境：代理到本地 Flask 后端
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:5000";
    // 生产环境不代理（直接用同域 /api）
    if (process.env.NODE_ENV === "production") {
      return [];
    }
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
