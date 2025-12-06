import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>AnimeHub</h3>
            <p>موقعك المفضل لمشاهدة أحدث وأفضل الأنميات</p>
          </div>
          <div className="footer-section">
            <h4>روابط سريعة</h4>
            <ul>
              <li>
                <a href="#latest">أحدث الحلقات</a>
              </li>
              <li>
                <a href="#seasonal">الأنميات الموسمية</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>تواصل معنا</h4>
            <p>
              تصميم وتطوير: <strong>Mina Samir</strong>
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 AnimeHub. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
