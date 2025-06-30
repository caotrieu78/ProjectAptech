import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../constants/paths"; // Import PATHS

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);
    const [favoriteCount, setFavoriteCount] = useState(
        product.favoriteCount || 0
    );
    const image =
        product.ThumbnailURL || "https://via.placeholder.com/300x300?text=No+Image";
    const price = parseFloat(product.Price);

    const handleFavorite = (e) => {
        e.stopPropagation();
        setIsFavorited(!isFavorited);
        setFavoriteCount((prev) => (isFavorited ? prev - 1 : prev + 1));
        console.log(
            `Added ${isFavorited ? "removed" : "added"} favorite to ${product.ProductName
            }`
        );
    };

    const handleQuickView = () => {
        console.log("ProductID:", product.ProductID); // Debug
        if (product.ProductID) {
            navigate(`${PATHS.PRODUCTDETAIL}/${product.ProductID}`); // Use PATHS.PRODUCTDETAIL
        } else {
            console.error("ProductID does not exist!");
        }
    };

    return (
        <div
            className="col-md-3 mb-4"
            style={{
                maxWidth: "320px",
                margin: "0 auto"
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                style={{
                    background: "#fff",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: isHovered
                        ? "0 10px 24px rgba(0, 0, 0, 0.2)"
                        : "0 4px 12px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s ease",
                    transform: isHovered
                        ? "translateY(-8px) scale(1.02)"
                        : "translateY(0) scale(1)"
                }}
            >
                <div
                    style={{
                        position: "relative",
                        width: "100%",
                        height: isHovered ? "340px" : "320px",
                        overflow: "hidden",
                        transition: "height 0.3s ease"
                    }}
                >
                    <img
                        src={image}
                        alt={product.ProductName}
                        loading="lazy"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.4s ease, opacity 0.3s ease",
                            transform: isHovered ? "scale(1.15)" : "scale(1)",
                            opacity: isHovered ? 0.85 : 1
                        }}
                    />
                    {product.Discount && (
                        <span
                            style={{
                                position: "absolute",
                                top: "12px",
                                left: "12px",
                                background: "linear-gradient(45deg, #ff4d4f, #ff7878)",
                                color: "#fff",
                                fontSize: "0.85rem",
                                fontWeight: "700",
                                padding: "6px 12px",
                                borderRadius: "6px",
                                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.25)",
                                zIndex: 10
                            }}
                        >
                            -{product.Discount}%
                        </span>
                    )}
                    <button
                        onClick={handleFavorite}
                        style={{
                            position: "absolute",
                            top: "12px",
                            right: "12px",
                            background: "rgba(255, 255, 255, 0.95)",
                            border: "1px solid #eee",
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            transform:
                                isFavorited || isHovered
                                    ? "scale(1.15) rotate(8deg)"
                                    : "scale(1) rotate(0)",
                            animation: isFavorited ? "pulse 0.3s ease" : "none",
                            zIndex: 10
                        }}
                        aria-label={
                            isFavorited
                                ? "Remove product from favorites"
                                : "Add product to favorites"
                        }
                    >
                        <i
                            className={isFavorited ? "fas fa-heart" : "far fa-heart"}
                            style={{
                                fontSize: "1.2rem",
                                color: isFavorited ? "#ff4d4f" : "#666",
                                transition: "color 0.3s ease"
                            }}
                        ></i>
                    </button>
                    <button
                        style={{
                            position: "absolute",
                            bottom: "12px",
                            left: "50%",
                            transform: isHovered
                                ? "translateX(-50%) scale(1)"
                                : "translateX(-50%) scale(0.9)",
                            background: "rgba(255, 255, 255, 0.8)",
                            backdropFilter: "blur(5px)",
                            color: "#333",
                            border: "1px solid rgba(0, 0, 0, 0.1)",
                            padding: "6px 16px",
                            borderRadius: "15px",
                            fontSize: "0.85rem",
                            fontWeight: "500",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            opacity: isHovered ? 1 : 0,
                            boxShadow: isHovered ? "0 2px 4px rgba(0, 0, 0, 0.15)" : "none",
                            zIndex: 10
                        }}
                        onClick={handleQuickView}
                        onMouseEnter={(e) => {
                            e.target.style.background = "rgba(255, 255, 255, 0.95)";
                            e.target.style.color = "#007bff";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = "rgba(255, 255, 255, 0.8)";
                            e.target.style.color = "#333";
                        }}
                        aria-label="Quick view product"
                    >
                        Quick View
                    </button>
                </div>

                <div
                    style={{
                        padding: "20px",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px"
                    }}
                >
                    <h5
                        style={{
                            fontSize: "1.2rem",
                            fontWeight: "600",
                            color: "#333",
                            margin: "0",
                            textAlign: "center",
                            whiteSpace: "normal",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            wordBreak: "break-word",
                            lineHeight: "1.4",
                            padding: "0 10px"
                        }}
                    >
                        {product.ProductName}
                    </h5>
                    <p
                        style={{
                            margin: "0"
                        }}
                    >
                        {!isNaN(price) ? (
                            <span>
                                <strong
                                    style={{
                                        color: "#007bff",
                                        fontSize: "1.3rem"
                                    }}
                                >
                                    {price.toLocaleString("vi-VN")} ₫
                                </strong>
                                {product.OriginalPrice && (
                                    <span
                                        style={{
                                            color: "#999",
                                            textDecoration: "line-through",
                                            fontSize: "0.95rem",
                                            marginLeft: "12px"
                                        }}
                                    >
                                        {parseFloat(product.OriginalPrice).toLocaleString("vi-VN")}{" "}
                                        ₫
                                    </span>
                                )}
                            </span>
                        ) : (
                            <span
                                style={{
                                    color: "#666",
                                    fontSize: "1.1rem"
                                }}
                            >
                                No price available
                            </span>
                        )}
                    </p>
                    {product.Rating && (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "6px"
                            }}
                        >
                            {[...Array(5)].map((_, i) => (
                                <i
                                    key={i}
                                    className={`fas fa-star ${i < Math.floor(product.Rating) ? "filled" : ""
                                        }`}
                                    style={{
                                        fontSize: "1rem",
                                        color: i < Math.floor(product.Rating) ? "#f5a623" : "#ccc",
                                        transition: "color 0.3s ease"
                                    }}
                                ></i>
                            ))}
                            <span
                                style={{
                                    fontSize: "0.9rem",
                                    color: "#666"
                                }}
                            >
                                ({product.Rating})
                            </span>
                        </div>
                    )}
                    <div
                        style={{
                            fontSize: "0.9rem",
                            color: "#666",
                            textAlign: "center"
                        }}
                    >
                        {favoriteCount} favorites
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
