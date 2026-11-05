"use client";

import React, { useState } from "react";
import { Track } from "@/lib/playlist";
import { Play, Pause, Search, Volume2, Bookmark, Check } from "lucide-react";

interface TrackListProps {
  tracks: Track[];
  currentTrackIndex: number;
  isPlaying: boolean;
  onSelectTrack: (index: number) => void;
  bookmarkedTracks: number[];
  onToggleBookmark: (trackId: number) => void;
}

export default function TrackList({
  tracks,
  currentTrackIndex,
  isPlaying,
  onSelectTrack,
  bookmarkedTracks,
  onToggleBookmark,
}: TrackListProps) {
  const [search, setSearch] = useState("");
  const [filterBookmarked, setFilterBookmarked] = useState(false);

  const filteredTracks = tracks.filter((track) => {
    const matchesSearch =
      track.title.toLowerCase().includes(search.toLowerCase()) ||
      (track.part && track.part.toLowerCase().includes(search.toLowerCase())) ||
      track.id.toString() === search.trim();
    const matchesBookmark = filterBookmarked ? bookmarkedTracks.includes(track.id) : true;
    return matchesSearch && matchesBookmark;
  });

  return (
    <div className="flex flex-col h-full bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-700/60 shadow-xl overflow-hidden">
      {/* Header and Search */}
      <div className="p-4 border-b border-slate-700/60 bg-slate-950/40">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-100 text-lg tracking-tight">
              Sumário & Faixas
            </h3>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
              {tracks.length} capítulos
            </span>
          </div>

          <button
            onClick={() => setFilterBookmarked(!filterBookmarked)}
            className={`text-xs px-2.5 py-1 rounded-lg border transition-colors flex items-center gap-1.5 ${
              filterBookmarked
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200"
            }`}
            title="Filtrar capítulos marcados"
          >
            <Bookmark className="w-3.5 h-3.5 fill-current" />
            <span>Marcados ({bookmarkedTracks.length})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por capítulo (ex: Capítulo 3, Prefácio)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-800/70 text-slate-100 text-sm pl-9 pr-4 py-2 rounded-xl border border-slate-700/70 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
            >
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* Playlist List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 max-h-[500px] lg:max-h-[580px]">
        {filteredTracks.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            Nenhum capítulo encontrado para essa busca.
          </div>
        ) : (
          filteredTracks.map((track) => {
            const originalIndex = tracks.findIndex((t) => t.id === track.id);
            const isCurrent = originalIndex === currentTrackIndex;
            const isBookmarked = bookmarkedTracks.includes(track.id);

            return (
              <div
                key={track.id}
                className={`group flex items-center justify-between px-4 py-3 transition-colors cursor-pointer select-none ${
                  isCurrent
                    ? "bg-cyan-950/50 border-l-4 border-cyan-400 pl-3"
                    : "hover:bg-slate-800/50"
                }`}
                onClick={() => onSelectTrack(originalIndex)}
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  {/* Track Number / Play Indicator */}
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-800/80 group-hover:bg-cyan-600/20 text-xs font-mono transition-colors shrink-0">
                    {isCurrent ? (
                      isPlaying ? (
                        <div className="flex items-end gap-0.5 h-3.5">
                          <span className="w-0.5 h-3 bg-cyan-400 animate-pulse" />
                          <span className="w-0.5 h-2 bg-cyan-400 animate-pulse delay-75" />
                          <span className="w-0.5 h-3.5 bg-cyan-400 animate-pulse delay-150" />
                        </div>
                      ) : (
                        <Pause className="w-3.5 h-3.5 text-cyan-400" />
                      )
                    ) : (
                      <span className="text-slate-400 group-hover:text-cyan-300">
                        {String(track.id).padStart(2, "0")}
                      </span>
                    )}
                  </div>

                  {/* Title & Info */}
                  <div className="truncate">
                    <p
                      className={`text-sm font-medium truncate ${
                        isCurrent ? "text-cyan-300 font-semibold" : "text-slate-200 group-hover:text-white"
                      }`}
                    >
                      {track.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span>Faixa {track.id}</span>
                      {track.part && (
                        <>
                          <span>•</span>
                          <span className="text-cyan-400/80">{track.part}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions: Bookmark & Status */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(track.id);
                    }}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isBookmarked
                        ? "text-amber-400 hover:text-amber-300"
                        : "text-slate-600 hover:text-slate-400 opacity-0 group-hover:opacity-100"
                    }`}
                    title={isBookmarked ? "Remover marcador" : "Marcar capítulo"}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`}
                    />
                  </button>

                  <div className="w-7 h-7 flex items-center justify-center">
                    {isCurrent && (
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer info */}
      <div className="p-3 bg-slate-950/60 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
        <span>39 gravações narradas</span>
        <span>Formato MP3 / OGG</span>
      </div>
    </div>
  );
}
