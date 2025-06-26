import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import ProductCard from "../../src/components/ProductCard";
import { PATHS } from "../../src/constants/paths";
import { useNavigate } from "react-router-dom";
import ProductService from "../services/ProductService";

const FlashSaleSection = ({ onQuickView }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Fetch product list from ProductService
  useEffect(() => {
    const fetchFlashSaleProducts = async () => {
      try {
        setLoading(true);
        const data = await ProductService.getAll();
        // Filter products with Discount and limit to 6 products
        const flashSaleProducts = data
          .filter((p) => p.Discount && p.Discount > 0)
          .slice(0, 6)
          .map((product) => {
            if (product.Variants && product.Variants.length > 0) {
              const sorted = [...product.Variants].sort(
                (a, b) => a.Price - b.Price
              );
              return { ...product, SelectedVariant: sorted[0] };
            }
            return product;
          });
        setProducts(flashSaleProducts);
      } catch (err) {
        console.error("Error fetching Flash Sale products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlashSaleProducts();
  }, []);

  // Countdown timer
  useEffect(() => {
    const endTime = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Slider settings
  const settings = {
    dots: true,
    infinite: products.length > 4,
    speed: 500,
    slidesToShow: Math.min(products.length, 4),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: Math.min(products.length, 3) }
      },
      {
        breakpoint: 992,
        settings: { slidesToShow: Math.min(products.length, 2) }
      },
      { breakpoint: 576, settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <section className="flash-sale-section">
      <div className="flash-sale-overlay"></div>
      <div className="container">
        <div className="flash-sale-header">
          <h2>Flash Sale</h2>
          <div className="countdown-timer">
            <div className="timer-unit">
              <span className="timer-value">
                {timeLeft.hours.toString().padStart(2, "0")}
              </span>
              <span className="timer-label">Hours</span>
            </div>
            <span className="timer-separator">:</span>
            <div className="timer-unit">
              <span className="timer-value">
                {timeLeft.minutes.toString().padStart(2, "0")}
              </span>
              <span className="timer-label">Minutes</span>
            </div>
            <span className="timer-separator">:</span>
            <div className="timer-unit">
              <span className="timer-value">
                {timeLeft.seconds.toString().padStart(2, "0")}
              </span>
              <span className="timer-label">Seconds</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="no-products">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="no-products">
            No Flash Sale products available at the moment!
          </div>
        ) : (
          <Slider {...settings}>
            {products.map((product) => (
              <div key={product.ProductID} className="product-slide">
                <div className="product-card-wrapper">
                  <ProductCard product={product} onQuickView={onQuickView} />
                </div>
              </div>
            ))}
          </Slider>
        )}

        <div className="view-more">
          <button
            onClick={() => navigate(PATHS.PRODUCTS)}
            className="view-more-btn"
          >
            View More Products
          </button>
        </div>
      </div>

      <style>{`
        .flash-sale-section {
          position: relative;
          padding: 60px 0;
          margin: 30px auto;
          max-width: 1300px;
          background: linear-gradient(135deg, #ff4b4b, #ff8c00, #ff4b4b);
          background-size: 200% 200%;
          border-radius: 20px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2), 0 0 20px rgba(255, 75, 75, 0.7);
          overflow: hidden;
          animation: gradientShift 5s ease infinite;
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .flash-sale-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%);
          opacity: 0.35;
          z-index: 0;
        }
        .container {
          position: relative;
          z-index: 1;
          padding: 0 20px;
        }
        .flash-sale-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          flex-wrap: wrap;
          gap: 20px;
        }
        .flash-sale-header h2 {
          font-size: 2.2rem;
          font-weight: 900;
          color: #ffffff;
          text-transform: uppercase;
          letter-spacing: 2.5px;
          text-shadow: 0 0 8px rgba(255, 215, 0, 0.8), 0 0 12px rgba(255, 75, 75, 0.6);
          animation: glowText 2s ease-in-out infinite;
        }
        @keyframes glowText {
          0%, 100% { text-shadow: 0 0 8px rgba(255, 215, 0, 0.8), 0 0 12px rgba(255, 75, 75, 0.6); }
          50% { text-shadow: 0 0 12px rgba(255, 215, 0, 1), 0 0 18px rgba(255, 75, 75, 0.9); }
        }
        .countdown-timer {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(0, 0, 0, 0.75);
          padding: 12px 25px;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2), 0 0 15px rgba(255, 75, 75, 0.6);
          animation: neonPulse 1.5s ease-in-out infinite;
        }
        @keyframes neonPulse {
          0%, 100% { box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2), 0 0 15px rgba(255, 75, 75, 0.6); }
          50% { box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2), 0 0 20px rgba(255, 75, 75, 0.9); }
        }
        .timer-unit {
          text-align: center;
        }
        .timer-value {
          display: block;
          font-size: 1.8rem;
          font-weight: 700;
          color: #ff4b4b;
          text-shadow: 0 0 6px rgba(255, 75, 75, 0.6);
          animation: flicker 3s ease-in-out infinite;
        }
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.9; }
        }
        .timer-label {
          font-size: 0.9rem;
          color: #ffffff;
          text-shadow: 0 0 3px rgba(255, 255, 255, 0.5);
        }
        .timer-separator {
          font-size: 1.8rem;
          color: #ffffff;
          text-shadow: 0 0 3px rgba(255, 255, 255, 0.5);
        }
        .no-products {
          text-align: center;
          color: #ffffff;
          font-size: 1.1rem;
          padding: 40px;
          text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
        }
        .slick-slider {
          position: relative;
          display: block;
          box-sizing: border-box;
          user-select: none;
          touch-action: pan-y;
          -webkit-tap-highlight-color: transparent;
        }
        .slick-list {
          position: relative;
          display: block;
          overflow: hidden;
          margin: 0;
          padding: 0;
        }
        .slick-track {
          position: relative;
          top: 0;
          left: 0;
          display: block;
          margin-left: auto;
          margin-right: auto;
        }
        .slick-slide {
          display: none;
          float: left;
          height: 100%;
          min-height: 1px;
        }
        .slick-slide.slick-active {
          display: block;
        }
        .product-slide {
          padding: 0 15px;
        }
        .product-card-wrapper {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          margin-bottom: 20px;
        }
        .product-card-wrapper:hover {
          transform: scale(1.06);
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2), 0 0 15px rgba(255, 140, 0, 0.8);
        }
        .view-more {
          text-align: center;
          margin-top: 40px;
          margin-bottom: 20px;
        }
        .view-more-btn {
          background: linear-gradient(90deg, #007bff, #00aaff);
          color: #fff;
          border: none;
          padding: 14px 35px;
          border-radius: 25px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
          box-shadow: 0 4px 10px rgba(0, 123, 255, 0.3);
          position: relative;
          overflow: hidden;
        }
        .view-more-btn::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
          transition: left 0.4s ease;
        }
        .view-more-btn:hover::after {
          left: 100%;
        }
        .view-more-btn:hover {
          background: linear-gradient(90deg, #0056d2, #0088cc);
          box-shadow: 0 6px 15px rgba(0, 123, 255, 0.4), 0 0 15px rgba(0, 123, 255, 0.8);
          transform: scale(1.06);
        }
        .slick-prev, .slick-next {
          position: absolute;
          top: 50%;
          width: 45px;
          height: 45px;
          background: rgba(255, 255, 255, 0.9);
          border-radius: 50%;
          z-index: 2;
          cursor: pointer;
          transform: translateY(-50%);
          transition: all 0.3s ease;
          display: flex !important;
          align-items: center;
          justify-content: center;
        }
        .slick-prev {
          left: -60px;
        }
        .slick-next {
          right: -60px;
        }
        .slick-prev:hover, .slick-next:hover {
          background: #ff4b4b;
          box-shadow: 0 0 15px rgba(255, 75, 75, 0.9);
          transform: translateY(-50%) scale(1.1);
        }
        .slick-prev:before, .slick-next:before {
          content: '';
          display: block;
          width: 14px;
          height: 14px;
          border: solid #333;
          border-width: 3px 3px 0 0;
          transform: rotate(-45deg);
        }
        .slick-prev:before {
          transform: rotate(-135deg);
        }
        .slick-dots {
          display: flex !important;
          justify-content: center;
          margin-top: 25px;
          padding: 0;
          list-style: none;
        }
        .slick-dots li {
          margin: 0 6px;
        }
        .slick-dots li button {
          background: none;
          border: none;
          font-size: 0;
          width: 12px;
          height: 12px;
          background: #fff;
          opacity: 0.5;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .slick-dots li.slick-active button, .slick-dots li button:hover {
          opacity: 1;
          transform: scale(1.4);
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.9);
        }
      `}</style>
    </section>
  );
};

export default FlashSaleSection;
