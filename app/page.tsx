"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { PLAYLIST, Track } from "@/lib/playlist";
import AudioPlayer from "@/components/AudioPlayer";
import TrackList from "@/components/TrackList";
import {
  BookOpen,
  Headphones,
  CheckCircle2,
  Clock,
  Sparkles,
  Info,
  BookmarkCheck,
  Share2,
} from "lucide-react";

export default function HomePage() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bookmarkedTracks, setBookmarkedTracks] = useState<number[]>([]);
  const [hasLoadedSavedState, setHasLoadedSavedState] = useState(false);
  const [showCopiedToast, setShowCopiedToast] = useState(false);

  // Restore saved track index and bookmarks from localStorage
  useEffect(() => {
    try {
      const savedIndex = localStorage.getItem("audioplayer_current_track");
      if (savedIndex !== null) {
        const idx = parseInt(savedIndex, 10);
        if (!isNaN(idx) && idx >= 0 && idx < PLAYLIST.length) {
          setCurrentTrackIndex(idx);
        }
      }

      const savedBookmarks = localStorage.getItem("audioplayer_bookmarks");
      if (savedBookmarks) {
        setBookmarkedTracks(JSON.parse(savedBookmarks));
      }
    } catch {
      // ignore in sandboxed environments
    }
    setHasLoadedSavedState(true);
  }, []);

  // Persist current track index
  const handleTrackChange = (index: number) => {
    setCurrentTrackIndex(index);
    try {
      localStorage.setItem("audioplayer_current_track", index.toString());
    } catch {}
  };

  // Toggle bookmark for a chapter
  const handleToggleBookmark = (trackId: number) => {
    setBookmarkedTracks((prev) => {
      const updated = prev.includes(trackId)
        ? prev.filter((id) => id !== trackId)
        : [...prev, trackId];
      try {
        localStorage.setItem("audioplayer_bookmarks", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleShare = async () => {
    const shareUrl =
      typeof window !== "undefined" && window.location.origin.includes("localhost")
        ? window.location.href
        : "https://omapadosucesso.netlify.app";

    const shareData = {
      title: "Audio Book - O Mapa do Sucesso",
      text: `Ouvindo ${PLAYLIST[currentTrackIndex]?.title || "Audio Book"} - O Mapa do Sucesso de Lourivan Catsro`,
      url: shareUrl,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setShowCopiedToast(true);
      setTimeout(() => setShowCopiedToast(false), 2500);
    }
  };

  const activeTrack = PLAYLIST[currentTrackIndex];

  return (
    <main className="min-h-screen relative flex flex-col justify-between text-slate-100 overflow-x-hidden">
      {/* Background with the original planodefundoapp.jpg */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <Image
          src="/planodefundoapp.jpg"
          alt="Plano de Fundo O Mapa do Sucesso"
          fill
          priority
          className="object-cover object-center opacity-25 filter blur-sm scale-105"
          referrerPolicy="no-referrer"
        />
        {/* Darkening gradient overlays for contrast and readability */}
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-slate-900/80" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
              <BookOpen className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-800/50">
                  Edição Completa
                </span>
                <span className="text-xs text-slate-400">• Narrado em Português</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
                O Mapa do Sucesso
              </h1>
              <p className="text-sm text-slate-400">
                Por <span className="text-slate-200 font-medium">Lourivan Catsro</span>
              </p>
            </div>
          </div>

          {/* Quick Info & Share */}
          <div className="flex items-center gap-3 self-start sm:self-center">
            <div className="hidden md:flex flex-col text-right text-xs">
              <span className="text-slate-300 font-medium">39 Capítulos</span>
              <span className="text-slate-500">Audio Book Oficial</span>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/70 text-slate-200 text-xs font-medium transition-colors"
              title="Compartilhar livro"
            >
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>Compartilhar</span>
            </button>
          </div>
        </header>

        {/* Toast for Copied link */}
        {showCopiedToast && (
          <div className="fixed top-6 right-6 z-50 bg-cyan-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold shadow-xl animate-bounce">
            Link copiado para a área de transferência!
          </div>
        )}

        {/* Content Grid: Audio Player + Chapter List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
          {/* Main Audio Player Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <AudioPlayer
              tracks={PLAYLIST}
              currentTrackIndex={currentTrackIndex}
              onTrackChange={handleTrackChange}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
            />

            {/* Book Details and Overview Card */}
            <div className="p-5 sm:p-6 bg-slate-900/70 backdrop-blur-md rounded-2xl border border-slate-800 shadow-lg text-sm text-slate-300">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold mb-3">
                <Info className="w-4 h-4" />
                <h4>Sobre a Obra</h4>
              </div>
              <p className="text-slate-300 leading-relaxed mb-4 text-xs sm:text-sm">
                <strong>O Mapa do Sucesso</strong> é um guia narrado com ensinamentos práticos e estratégias para desenvolvimento pessoal, liderança e conquistas. Esta aplicação permite a reprodução contínua dos 39 capítulos organizados em ordem cronológica de leitura com suporte a marcadores e busca rápida de tópicos.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-xs">
                <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 block">Autor</span>
                  <span className="font-semibold text-slate-200">Lourivan Catsro</span>
                </div>
                <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 block">Capítulos</span>
                  <span className="font-semibold text-slate-200">39 faixas de áudio</span>
                </div>
                <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80 col-span-2 sm:col-span-1">
                  <span className="text-slate-500 block">Formatos</span>
                  <span className="font-semibold text-slate-200">MP3 & OGG HD</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chapters Playlist Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <TrackList
              tracks={PLAYLIST}
              currentTrackIndex={currentTrackIndex}
              isPlaying={isPlaying}
              onSelectTrack={handleTrackChange}
              bookmarkedTracks={bookmarkedTracks}
              onToggleBookmark={handleToggleBookmark}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 pt-6 border-t border-slate-800/80 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} O Mapa do Sucesso • Desenvolvido com base na obra de Lourivan Catsro.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Next.js App Router</span>
            <span>•</span>
            <span>Áudio Playlist Player</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
