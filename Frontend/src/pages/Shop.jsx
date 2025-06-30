import React, { useState, useEffect, useContext, useCallback } from "react";
import ProductService from "../services/ProductService";
import CartService from "../services/CartService";
import { CartContext } from "../context/CartContext";
import ProductFilter from "../components/ProductFilter";
import ProductCard from "../components/ProductCard";
import Swal from "sweetalert2";
import { getUser } from "../services/authService";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

// CSS styles for UI
const styles = `
  .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 12px;
  }
  .skeleton-img {
    height: 200px;
    width: 100%;
    border-radius: 12px 12px 0 0;
  }
  .skeleton-text {
    height: 20px;
    width: 80%;
    margin: 10px auto;
    border-radius: 4px;
  }
  .skeleton-btn {
    height: 40px;
    width: 60%;
    margin: 10px auto;
    border-radius: 20px;
  }
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  .shop-container {
    background: #f9fafb;
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    min-height: 100vh;
  }
  .shop-title {
    color: #1f2937;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 2px;
    text-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    animation: fadeIn 0.5s ease-in;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .pagination-btn {
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    border: none;
    border-radius: 25px;
    padding: 8px 20px;
    font-weight: 600;
    transition: all 0.3s ease;
    margin: 0 5px;
  }
  .pagination-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #34d399, #10b981);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }
  .pagination-btn.active {
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
  .pagination-btn:disabled {
    background: #d1d5db;
    cursor: not-allowed;
  }
  .back-to-top {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #10b981;
    color: white;
    border: none;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
  }
  .back-to-top:hover {
    background: #34d399;
    transform: translateY(-2px);
  }
  @media (max-width: 576px) {
    .shop-container {
      padding: 1rem;
    }
    .col-sm-6 {
      flex: 0 0 100%;
      max-width: 100%;
    }
  }
`;

const Shop = () => {
    const { addToCart } = useContext(CartContext);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;

    // Fetch products
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await ProductService.getAll();
                const enriched = data.map((product) => {
                    if (product.Variants?.length > 0) {
                        const sorted = [...product.Variants].sort(
                            (a, b) => a.Price - b.Price
                        );
                        return { ...product, SelectedVariant: sorted[0] };
                    }
                    return { ...product, SelectedVariant: { Price: product.Price || 0 } };
                });
                setProducts(enriched);
                setFilteredProducts(enriched);
            } catch (err) {
                setError("Unable to load products. Please try again!");
                console.error("Error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
        window.scrollTo(0, 0);
    }, []);

    // Handle filter changes
    const handleFilterChange = useCallback(
        (filter) => {
            let filtered = [...products];

            if (filter.search) {
                filtered = filtered.filter((p) =>
                    p.ProductName?.toLowerCase().includes(filter.search.toLowerCase())
                );
            }

            if (filter.tag === "Best Seller") {
                filtered = filtered.filter((p) => p.isBestSeller === true);
            } else if (filter.tag === "New Arrival") {
                filtered = filtered.filter(
                    (p) =>
                        p.createdAt &&
                        new Date(p.createdAt) >=
                        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                );
            }

            if (filter.gender) {
                filtered = filtered.filter((p) => p.Gender === filter.gender);
            }

            if (filter.category) {
                filtered = filtered.filter(
                    (p) => p.category?.CategoryName === filter.category
                );
            }

            if (filter.minPrice || filter.maxPrice) {
                filtered = filtered.filter((p) => {
                    const price = parseFloat(p.SelectedVariant?.Price) || 0;
                    const minPrice = parseInt(filter.minPrice) || 0;
                    const maxPrice = parseInt(filter.maxPrice) || Infinity;
                    return price >= minPrice && price <= maxPrice;
                });
            }

            if (filter.sortBy) {
                filtered.sort((a, b) => {
                    const priceA = parseFloat(a.SelectedVariant?.Price) || 0;
                    const priceB = parseFloat(b.SelectedVariant?.Price) || 0;
                    if (filter.sortBy === "price-asc") return priceA - priceB;
                    if (filter.sortBy === "price-desc") return priceB - priceA;
                    if (filter.sortBy === "newest")
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    return 0;
                });
            }

            setFilteredProducts(filtered);
            setCurrentPage(1);
        },
        [products]
    );

    // Handle add to cart
    const handleAddToCart = useCallback(
        async (product) => {
            const user = getUser();
            if (!user) {
                Swal.fire({
                    icon: "warning",
                    title: "Please log in!",
                    text: "You need to log in to add products to cart.",
                    timer: 2000,
                    showConfirmButton: false
                });
                return;
            }

            if (!product.SelectedVariant) {
                Swal.fire({
                    icon: "warning",
                    title: "Error",
                    text: "Please select a product variant!",
                    timer: 2000,
                    showConfirmButton: false
                });
                return;
            }

            try {
                await CartService.addItem(product.SelectedVariant.VariantID, 1);
                addToCart(product.SelectedVariant, 1);
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: `${product.ProductName} has been added to cart!`,
                    timer: 2000,
                    showConfirmButton: false
                });
            } catch (err) {
                Swal.fire({
                    icon: "error",
                    title: "Error!",
                    text: "Unable to add to cart.",
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        },
        [addToCart]
    );

    // Pagination
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(
        indexOfFirstProduct,
        indexOfLastProduct
    );
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    // Back to top
    const handleBackToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Skeleton Loader
    const SkeletonLoader = () => (
        <div className="row g-4">
            {[...Array(productsPerPage)].map((_, index) => (
                <div key={index} className="col-md-3 col-sm-6 col-12 mb-4">
                    <div className="skeleton">
                        <div className="skeleton-img" />
                        <div className="skeleton-text" />
                        <div className="skeleton-text" style={{ width: "60%" }} />
                        <div className="skeleton-btn" />
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="shop-container py-5">
            <style>{styles}</style>
            <div className="container">
                <h1 className="text-center mb-5 shop-title">Product Shop</h1>

                <ProductFilter onFilterChange={handleFilterChange} />

                {isLoading ? (
                    <SkeletonLoader />
                ) : error ? (
                    <div className="text-center py-5 text-danger">{error}</div>
                ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-5 text-muted">No products found.</div>
                ) : (
                    <>
                        <div className="row g-4">
                            {currentProducts.map((product) => (
                                <ProductCard
                                    key={product.ProductID}
                                    product={product}
                                    onQuickView={() => { }}
                                    onAddToCart={() => handleAddToCart(product)}
                                />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <nav
                                className="d-flex justify-content-center mt-5"
                                aria-label="Product Pagination"
                            >
                                <ul className="pagination">
                                    <li className="page-item">
                                        <button
                                            className="page-link pagination-btn"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            aria-label="Previous"
                                        >
                                            « Previous
                                        </button>
                                    </li>
                                    {[...Array(totalPages)].map((_, index) => (
                                        <li key={index} className="page-item">
                                            <button
                                                className={`page-link pagination-btn ${currentPage === index + 1 ? "active" : ""
                                                    }`}
                                                onClick={() => handlePageChange(index + 1)}
                                                aria-current={
                                                    currentPage === index + 1 ? "page" : undefined
                                                }
                                            >
                                                {index + 1}
                                            </button>
                                        </li>
                                    ))}
                                    <li className="page-item">
                                        <button
                                            className="page-link pagination-btn"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            aria-label="Next"
                                        >
                                            Next »
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        )}
                    </>
                )}

                {/* Back to Top Button */}
                <button
                    className="back-to-top"
                    onClick={handleBackToTop}
                    aria-label="Back to Top"
                >
                    ↑
                </button>
            </div>
        </div>
    );
};

export default React.memo(Shop);
