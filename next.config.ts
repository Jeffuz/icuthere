import withPWA from 'next-pwa';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

const config = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
})(nextConfig);

export default config;
