import React from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="row">
            {/* Information column */}
            <div className="col-md-4 footer-column">
              <h5 className="footer-heading">Maverick Dresses</h5>
              <p className="footer-text">
                We provide high-quality dresses with dedicated support services
                and the latest fashion trends.
              </p>
            </div>

            {/* Navigation column */}
            <div className="col-md-4 footer-column">
              <h5 className="footer-heading">Links</h5>
              <ul className="footer-link-list">
                <li>
                  <Link
                    to="/"
                    className="footer-link"
                    aria-label="Go to Home page"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="footer-link"
                    aria-label="Go to About page"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="footer-link"
                    aria-label="Go to Contact page"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shop"
                    className="footer-link"
                    aria-label="Go to Shop page"
                  >
                    Shop
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact column */}
            <div className="col-md-4 footer-column">
              <h5 className="footer-heading">Contact</h5>
              <p className="footer-contact-item">
                <FaEnvelope size={16} />
                <strong>Email:</strong>
                <span className="footer-contact-text">
                  support@maverickdresses.com
                </span>
              </p>
              <p className="footer-contact-item">
                <FaPhone size={16} />
                <strong>Hotline:</strong>
                <span className="footer-contact-text">0123 456 789</span>
              </p>
              <p className="footer-contact-item">
                <FaMapMarkerAlt size={16} />
                <strong>Address:</strong>
                <span className="footer-contact-text">
                  123 ABC Street, District 1, Ho Chi Minh City
                </span>
              </p>
            </div>
          </div>

          <hr className="footer-divider" />
          <div className="footer-copyright">
            <small>
              © {new Date().getFullYear()} Maverick Dresses. All rights
              reserved.
            </small>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
