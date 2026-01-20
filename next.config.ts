import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: [
    "http://192.168.1.4:3000",
    "local-origin.dev",
    "*.local-origin.dev"
  ],
  turbopack: {
    root: __dirname,
    resolveAlias: {
      "@/environments/environment": (() => {
        const env =
            process.env.NEXT_PUBLIC_ENV || process.env.NODE_ENV || "development";
        const environmentFile =
            env === "production"
                ? "./src/environments/environment.production.ts"
                : env === "qa"
                    ? "./src/environments/environment.qa.ts"
                    : "./src/environments/environment.development.ts";
        return environmentFile;
      })(),
    },
  },

  webpack: (config) => {
    const env =
        process.env.NEXT_PUBLIC_ENV || process.env.NODE_ENV || "development";
    const environmentFile =
        env === "production"
            ? "environment.production.ts"
            : env === "qa"
                ? "environment.qa.ts"
                : "environment.development.ts";
    config.resolve.alias = {
      ...config.resolve.alias,
      "@/environments/environment$": require("path").resolve(
          __dirname,
          `src/environments/${environmentFile}`
      ),
    };
    return config;
  },
};

export default nextConfig;
