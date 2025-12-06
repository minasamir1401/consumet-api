import React from "react";
import "./Hero.css";

function Hero({ onExploreClick }) {
  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h2 className="hero-title animate-in">اكتشف عالم الأنمي</h2>
        <p className="hero-subtitle animate-in">
          آخر الحلقات والأنميات الموسمية في مكان واحد
        </p>
        <button className="cta-button animate-in" onClick={onExploreClick}>
          <span>استكشف الآن</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7 10l5 5 5-5H7z" />
          </svg>
        </button>
      </div>
      <div className="hero-particles"></div>
    </section>
  );
}

export default Hero;
