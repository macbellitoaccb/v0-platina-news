/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['assets.reedpopcdn.com', 'image.api.playstation.com', 'cdn.mos.cms.futurecdn.net', 'cdn.vox-cdn.com', 'www.psu.com', 'meups.com.br', 'sm.ign.com', 'files.tecnoblog.net', 'cdn.akamai.steamstatic.com', 'assets.xboxservices.com', 'www.pcgamesn.com', 'i.pravatar.cc'],
    unoptimized: true,
  }
}

export default nextConfig
