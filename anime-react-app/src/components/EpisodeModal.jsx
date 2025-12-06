import React, { useState, useEffect } from "react";
import "./EpisodeModal.css";

function EpisodeModal({ episodeId, episodeName, onClose }) {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEpisodeSources = async () => {
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
        setLoading(false);
      }
    };

    if (episodeId) {
      fetchEpisodeSources();
    }

    // Prevent body scroll
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [episodeId]);

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  return (
    <div className="modal active episode-modal">
      <div className="modal-overlay" onClick={handleOverlayClick}></div>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        </button>

        <div className="modal-body">
          <div className="episode-detail">
            <h2 className="episode-title">{episodeName}</h2>

            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>جاري تحميل روابط المشاهدة والتحميل...</p>
              </div>
            ) : (
              <>
                {sources.length === 0 ? (
                  <p className="no-links">لا توجد روابط متاحة لهذه الحلقة</p>
                ) : (
                  <div className="qualities-container">
                    <div className="quality-section">
                      <h3 className="quality-title">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                        </svg>
                        سيرفرات المشاهدة
                      </h3>
                      <div className="servers-grid">
                        {sources.map((source, index) => (
                          <a
                            key={index}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="server-button"
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                            </svg>
                            {source.quality || `سيرفر ${index + 1}`}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EpisodeModal;
