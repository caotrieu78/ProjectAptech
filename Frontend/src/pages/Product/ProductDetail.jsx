// src/pages/ProductDetail.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductVariantService from "../../services/productVariantService";
import { CartContext } from "../../context/CartContext";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import ProductService from "../../services/ProductService";
import CartService from "../../services/CartService";

const ProductDetail = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);
    const [product, setProduct] = useState(null);
    const [variants, setVariants] = useState([]);
    const [availableSizes, setAvailableSizes] = useState([]);
    const [availableColors, setAvailableColors] = useState([]);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedImage, setSelectedImage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const productData = await ProductService.getById(productId);
                if (!productData) throw new Error("Không tìm thấy sản phẩm.");
                setProduct(productData);
                setSelectedImage(
                    productData.ThumbnailURL || "https://via.placeholder.com/600x400?text=No+Image"
                );

                const timeout = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error("API timeout")), ms));
                const variantData = await Promise.race([
                    ProductVariantService.getAll(),
                    timeout(5000)
                ]);
                const filteredVariants = variantData.filter((v) => v.ProductID === parseInt(productId));
                setVariants(filteredVariants);

                const sizes = Array.from(new Set(filteredVariants.map((v) => v.size?.SizeID)))
                    .map((id) => filteredVariants.find((v) => v.size?.SizeID === id)?.size)
                    .filter(Boolean);
                const colors = Array.from(new Set(filteredVariants.map((v) => v.color?.ColorID)))
                    .map((id) => filteredVariants.find((v) => v.color?.ColorID === id)?.color)
                    .filter(Boolean);
                setAvailableSizes(sizes);
                setAvailableColors(colors);
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu:", err.message);
                setError("Không thể tải thông tin sản phẩm hoặc biến thể.");
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchData();
        } else {
            setError("ID sản phẩm không hợp lệ.");
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        if (selectedSize && selectedColor && variants.length > 0) {
            const matchedVariant = variants.find(
                (v) =>
                    v.size?.SizeID === parseInt(selectedSize) &&
                    v.color?.ColorID === parseInt(selectedColor)
            );
            setSelectedVariant(matchedVariant || null);
            setSelectedImage(
                matchedVariant?.ImageURL ||
                product?.ThumbnailURL ||
                "https://via.placeholder.com/600x400?text=No+Image"
            );
            if (matchedVariant && quantity > matchedVariant.StockQuantity) {
                setQuantity(matchedVariant.StockQuantity || 1);
            }
        } else {
            setSelectedVariant(null);
            setSelectedImage(
                product?.ThumbnailURL || "https://via.placeholder.com/600x400?text=No+Image"
            );
        }
    }, [selectedSize, selectedColor, variants, product, quantity]);

    const increaseQuantity = () => {
        if (selectedVariant && quantity < selectedVariant.StockQuantity) {
            setQuantity((prev) => prev + 1);
        }
    };

    const decreaseQuantity = () => {
        setQuantity((prev) => Math.max(1, prev - 1));
    };

    const handleAddToCart = async () => {
        if (!selectedVariant) {
            Swal.fire({
                icon: "warning",
                title: "Lỗi",
                text: "Vui lòng chọn size và màu!",
                timer: 2000,
                showConfirmButton: false
            });
            return;
        }

        if (selectedVariant.StockQuantity === 0) {
            Swal.fire({
                icon: "error",
                title: "Hết hàng",
                text: "Biến thể này hiện đã hết hàng!",
                timer: 2000,
                showConfirmButton: false
            });
            return;
        }

        try {
            await CartService.addItem(selectedVariant.VariantID, quantity);
            addToCart(selectedVariant, quantity); // Optional if you still want local state
            Swal.fire({
                icon: "success",
                title: "Thành công",
                text: "Đã thêm vào giỏ hàng!",
                timer: 2000,
                showConfirmButton: false
            });
        } catch (err) {
            console.error("Lỗi thêm giỏ hàng:", err);
            Swal.fire({
                icon: "error",
                title: "Lỗi",
                text: "Không thể thêm vào giỏ hàng!",
                timer: 2000,
                showConfirmButton: false
            });
        }
    };

    return (
        <div className="container py-5">
            {loading ? (
                <div className="text-center">Đang tải...</div>
            ) : error ? (
                <div className="alert alert-danger">{error}</div>
            ) : (
                product && (
                    <div className="row">
                        <div className="col-md-6">
                            <img
                                src={selectedImage}
                                alt={product.ProductName}
                                className="img-fluid rounded shadow"
                            />
                            <div className="mt-3 d-flex gap-2 overflow-auto">
                                {variants
                                    .filter((v) => v.ImageURL)
                                    .map((variant, index) => (
                                        <img
                                            key={index}
                                            src={variant.ImageURL}
                                            alt={`thumb-${index}`}
                                            className={`img-thumbnail ${selectedImage === variant.ImageURL ? "border-primary" : ""}`}
                                            style={{ width: "80px", height: "80px", objectFit: "cover", cursor: "pointer" }}
                                            onClick={() => setSelectedImage(variant.ImageURL)}
                                        />
                                    ))}
                            </div>
                        </div>

                        <div className="col-md-6">
                            <h2>{product.ProductName}</h2>
                            <p className="text-muted">
                                Giá: {(selectedVariant?.Price || product.Price).toLocaleString("vi-VN")} ₫
                            </p>
                            <p>{product.Description}</p>

                            <div className="mb-3">
                                <label>Chọn size:</label>
                                <select
                                    className="form-select"
                                    value={selectedSize}
                                    onChange={(e) => setSelectedSize(e.target.value)}
                                >
                                    <option value="">-- Chọn size --</option>
                                    {availableSizes.map((size) => (
                                        <option key={size.SizeID} value={size.SizeID}>
                                            {size.SizeName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label>Chọn màu:</label>
                                <select
                                    className="form-select"
                                    value={selectedColor}
                                    onChange={(e) => setSelectedColor(e.target.value)}
                                >
                                    <option value="">-- Chọn màu --</option>
                                    {availableColors.map((color) => (
                                        <option key={color.ColorID} value={color.ColorID}>
                                            {color.ColorName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-3 d-flex align-items-center gap-2">
                                <label className="mb-0">Số lượng:</label>
                                <button className="btn btn-outline-secondary" onClick={decreaseQuantity} disabled={quantity <= 1}>-</button>
                                <input type="text" readOnly value={quantity} className="form-control w-25 text-center" />
                                <button className="btn btn-outline-secondary" onClick={increaseQuantity} disabled={!selectedVariant || quantity >= selectedVariant.StockQuantity}>+</button>
                            </div>

                            <button className="btn btn-primary w-100" onClick={handleAddToCart} disabled={!selectedVariant}>
                                Thêm vào giỏ hàng
                            </button>
                        </div>
                    </div>
                )
            )}
        </div>
    );
};

export default ProductDetail;
