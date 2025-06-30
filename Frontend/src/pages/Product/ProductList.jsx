import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductService from "../../services/ProductService";
import ProductCard from "../../components/ProductCard";
import ProductFilter from "../../components/ProductFilter";
import QuickViewModal from "../../components/QuickViewModal";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const productsPerPage = 4; // Number of products to display on the homepage
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await ProductService.getAll();
                console.log("Product data from API:", data); // Debug product data from API
                const enriched = data.map((product) => {
                    // Ensure SelectedVariant.Price always has a value
                    if (product.Variants?.length > 0) {
                        const sorted = [...product.Variants].sort(
                            (a, b) => a.Price - b.Price
                        );
                        return { ...product, SelectedVariant: sorted[0] };
                    }
                    return { ...product, SelectedVariant: { Price: product.Price || 0 } }; // Fallback price
                });
                setProducts(enriched);
                setFilteredProducts(enriched.slice(0, productsPerPage));
            } catch (err) {
                setError("Unable to load products. Please try again later.");
                console.error("Error loading products:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
        window.scrollTo(0, 0);
    }, []);

    const handleFilterChange = (filter) => {
        let filtered = [...products];

        console.log("Received filters:", filter); // Debug all filters

        // Filter by search query
        if (filter.search) {
            filtered = filtered.filter((p) =>
                p.ProductName?.toLowerCase().includes(filter.search.toLowerCase())
            );
        }

        // Filter by tag
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

        // Filter by gender
        if (filter.gender) {
            filtered = filtered.filter((p) => p.Gender === filter.gender);
        }

        // Filter by category
        if (filter.category) {
            filtered = filtered.filter(
                (p) => p.category?.CategoryName === filter.category
            );
        }

        // Filter by price range
        if (filter.minPrice || filter.maxPrice) {
            filtered = filtered.filter((p) => {
                const price = parseFloat(p.SelectedVariant?.Price) || 0; // Convert to number
                const minPrice = parseInt(filter.minPrice) || 0;
                const maxPrice = parseInt(filter.maxPrice) || Infinity;
                console.log(
                    `Checking price: ${price}, Min: ${minPrice}, Max: ${maxPrice}`
                ); // Debug
                return price >= minPrice && price <= maxPrice;
            });
        }

        // Sort products
        if (filter.sortBy) {
            console.log("Sorting by:", filter.sortBy); // Debug
            filtered.sort((a, b) => {
                const priceA = parseFloat(a.SelectedVariant?.Price) || 0;
                const priceB = parseFloat(b.SelectedVariant?.Price) || 0;
                if (filter.sortBy === "price-asc") {
                    console.log(`Comparing prices: ${priceA} vs ${priceB}`); // Debug
                    return priceA - priceB;
                } else if (filter.sortBy === "price-desc") {
                    return priceB - priceA;
                } else if (filter.sortBy === "newest") {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                }
                return 0;
            });
        }

        // Temporarily remove limit for testing
        setFilteredProducts(filtered);
        console.log("Filtered products:", filtered); // Debug result
        // If you want to keep the limit of 4 products, use:
        // setFilteredProducts(filtered.slice(0, productsPerPage));
    };

    const handleQuickView = (product) => {
        setSelectedProduct(product);
    };

    const handleViewMore = () => {
        navigate("/shop");
    };

    if (isLoading) {
        return <div className="text-center py-5">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-5 text-danger">{error}</div>;
    }

    return (
        <div className="container py-5">
            <h3 className="mb-4">Featured Products</h3> {/* Changed to English */}
            <ProductFilter onFilterChange={handleFilterChange} />
            <div className="row">
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-5">No products found.</div>
                ) : (
                    filteredProducts.map((product) => (
                        <ProductCard
                            key={product.ProductID}
                            product={product}
                            onQuickView={handleQuickView}
                        />
                    ))
                )}
            </div>
            <div className="text-center mt-5">
                <button
                    className="view-more-btn"
                    onClick={handleViewMore}
                    aria-label="View more products"
                >
                    View More
                </button>
            </div>
            {selectedProduct && (
                <QuickViewModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    );
};

export default ProductList;
