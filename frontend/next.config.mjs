import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove output: 'export' to use the regular build process
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  ...nextConfig,
});