import React, { useEffect, useState, useContext, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    FaSearch,
    FaShoppingCart,
    FaHeart,
    FaTimes,
    FaEye,
    FaQuestionCircle,
    FaUser,
    FaSignInAlt,
    FaGlobe,
    FaDollarSign
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    Container,
    Navbar,
    Nav,
    Button,
    Form,
    FormControl,
    Badge
} from "react-bootstrap";
import CartPanel from "./CartPanel";
import ConfirmModal from "./ConfirmModal"; // Import ConfirmModal
import { PATHS } from "../constants/paths";
import { CartContext } from "../context/CartContext";

const Header = () => {
    const { cartItemCount } = useContext(CartContext);
    const [user, setUser] = useState(null);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // State for logout modal
    const [visitCount, setVisitCount] = useState(0);
    const [flyImage, setFlyImage] = useState(null);
    const cartIconRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Get user from localStorage
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }

        // Track visit count
        let count = localStorage.getItem("visitCount") || 0;
        count = parseInt(count) + 1;
        localStorage.setItem("visitCount", count);
        setVisitCount(count);
    }, []);

    // Handle fly-to-cart animation
    useEffect(() => {
        const handleCartItemAdded = (event) => {
            const { imageUrl } = event.detail;
            if (!imageUrl || !cartIconRef.current) return;

            // Get cart icon position
            const cartRect = cartIconRef.current.getBoundingClientRect();
            const cartX = cartRect.left + cartRect.width / 2;
            const cartY = cartRect.top + cartRect.height / 2;

            // Create image animation object
            setFlyImage({
                src: imageUrl,
                startX: window.innerWidth / 2,
                startY: window.innerHeight / 2,
                endX: cartX,
                endY: cartY
            });

            // Remove image after animation (1s)
            setTimeout(() => setFlyImage(null), 1000);
        };

        window.addEventListener("cartItemAdded", handleCartItemAdded);
        return () => {
            window.removeEventListener("cartItemAdded", handleCartItemAdded);
        };
    }, []);

    const handleLogout = () => {
        setIsLogoutModalOpen(true); // Show logout confirmation modal
    };

    const confirmLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        setUser(null);
        setIsLogoutModalOpen(false);
        navigate("/login");
    };

    const closeLogoutModal = () => {
        setIsLogoutModalOpen(false);
    };

    const toggleSearchModal = () => setIsSearchModalOpen((prev) => !prev);
    const toggleCart = () => setIsCartOpen((prev) => !prev);
    const closeCart = () => setIsCartOpen(false);

    return (
        <>
            <style>
                {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

          body {
            font-family: 'Poppins', sans-serif;
          }

          .top-bar {
            background: #000000;
            padding: 12px 0;
            font-size: 0.9rem;
            border-bottom: 1px solid #1a1a1a;
          }

          .navbar {
            padding: 15px 0;
            background: linear-gradient(180deg, #ffffff 0%, #f8f9fa 100%);
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .navbar-brand {
            font-size: 1.8rem;
            font-weight: 600;
            color: #1a73e8 !important;
            transition: color 0.3s ease;
          }

          .navbar-brand:hover {
            color: #1565c0 !important;
          }

          .nav-link-custom {
            font-size: 1rem;
            font-weight: 500;
            color: #2c3e50 !important;
            padding: 8px 12px;
            transition: color 0.3s ease, background 0.3s ease;
          }

          .nav-link-custom:hover {
            color: #1a73e8 !important;
            background: #e9f1ff;
            border-radius: 4px;
          }

          .hover-text, .hover-btn, .hover-icon {
            transition: all 0.3s ease;
          }

          .badge {
            font-size: 0.7rem;
            padding: 3px 6px;
            top: -2px;
            right: -10px;
          }

          .view-count {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 4px 10px;
            border-radius: 16px;
            background: rgba(255, 255, 255, 0.15);
            transition: transform 0.3s ease, background 0.3s ease;
          }

          .view-count:hover {
            transform: scale(1.05);
            background: rgba(255, 255, 255, 0.25);
          }

          .view-count .hover-icon {
            color: #4dabf7;
            transform: translateY(0);
          }

          .view-count:hover .hover-icon {
            animation: pulse 0.5s ease;
            color: #ffffff;
          }

          .view-badge {
            background: linear-gradient(45deg, #1a73e8, #4dabf7);
            font-size: 0.85rem;
            font-weight: 500;
            padding: 5px 12px;
            border-radius: 14px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            transition: box-shadow 0.3s ease, transform 0.3s ease;
          }

          .view-badge:hover {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
            transform: translateY(-1px);
          }

          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.3); }
            100% { transform: scale(1); }
          }

          .fly-to-cart {
            position: fixed;
            width: 60px;
            height: 60px;
            object-fit: cover;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            z-index: 1060;
            animation: flyToCart 1s ease forwards;
          }

          @keyframes flyToCart {
            0% {
              transform: translate(0, 0) scale(1);
              opacity: 1;
            }
            80% {
              transform: translate(var(--endX), var(--endY)) scale(0.3);
              opacity: 0.7;
            }
            100% {
              transform: translate(var(--endX), var(--endY)) scale(0);
              opacity: 0;
            }
          }

          .search-modal {
            animation: fadeIn 0.3s ease-in-out;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .form-control {
            border-radius: 20px;
            border: 1px solid #ced4da;
            padding: 8px 16px;
            transition: border-color 0.3s ease;
          }

          .form-control:focus {
            border-color: #1a73e8;
            box-shadow: 0 0 5px rgba(26, 115, 232, 0.3);
          }

          .btn-outline-primary {
            border-radius: 20px;
            padding: 8px 16px;
          }

          @media (max-width: 991px) {
            .navbar-nav {
              padding: 10px 0;
            }
            .nav-link-custom {
              font-size: 1.1rem;
              padding: 10px 15px;
            }
            .badge {
              right: -8px;
            }
            .top-bar .d-flex {
              flex-direction: column;
              align-items: flex-start;
              gap: 8px;
            }
            .view-count {
              margin-left: 0;
              padding: 6px 12px;
            }
          }
        `}
            </style>

            {/* Fly-to-cart image */}
            {flyImage && (
                <img
                    src={flyImage.src}
                    className="fly-to-cart"
                    style={{
                        left: `${flyImage.startX}px`,
                        top: `${flyImage.startY}px`,
                        "--endX": `${flyImage.endX - flyImage.startX}px`,
                        "--endY": `${flyImage.endY - flyImage.startY}px`
                    }}
                    alt="Flying product"
                />
            )}

            {/* Top bar */}
            <div className="top-bar text-white">
                <Container className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                    <div className="fs-6 fw-semibold d-flex align-items-center gap-2">
                        <span>Hello, this is C5Coders team</span>
                        <span className="ms-3 view-count">
                            <FaEye size={16} className="hover-icon" />
                            <Badge className="view-badge text-white">
                                {visitCount} views
                            </Badge>
                        </span>
                    </div>
                    <div className="d-flex flex-wrap align-items-center gap-3">
                        <NavLink
                            to="#"
                            className="text-white text-decoration-none hover-text d-flex align-items-center gap-1"
                            onMouseEnter={(e) => (e.target.style.color = "#1a73e8")}
                            onMouseLeave={(e) => (e.target.style.color = "#fff")}
                        >
                            <FaQuestionCircle size={14} /> Help & FAQs
                        </NavLink>
                        {user ? (
                            <>
                                <span className="text-white fs-6 d-flex align-items-center gap-1">
                                    <FaUser size={14} /> Hi {user.FullName || user.Username}
                                </span>
                                <Button
                                    variant="outline-light"
                                    size="sm"
                                    className="hover-btn"
                                    onClick={handleLogout}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = "#1a73e8";
                                        e.target.style.color = "#fff";
                                        e.target.style.borderColor = "#1a73e8";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = "transparent";
                                        e.target.style.color = "#fff";
                                        e.target.style.borderColor = "#fff";
                                    }}
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <NavLink
                                to="/login"
                                className="text-white text-decoration-none hover-text d-flex align-items-center gap-1"
                                onMouseEnter={(e) => (e.target.style.color = "#1a73e8")}
                                onMouseLeave={(e) => (e.target.style.color = "#fff")}
                            >
                                <FaSignInAlt size={14} /> Login
                            </NavLink>
                        )}
                        <NavLink
                            to="#"
                            className="text-white text-decoration-none hover-text d-flex align-items-center gap-1"
                            onMouseEnter={(e) => (e.target.style.color = "#1a73e8")}
                            onMouseLeave={(e) => (e.target.style.color = "#fff")}
                        >
                            <FaGlobe size={14} /> EN
                        </NavLink>
                        <NavLink
                            to="#"
                            className="text-white text-decoration-none hover-text d-flex align-items-center gap-1"
                            onMouseEnter={(e) => (e.target.style.color = "#1a73e8")}
                            onMouseLeave={(e) => (e.target.style.color = "#fff")}
                        >
                            <FaDollarSign size={14} /> USD
                        </NavLink>
                    </div>
                </Container>
            </div>

            {/* Navbar */}
            <Navbar expand="lg" className="sticky-top">
                <Container>
                    <Navbar.Brand
                        as={NavLink}
                        to="/"
                        className="fs-4 fw-bold text-primary"
                    >
                        Maverick <span className="text-muted fw-normal">Dresses</span>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="main-navbar" />
                    <Navbar.Collapse id="main-navbar">
                        <div className="d-flex align-items-center d-lg-none gap-3 py-2">
                            <FaSearch
                                size={20}
                                className="text-secondary hover-icon"
                                onMouseEnter={(e) => (e.target.style.color = "#1a73e8")}
                                onMouseLeave={(e) => (e.target.style.color = "#6c757d")}
                                onClick={toggleSearchModal}
                            />
                            <div className="position-relative">
                                <FaShoppingCart
                                    size={20}
                                    className="text-secondary hover-icon"
                                    ref={cartIconRef}
                                    onMouseEnter={(e) => (e.target.style.color = "#1a73e8")}
                                    onMouseLeave={(e) => (e.target.style.color = "#6c757d")}
                                    onClick={toggleCart}
                                />
                                <span className="position-absolute badge rounded-circle bg-danger text-white">
                                    {cartItemCount}
                                </span>
                            </div>
                            <div className="position-relative">
                                <FaHeart
                                    size={20}
                                    className="text-secondary hover-icon"
                                    onMouseEnter={(e) => (e.target.style.color = "#e74c3c")}
                                    onMouseLeave={(e) => (e.target.style.color = "#6c757d")}
                                />
                                <span className="position-absolute badge rounded-circle bg-danger text-white">
                                    0
                                </span>
                            </div>
                        </div>
                        <Nav className="me-auto mx-auto">
                            <Nav.Link as={NavLink} to="/" className="nav-link-custom">
                                Home
                            </Nav.Link>
                            <Nav.Link as={NavLink} to="/shop" className="nav-link-custom">
                                Shop
                            </Nav.Link>
                            <Nav.Link
                                as={NavLink}
                                to="/shoping-cart"
                                className="nav-link-custom"
                            >
                                Features <span className="badge bg-danger ms-1"></span>
                            </Nav.Link>
                            <Nav.Link as={NavLink} to="/blog" className="nav-link-custom">
                                Blog
                            </Nav.Link>
                            <Nav.Link
                                as={NavLink}
                                to={PATHS.ABOUT}
                                className="nav-link-custom"
                            >
                                About
                            </Nav.Link>
                            <Nav.Link
                                as={NavLink}
                                to={PATHS.CONTACT}
                                className="nav-link-custom"
                            >
                                Contact
                            </Nav.Link>
                        </Nav>
                        <div className="d-none d-lg-flex align-items-center gap-3">
                            <FaSearch
                                size={20}
                                className="text-secondary hover-icon"
                                onMouseEnter={(e) => (e.target.style.color = "#1a73e8")}
                                onMouseLeave={(e) => (e.target.style.color = "#6c757d")}
                                onClick={toggleSearchModal}
                            />
                            <div className="position-relative">
                                <FaShoppingCart
                                    size={20}
                                    className="text-secondary hover-icon"
                                    ref={cartIconRef}
                                    onMouseEnter={(e) => (e.target.style.color = "#1a73e8")}
                                    onMouseLeave={(e) => (e.target.style.color = "#6c757d")}
                                    onClick={toggleCart}
                                />
                                <span className="position-absolute badge rounded-circle bg-danger text-white">
                                    {cartItemCount}
                                </span>
                            </div>
                            <div className="position-relative">
                                <FaHeart
                                    size={20}
                                    className="text-secondary hover-icon"
                                    onMouseEnter={(e) => (e.target.style.color = "#e74c3c")}
                                    onMouseLeave={(e) => (e.target.style.color = "#6c757d")}
                                />
                                <span className="position-absolute badge rounded-circle bg-danger text-white">
                                    0
                                </span>
                            </div>
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Search Modal */}
            {isSearchModalOpen && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center"
                    style={{ zIndex: 1050 }}
                    onClick={toggleSearchModal}
                >
                    <div
                        className="bg-white p-4 search-modal w-100"
                        style={{ maxWidth: "500px" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="d-flex justify-content-end">
                            <Button variant="light" onClick={toggleSearchModal}>
                                <FaTimes />
                            </Button>
                        </div>
                        <Form className="d-flex mt-3">
                            <FormControl
                                type="search"
                                placeholder="Search..."
                                className="me-2"
                            />
                            <Button variant="outline-primary">
                                <FaSearch />
                            </Button>
                        </Form>
                    </div>
                </div>
            )}

            {/* Logout Confirmation Modal */}
            <ConfirmModal
                show={isLogoutModalOpen}
                title="Confirm Logout"
                message="Are you sure you want to log out?"
                onConfirm={confirmLogout}
                onClose={closeLogoutModal}
            />

            {/* Cart Panel */}
            <CartPanel isOpen={isCartOpen} onClose={closeCart} />
        </>
    );
};

export default Header;
