import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AnimeGrid from "./components/AnimeGrid";
import AnimeModal from "./components/AnimeModal";
import Footer from "./components/Footer";
import "./App.css";

// API base is loaded at runtime from /config.json to allow updating the
// backend URL without rebuilding the frontend.

const DEFAULT_API_BASE = "http://localhost:3000/anime/hianime";

function App() {
  const [latestEpisodes, setLatestEpisodes] = useState([]);
  const [seasonalAnime, setSeasonalAnime] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAllLatest, setShowAllLatest] = useState(false);
  const [showAllSeasonal, setShowAllSeasonal] = useState(false);
  const [loading, setLoading] = useState({
    latest: true,
    seasonal: true,
    search: false,
  });

  // runtime API base loaded from /config.json
  const [apiBase, setApiBase] = useState(DEFAULT_API_BASE);

  const ITEMS_PER_PAGE = 12; // عدد العناصر المعروضة في البداية

  useEffect(() => {
    // Load runtime config then fetch data
    (async () => {
      let base = DEFAULT_API_BASE;
      try {
        const res = await fetch("/config.json");
        if (res.ok) {
          const cfg = await res.json();
          if (cfg && cfg.API_BASE) base = cfg.API_BASE;
        }
      } catch (e) {
        // ignore, will use default
      }
      setApiBase(base);
      await loadLatestEpisodes(base);
      await loadSeasonalAnime(base);
    })();
  }, []);

  const loadLatestEpisodes = async (base = apiBase) => {
    try {
      console.log("Fetching latest episodes...");
      // Using 'recently-updated' from hianime
      const response = await fetch(`${base}/recently-updated?page=1`);
      console.log("Response status:", response.status);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      console.log("Latest episodes data:", data);

      // Map Consumet results to App format if needed
      // Consumet: { results: [ { id, title, image, episodeNumber, ... } ] }
      const mappedResults = (data.results || []).map((item) => ({
        ...item,
        episode: item.episodeNumber ? `حلقة ${item.episodeNumber}` : "",
        img: item.image, // Ensure image property matches AnimeCard expectation
      }));

      setLatestEpisodes(mappedResults);
    } catch (error) {
      console.error("Error loading latest episodes:", error);
    } finally {
      setLoading((prev) => ({ ...prev, latest: false }));
    }
  };

  const loadSeasonalAnime = async (base = apiBase) => {
    try {
      // Using 'top-airing' as seasonal/popular proxy
      const response = await fetch(`${base}/top-airing?page=1`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();

      const mappedResults = (data.results || []).map((item) => ({
        ...item,
        img: item.image,
      }));

      setSeasonalAnime(mappedResults);
    } catch (error) {
      console.error("Error loading seasonal anime:", error);
    } finally {
      setLoading((prev) => ({ ...prev, seasonal: false }));
    }
  };

  const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setShowSearchResults(false);
      return;
    }

    setLoading((prev) => ({ ...prev, search: true }));
    try {
      const response = await fetch(
        `${apiBase}/${encodeURIComponent(searchTerm)}?page=1`
      );
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();

      const mappedResults = (data.results || []).map((item) => ({
        ...item,
        img: item.image,
      }));

      setSearchResults(mappedResults);
      setShowSearchResults(true);

      // Scroll to results
      setTimeout(() => {
        document
          .getElementById("searchResults")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      console.error("Error searching anime:", error);
    } finally {
      setLoading((prev) => ({ ...prev, search: false }));
    }
  };

  const handleAnimeClick = async (animeId) => {
    try {
      // Fetch anime info (Consumet returns info + episodes in one call usually)
      const infoResponse = await fetch(`${apiBase}/info?id=${animeId}`);
      if (!infoResponse.ok) throw new Error("Failed to fetch anime info");
      const animeInfo = await infoResponse.json();

      // Consumet usually includes episodes in info response
      // If separate call needed in future, add here.

      setSelectedAnime(animeInfo);
      setShowModal(true);
    } catch (error) {
      console.error("Error loading anime detail:", error);
    }
  };

  const extractAnimeId = (input) => {
    // If input is already an ID (no slashes), return it
    if (!input || typeof input !== "string") return "";
    if (!input.includes("/")) return input;

    // Legacy URL handling just in case
    const match = input.match(/\/anime\/([^\/]+)/);
    return match ? match[1] : input;
  };

  const scrollToLatest = () => {
    document.getElementById("latest")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="app">
      <Navbar onSearch={handleSearch} />
      <Hero onExploreClick={scrollToLatest} />

      {showSearchResults && (
        <section id="searchResults" className="section">
          <div className="container">
            <h2 className="section-title">نتائج البحث</h2>
            <div className="section-line"></div>
            <AnimeGrid
              items={searchResults}
              loading={loading.search}
              onAnimeClick={handleAnimeClick}
              extractAnimeId={extractAnimeId}
              type="seasonal"
            />
          </div>
        </section>
      )}

      <section id="latest" className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">أحدث الحلقات</h2>
            <div className="section-line"></div>
          </div>
          <AnimeGrid
            items={
              showAllLatest
                ? latestEpisodes
                : latestEpisodes.slice(0, ITEMS_PER_PAGE)
            }
            loading={loading.latest}
            onAnimeClick={handleAnimeClick}
            extractAnimeId={extractAnimeId}
            type="episodes"
          />
          {!loading.latest && latestEpisodes.length > ITEMS_PER_PAGE && (
            <div className="load-more-container">
              <button
                className="load-more-btn"
                onClick={() => setShowAllLatest(!showAllLatest)}
              >
                {showAllLatest ? "عرض أقل" : "عرض المزيد"}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  style={{
                    transform: showAllLatest ? "rotate(180deg)" : "none",
                    transition: "transform 0.3s",
                  }}
                >
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>

      <section id="seasonal" className="section section-alt">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">الأنميات الموسمية</h2>
            <div className="section-line"></div>
          </div>
          <AnimeGrid
            items={
              showAllSeasonal
                ? seasonalAnime
                : seasonalAnime.slice(0, ITEMS_PER_PAGE)
            }
            loading={loading.seasonal}
            onAnimeClick={handleAnimeClick}
            extractAnimeId={extractAnimeId}
            type="seasonal"
          />
          {!loading.seasonal && seasonalAnime.length > ITEMS_PER_PAGE && (
            <div className="load-more-container">
              <button
                className="load-more-btn"
                onClick={() => setShowAllSeasonal(!showAllSeasonal)}
              >
                {showAllSeasonal ? "عرض أقل" : "عرض المزيد"}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  style={{
                    transform: showAllSeasonal ? "rotate(180deg)" : "none",
                    transition: "transform 0.3s",
                  }}
                >
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />

      {showModal && selectedAnime && (
        <AnimeModal anime={selectedAnime} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}

export default App;
