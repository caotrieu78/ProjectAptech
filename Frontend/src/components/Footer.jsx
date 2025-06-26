import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <>
            <style>
                {`
          .footer {
            background-color: #212529;
            color: #f8f9fa;
            padding-top: 3rem;
            padding-bottom: 1.5rem;
            margin-top: 3rem;
          }
          .footer-heading {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: #ffffff;
          }
          .footer-text {
            font-size: 0.95rem;
            line-height: 1.6;
            color: #d1d5db;
          }
          .footer-link {
            color: #d1d5db;
            text-decoration: none;
            font-size: 0.95rem;
            transition: color 0.2s ease-in-out;
          }
          .footer-link:hover, .footer-link:focus {
            color: #ffffff;
            text-decoration: underline;
          }
          .footer-contact-item {
            margin-bottom: 0.5rem;
            font-size: 0.95rem;
            color: #d1d5db;
          }
          .footer-divider {
            border-color: #495057;
            margin: 1.5rem 0;
          }
          .footer-copyright {
            font-size: 0.85rem;
            color: #adb5bd;
          }
          @media (max-width: 767px) {
            .footer-column {
              margin-bottom: 2rem;
              text-align: center;
            }
            .footer-link-list {
              padding-left: 0;
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
                            <ul className="list-unstyled footer-link-list">
                                <li className="mb-2">
                                    <Link
                                        to="/about"
                                        className="footer-link"
                                        aria-label="Go to About page"
                                    >
                                        About
                                    </Link>
                                </li>
                                <li className="mb-2">
                                    <Link
                                        to="/contact"
                                        className="footer-link"
                                        aria-label="Go to Contact page"
                                    >
                                        Contact
                                    </Link>
                                </li>
                                <li className="mb-2">
                                    <Link
                                        to="/products"
                                        className="footer-link"
                                        aria-label="Go to Products page"
                                    >
                                        Products
                                    </Link>
                                </li>
                                <li className="mb-2">
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
                                <strong>Email:</strong> support@maverickdresses.com
                            </p>
                            <p className="footer-contact-item">
                                <strong>Hotline:</strong> 0123 456 789
                            </p>
                            <p className="footer-contact-item">
                                <strong>Address:</strong> 123 ABC Street, District 1, Ho Chi
                                Minh City
                            </p>
                        </div>
                    </div>

                    <hr className="footer-divider" />
                    <div className="text-center footer-copyright">
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
