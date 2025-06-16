import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    FaSearch,
    FaShoppingCart,
    FaHeart,
    FaTimes
} from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Navbar, Nav, Button, NavDropdown, Form, FormControl } from 'react-bootstrap';
import CartPanel from './CartPanel'; // Đảm bảo đường dẫn chính xác

const Header = () => {
    const [user, setUser] = useState(null);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    const toggleSearchModal = () => setIsSearchModalOpen(prev => !prev);
    const toggleCart = () => setIsCartOpen(prev => !prev);
    const closeCart = () => setIsCartOpen(false);

    return (
        <>
            {/* Top bar */}
            <div className="bg-dark text-white py-2">
                <Container className="d-flex justify-content-between flex-wrap gap-2">
                    <div>Xin chào đây là nhóm C5Coders</div>
                    <div className="d-flex flex-wrap align-items-center gap-3">
                        <NavLink to="#" className="text-white text-decoration-none">Help & FAQs</NavLink>
                        {user ? (
                            <>
                                <span className="text-white">Hi {user.FullName || user.Username}</span>
                                <Button variant="outline-light" size="sm" onClick={handleLogout}>Đăng xuất</Button>
                            </>
                        ) : (
                            <NavLink to="/login" className="text-white text-decoration-none">Đăng Nhập</NavLink>
                        )}
                        <NavLink to="#" className="text-white text-decoration-none">EN</NavLink>
                        <NavLink to="#" className="text-white text-decoration-none">USD</NavLink>
                    </div>
                </Container>
            </div>

            {/* Navbar */}
            <Navbar bg="light" expand="lg" className="shadow-sm sticky-top">
                <Container>
                    <Navbar.Brand as={NavLink} to="/">
                        <strong>Maverick <span className="fw-light">Dresses</span></strong>
                    </Navbar.Brand>

                    <div className="d-flex align-items-center d-lg-none gap-3">
                        <FaSearch role="button" onClick={toggleSearchModal} />
                        <div className="position-relative">
                            <FaShoppingCart role="button" onClick={toggleCart} />
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">2</span>
                        </div>
                        <div className="position-relative">
                            <FaHeart />
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">0</span>
                        </div>
                    </div>

                    <Navbar.Toggle aria-controls="main-navbar" />
                    <Navbar.Collapse id="main-navbar">
                        <Nav className="me-auto">
                            <NavDropdown title="Home" id="home-nav-dropdown">
                                <NavDropdown.Item as={NavLink} to="/">Homepage 1</NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to="/home-02">Homepage 2</NavDropdown.Item>
                                <NavDropdown.Item as={NavLink} to="/home-03">Homepage 3</NavDropdown.Item>
                            </NavDropdown>
                            <Nav.Link as={NavLink} to="/product">Shop</Nav.Link>
                            <Nav.Link as={NavLink} to="/shoping-cart">
                                Features <span className="badge bg-danger ms-1"></span>
                            </Nav.Link>
                            <Nav.Link as={NavLink} to="/blog">Blog</Nav.Link>
                            <Nav.Link as={NavLink} to="/about">About</Nav.Link>
                            <Nav.Link as={NavLink} to="/contact">Contact</Nav.Link>
                        </Nav>
                        <div className="d-none d-lg-flex align-items-center gap-3">
                            <FaSearch role="button" onClick={toggleSearchModal} />
                            <div className="position-relative">
                                <FaShoppingCart role="button" onClick={toggleCart} />
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">2</span>
                            </div>
                            <div className="position-relative">
                                <FaHeart />
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">0</span>
                            </div>
                        </div>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Search Modal */}
            {isSearchModalOpen && (
                <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex align-items-center justify-content-center z-3" onClick={toggleSearchModal}>
                    <div className="bg-white p-4 rounded w-100" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
                        <div className="d-flex justify-content-end">
                            <Button variant="light" onClick={toggleSearchModal}><FaTimes /></Button>
                        </div>
                        <Form className="d-flex mt-3">
                            <FormControl type="search" placeholder="Search..." className="me-2" />
                            <Button variant="outline-primary"><FaSearch /></Button>
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
