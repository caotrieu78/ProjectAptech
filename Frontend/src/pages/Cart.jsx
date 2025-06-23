import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartService from "../services/CartService";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const data = await CartService.getAll();
                setCartItems(data);

                const totalPrice = data.reduce((sum, item) => {
                    const price = parseFloat(item.variant?.Price || 0);
                    return sum + price * item.Quantity;
                }, 0);

                setTotal(totalPrice);
            } catch (error) {
                console.error("Lỗi khi tải giỏ hàng:", error);
            }
        };

        fetchCart();
    }, []);

    const formatCurrency = (value) => {
        return value.toLocaleString("vi-VN") + " ₫";
    };

    return (
        <div className="wrap-header-cart js-panel-cart">
            <div className="s-full js-hide-cart" />
            <div className="header-cart flex-col-l p-l-65 p-r-25">
                <div className="header-cart-title flex-w flex-sb-m p-b-8">
                    <span className="mtext-103 cl2">Giỏ hàng</span>
                    <div className="fs-35 lh-10 cl2 p-lr-5 pointer hov-cl1 trans-04 js-hide-cart">
                        <i className="zmdi zmdi-close" />
                    </div>
                </div>

                <div className="header-cart-content flex-w js-pscroll">
                    <ul className="header-cart-wrapitem w-full">
                        {cartItems.length === 0 ? (
                            <li className="text-muted px-3 py-2">Không có sản phẩm nào trong giỏ hàng.</li>
                        ) : (
                            cartItems.map((item) => (
                                <li key={item.CartItemID} className="header-cart-item flex-w flex-t m-b-12">
                                    <div className="header-cart-item-img">
                                        <img
                                            src={item.variant?.ImageURL || item.variant?.product?.ThumbnailURL || "https://via.placeholder.com/100"}
                                            alt={item.variant?.product?.ProductName}
                                        />
                                    </div>
                                    <div className="header-cart-item-txt p-t-8">
                                        <span className="header-cart-item-name m-b-12 hov-cl1 trans-04">
                                            {item.variant?.product?.ProductName}
                                        </span>
                                        <div className="text-muted small">
                                            {item.variant?.color?.ColorName} / {item.variant?.size?.SizeName}
                                        </div>
                                        <span className="header-cart-item-info">
                                            {item.Quantity} x {formatCurrency(item.variant?.Price || 0)}
                                        </span>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>

                    <div className="w-full">
                        <div className="header-cart-total w-full p-tb-20">
                            Tổng cộng: {formatCurrency(total)}
                        </div>

                        <div className="header-cart-buttons flex-w w-full">
                            <button
                                onClick={() => navigate("/cart")}
                                className="flex-c-m stext-101 cl0 size-107 bg3 bor2 hov-btn3 p-lr-15 trans-04 m-r-8 m-b-10"
                            >
                                Xem giỏ hàng
                            </button>
                            <button
                                onClick={() => navigate("/checkout")}
                                className="flex-c-m stext-101 cl0 size-107 bg3 bor2 hov-btn3 p-lr-15 trans-04 m-b-10"
                            >
                                Thanh toán
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
