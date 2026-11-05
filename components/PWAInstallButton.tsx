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
      <span className="badge bg-success-subtle text-success border border-success-subtle d-inline-flex align-items-center gap-1 px-2.5 py-1.5 rounded-pill">
        <Check size={14} />
        <span>Instalado</span>
      </span>
    );
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        type="button"
        onClick={async () => {
          setInstalling(true);
          await install();
          setInstalling(false);
        }}
        disabled={installing}
        className="btn btn-sm btn-primary d-inline-flex align-items-center gap-1.5 rounded-3 fw-semibold shadow-sm"
      >
        <Download size={14} />
        <span>Instalar App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-1.5 rounded-3"
        >
          <Smartphone size={14} className="text-info" />
          <span>Instalar no iOS</span>
        </button>

        {showIOSGuide && (
          <div
            className="modal d-block"
            tabIndex={-1}
            style={{ backgroundColor: "rgba(0, 0, 0, 0.75)", zIndex: 1055 }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content glass-card text-light p-3 border border-secondary border-opacity-50">
                <div className="modal-header border-0 pb-2">
                  <h6 className="modal-title fw-bold text-white d-flex align-items-center gap-2">
                    <Smartphone size={18} className="text-info" />
                    Instalar no iPhone / iPad
                  </h6>
                  <button
                    type="button"
                    onClick={() => setShowIOSGuide(false)}
                    className="btn btn-sm btn-link text-secondary p-0"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="modal-body small text-secondary">
                  <div className="mb-2">
                    1. No Safari, toque no botão <strong>Compartilhar</strong> (ícone com seta para cima).
                  </div>
                  <div className="mb-2">
                    2. Role para baixo e selecione <strong>&quot;Adicionar à Tela de Início&quot;</strong>.
                  </div>
                  <div>
                    3. Toque em <strong>Adicionar</strong> no canto superior direito.
                  </div>
                </div>

                <div className="modal-footer border-0 pt-0">
                  <button
                    type="button"
                    onClick={() => setShowIOSGuide(false)}
                    className="btn btn-sm btn-secondary w-100 rounded-3"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setShowDesktopGuide(true)}
        className="btn btn-sm btn-outline-secondary d-none d-sm-inline-flex align-items-center gap-1.5 rounded-3"
      >
        <Download size={14} className="text-info" />
        <span>Instalar App</span>
      </button>

      {showDesktopGuide && (
        <div
          className="modal d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0, 0, 0, 0.75)", zIndex: 1055 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content glass-card text-light p-3 border border-secondary border-opacity-50">
              <div className="modal-header border-0 pb-2">
                <h6 className="modal-title fw-bold text-white d-flex align-items-center gap-2">
                  <Download size={18} className="text-info" />
                  Instalar Aplicativo
                </h6>
                <button
                  type="button"
                  onClick={() => setShowDesktopGuide(false)}
                  className="btn btn-sm btn-link text-secondary p-0"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="modal-body small text-secondary">
                <p className="mb-2 text-light">
                  Para instalar no seu celular ou computador:
                </p>
                <ul className="ps-3 mb-0">
                  <li className="mb-1">No Chrome/Edge: clique no ícone de instalação na barra de navegação.</li>
                  <li className="mb-1">No Android: abra o menu (⋮) e toque em &quot;Instalar aplicativo&quot;.</li>
                  <li>No iPhone/iPad: toque em Compartilhar e &quot;Adicionar à Tela de Início&quot;.</li>
                </ul>
              </div>

              <div className="modal-footer border-0 pt-0">
                <button
                  type="button"
                  onClick={() => setShowDesktopGuide(false)}
                  className="btn btn-sm btn-primary w-100 rounded-3"
                >
                  Entendi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
