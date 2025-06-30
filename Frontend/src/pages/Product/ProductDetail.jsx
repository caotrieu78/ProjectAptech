import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductVariantService from "../../services/productVariantService";
import { CartContext } from "../../context/CartContext";
import Swal from "sweetalert2";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import ProductService from "../../services/ProductService";
import { getUser } from "../../services/authService";

// Custom CSS for skeleton loader and hover effects
const styles = `
  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    opacity: 0.8;
  }
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  .cursor-pointer:hover {
    transform: scale(1.05);
    border-color: #007bff !important;
  }
`;

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

    // Fetch product and variant data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const productData = await ProductService.getById(productId);
                if (!productData) throw new Error("Product not found.");
                setProduct(productData);
                setSelectedImage(
                    productData.ThumbnailURL ||
                    "https://via.placeholder.com/600x400?text=No+Image"
                );

                const timeout = (ms) =>
                    new Promise((_, reject) =>
                        setTimeout(() => reject(new Error("API request timed out")), ms)
                    );
                const variantData = await Promise.race([
                    ProductVariantService.getAll(),
                    timeout(5000)
                ]);
                const filteredVariants = variantData.filter(
                    (v) => v.ProductID === parseInt(productId)
                );
                setVariants(filteredVariants);

                const sizes = Array.from(
                    new Set(filteredVariants.map((v) => v.size?.SizeID))
                )
                    .map(
                        (id) => filteredVariants.find((v) => v.size?.SizeID === id)?.size
                    )
                    .filter(Boolean);
                const colors = Array.from(
                    new Set(filteredVariants.map((v) => v.color?.ColorID))
                )
                    .map(
                        (id) => filteredVariants.find((v) => v.color?.ColorID === id)?.color
                    )
                    .filter(Boolean);
                setAvailableSizes(sizes);
                setAvailableColors(colors);
            } catch (err) {
                console.error("Error fetching data:", err.message);
                setError("Unable to load product or variant information.");
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchData();
        } else {
            setError("Invalid product ID.");
            setLoading(false);
        }
    }, [productId]);

    // Update selected variant and image
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
                product?.ThumbnailURL ||
                "https://via.placeholder.com/600x400?text=No+Image"
            );
        }
    }, [selectedSize, selectedColor, variants, product, quantity]);

    // Quantity handlers
    const increaseQuantity = () => {
        if (selectedVariant && quantity < selectedVariant.StockQuantity) {
            setQuantity((prev) => prev + 1);
        }
    };

    const decreaseQuantity = () => {
        setQuantity((prev) => Math.max(1, prev - 1));
    };

    // Add to cart handler
    const handleAddToCart = async () => {
        const user = getUser();
        if (!user) {
            Swal.fire({
                icon: "warning",
                title: "Please log in!",
                text: "You need to log in to add products to the cart.",
                timer: 2000,
                showConfirmButton: false
            });
            return false;
        }

        if (!selectedVariant) {
            Swal.fire({
                icon: "warning",
                title: "Error",
                text: "Please select size and color!",
                timer: 2000,
                showConfirmButton: false
            });
            return false;
        }

        if (selectedVariant.StockQuantity === 0) {
            Swal.fire({
                icon: "error",
                title: "Out of stock",
                text: "This variant is currently out of stock!",
                timer: 2000,
                showConfirmButton: false
            });
            return false;
        }

        try {
            await addToCart(selectedVariant, quantity);
            await Swal.fire({
                icon: "success",
                title: "Success",
                text: "Added to cart!",
                timer: 2000,
                showConfirmButton: false
            });
            // Dispatch event with image URL for fly-to-cart animation
            window.dispatchEvent(
                new CustomEvent("cartItemAdded", {
                    detail: { imageUrl: selectedImage }
                })
            );
            return true;
        } catch (err) {
            console.error("Error adding to cart:", err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Unable to add to cart!",
                timer: 2000,
                showConfirmButton: false
            });
            return false;
        }
    };

    // Buy now handler
    const handleBuyNow = async () => {
        const user = getUser();
        if (!user) {
            Swal.fire({
                icon: "warning",
                title: "Please log in!",
                text: "You need to log in to proceed with the purchase.",
                timer: 2000,
                showConfirmButton: false
            });
            return;
        }

        const success = await handleAddToCart();
        if (success) {
            navigate("/checkout");
        }
    };

    // Skeleton Loader Component
    const SkeletonLoader = () => (
        <div className="row g-4">
            <div className="col-md-7">
                <div
                    className="skeleton"
                    style={{ height: "500px", borderRadius: "12px" }}
                />
                <div className="d-flex gap-2 mt-3">
                    {[...Array(4)].map((_, index) => (
                        <div
                            key={index}
                            className="skeleton"
                            style={{ width: "80px", height: "80px", borderRadius: "8px" }}
                        />
                    ))}
                </div>
            </div>
            <div className="col-md-5">
                <div
                    className="skeleton mb-3"
                    style={{ height: "30px", width: "70%" }}
                />
                <div
                    className="skeleton mb-4"
                    style={{ height: "20px", width: "40%" }}
                />
                <div className="skeleton mb-4" style={{ height: "100px" }} />
                <div className="skeleton mb-3" style={{ height: "40px" }} />
                <div className="skeleton mb-3" style={{ height: "40px" }} />
                <div className="skeleton mb-4" style={{ height: "40px" }} />
                <div
                    className="skeleton"
                    style={{ height: "50px", borderRadius: "50px" }}
                />
            </div>
        </div>
    );

    // Render loading state
    if (loading) {
        return (
            <div className="min-vh-100 py-5 bg-light">
                <style>{styles}</style>
                <div className="container">
                    <SkeletonLoader />
                </div>
            </div>
        );
    }

    // Render error state
    if (error) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="alert alert-danger text-center p-5" role="alert">
                    {error}
                </div>
            </div>
        );
    }

    // Render not found state
    if (!product) {
        return (
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <div className="alert alert-warning text-center p-5" role="alert">
                    Product not found.
                </div>
            </div>
        );
    }

    // Main render
    return (
        <div className="min-vh-100 py-5 bg-light">
            <style>{styles}</style>
            <div className="container">
                <div className="row g-4">
                    {/* Product Images */}
                    <div className="col-md-7">
                        <div className="position-relative">
                            <div
                                id="productCarousel"
                                className="carousel slide"
                                data-bs-ride="carousel"
                            >
                                <div className="carousel-inner">
                                    <div className="carousel-item active">
                                        <img
                                            src={selectedImage}
                                            alt={product.ProductName}
                                            className="d-block w-100 rounded-3 shadow product-image"
                                            style={{ height: "500px", objectFit: "contain" }}
                                            loading="lazy"
                                        />
                                    </div>
                                </div>
                                <button
                                    className="carousel-control-prev"
                                    type="button"
                                    data-bs-target="#productCarousel"
                                    data-bs-slide="prev"
                                >
                                    <span
                                        className="carousel-control-prev-icon"
                                        aria-hidden="true"
                                    ></span>
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button
                                    className="carousel-control-next"
                                    type="button"
                                    data-bs-target="#productCarousel"
                                    data-bs-slide="next"
                                >
                                    <span
                                        className="carousel-control-next-icon"
                                        aria-hidden="true"
                                    ></span>
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </div>
                            <div className="d-flex gap-2 mt-3 overflow-auto">
                                {variants
                                    .filter((v) => v.ImageURL)
                                    .map((variant, index) => (
                                        <img
                                            key={index}
                                            src={variant.ImageURL}
                                            alt={`Thumbnail ${index + 1}`}
                                            className={`img-thumbnail rounded cursor-pointer ${selectedImage === variant.ImageURL
                                                ? "border-primary"
                                                : ""
                                                }`}
                                            style={{
                                                width: "80px",
                                                height: "80px",
                                                objectFit: "cover",
                                                transition: "transform 0.2s ease"
                                            }}
                                            onClick={() => setSelectedImage(variant.ImageURL)}
                                        />
                                    ))}
                            </div>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="col-md-5">
                        <div className="p-4 bg-white rounded-3 shadow">
                            <h2 className="h4 mb-3 fw-bold">{product.ProductName}</h2>
                            <p className="text-muted fs-5 mb-4">
                                Price:{" "}
                                {(selectedVariant?.Price || product.Price).toLocaleString(
                                    "en-US"
                                )}{" "}
                                $
                            </p>
                            <div className="card mb-4">
                                <div className="card-body">
                                    <h5 className="card-title text-primary fw-bold">
                                        Description:
                                    </h5>
                                    <p className="card-text text-secondary">
                                        {product.Description}
                                    </p>
                                </div>
                            </div>

                            {/* Size Selection */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Select Size:</label>
                                <select
                                    className="form-select"
                                    value={selectedSize}
                                    onChange={(e) => setSelectedSize(e.target.value)}
                                >
                                    <option value="">-- Select Size --</option>
                                    {availableSizes.map((size) => (
                                        <option key={size.SizeID} value={size.SizeID}>
                                            {size.SizeName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Color Selection */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold">Select Color:</label>
                                <select
                                    className="form-select"
                                    value={selectedColor}
                                    onChange={(e) => setSelectedColor(e.target.value)}
                                >
                                    <option value="">-- Select Color --</option>
                                    {availableColors.map((color) => (
                                        <option key={color.ColorID} value={color.ColorID}>
                                            {color.ColorName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Quantity Selection */}
                            <div className="mb-4">
                                <label className="form-label fw-semibold">Quantity:</label>
                                <div className="input-group w-50">
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={decreaseQuantity}
                                        disabled={quantity <= 1 || !selectedVariant}
                                        aria-label="Decrease quantity"
                                    >
                                        –
                                    </button>
                                    <input
                                        type="text"
                                        className="form-control text-center"
                                        value={quantity}
                                        readOnly
                                    />
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={increaseQuantity}
                                        disabled={
                                            !selectedVariant ||
                                            quantity >= selectedVariant.StockQuantity
                                        }
                                        aria-label="Increase quantity"
                                    >
                                        +
                                    </button>
                                </div>
                                {selectedVariant && (
                                    <small className="text-muted">
                                        {selectedVariant.StockQuantity} items available
                                    </small>
                                )}
                            </div>

                            {/* Add to Cart and Buy Now Buttons */}
                            <div className="d-flex gap-2 mb-4">
                                <button
                                    className="btn btn-primary w-100 py-3 rounded-pill"
                                    onClick={handleAddToCart}
                                    disabled={!selectedVariant}
                                >
                                    Add to Cart
                                </button>
                                <button
                                    className="btn btn-success w-100 py-3 rounded-pill"
                                    onClick={handleBuyNow}
                                    disabled={!selectedVariant}
                                >
                                    Buy Now
                                </button>
                            </div>

                            {/* Social Share */}
                            <div className="d-flex gap-3 mt-3 justify-content-center">
                                <a
                                    href="#"
                                    className="text-muted fs-5"
                                    data-bs-toggle="tooltip"
                                    title="Add to Favorites"
                                >
                                    <i className="bi bi-heart"></i>
                                </a>
                                <a
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                                        window.location.href
                                    )}`}
                                    className="text-muted fs-5"
                                    data-bs-toggle="tooltip"
                                    title="Share on Facebook"
                                    target="_blank"
                                >
                                    <i className="bi bi-facebook"></i>
                                </a>
                                <a
                                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                                        window.location.href
                                    )}&text=${encodeURIComponent(product.ProductName)}`}
                                    className="text-muted fs-5"
                                    data-bs-toggle="tooltip"
                                    title="Share on Twitter"
                                    target="_blank"
                                >
                                    <i className="bi bi-twitter"></i>
                                </a>
                                <a
                                    href="#"
                                    className="text-muted fs-5"
                                    data-bs-toggle="tooltip"
                                    title="Share on Google"
                                >
                                    <i className="bi bi-google"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
