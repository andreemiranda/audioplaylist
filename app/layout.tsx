import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://omapadosucesso.netlify.app"),
  title: "Audio Book - O Mapa do Sucesso",
  description: "Audio book player for O Mapa do Sucesso by Lourivan Catsro, featuring chapter playlist, playback controls, progress seeking, and volume management.",
  alternates: {
    canonical: "https://omapadosucesso.netlify.app",
  },
  openGraph: {
    title: "Audio Book - O Mapa do Sucesso",
    description: "Audio book player for O Mapa do Sucesso by Lourivan Catsro",
    url: "https://omapadosucesso.netlify.app",
    siteName: "O Mapa do Sucesso",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
