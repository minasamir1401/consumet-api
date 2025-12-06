import React from "react";
import AnimeCard from "./AnimeCard";
import SkeletonCard from "./SkeletonCard";
import "./AnimeGrid.css";

function AnimeGrid({ items, loading, onAnimeClick, extractAnimeId, type }) {
  if (loading) {
    return (
      <div className="anime-grid">
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="no-results">
        <p>لا توجد نتائج متاحة حالياً</p>
      </div>
    );
  }

  return (
    <div className="anime-grid">
      {items.map((item, index) => (
        <AnimeCard
          key={index}
          item={item}
          type={type}
          onClick={() =>
            onAnimeClick(
              item.id ? item.id : extractAnimeId(item.anime_url || item.url)
            )
          }
        />
      ))}
    </div>
  );
}

export default AnimeGrid;
