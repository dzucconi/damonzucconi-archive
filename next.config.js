/** @type {import('next').NextConfig} */
const path = require("node:path");

const nextConfig = {
  reactStrictMode: true,
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
