"use client";

import React, { useState } from "react";
import { Track } from "@/lib/playlist";
import { Pause, Search, Bookmark } from "lucide-react";

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
    <div className="card glass-card border-0 d-flex flex-column h-100">
      {/* Header and Search */}
      <div className="p-3 border-bottom border-secondary border-opacity-25">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <h5 className="text-white fw-bold mb-0">Capítulos</h5>
            <span className="badge bg-secondary-subtle text-light rounded-pill">
              {tracks.length}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setFilterBookmarked(!filterBookmarked)}
            className={`btn btn-sm ${
              filterBookmarked
                ? "btn-warning text-dark fw-semibold"
                : "btn-outline-secondary"
            } d-flex align-items-center gap-1`}
          >
            <Bookmark size={14} className={filterBookmarked ? "fill-dark" : ""} />
            <span>Marcados ({bookmarkedTracks.length})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="input-group input-group-sm">
          <span className="input-group-text bg-dark border-secondary border-opacity-50 text-secondary">
            <Search size={14} />
          </span>
          <input
            type="text"
            placeholder="Buscar capítulo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control bg-dark text-light border-secondary border-opacity-50"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="btn btn-outline-secondary"
            >
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* Chapter List */}
      <div
        className="overflow-y-auto flex-grow-1"
        style={{ maxHeight: "560px" }}
      >
        {filteredTracks.length === 0 ? (
          <div className="p-4 text-center text-secondary small">
            Nenhum capítulo encontrado.
          </div>
        ) : (
          filteredTracks.map((track) => {
            const originalIndex = tracks.findIndex((t) => t.id === track.id);
            const isCurrent = originalIndex === currentTrackIndex;
            const isBookmarked = bookmarkedTracks.includes(track.id);

            return (
              <div
                key={track.id}
                onClick={() => onSelectTrack(originalIndex)}
                className={`d-flex align-items-center justify-content-between p-3 border-bottom border-secondary border-opacity-10 track-item cursor-pointer text-decoration-none ${
                  isCurrent ? "track-item-active" : ""
                }`}
                style={{ cursor: "pointer" }}
              >
                <div className="d-flex align-items-center gap-3 overflow-hidden me-2">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-2 bg-dark border border-secondary border-opacity-25 font-monospace text-secondary small flex-shrink-0"
                    style={{ width: 34, height: 34 }}
                  >
                    {isCurrent ? (
                      isPlaying ? (
                        <div
                          className="d-flex align-items-end gap-1"
                          style={{ height: 16 }}
                        >
                          <span
                            className="bg-info"
                            style={{ width: 2, height: 14 }}
                          />
                          <span
                            className="bg-info"
                            style={{ width: 2, height: 9 }}
                          />
                          <span
                            className="bg-info"
                            style={{ width: 2, height: 16 }}
                          />
                        </div>
                      ) : (
                        <Pause size={14} className="text-info" />
                      )
                    ) : (
                      <span>{String(track.id).padStart(2, "0")}</span>
                    )}
                  </div>

                  <div className="text-truncate">
                    <div
                      className={`small text-truncate ${
                        isCurrent ? "text-info fw-bold" : "text-light fw-medium"
                      }`}
                    >
                      {track.title}
                    </div>
                    {track.part && (
                      <div className="text-secondary" style={{ fontSize: "11px" }}>
                        {track.part}
                      </div>
                    )}
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(track.id);
                    }}
                    className={`btn btn-sm btn-link p-1 text-decoration-none ${
                      isBookmarked ? "text-warning" : "text-secondary"
                    }`}
                    title="Marcar capítulo"
                  >
                    <Bookmark
                      size={15}
                      className={isBookmarked ? "fill-warning" : ""}
                    />
                  </button>

                  {isCurrent && (
                    <span
                      className="spinner-grow spinner-grow-sm text-info"
                      role="status"
                    />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
