import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-dark text-light pt-4 mt-5">
            <div className="container">
                <div className="row">
                    {/* Cột thông tin */}
                    <div className="col-md-4 mb-3">
                        <h5>MyShop</h5>
                        <p>
                            Chúng tôi cung cấp các sản phẩm chất lượng với dịch vụ hỗ trợ tận tâm.
                        </p>
                    </div>

                    {/* Cột điều hướng */}
                    <div className="col-md-4 mb-3">
                        <h5>Liên kết</h5>
                        <ul className="list-unstyled">
                            <li><Link to="/about" className="text-light text-decoration-none">Giới thiệu</Link></li>
                            <li><Link to="/contact" className="text-light text-decoration-none">Liên hệ</Link></li>
                            <li><Link to="/products" className="text-light text-decoration-none">Sản phẩm</Link></li>
                            <li><Link to="/policy" className="text-light text-decoration-none">Chính sách</Link></li>
                        </ul>
                    </div>

                    {/* Cột liên hệ */}
                    <div className="col-md-4 mb-3">
                        <h5>Liên hệ</h5>
                        <p>Email: support@myshop.com</p>
                        <p>Hotline: 0123 456 789</p>
                        <p>Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</p>
                    </div>
                </div>

                <hr className="border-secondary" />
                <div className="text-center pb-3">
                    <small>&copy; {new Date().getFullYear()} MyShop. All rights reserved.</small>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
