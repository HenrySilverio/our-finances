/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MONGODB_URI:
      process.env.MONGODB_URI ||
      "mongodb+srv://silveriohenriqueb:hOwQUMTo4zoiIWET@cluster0.ey1dlz6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  },
};

module.exports = nextConfig;
