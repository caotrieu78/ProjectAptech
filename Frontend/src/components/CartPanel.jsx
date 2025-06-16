import React from 'react';
import { FaTimes } from 'react-icons/fa';

const CartPanel = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div
            className="position-fixed top-0 end-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-end"
            style={{ zIndex: 1055 }} // higher than Bootstrap's sticky navbar (1020)
            onClick={onClose}
        >
            <div
                className="bg-white p-4 h-100 cart-slide-in"
                style={{
                    width: '400px',
                    maxWidth: '100%',
                }}
                onClick={e => e.stopPropagation()}
            >
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold m-0">Your Cart</h5>
                    <FaTimes role="button" onClick={onClose} />
                </div>

                <ul className="list-unstyled">
                    <li className="d-flex mb-3">
                        <img src="/images/item-cart-01.jpg" alt="White Shirt Pleat" width="60" className="me-3" />
                        <div>
                            <div className="fw-semibold">White Shirt Pleat</div>
                            <small>1 x $19.00</small>
                        </div>
                    </li>
                    <li className="d-flex mb-3">
                        <img src="/images/item-cart-02.jpg" alt="Converse All Star" width="60" className="me-3" />
                        <div>
                            <div className="fw-semibold">Converse All Star</div>
                            <small>1 x $39.00</small>
                        </div>
                    </li>
                    <li className="d-flex mb-4">
                        <img src="/images/item-cart-03.jpg" alt="Nixon Porter Leather" width="60" className="me-3" />
                        <div>
                            <div className="fw-semibold">Nixon Porter Leather</div>
                            <small>1 x $17.00</small>
                        </div>
                    </li>
                </ul>

                <div className="mb-4">
                    <h6>Total: $75.00</h6>
                </div>

                <div className="d-flex gap-2">
                    <a href="/shoping-cart" className="btn btn-dark w-50">View Cart</a>
                    <a href="/checkout" className="btn btn-outline-dark w-50">Check Out</a>
                </div>
            </div>
        </div>
    );
};

export default CartPanel;
