/** @type {import('next').NextConfig} */

const nextConfig = {
    output: 'export',
     reactStrictMode: true,
     // Note: This feature is required to use NextJS Image in SSG mode.
     // See https://nextjs.org/docs/messages/export-image-api for different workarounds.
     images: {
       unoptimized: true,
     },
     eslint: {
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true,
    },
   };
   
   module.exports = nextConfig;