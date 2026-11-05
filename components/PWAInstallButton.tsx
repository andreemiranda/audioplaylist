"use client";

import React, { useState } from "react";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { Download, Smartphone, X, Check } from "lucide-react";

export function PWAInstallButton() {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showDesktopGuide, setShowDesktopGuide] = useState(false);
  const [installing, setInstalling] = useState(false);

  // If already running as an installed PWA, hide
  if (isInstalled) {
    return (
      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-800/40 text-cyan-300 text-xs">
        <Check className="w-3.5 h-3.5 text-cyan-400" />
        <span>App Instalado</span>
      </div>
    );
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={async () => {
          setInstalling(true);
          await install();
          setInstalling(false);
        }}
        disabled={installing}
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all transform active:scale-95 cursor-pointer"
        title="Instalar aplicativo no dispositivo"
      >
        <Download className="w-4 h-4" />
        <span>Instalar App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/70 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
          title="Instalar no iPhone ou iPad"
        >
          <Smartphone className="w-4 h-4 text-cyan-400" />
          <span>Instalar no iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-bold text-white text-base">Instalar no iPhone / iPad</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 text-xs font-bold shrink-0 border border-cyan-800">
                    1
                  </span>
                  <p>
                    No Safari, toque no botão <strong>Compartilhar</strong> (ícone de quadrado com seta para cima).
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 text-xs font-bold shrink-0 border border-cyan-800">
                    2
                  </span>
                  <p>
                    Role o menu para baixo e toque em <strong>&quot;Adicionar à Tela de Início&quot;</strong>.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 text-xs font-bold shrink-0 border border-cyan-800">
                    3
                  </span>
                  <p>
                    Toque em <strong>Adicionar</strong> no canto superior direito para concluir.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-colors"
              >
                Entendi
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowDesktopGuide(true)}
        className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
        title="Instalar como aplicativo no celular ou computador"
      >
        <Download className="w-3.5 h-3.5 text-cyan-400" />
        <span>Instalar App</span>
      </button>

      {showDesktopGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white text-base">Instalar Aplicativo</h3>
              </div>
              <button
                onClick={() => setShowDesktopGuide(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-slate-300 mb-4">
              Você pode instalar este audiolivro diretamente no seu dispositivo para acesso rápido:
            </p>
            <ul className="space-y-2 text-xs text-slate-400 list-disc list-inside mb-4">
              <li>No Chrome ou Edge: clique no ícone de instalação na barra de endereço do navegador.</li>
              <li>No celular Android: abra o menu do navegador (⋮) e toque em &quot;Instalar aplicativo&quot;.</li>
              <li>No iPhone/iPad: toque em Compartilhar e depois &quot;Adicionar à Tela de Início&quot;.</li>
            </ul>

            <button
              onClick={() => setShowDesktopGuide(false)}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-bold transition-colors"
            >
              Concluir
            </button>
          </div>
        </div>
      )}
    </>
  );
}
