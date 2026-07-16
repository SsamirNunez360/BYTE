import type { Metadata } from "next";
import Image from "next/image";
import "./globals.css";
import ThemeProvider from "../contexts/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";

import { Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Sistema de Planificación Académica — UNAH",
  description: "Sistema oficial de planificación académica para estudiantes de Ingeniería en Sistemas Computacionales - Universidad Nacional Autónoma de Honduras",
  keywords: "UNAH, planificación académica, ingeniería en sistemas, plan de estudios",
  authors: [{ name: "Universidad Nacional Autónoma de Honduras" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <ThemeProvider>
          {/* Header Institucional */}
          <header className="institutional-header">
            <div className="header-content">
              <div className="university-info">
                <div className="university-logos">
                  <div className="university-logo university-logo-unah">
                    <Image
                      src="/unah-logo.png"
                      alt="Escudo de la Universidad Nacional Autónoma de Honduras"
                      width={64}
                      height={84}
                      className="university-logo-image"
                      priority
                    />
                  </div>
                  <div className="university-logo university-logo-isc">
                    <Image
                      src="/isc-unah-logo.png"
                      alt="Logo de Ingeniería en Sistemas Computacionales UNAH"
                      width={72}
                      height={72}
                      className="university-logo-image"
                      priority
                    />
                  </div>
                </div>
                <div className="university-details">
                  <h1>Universidad Nacional Autónoma de Honduras</h1>
                  <p>Campus Choluteca — Ingeniería en Sistemas Computacionales</p>
                </div>
              </div>
              <div className="header-controls">
                <ThemeToggle />

              </div>
            </div>
          </header>

        {/* Contenido Principal */}
        <div className="main-container">
          {children}
        </div>

        {/* Footer Institucional */}
        <footer className="institutional-footer">
          <div className="footer-content">
            <div className="footer-info">
              <p><strong>Universidad Nacional Autónoma de Honduras</strong></p>
              <p>Campus Choluteca — Ingeniería en Sistemas Computacionales</p>
              <p>Sistema de Planificación Académica v2.1 — 2026</p>
            </div>

          </div>
        </footer>
        </ThemeProvider>
        </body>
      </html>
    );
  }
