"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Track } from "@/lib/playlist";
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
  Volume1,
  Shuffle,
  Repeat,
  Repeat1,
  ListMusic,
  BookOpen,
  Headphones,
  Gauge,
  Sparkles,
} from "lucide-react";

interface AudioPlayerProps {
  tracks: Track[];
  currentTrackIndex: number;
  onTrackChange: (index: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export default function AudioPlayer({
  tracks,
  currentTrackIndex,
  onTrackChange,
  isPlaying,
  setIsPlaying,
}: AudioPlayerProps) {
  const currentTrack = tracks[currentTrackIndex] || tracks[0];

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const volumeBarRef = useRef<HTMLDivElement | null>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(0.8);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "all" | "one">("off");
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [sourceIndex, setSourceIndex] = useState(0);

  // Define potential audio source URLs to fallback through if needed
  const getSources = useCallback((track: Track) => {
    return [
      track.mp3,
      track.oga,
      track.remoteMp3,
      track.remoteOga,
    ];
  }, []);

  const sources = getSources(currentTrack);
  const activeSrc = sources[sourceIndex] || currentTrack.mp3;

  // Restore stored volume / speed / track on initial mount
  useEffect(() => {
    try {
      const savedVolume = localStorage.getItem("audioplayer_volume");
      if (savedVolume !== null) {
        const v = parseFloat(savedVolume);
        if (!isNaN(v) && v >= 0 && v <= 1) {
          setVolume(v);
          if (audioRef.current) audioRef.current.volume = v;
        }
      }
      const savedRate = localStorage.getItem("audioplayer_rate");
      if (savedRate !== null) {
        const r = parseFloat(savedRate);
        if (!isNaN(r)) {
          setPlaybackRate(r);
          if (audioRef.current) audioRef.current.playbackRate = r;
        }
      }
      const savedShuffle = localStorage.getItem("audioplayer_shuffle");
      if (savedShuffle !== null) {
        setIsShuffle(savedShuffle === "true");
      }
      const savedRepeat = localStorage.getItem("audioplayer_repeat");
      if (savedRepeat === "off" || savedRepeat === "all" || savedRepeat === "one") {
        setRepeatMode(savedRepeat);
      }
    } catch {
      // localStorage may fail in private mode
    }
  }, []);

  // Sync source and reset source index when track changes
  useEffect(() => {
    setSourceIndex(0);
    setAudioError(null);
    setCurrentTime(0);
    setDuration(0);
  }, [currentTrackIndex]);

  // Audio update handlers
  const handleTimeUpdate = () => {
    if (audioRef.current && !isSeeking) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
      setIsLoadingAudio(false);
      setAudioError(null);
      if (isPlaying) {
        audioRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      }
    }
  };

  const handleNext = useCallback(() => {
    if (isShuffle) {
      const remainingIndices = tracks
        .map((_, i) => i)
        .filter((i) => i !== currentTrackIndex);
      const randomIndex =
        remainingIndices[Math.floor(Math.random() * remainingIndices.length)];
      onTrackChange(randomIndex);
    } else {
      if (currentTrackIndex < tracks.length - 1) {
        onTrackChange(currentTrackIndex + 1);
      } else if (repeatMode === "all") {
        onTrackChange(0);
      } else {
        setIsPlaying(false);
      }
    }
  }, [currentTrackIndex, isShuffle, onTrackChange, repeatMode, setIsPlaying, tracks]);

  const handlePrevious = useCallback(() => {
    if (audioRef.current && audioRef.current.currentTime > 4) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }
    if (currentTrackIndex > 0) {
      onTrackChange(currentTrackIndex - 1);
    } else {
      onTrackChange(tracks.length - 1);
    }
  }, [currentTrackIndex, onTrackChange, tracks.length]);

  const handleEnded = useCallback(() => {
    if (repeatMode === "one") {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      handleNext();
    }
  }, [handleNext, repeatMode]);

  const handleAudioError = () => {
    const nextIdx = sourceIndex + 1;
    if (nextIdx < sources.length) {
      console.warn(`Audio error on ${activeSrc}, trying fallback: ${sources[nextIdx]}`);
      setSourceIndex(nextIdx);
    } else {
      setAudioError("Não foi possível carregar este áudio.");
      setIsLoadingAudio(false);
      setIsPlaying(false);
    }
  };

  // Play / Pause toggle
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error("Play error:", err);
          setIsPlaying(false);
        });
    }
  };

  // Stop playback (pause and rewind to 0)
  const handleStop = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
    setIsPlaying(false);
  };

  // Skip 15s forward / backward
  const skipTime = (offset: number) => {
    if (!audioRef.current) return;
    const newTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + offset));
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Seek bar interaction
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !audioRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const targetTime = pos * duration;
    audioRef.current.currentTime = targetTime;
    setCurrentTime(targetTime);
  };

  // Volume interaction
  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!volumeBarRef.current || !audioRef.current) return;
    const rect = volumeBarRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setVolume(pos);
    setIsMuted(pos === 0);
    audioRef.current.volume = pos;
    try {
      localStorage.setItem("audioplayer_volume", pos.toString());
    } catch {}
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      const restored = previousVolume || 0.8;
      setIsMuted(false);
      setVolume(restored);
      audioRef.current.volume = restored;
    } else {
      setPreviousVolume(volume);
      setIsMuted(true);
      setVolume(0);
      audioRef.current.volume = 0;
    }
  };

  const setMaxVolume = () => {
    if (!audioRef.current) return;
    setIsMuted(false);
    setVolume(1);
    audioRef.current.volume = 1;
    try {
      localStorage.setItem("audioplayer_volume", "1");
    } catch {}
  };

  const cycleRepeatMode = () => {
    const nextMode =
      repeatMode === "off" ? "all" : repeatMode === "all" ? "one" : "off";
    setRepeatMode(nextMode);
    try {
      localStorage.setItem("audioplayer_repeat", nextMode);
    } catch {}
  };

  const toggleShuffle = () => {
    const nextVal = !isShuffle;
    setIsShuffle(nextVal);
    try {
      localStorage.setItem("audioplayer_shuffle", String(nextVal));
    } catch {}
  };

  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
    try {
      localStorage.setItem("audioplayer_rate", rate.toString());
    } catch {}
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        skipTime(-10);
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        skipTime(10);
      } else if (e.code === "KeyM") {
        e.preventDefault();
        toggleMute();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex flex-col bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-700/70 shadow-2xl overflow-hidden">
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={activeSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={handleAudioError}
        onWaiting={() => setIsLoadingAudio(true)}
        onPlaying={() => {
          setIsLoadingAudio(false);
          setIsPlaying(true);
        }}
        onPause={() => setIsPlaying(false)}
        preload="metadata"
      />

      {/* Blue Monday / Modern Audiobook Interface Header */}
      <div className="relative p-6 sm:p-8 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border-b border-slate-800">
        {/* Subtle glowing backdrop highlight */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          {/* Top badges */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                <Headphones className="w-3.5 h-3.5" />
                Audio Book Player
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                {currentTrackIndex + 1} de {tracks.length}
              </span>
            </div>

            {/* Playback Speed selector */}
            <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs">
              <Gauge className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-0.5" />
              {[0.75, 1, 1.25, 1.5, 2].map((rate) => (
                <button
                  key={rate}
                  onClick={() => handleRateChange(rate)}
                  className={`px-2 py-0.5 rounded-md font-medium transition-colors ${
                    playbackRate === rate
                      ? "bg-cyan-500 text-slate-950 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>

          {/* Current Chapter Display */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-cyan-400 font-bold mb-1">
                O Mapa do Sucesso • Lourivan Catsro
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {currentTrack.title}
              </h2>
              {currentTrack.part && (
                <p className="text-sm text-cyan-300/80 mt-1 font-medium">
                  {currentTrack.part}
                </p>
              )}
            </div>

            {/* Animated Equalizer Waves */}
            <div className="flex items-end gap-1 h-9 px-3 py-1.5 bg-slate-950/60 rounded-xl border border-slate-800 self-start sm:self-center">
              {[40, 75, 100, 60, 90, 45, 80, 55].map((height, i) => (
                <span
                  key={i}
                  className={`w-1 rounded-full transition-all duration-300 ${
                    isPlaying
                      ? "bg-gradient-to-t from-cyan-500 to-blue-400 animate-pulse"
                      : "bg-slate-700"
                  }`}
                  style={{
                    height: isPlaying ? `${height}%` : "20%",
                    animationDelay: `${i * 90}ms`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Error Message if any */}
          {audioError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
              <span>{audioError}</span>
              <button
                onClick={() => {
                  setSourceIndex(0);
                  setAudioError(null);
                }}
                className="underline hover:text-rose-200 text-xs ml-3"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {/* Progress Seek Bar */}
          <div className="space-y-2 mb-6">
            <div
              ref={progressBarRef}
              onClick={handleSeek}
              className="group relative h-3 bg-slate-800 rounded-full cursor-pointer overflow-hidden border border-slate-700/60 hover:h-4 transition-all"
            >
              {/* Buffer / background bar */}
              <div
                className="absolute left-0 top-0 bottom-0 bg-cyan-400/20"
                style={{ width: "100%" }}
              />

              {/* Played progress bar */}
              <div
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-300 rounded-full group-hover:from-blue-400 group-hover:to-cyan-300 transition-all shadow-md"
                style={{ width: `${progressPercent}%` }}
              />

              {/* Scrubber head */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity -ml-2 pointer-events-none"
                style={{ left: `${progressPercent}%` }}
              />
            </div>

            {/* Time Indicators */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 font-medium">
              <span>{formatTime(currentTime)}</span>
              <span className="text-slate-500 text-[11px]">
                {isLoadingAudio ? "Carregando faixa..." : ""}
              </span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Main Controls row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Left Controls: Shuffle & Repeat */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleShuffle}
                className={`p-2.5 rounded-xl transition-all border ${
                  isShuffle
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm"
                    : "bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200 hover:bg-slate-800"
                }`}
                title={isShuffle ? "Modo aleatório ativado" : "Ativar modo aleatório"}
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button
                onClick={cycleRepeatMode}
                className={`p-2.5 rounded-xl transition-all border flex items-center gap-1 ${
                  repeatMode !== "off"
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm"
                    : "bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200 hover:bg-slate-800"
                }`}
                title={
                  repeatMode === "one"
                    ? "Repetindo este capítulo"
                    : repeatMode === "all"
                    ? "Repetindo toda a lista"
                    : "Repetição desativada"
                }
              >
                {repeatMode === "one" ? (
                  <Repeat1 className="w-4 h-4 text-cyan-300" />
                ) : (
                  <Repeat className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={handleStop}
                className="p-2.5 rounded-xl bg-slate-800/60 text-slate-400 border border-slate-700/60 hover:text-slate-200 hover:bg-slate-800 transition-all"
                title="Parar reprodução (Stop)"
              >
                <Square className="w-4 h-4" />
              </button>
            </div>

            {/* Center Controls: Skip -15, Prev, Play/Pause, Next, Skip +15 */}
            <div className="flex items-center gap-2 sm:gap-3 mx-auto">
              <button
                onClick={() => skipTime(-15)}
                className="p-2 sm:p-2.5 rounded-xl bg-slate-800/70 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60 transition-colors"
                title="Voltar 15 segundos"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={handlePrevious}
                className="p-2.5 sm:p-3 rounded-xl bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 border border-slate-700/80 transition-colors shadow-sm"
                title="Capítulo anterior"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={togglePlay}
                disabled={isLoadingAudio && !duration}
                className="p-4 sm:p-5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 font-bold hover:from-cyan-400 hover:to-blue-500 transition-all transform active:scale-95 shadow-lg shadow-cyan-500/25 disabled:opacity-50"
                title={isPlaying ? "Pausar" : "Reproduzir"}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 fill-current text-slate-950" />
                ) : (
                  <Play className="w-6 h-6 fill-current text-slate-950 ml-0.5" />
                )}
              </button>

              <button
                onClick={handleNext}
                className="p-2.5 sm:p-3 rounded-xl bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 border border-slate-700/80 transition-colors shadow-sm"
                title="Próximo capítulo"
              >
                <SkipForward className="w-5 h-5" />
              </button>

              <button
                onClick={() => skipTime(15)}
                className="p-2 sm:p-2.5 rounded-xl bg-slate-800/70 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60 transition-colors"
                title="Avançar 15 segundos"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            {/* Right Controls: Volume slider & max volume */}
            <div className="flex items-center gap-2 min-w-[170px] justify-end">
              <button
                onClick={toggleMute}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-200 transition-colors"
                title={isMuted ? "Ativar som" : "Mudo"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : volume < 0.5 ? (
                  <Volume1 className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                )}
              </button>

              {/* Volume track */}
              <div
                ref={volumeBarRef}
                onClick={handleVolumeChange}
                className="w-24 sm:w-28 h-2 bg-slate-800 rounded-full cursor-pointer relative overflow-hidden border border-slate-700/60 group"
                title={`Volume: ${Math.round(volume * 100)}%`}
              >
                <div
                  className="h-full bg-cyan-400 rounded-full transition-all group-hover:bg-cyan-300"
                  style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                />
              </div>

              <button
                onClick={setMaxVolume}
                className="text-[11px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 hover:text-cyan-300 border border-slate-700/60 font-mono transition-colors"
                title="Volume Máximo (100%)"
              >
                MAX
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Hint Bar */}
      <div className="px-6 py-2.5 bg-slate-950/70 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/60">
        <div className="flex items-center gap-3">
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">
              Espaço
            </kbd>{" "}
            Play/Pause
          </span>
          <span className="hidden sm:inline">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">
              ←
            </kbd>{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">
              →
            </kbd>{" "}
            ±10s
          </span>
          <span className="hidden md:inline">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">
              M
            </kbd>{" "}
            Mudo
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-cyan-400/90 font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Áudio em alta definição</span>
        </div>
      </div>
    </div>
  );
}
