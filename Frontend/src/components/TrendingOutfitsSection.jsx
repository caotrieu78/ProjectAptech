import React, { useState, useEffect, Suspense } from "react";
import Slider from "react-slick";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../constants/paths";
import ProductService from "../services/ProductService";
import ProductCard from "./ProductCard";
import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const TrendingOutfitsSection = () => {
    const navigate = useNavigate();
    const [trendingProducts, setTrendingProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Hàm xử lý dữ liệu sản phẩm
    const processProducts = (data) => {
        if (!Array.isArray(data)) {
            console.error("Data from API is not an array:", data);
            return [];
        }
        return data
            .map((product) => {
                if (!product?.ProductID) {
                    console.warn("Product missing ProductID:", product);
                    return null;
                }
                const variants = Array.isArray(product.Variants)
                    ? product.Variants
                    : [];
                const selectedVariant =
                    variants.length > 0
                        ? [...variants].sort(
                            (a, b) =>
                                (parseFloat(a.Price) || 0) - (parseFloat(b.Price) || 0)
                        )[0]
                        : { Price: parseFloat(product.Price) || 0 };
                return {
                    ...product,
                    SelectedVariant: selectedVariant,
                    favoriteCount: product.favoriteCount || 0,
                    Discount: product.Discount || 0,
                    OriginalPrice: product.OriginalPrice || null
                };
            })
            .filter(Boolean);
    };

    useEffect(() => {
        const fetchTrendingProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await ProductService.getAll();
                console.log("API Data:", data);
                const processedProducts = processProducts(data);
                const filteredProducts = processedProducts
                    .filter((p) => p.isTrending || (p.Rating && p.Rating >= 4))
                    .slice(0, 6);
                console.log("Filtered Products:", filteredProducts);
                if (filteredProducts.length === 0 && processedProducts.length > 0) {
                    console.warn(
                        "No trending products found, using all processed products."
                    );
                    setTrendingProducts(processedProducts.slice(0, 6));
                } else {
                    setTrendingProducts(filteredProducts);
                }
            } catch (err) {
                console.error("Error fetching products:", err);
                if (err.response && err.response.status === 401) {
                    console.warn("Unauthorized access, using fallback data.");
                }
                setError("Failed to load products. Using sample data.");
                setTrendingProducts([
                    {
                        ProductID: 1,
                        ProductName: "Men's Plain T-Shirt",
                        ThumbnailURL:
                            "https://via.placeholder.com/300x300?text=Men%27s+Plain+T-Shirt",
                        SelectedVariant: { Price: 250000 },
                        Rating: 4.5,
                        isTrending: true,
                        favoriteCount: 15,
                        Discount: 10,
                        OriginalPrice: 300000
                    },
                    {
                        ProductID: 2,
                        ProductName: "Women's Jeans",
                        ThumbnailURL:
                            "https://via.placeholder.com/300x300?text=Women%27s+Jeans",
                        SelectedVariant: { Price: 450000 },
                        Rating: 4.2,
                        isTrending: true,
                        favoriteCount: 10,
                        Discount: 15,
                        OriginalPrice: 500000
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchTrendingProducts();
    }, []);

    // Hàm xử lý quick view
    const handleQuickView = (product) => {
        console.log("Quick View for ProductID:", product.ProductID);
        if (product.ProductID) {
            navigate(`${PATHS.PRODUCTDETAIL}/${product.ProductID}`);
        } else {
            console.error("ProductID does not exist!");
        }
    };

    const settings = {
        dots: true,
        infinite: trendingProducts.length >= 4,
        speed: 500,
        slidesToShow: Math.min(trendingProducts.length || 1, 4),
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            { breakpoint: 992, settings: { slidesToShow: 3, arrows: true } },
            { breakpoint: 576, settings: { slidesToShow: 1, arrows: true } }
        ],
        focusOnSelect: false,
        accessibility: true
    };

    return (
        <section className="trending-outfits-section">
            <Container>
                <div className="trending-header text-center mb-5">
                    <h2
                        className="display-4 fw-bold text-gradient"
                        onMouseEnter={(e) =>
                            (e.target.style.textShadow = "0 2px 4px rgba(0, 123, 255, 0.3)")
                        }
                        onMouseLeave={(e) => (e.target.style.textShadow = "none")}
                    >
                        Trending Products
                    </h2>
                </div>
                {loading ? (
                    <div className="skeleton-container">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="skeleton-card" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-5 text-danger">{error}</div>
                ) : trendingProducts.length === 0 ? (
                    <div className="text-center py-5">
                        No trending products available at the moment!
                    </div>
                ) : (
                    <div className="trending-slider">
                        <Slider {...settings}>
                            {trendingProducts.map((product) => (
                                <div key={product.ProductID} className="trending-slide">
                                    <Suspense fallback={<div className="skeleton-card" />}>
                                        <ProductCard
                                            product={product}
                                            onQuickView={handleQuickView}
                                        />
                                    </Suspense>
                                </div>
                            ))}
                        </Slider>
                    </div>
                )}
                <div className="text-center mt-5">
                    <button
                        className="btn btn-gradient btn-lg rounded-pill px-4 py-2"
                        onClick={() => navigate("/shop")}
                        aria-label="View more trending products"
                    >
                        View more
                    </button>
                </div>
            </Container>
            <style>{`
        .trending-outfits-section {
          padding: 4rem 0 !important;
          background: linear-gradient(135deg, #f5f7fa, #e3f2fd, #f5f7fa);
          background-size: 200% 200%;
          border-radius: 12px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
          animation: gradientShift 8s ease infinite;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .trending-header .text-gradient {
          background: linear-gradient(90deg, #0066cc, #00cc99);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-size: 2.25rem;
          font-weight: 700;
          text-transform: capitalize;
          letter-spacing: 1px;
          line-height: 1.3;
          padding-bottom: 5px;
        }

        .trending-header .text-gradient:hover {
          text-shadow: 0 2px 4px rgba(0, 123, 255, 0.3);
          transition: text-shadow 0.3s ease;
        }

        .trending-slider {
          padding: 1.5rem 0 !important;
          margin: 0 -15px !important;
        }

        .trending-slide {
          padding: 0 15px !important;
          height: 100% !important;
          display: flex !important;
          justify-content: center !important;
          align-items: stretch !important;
          max-width: 320px !important;
          margin: 0 auto !important;
        }

        .skeleton-container {
          display: flex !important;
          gap: 2rem;
          padding: 1.5rem 0 !important;
          margin: 0 -15px !important;
          flex-wrap: nowrap !important;
          overflow: hidden !important;
        }

        .skeleton-card {
          flex: 0 0 calc(25% - 2rem) !important;
          height: 450px !important;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 12px;
          margin: 0 1rem !important;
        }

        .slick-dots {
          margin-top: 1.5rem !important;
        }

        .slick-dots li button:before {
          color: #1e88e5;
          opacity: 0.6;
          font-size: 12px;
          transition: all 0.3s ease;
        }

        .slick-dots li.slick-active button:before {
          opacity: 1;
          transform: scale(1.4);
        }

        .slick-prev,
        .slick-next {
          width: 50px;
          height: 50px;
          background: linear-gradient(45deg, #007bff, #00c4cc) !important;
          border-radius: 50%;
          opacity: 0.9;
          z-index: 10;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .slick-prev {
          left: -70px;
        }

        .slick-next {
          right: -70px;
        }

        .slick-prev:hover,
        .slick-next:hover {
          background: linear-gradient(45deg, #0056b3, #0099a8) !important;
          opacity: 1;
          transform: scale(1.1);
          box-shadow: 0 0 15px rgba(0, 123, 255, 0.5);
        }

        .slick-prev:before,
        .slick-next:before {
          content: '';
          display: block;
          width: 12px;
          height: 12px;
          border: solid #fff;
          border-width: 3px 3px 0 0;
        }

        .slick-prev:before {
          transform: rotate(-135deg);
        }

        .slick-next:before {
          transform: rotate(45deg);
        }

        .slick-slide > div {
          height: 100% !important;
          display: flex !important;
          justify-content: center !important;
          align-items: stretch !important;
        }

        .trending-slide .col-md-3 {
          max-width: 320px !important;
          width: 100% !important;
        }

        @media (max-width: 992px) {
          .skeleton-card {
            flex: 0 0 calc(33.333% - 2rem) !important;
          }

          .slick-prev {
            left: -30px;
          }

          .slick-next {
            right: -30px;
          }

          .trending-header .text-gradient {
            font-size: 1.75rem;
            letter-spacing: 0.5px;
          }
        }

        @media (max-width: 576px) {
          .trending-outfits-section {
            padding: 2rem 0 !important;
          }

          .trending-header .text-gradient {
            font-size: 1.5rem;
            letter-spacing: 0.3px;
          }

          .skeleton-card {
            flex: 0 0 calc(100% - 2rem) !important;
          }

          .slick-prev {
            left: -15px;
          }

          .slick-next {
            right: -15px;
          }
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        .btn-gradient {
          background: linear-gradient(90deg, #007bff, #00aaff);
          color: #fff;
          font-size: 1.125rem;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          padding: 0.75rem 2.5rem;
          border: none;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 10px rgba(0, 123, 255, 0.3);
          text-transform: capitalize;
          letter-spacing: 0.5px;
        }

        .btn-gradient:hover {
          background: linear-gradient(90deg, #0056d2, #0088cc);
          transform: scale(1.06);
          box-shadow: 0 6px 15px rgba(0, 123, 255, 0.4), 0 0 15px rgba(0, 123, 255, 0.8);
        }

        .btn-gradient::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
          transition: left 0.4s ease;
        }

        .btn-gradient:hover::after {
          left: 100%;
        }

        @media (max-width: 576px) {
          .btn-gradient {
            font-size: 0.875rem;
            padding: 0.5rem 1.5rem;
            letter-spacing: 0.3px;
          }
        }
      `}</style>
        </section>
    );
};

export default TrendingOutfitsSection;
