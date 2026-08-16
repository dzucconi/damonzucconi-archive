/** @type {import('next').NextConfig} */
const path = require("node:path");

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      // Proxies S3 files through the app's origin so the native `download`
      // attribute works (browsers ignore it on cross-origin links)
      {
        source: "/downloads/:key*",
        destination: "https://zucconi.s3.amazonaws.com/:key*",
      },
    ];
  },
  compiler: {
    styledComponents: true,
  },
  turbopack: {
    resolveAlias: {
      "styled-components": "./node_modules/styled-components",
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "styled-components": path.join(
        __dirname,
        "node_modules/styled-components"
      ),
    };

    return config;
  },
};

module.exports = nextConfig;
