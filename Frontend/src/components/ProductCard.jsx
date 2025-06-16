import React from 'react';

const ProductCard = ({ product, onQuickView }) => {
    const variant = product.SelectedVariant;

    return (
        <div className="col-md-3 mb-4">
            <div className="card h-100">
                <img
                    src={variant?.ImageURL || product.ThumbnailURL || 'https://via.placeholder.com/300x300?text=No+Image'}
                    className="card-img-top"
                    alt={product.ProductName}
                    style={{ objectFit: 'cover', height: 250 }}
                />
                <div className="card-body d-flex flex-column">
                    <h6 className="card-title">{product.ProductName}</h6>
                    <p className="card-text text-danger fw-bold mb-2">
                        {variant?.Price ? variant.Price.toLocaleString('vi-VN') + ' đ' : 'Chưa có giá'}
                    </p>
                    <button className="btn btn-outline-primary mt-auto" onClick={() => onQuickView(product)}>
                        Xem nhanh
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
