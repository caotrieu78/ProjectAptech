import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../constants/paths"; // Import PATHS

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const image = product.ThumbnailURL || "https://placehold.co/300x300";

  const handleQuickView = (e) => {
    e.stopPropagation(); // Prevent click from bubbling
    console.log("ProductID:", product.ProductID); // Debug
    if (product.ProductID) {
      navigate(`${PATHS.PRODUCTDETAIL}/${product.ProductID}`); // Navigate to product detail
    } else {
      console.error("ProductID does not exist!");
    }
  };

  return (
    <div
      className="product-card-container col-md-3 mb-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`product-card ${isHovered ? "hovered" : ""}`}>
        <div className="image-container">
          <img
            src={image}
            alt={product.ProductName}
            loading="lazy"
            className="product-image"
          />
          <button
            className="view-more-button"
            onClick={handleQuickView}
            aria-label="View more product"
          >
            View More
          </button>
        </div>
        <div className="product-info">
          <h5 className="product-name">{product.ProductName}</h5>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
