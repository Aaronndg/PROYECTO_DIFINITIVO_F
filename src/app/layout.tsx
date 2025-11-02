import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Break_IA - Bienestar Emocional Cristiano",
  description: "Aplicación cristiana para el bienestar emocional y psicológico basada en las Escrituras",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} font-sans antialiased bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
