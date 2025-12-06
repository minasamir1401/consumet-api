import React from "react";
import "./AnimeCard.css";

function AnimeCard({ item, type, onClick }) {
  const isEpisode = type === "episodes";
  const title = item.name || item.title || "غير معروف";
  const imageUrl = item.src || item.img || "placeholder.jpg";
  const badge = isEpisode ? item.episode : item.status;
  const itemType = item.type || "";
  const story = item.story || "";

  return (
    <div className="anime-card" onClick={onClick}>
      <div className="card-image">
        <img src={imageUrl} alt={title} loading="lazy" />
        {badge && <div className="card-badge">{badge}</div>}
        {isEpisode && (
          <div className="card-overlay">
            <h3>{title}</h3>
          </div>
        )}
      </div>
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <div className="card-meta">
          {isEpisode ? (
            <span className="card-tag">
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
              </svg>
              {item.episode}
            </span>
          ) : (
            itemType && (
              <span className="card-tag">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
                {itemType}
              </span>
            )
          )}
        </div>
        {story && <p className="card-description">{story}</p>}
      </div>
    </div>
  );
}

export default AnimeCard;
