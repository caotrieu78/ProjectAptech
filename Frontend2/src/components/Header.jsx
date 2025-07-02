import React, { useEffect, useState, useContext, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaShoppingCart,
  FaTimes,
  FaEye,
  FaUser,
  FaSignInAlt
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
import ConfirmModal from "./ConfirmModal";
import { PATHS } from "../constants/paths";
import { CartContext } from "../context/CartContext";
import { logout } from "../services/authService";

const Header = () => {
  const { cartItemCount, resetCart } = useContext(CartContext);
  const [user, setUser] = useState(null);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [visitCount, setVisitCount] = useState(0);
  const [flyImage, setFlyImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const cartIconRef = useRef(null);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      resetCart();
    }

    // Đếm số lượt truy cập
    const sessionKey = "visited";
    const hasVisited = sessionStorage.getItem(sessionKey);
    if (!hasVisited) {
      const count = parseInt(localStorage.getItem("visitCount") || "0", 10) + 1;
      localStorage.setItem("visitCount", count);
      sessionStorage.setItem(sessionKey, "true");
      setVisitCount(count);
    } else {
      setVisitCount(parseInt(localStorage.getItem("visitCount") || "0", 10));
    }
  }, [resetCart]);

  useEffect(() => {
    const handleCartItemAdded = (event) => {
      const { imageUrl } = event.detail || {};
      if (!imageUrl || !cartIconRef.current) return;

      const cartRect = cartIconRef.current.getBoundingClientRect();
      const cartX = cartRect.left + cartRect.width / 2;
      const cartY = cartRect.top + cartRect.height / 2;

      setFlyImage({
        src: imageUrl,
        startX: window.innerWidth / 2,
        startY: window.innerHeight / 2,
        endX: cartX,
        endY: cartY
      });

      setTimeout(() => setFlyImage(null), 1000);
    };

    window.addEventListener("cartItemAdded", handleCartItemAdded);
    return () =>
      window.removeEventListener("cartItemAdded", handleCartItemAdded);
  }, []);

  useEffect(() => {
    if (isSearchModalOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchModalOpen]);

  const handleLogout = () => setIsLogoutModalOpen(true);
  const confirmLogout = async () => {
    await logout(() => resetCart());
    setUser(null);
    setIsLogoutModalOpen(false);
    navigate("/login");
  };
  const closeLogoutModal = () => setIsLogoutModalOpen(false);

  const toggleSearchModal = () => {
    setIsSearchModalOpen((prev) => !prev);
    setSearchQuery("");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      toggleSearchModal();
    }
  };

  const toggleCart = () => setIsCartOpen((prev) => !prev);
  const closeCart = () => setIsCartOpen(false);

  return (
    <>
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

      <div className="top-bar text-white">
        <Container className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div className="team-info fs-6 fw-semibold d-flex align-items-center gap-2">
            <span>Hello, this is C5Coders team</span>
            <span className="ms-3 view-count">
              <FaEye size={16} className="hover-icon" />
              <Badge className="view-badge text-white">
                {visitCount} views
              </Badge>
            </span>
          </div>
          <div className="user-info d-flex flex-wrap align-items-center gap-3">
            {user ? (
              <>
                <span className="text-white fs-6 d-flex align-items-center gap-1">
                  <FaUser size={14} /> Hi {user.FullName || user.Username}
                </span>
                <Button
                  variant="outline-light"
                  size="sm"
                  className="logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <NavLink to="/login" className="login-link">
                <FaSignInAlt size={14} /> Login
              </NavLink>
            )}
          </div>
        </Container>
      </div>

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
                className="icon-hover text-secondary hover-icon"
                onClick={toggleSearchModal}
              />
              <div className="position-relative cart-icon-container">
                <FaShoppingCart
                  size={20}
                  className="icon-hover text-secondary hover-icon"
                  ref={cartIconRef}
                  onClick={toggleCart}
                />
                <span className="position-absolute badge rounded-circle bg-danger text-white">
                  {cartItemCount}
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
                className="icon-hover text-secondary hover-icon"
                onClick={toggleSearchModal}
              />
              <div className="position-relative cart-icon-container">
                <FaShoppingCart
                  size={20}
                  className="icon-hover text-secondary hover-icon"
                  ref={cartIconRef}
                  onClick={toggleCart}
                />
                <span className="position-absolute badge rounded-circle bg-danger text-white">
                  {cartItemCount}
                </span>
              </div>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {isSearchModalOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center"
          style={{ zIndex: 1050 }}
          onClick={toggleSearchModal}
        >
          <div className="search-modal" onClick={(e) => e.stopPropagation()}>
            <div className="search-modal-header">
              <h2 className="search-modal-title">Search Products</h2>
              <FaTimes
                className="search-modal-close"
                onClick={toggleSearchModal}
              />
            </div>
            <Form className="search-form" onSubmit={handleSearchSubmit}>
              <FormControl
                type="search"
                placeholder="Enter product name..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                ref={searchInputRef}
              />
              <Button variant="primary" type="submit" className="search-button">
                <FaSearch /> Search
              </Button>
            </Form>
          </div>
        </div>
      )}

      <ConfirmModal
        show={isLogoutModalOpen}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        onConfirm={confirmLogout}
        onClose={closeLogoutModal}
        confirmText="Logout"
        cancelText="Cancel"
        confirmVariant="danger"
        size="lg"
      />

      <CartPanel isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
};

export default Header;
