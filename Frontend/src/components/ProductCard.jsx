
const ProductCard = ({ product, onQuickView }) => {
    const image = product.ThumbnailURL || 'https://via.placeholder.com/300x300?text=No+Image';
    const price = parseFloat(product.Price);
    return (
        <div className="col-md-3 mb-4">
            <div className="product-card">
                <div className="product-card-image-wrapper">
                    <img
                        src={image}
                        alt={product.ProductName}
                        className="product-card-img"
                    />
                    <button
                        className="product-card-button"
                        onClick={() => onQuickView(product)}
                    >
                        Xem nhanh
                    </button>
                </div>

                <div className="product-card-body">
                    <h5 className="product-card-title">{product.ProductName}</h5>
                    <p className="product-card-price">
                        <strong>Giá: </strong>
                        {!isNaN(price) ? price.toLocaleString('vi-VN') + ' ₫' : 'Chưa có'}
                    </p>
                </div>
            </div>

        </div>

    );
};

export default ProductCard;
