import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  // Permite conexiones desde otros dispositivos en la red local (ej: tu teléfono)
  allowedDevOrigins: ['192.168.1.8'],
};

export default nextConfig;
