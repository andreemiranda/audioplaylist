"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
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
  const autoPlayNextRef = useRef<boolean>(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(0.85);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "all" | "one">("off");
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [sourceIndex, setSourceIndex] = useState(0);

  // Audio source fallback hierarchy
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

  // Restore stored volume / speed / shuffle on initial mount
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
      // ignore
    }
  }, []);

  // Reset source index on track change
  useEffect(() => {
    setSourceIndex(0);
    setAudioError(null);
    setCurrentTime(0);
    setDuration(0);
  }, [currentTrackIndex]);

  // Handler refs for mediaSession
  const handleNextRef = useRef<() => void>(() => {});
  const handlePreviousRef = useRef<() => void>(() => {});
  const skipTimeRef = useRef<(offset: number) => void>(() => {});

  // MediaSession API setup
  useEffect(() => {
    if ("mediaSession" in navigator && currentTrack) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title + (currentTrack.part ? ` - ${currentTrack.part}` : ""),
        artist: "Lourivan Catsro",
        album: "O Mapa do Sucesso",
        artwork: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "/cover.jpg", sizes: "800x800", type: "image/jpeg" },
        ],
      });

      navigator.mediaSession.setActionHandler("play", () => {
        audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => {});
      });
      navigator.mediaSession.setActionHandler("pause", () => {
        audioRef.current?.pause();
        setIsPlaying(false);
      });
      navigator.mediaSession.setActionHandler("previoustrack", () => {
        handlePreviousRef.current();
      });
      navigator.mediaSession.setActionHandler("nexttrack", () => {
        handleNextRef.current();
      });
      navigator.mediaSession.setActionHandler("seekbackward", () => {
        skipTimeRef.current(-10);
      });
      navigator.mediaSession.setActionHandler("seekforward", () => {
        skipTimeRef.current(10);
      });
    }
  }, [currentTrack, setIsPlaying]);

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

      // Continuous autoplay
      if (isPlaying || autoPlayNextRef.current) {
        autoPlayNextRef.current = false;
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            setIsPlaying(false);
          });
      }
    }
  };

  // Next Track logic strictly following numerical sequence 1..39
  const handleNext = useCallback(() => {
    if (isShuffle) {
      const remainingIndices = tracks
        .map((_, i) => i)
        .filter((i) => i !== currentTrackIndex);
      const randomIndex =
        remainingIndices[Math.floor(Math.random() * remainingIndices.length)];
      autoPlayNextRef.current = true;
      onTrackChange(randomIndex);
    } else {
      if (currentTrackIndex < tracks.length - 1) {
        autoPlayNextRef.current = true;
        onTrackChange(currentTrackIndex + 1);
      } else if (repeatMode === "all") {
        autoPlayNextRef.current = true;
        onTrackChange(0);
      } else {
        setIsPlaying(false);
        autoPlayNextRef.current = false;
      }
    }
  }, [currentTrackIndex, isShuffle, onTrackChange, repeatMode, setIsPlaying, tracks]);

  // Previous Track logic
  const handlePrevious = useCallback(() => {
    if (audioRef.current && audioRef.current.currentTime > 4) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }
    autoPlayNextRef.current = isPlaying;
    if (currentTrackIndex > 0) {
      onTrackChange(currentTrackIndex - 1);
    } else {
      onTrackChange(tracks.length - 1);
    }
  }, [currentTrackIndex, isPlaying, onTrackChange, tracks.length]);

  // Continuous playback: automatically advance to the next audio when track ends
  const handleEnded = useCallback(() => {
    if (repeatMode === "one") {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    } else {
      autoPlayNextRef.current = true;
      handleNext();
    }
  }, [handleNext, repeatMode]);

  const handleAudioError = () => {
    const nextIdx = sourceIndex + 1;
    if (nextIdx < sources.length) {
      setSourceIndex(nextIdx);
    } else {
      setAudioError("Não foi possível carregar o áudio.");
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
      autoPlayNextRef.current = false;
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          setIsPlaying(false);
        });
    }
  };

  const handleStop = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
    setIsPlaying(false);
    autoPlayNextRef.current = false;
  };

  const skipTime = (offset: number) => {
    if (!audioRef.current) return;
    const newTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + offset));
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  handleNextRef.current = handleNext;
  handlePreviousRef.current = handlePrevious;
  skipTimeRef.current = skipTime;

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
      const restored = previousVolume || 0.85;
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
    <div className="card glass-card p-4 border-0">
      {/* Native Audio Element */}
      <audio
        ref={audioRef}
        src={activeSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onCanPlay={() => {
          if (autoPlayNextRef.current || isPlaying) {
            autoPlayNextRef.current = false;
            audioRef.current?.play().catch(() => {});
          }
        }}
        onEnded={handleEnded}
        onError={handleAudioError}
        onWaiting={() => setIsLoadingAudio(true)}
        onPlaying={() => {
          setIsLoadingAudio(false);
          setIsPlaying(true);
        }}
        onPause={() => setIsPlaying(false)}
        preload="auto"
      />

      {/* Top Header inside Player: Chapter Counter & Speed */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <span className="badge bg-secondary-subtle text-light border border-secondary-subtle px-3 py-2 rounded-pill">
          Capítulo {currentTrackIndex + 1} de {tracks.length}
        </span>

        {/* Speed Controls */}
        <div className="btn-group btn-group-sm" role="group">
          {[0.75, 1, 1.25, 1.5, 2].map((rate) => (
            <button
              key={rate}
              type="button"
              onClick={() => handleRateChange(rate)}
              className={`btn ${
                playbackRate === rate ? "btn-primary" : "btn-outline-secondary"
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>

      {/* Chapter Information & Cover */}
      <div className="d-flex align-items-center justify-content-between gap-3 mb-4">
        <div className="d-flex align-items-center gap-3">
          <div
            className="position-relative rounded-3 overflow-hidden shadow flex-shrink-0"
            style={{ width: 72, height: 72, backgroundColor: "#1e293b" }}
          >
            <Image
              src="/cover.jpg"
              alt="Capa O Mapa do Sucesso"
              fill
              sizes="72px"
              priority
              className="object-fit-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div>
            <h4 className="text-white fw-bold mb-1 tracking-tight">
              {currentTrack.title}
            </h4>
            {currentTrack.part && (
              <div className="text-info small fw-medium mb-1">
                {currentTrack.part}
              </div>
            )}
            <div className="text-secondary small">
              Lourivan Catsro
            </div>
          </div>
        </div>

        {/* Animated Equalizer Waves */}
        <div
          className="d-flex align-items-end gap-1 px-3 py-2 rounded-3 bg-black bg-opacity-40 border border-secondary border-opacity-25"
          style={{ height: 42 }}
        >
          {[40, 75, 100, 60, 90, 45, 80, 55].map((height, i) => (
            <span
              key={i}
              className="eq-bar"
              style={{
                height: isPlaying ? `${height}%` : "20%",
                opacity: isPlaying ? 1 : 0.4,
              }}
            />
          ))}
        </div>
      </div>

      {/* Error Message if any */}
      {audioError && (
        <div className="alert alert-danger py-2 px-3 small d-flex justify-content-between align-items-center mb-3">
          <span>{audioError}</span>
          <button
            onClick={() => {
              setSourceIndex(0);
              setAudioError(null);
            }}
            className="btn btn-sm btn-link text-danger text-decoration-underline p-0"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* Progress Seek Bar */}
      <div className="mb-4">
        <div
          ref={progressBarRef}
          onClick={handleSeek}
          className="audio-seek-track mb-2"
        >
          <div
            className="audio-seek-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="d-flex justify-content-between text-secondary small font-monospace">
          <span>{formatTime(currentTime)}</span>
          <span>{isLoadingAudio ? "..." : ""}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls Row */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
        {/* Shuffle, Repeat, Stop */}
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            onClick={toggleShuffle}
            className={`btn btn-sm ${
              isShuffle ? "btn-primary" : "btn-outline-secondary"
            }`}
            title="Aleatório"
          >
            <Shuffle size={16} />
          </button>

          <button
            type="button"
            onClick={cycleRepeatMode}
            className={`btn btn-sm ${
              repeatMode !== "off" ? "btn-primary" : "btn-outline-secondary"
            }`}
            title="Repetir"
          >
            {repeatMode === "one" ? <Repeat1 size={16} /> : <Repeat size={16} />}
          </button>

          <button
            type="button"
            onClick={handleStop}
            className="btn btn-sm btn-outline-secondary"
            title="Parar"
          >
            <Square size={16} />
          </button>
        </div>

        {/* Center: -15s, Prev, Play/Pause, Next, +15s */}
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            onClick={() => skipTime(-15)}
            className="btn btn-outline-secondary btn-sm"
            title="Voltar 15s"
          >
            <RotateCcw size={16} />
          </button>

          <button
            type="button"
            onClick={handlePrevious}
            className="btn btn-secondary btn-sm"
            title="Anterior"
          >
            <SkipBack size={18} />
          </button>

          <button
            type="button"
            onClick={togglePlay}
            disabled={isLoadingAudio && !duration}
            className="btn btn-primary rounded-circle p-3 shadow d-flex align-items-center justify-content-center"
            style={{ width: 56, height: 56 }}
            title={isPlaying ? "Pausar" : "Reproduzir"}
          >
            {isPlaying ? (
              <Pause size={24} className="text-white" />
            ) : (
              <Play size={24} className="text-white ms-1" />
            )}
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="btn btn-secondary btn-sm"
            title="Próximo"
          >
            <SkipForward size={18} />
          </button>

          <button
            type="button"
            onClick={() => skipTime(15)}
            className="btn btn-outline-secondary btn-sm"
            title="Avançar 15s"
          >
            <RotateCw size={16} />
          </button>
        </div>

        {/* Right: Volume */}
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            onClick={toggleMute}
            className="btn btn-sm btn-link text-secondary p-1 text-decoration-none"
            title={isMuted ? "Ativar som" : "Mudo"}
          >
            {isMuted || volume === 0 ? (
              <VolumeX size={18} className="text-danger" />
            ) : volume < 0.5 ? (
              <Volume1 size={18} />
            ) : (
              <Volume2 size={18} className="text-info" />
            )}
          </button>

          <div
            ref={volumeBarRef}
            onClick={handleVolumeChange}
            className="volume-track"
          >
            <div
              className="volume-fill"
              style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
            />
          </div>

          <button
            type="button"
            onClick={setMaxVolume}
            className="btn btn-sm btn-outline-secondary py-0 px-2 font-monospace"
            style={{ fontSize: "11px" }}
            title="Volume Máximo"
          >
            MAX
          </button>
        </div>
      </div>
    </div>
  );
}
