import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'companieslogo.com',
      },
      {
        protocol: 'https',
        hostname: 'static.tacdn.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'www.expedia.com',
      },
      {
        protocol: 'https',
        hostname: 'www.travelsansr.com',
      },
      {
        protocol: 'https',
        hostname: 'backendtsa.travelsansr.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'www.vectorlogo.zone',
      }
    ],
  },
};

export default nextConfig;
