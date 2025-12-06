import React, { useEffect, useState } from "react";
import "./AnimeModal.css";

function AnimeModal({ anime, onClose }) {
  const [activeEpisode, setActiveEpisode] = useState(null);
  const [sources, setSources] = useState([]);
  const [loadingSources, setLoadingSources] = useState(false);

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  const handleEpisodeSelect = async (episode) => {
    setActiveEpisode(episode);
    setSources([]);
    setLoadingSources(true);

    // Extract episode ID
    const episodeId =
      episode.id ||
      (episode.episode_url &&
        episode.episode_url.match(/\/episode\/([^\/]+)/)?.[1]);

    if (!episodeId) {
      setLoadingSources(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/anime/hianime/watch/${episodeId}`
      );
      if (response.ok) {
        const data = await response.json();
        setSources(data.sources || []);
      }
    } catch (error) {
      console.error("Error fetching episode sources:", error);
    } finally {
      setLoadingSources(false);
    }
  };

  // Determine which video source to show (HLS or Iframe)
  // For simplicity, we prioritize the first available source in an iframe if possible,
  // OR we just show the sources as buttons if we can't auto-embed easily without a player.
  // Actually, standard hianime/consumet sources are .m3u8.
  // Browsers can't play them natively.
  // We will show a placeholder saying "Select Server" and list buttons below.
  // If we had a player component, we would use it here.
  // For now: We display a "Screen" area that updates when a server is clicked (if it was an embed),
  // but since these are direct links/m3u8, we typically open them.
  // HOWEVER, user asked for "Place for video".
  // Let's assume for now we just show the "Active Source" url in a video tag if mp4, or just buttons.
  // IMPROVEMENT: We will just show the buttons vividly in the "Video Section".

  return (
    <div className="modal active">
      <div className="modal-overlay" onClick={handleOverlayClick}></div>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>

        <div className="modal-body">
          <div className="watch-container">
            {/* Main View: Player & Info */}
            <div className="main-view">
              <div className="video-section">
                <div className="video-player-container">
                  {activeEpisode ? (
                    loadingSources ? (
                      <div className="placeholder-message">
                        <div className="spinner"></div>
                        <p>جاري جلب السيرفرات...</p>
                      </div>
                    ) : sources.length > 0 ? (
                      <div className="placeholder-message">
                        {/* In a real app, an HLS player would go here. 
                             For now, we prompt to pick a server below or open the first one if embeddable. */}
                        <svg
                          width="60"
                          height="60"
                          viewBox="0 0 24 24"
                          fill="#555"
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                        </svg>
                        <p>اختر سيرفر للمشاهدة من الأسفل</p>
                      </div>
                    ) : (
                      <div className="placeholder-message">
                        <p>لا توجد روابط لهذه الحلقة</p>
                      </div>
                    )
                  ) : (
                    <div className="placeholder-message">
                      <svg
                        width="60"
                        height="60"
                        viewBox="0 0 24 24"
                        fill="#333"
                      >
                        <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z" />
                      </svg>
                      <p>اختر حلقة من القائمة لبدء المشاهدة</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="watch-info">
                <h2 className="anime-title">{anime.title}</h2>
                {activeEpisode && (
                  <div className="active-episode-info">
                    <h3 className="episode-title">
                      {activeEpisode.episode || `حلقة ${activeEpisode.number}`}
                      {activeEpisode.title && ` - ${activeEpisode.title}`}
                    </h3>

                    {/* Servers List */}
                    <div className="servers-section">
                      <h3>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                        </svg>
                        سيرفرات المشاهدة والتحميل
                      </h3>
                      <div className="servers-grid">
                        {sources.map((source, index) => (
                          <a
                            key={index}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="server-btn"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                            </svg>
                            {source.quality || `سيرفر ${index + 1}`}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {!activeEpisode && (
                  <div className="anime-details-text">
                    <p style={{ color: "#ccc", lineHeight: "1.6" }}>
                      {anime.story || "لا توجد قصة متاحة."}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar: Episodes List */}
            <div className="sidebar">
              <div className="sidebar-header">
                <h3>الحلقات ({anime.episodes ? anime.episodes.length : 0})</h3>
              </div>
              <div className="episodes-list">
                {anime.episodes &&
                  anime.episodes.map((episode, index) => (
                    <div
                      key={index}
                      className={`episode-item ${
                        activeEpisode === episode ? "active" : ""
                      }`}
                      onClick={() => handleEpisodeSelect(episode)}
                    >
                      <span className="episode-number-badge">
                        {episode.number
                          ? `حلقة ${episode.number}`
                          : `حلقة ${index + 1}`}
                      </span>
                      <span className="episode-name">
                        {episode.title || "بدون عنوان"}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnimeModal;
