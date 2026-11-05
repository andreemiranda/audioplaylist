import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { OfflineIndicator } from "@/components/OfflineIndicator";

export const viewport: Viewport = {
  themeColor: "#06b6d4",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://omapadosucesso.netlify.app"),
  title: "Audio Book – O Mapa do Sucesso | Lourivan Catsro",
  description:
    "Ouça o audiolivro completo O Mapa do Sucesso de Lourivan Catsro com 39 capítulos narrados em áudio de alta definição, reprodução contínua automática, controle de velocidade e marcadores.",
  applicationName: "O Mapa do Sucesso",
  authors: [{ name: "Lourivan Catsro" }],
  creator: "Lourivan Catsro",
  publisher: "Lourivan Catsro",
  keywords: [
    "audiobook",
    "o mapa do sucesso",
    "lourivan catsro",
    "audiolivro",
    "livro narrado",
    "desenvolvimento pessoal",
    "sucesso",
    "reproducao continua",
  ],
  alternates: {
    canonical: "https://omapadosucesso.netlify.app",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MapaSucesso",
  },
  openGraph: {
    title: "O Mapa do Sucesso – Audio Book Oficial | Lourivan Catsro",
    description:
      "Audiolivro completo com 39 capítulos narrados em alta definição. Reprodução contínua automática do início ao fim com player interativo.",
    url: "https://omapadosucesso.netlify.app",
    siteName: "O Mapa do Sucesso",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "https://omapadosucesso.netlify.app/og-cover.png",
        width: 1200,
        height: 630,
        alt: "Capa do Audio Book O Mapa do Sucesso - Lourivan Catsro",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "O Mapa do Sucesso – Audio Book Oficial | Lourivan Catsro",
    description:
      "Ouça o audiolivro completo com 39 capítulos narrados em áudio HD com reprodução contínua automática.",
    images: ["https://omapadosucesso.netlify.app/og-cover.png"],
    creator: "Lourivan Catsro",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Audiobook",
  name: "O Mapa do Sucesso",
  description:
    "Audiolivro completo O Mapa do Sucesso de Lourivan Catsro com 39 capítulos narrados em sequência contínua.",
  author: {
    "@type": "Person",
    name: "Lourivan Catsro",
  },
  readBy: {
    "@type": "Person",
    name: "Lourivan Catsro",
  },
  bookFormat: "https://schema.org/AudiobookFormat",
  inLanguage: "pt-BR",
  numberOfPages: 39,
  image: "https://omapadosucesso.netlify.app/cover.jpg",
  url: "https://omapadosucesso.netlify.app",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "BRL",
    availability: "https://schema.org/InStock",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        <ServiceWorkerRegister />
        <OfflineIndicator />
        {children}
      </body>
    </html>
  );
}
