"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { PLAYLIST } from "@/lib/playlist";
import AudioPlayer from "@/components/AudioPlayer";
import TrackList from "@/components/TrackList";
import { BookOpen, Share2 } from "lucide-react";
import { PWAInstallButton } from "@/components/PWAInstallButton";

export default function HomePage() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bookmarkedTracks, setBookmarkedTracks] = useState<number[]>([]);
  const [showCopiedToast, setShowCopiedToast] = useState(false);

  // Restore saved track index and bookmarks
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
      // ignore
    }
  }, []);

  const handleTrackChange = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    try {
      localStorage.setItem("audioplayer_current_track", index.toString());
    } catch {}
  };

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

  return (
    <main className="position-relative min-vh-100 d-flex flex-column justify-content-between overflow-x-hidden">
      {/* Background artwork overlay */}
      <div className="app-bg-backdrop">
        <Image
          src="/planodefundoapp.jpg"
          alt="Plano de Fundo"
          fill
          priority
          className="app-bg-image"
          referrerPolicy="no-referrer"
        />
        <div className="app-bg-overlay" />
      </div>

      {/* Main Container */}
      <div className="container py-4 position-relative z-1 flex-grow-1 d-flex flex-column">
        {/* Header */}
        <header className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 pb-3 mb-4 border-bottom border-secondary border-opacity-25">
          <div className="d-flex align-items-center gap-3">
            <div
              className="rounded-3 d-flex align-items-center justify-content-center shadow-sm flex-shrink-0"
              style={{
                width: 48,
                height: 48,
                background: "linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)",
                color: "#0b111e",
              }}
            >
              <BookOpen size={24} />
            </div>

            <div>
              <h1 className="h3 text-white fw-bold mb-0 tracking-tight">
                O Mapa do Sucesso
              </h1>
              <div className="text-secondary small">
                Por <span className="text-light fw-medium">Lourivan Catsro</span>
              </div>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="d-flex align-items-center gap-2 align-self-start align-self-sm-center">
            <PWAInstallButton />

            <button
              type="button"
              onClick={handleShare}
              className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1.5 rounded-3"
              title="Compartilhar"
            >
              <Share2 size={14} className="text-info" />
              <span>Compartilhar</span>
            </button>
          </div>
        </header>

        {/* Toast for Copied link */}
        {showCopiedToast && (
          <div
            className="toast align-items-center text-bg-info border-0 show position-fixed top-0 end-0 m-3"
            role="alert"
            style={{ zIndex: 1070 }}
          >
            <div className="d-flex">
              <div className="toast-body small fw-bold text-dark">
                Link copiado para a área de transferência!
              </div>
            </div>
          </div>
        )}

        {/* Content Layout: Audio Player (7) + Chapter List (5) */}
        <div className="row g-4 flex-grow-1 align-items-start">
          <div className="col-lg-7">
            <AudioPlayer
              tracks={PLAYLIST}
              currentTrackIndex={currentTrackIndex}
              onTrackChange={handleTrackChange}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
            />
          </div>

          <div className="col-lg-5">
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

        {/* Clean, minimal Footer without implementation comments */}
        <footer className="mt-5 pt-3 border-top border-secondary border-opacity-25 text-center text-secondary small">
          <p className="mb-0">
            © {new Date().getFullYear()} O Mapa do Sucesso • Lourivan Catsro
          </p>
        </footer>
      </div>
    </main>
  );
}
