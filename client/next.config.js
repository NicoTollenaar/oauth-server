/** @type {import('next').NextConfig} */
const nextConfig = {
  // below is from mongoose documentation: https://mongoosejs.com/docs/nextjs.html
  //   experimental: {
  //     esmExternals: "loose", // <-- add this (NT: add "@types/mongoose"?)
  //     serverComponentsExternalPackages: ["mongoose"], // <-- and this
  //   },
  //   // and the following to enable top-level await support for Webpack
  //   webpack: (config) => {
  //     config.experiments = {
  //       topLevelAwait: true,
  //     };
  //     return config;
  //   },
};

module.exports = nextConfig;
