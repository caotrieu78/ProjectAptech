import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    FaSearch,
    FaShoppingCart,
    FaHeart,
    FaTimes,
    FaEye
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    Container,
    Navbar,
    Nav,
    Button,
    NavDropdown,
    Form,
    FormControl,
    Badge
} from "react-bootstrap";
import CartPanel from "./CartPanel";
import { PATHS } from "../constants/paths";
import CartService from "../services/CartService";

const Header = () => {
    const [user, setUser] = useState(null);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [visitCount, setVisitCount] = useState(0);
    const [cartItemCount, setCartItemCount] = useState(0);
    const navigate = useNavigate();

    // Hàm lấy số lượng sản phẩm từ API
    const fetchCartCount = async () => {
        try {
            const cartData = await CartService.getAll();
            const totalItems = cartData.reduce(
                (total, item) => total + item.Quantity,
                0
            );
            setCartItemCount(totalItems);
        } catch (error) {
            console.error("Error fetching cart count:", error);
            setCartItemCount(0);
        }
    };

    useEffect(() => {
        // Lấy thông tin user từ localStorage
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        }

        // Đếm số lượt truy cập
        let count = localStorage.getItem("visitCount") || 0;
        count = parseInt(count) + 1;
        localStorage.setItem("visitCount", count);
        setVisitCount(count);

        // Lấy số lượng sản phẩm từ API
        fetchCartCount();
    }, []);

    // Lắng nghe sự kiện cartUpdated từ CartPanel
    useEffect(() => {
        const updateCartCount = () => {
            fetchCartCount();
        };

        window.addEventListener("cartUpdated", updateCartCount);

        return () => {
            window.removeEventListener("cartUpdated", updateCartCount);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
    };

    const toggleSearchModal = () => setIsSearchModalOpen((prev) => !prev);
    const toggleCart = () => setIsCartOpen((prev) => !prev);
    const closeCart = () => setIsCartOpen(false);

    return (
        <>
            {/* Top bar */}
            <div className="bg-dark text-white py-2">
                <Container className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div className="fs-6 fw-semibold d-flex align-items-center gap-2">
                        Xin chào đây là nhóm C5Coders
                        <span className="ms-3 d-flex align-items-center gap-1">
                            <FaEye size={16} className="text-primary" />
                            <Badge bg="primary" className="rounded-pill">
                                {visitCount} lượt xem
                            </Badge>
                        </span>
                    </div>
                    <div className="d-flex flex-wrap align-items-center gap-3">
                        <NavLink
                            to="#"
                            className="text-white text-decoration-none hover-text"
                            style={{ transition: "color 0.3s" }}
                            onMouseEnter={(e) => (e.target.style.color = "#ecf0f1")}
                            onMouseLeave={(e) => (e.target.style.color = "#fff")}
                        >
                            Help & FAQs
                        </NavLink>
                        {user ? (
                            <>
                                <span className="text-white fs-6">
                                    Hi {user.FullName || user.Username}
                                </span>
                                <Button
                                    variant="outline-light"
                                    size="sm"
                                    className="hover-btn"
                                    style={{ transition: "background 0.3s, color 0.3s" }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = "#ecf0f1";
                                        e.target.style.color = "#2c3e50";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = "transparent";
                                        e.target.style.color = "#fff";
                                    }}
                                    onClick={handleLogout}
                                >
                                    Đăng xuất
                                </Button>
                            </>
                        ) : (
                            <NavLink
                                to="/login"
                                className="text-white text-decoration-none hover-text"
                                style={{ transition: "color 0.3s" }}
                                onMouseEnter={(e) => (e.target.style.color = "#ecf0f1")}
                                onMouseLeave={(e) => (e.target.style.color = "#fff")}
                            >
                                Đăng Nhập
                            </NavLink>
                        )}
                        <NavLink
                            to="#"
                            className="text-white text-decoration-none hover-text"
                            style={{ transition: "color 0.3s" }}
                            onMouseEnter={(e) => (e.target.style.color = "#ecf0f1")}
                            onMouseLeave={(e) => (e.target.style.color = "#fff")}
                        >
                            EN
                        </NavLink>
                        <NavLink
                            to="#"
                            className="text-white text-decoration-none hover-text"
                            style={{ transition: "color 0.3s" }}
                            onMouseEnter={(e) => (e.target.style.color = "#ecf0f1")}
                            onMouseLeave={(e) => (e.target.style.color = "#fff")}
                        >
                            USD
                        </NavLink>
                    </div>
                </Container>
            </div>

            {/* Navbar */}
            <Navbar
                bg="light"
                expand="lg"
                className="shadow-sm sticky-top"
                style={{ background: "#fff", borderBottom: "1px solid #eee" }}
            >
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
                        <div className="d-flex align-items-center d-lg-none gap-3">
                            <FaSearch
                                size={20}
                                className="text-secondary hover-icon"
                                style={{ transition: "color 0.3s" }}
                                onMouseEnter={(e) => (e.target.style.color = "#3498db")}
                                onMouseLeave={(e) => (e.target.style.color = "#6c757d")}
                                onClick={toggleSearchModal}
                            />
                            <div className="position-relative">
                                <FaShoppingCart
                                    size={20}
                                    className="text-secondary hover-icon"
                                    style={{ transition: "color 0.3s" }}
                                    onMouseEnter={(e) => (e.target.style.color = "#3498db")}
                                    onMouseLeave={(e) => (e.target.style.color = "#6c757d")}
                                    onClick={toggleCart}
                                />
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger text-white">
                                    {cartItemCount}
                                </span>
                            </div>
                            <div className="position-relative">
                                <FaHeart
                                    size={20}
                                    className="text-secondary hover-icon"
                                    style={{ transition: "color 0.3s" }}
                                    onMouseEnter={(e) => (e.target.style.color = "#e74c3c")}
                                    onMouseLeave={(e) => (e.target.style.color = "#6c757d")}
                                />
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger text-white">
                                    0
                                </span>
                            </div>
                        </div>

                        <Nav className="me-auto mx-auto">
                            <NavDropdown
                                title="Home"
                                id="home-nav-dropdown"
                                className="nav-dropdown"
                                style={{ fontSize: "1.1rem" }}
                            >
                                <NavDropdown.Item
                                    as={NavLink}
                                    to="/"
                                    className="dropdown-item-custom"
                                >
                                    Homepage 1
                                </NavDropdown.Item>
                                <NavDropdown.Item
                                    as={NavLink}
                                    to="/home-02"
                                    className="dropdown-item-custom"
                                >
                                    Homepage 2
                                </NavDropdown.Item>
                                <NavDropdown.Item
                                    as={NavLink}
                                    to="/home-03"
                                    className="dropdown-item-custom"
                                >
                                    Homepage 3
                                </NavDropdown.Item>
                            </NavDropdown>
                            <Nav.Link
                                as={NavLink}
                                to="/shop"
                                className="nav-link-custom"
                                style={{ fontSize: "1.1rem" }}
                            >
                                Shop
                            </Nav.Link>
                            <Nav.Link
                                as={NavLink}
                                to="/shoping-cart"
                                className="nav-link-custom"
                                style={{ fontSize: "1.1rem" }}
                            >
                                Features <span className="badge bg-danger ms-1"></span>
                            </Nav.Link>
                            <Nav.Link
                                as={NavLink}
                                to="/blog"
                                className="nav-link-custom"
                                style={{ fontSize: "1.1rem" }}
                            >
                                Blog
                            </Nav.Link>
                            <Nav.Link
                                as={NavLink}
                                to={PATHS.ABOUT}
                                className="nav-link-custom"
                                style={{ fontSize: "1.1rem" }}
                            >
                                About
                            </Nav.Link>
                            <Nav.Link
                                as={NavLink}
                                to={PATHS.CONTACT}
                                className="nav-link-custom"
                                style={{ fontSize: "1.1rem" }}
                            >
                                Contact
                            </Nav.Link>
                        </Nav>
                        <div className="d-none d-lg-flex align-items-center gap-3">
                            <FaSearch
                                size={20}
                                className="text-secondary hover-icon"
                                style={{ transition: "color 0.3s" }}
                                onMouseEnter={(e) => (e.target.style.color = "#3498db")}
                                onMouseLeave={(e) => (e.target.style.color = "#6c757d")}
                                onClick={toggleSearchModal}
                            />
                            <div className="position-relative">
                                <FaShoppingCart
                                    size={20}
                                    className="text-secondary hover-icon"
                                    style={{ transition: "color 0.3s" }}
                                    onMouseEnter={(e) => (e.target.style.color = "#3498db")}
                                    onMouseLeave={(e) => (e.target.style.color = "#6c757d")}
                                    onClick={toggleCart}
                                />
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger text-white">
                                    {cartItemCount}
                                </span>
                            </div>
                            <div className="position-relative">
                                <FaHeart
                                    size={20}
                                    className="text-secondary hover-icon"
                                    style={{ transition: "color 0.3s" }}
                                    onMouseEnter={(e) => (e.target.style.color = "#e74c3c")}
                                    onMouseLeave={(e) => (e.target.style.color = "#6c757d")}
                                />
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger text-white">
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
                    className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center z-3"
                    onClick={toggleSearchModal}
                >
                    <div
                        className="bg-white p-4 rounded w-100"
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

            {/* Cart Panel */}
            <CartPanel isOpen={isCartOpen} onClose={closeCart} />
        </>
    );
};

export default Header;
