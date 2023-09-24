/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: './.next',
};

module.exports = async (phase, { defaultConfig }) => {
  return nextConfig;
};
