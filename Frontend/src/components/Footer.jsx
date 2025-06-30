import React from "react";
import { Link } from "react-router-dom";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
    return (
        <>
            <style>
                {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

          .footer {
            background: #000000;
            color: #f8f9fa;
            padding: 4rem 0 2rem;
            margin-top: 4rem;
            animation: fadeIn 0.5s ease-in-out;
          }

          .footer-heading {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
            color: #ffffff;
            position: relative;
            padding-bottom: 0.5rem;
          }

          .footer-heading::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 50px;
            height: 2px;
            background: linear-gradient(90deg, #1a73e8, #4dabf7);
          }

          .footer-text {
            font-size: 1rem;
            line-height: 1.8;
            color: #d1d5db;
            max-width: 300px;
          }

          .footer-link {
            color: #d1d5db;
            text-decoration: none;
            font-size: 1rem;
            display: block;
            margin-bottom: 0.75rem;
            transition: color 0.3s ease, transform 0.3s ease;
          }

          .footer-link:hover, .footer-link:focus {
            color: #1a73e8;
            transform: translateX(5px);
          }

          .footer-contact-item {
            font-size: 1rem;
            color: #d1d5db;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: color 0.3s ease;
          }

          .footer-contact-item:hover {
            color: #ffffff;
          }

          .footer-contact-item strong {
            color: #ffffff;
            font-weight: 500;
          }

          .footer-divider {
            border-color: rgba(255, 255, 255, 0.1);
            margin: 2rem 0;
          }

          .footer-copyright {
            font-size: 0.9rem;
            color: #adb5bd;
            text-align: center;
          }

          .footer-column {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          }

          .footer-link-list {
            padding-left: 0;
            list-style: none;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @media (max-width: 767px) {
            .footer-column {
              margin-bottom: 2.5rem;
              align-items: center;
              text-align: center;
            }
            .footer-heading::after {
              left: 50%;
              transform: translateX(-50%);
            }
            .footer-text {
              max-width: 100%;
            }
            .footer-link {
              margin-bottom: 1rem;
            }
            .footer-contact-item {
              justify-content: center;
            }
          }
        `}
            </style>
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
                                        to="/products"
                                        className="footer-link"
                                        aria-label="Go to Products page"
                                    >
                                        Products
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/policy"
                                        className="footer-link"
                                        aria-label="Go to Policy page"
                                    >
                                        Policy
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contact column */}
                        <div className="col-md-4 footer-column">
                            <h5 className="footer-heading">Contact</h5>
                            <p className="footer-contact-item">
                                <FaEnvelope size={16} />
                                <strong>Email:</strong> support@maverickdresses.com
                            </p>
                            <p className="footer-contact-item">
                                <FaPhone size={16} />
                                <strong>Hotline:</strong> 0123 456 789
                            </p>
                            <p className="footer-contact-item">
                                <FaMapMarkerAlt size={16} />
                                <strong>Address:</strong> 123 ABC Street, District 1, Ho Chi
                                Minh City
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
