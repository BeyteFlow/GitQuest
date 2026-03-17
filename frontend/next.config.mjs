/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Make the backend base URL available to Server Components through env.
  // Client Components use NEXT_PUBLIC_API_BASE_URL set in .env.local / Vercel.
  env: {
    NEXT_PUBLIC_API_BASE_URL:
      process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5198",
  },
}

export default nextConfig
