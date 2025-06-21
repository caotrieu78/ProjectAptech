import React, { useState, useEffect, useContext } from 'react';
import ProductVariantService from '../services/productVariantService';
import OrderService from '../services/orderService';
import { CartContext } from '../context/CartContext';

const QuickViewModal = ({ product, onClose }) => {
    const [variants, setVariants] = useState([]);
    const [availableSizes, setAvailableSizes] = useState([]);
    const [availableColors, setAvailableColors] = useState([]);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedImage, setSelectedImage] = useState('');

    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        const fetchVariants = async () => {
            try {
                const data = await ProductVariantService.getAll();
                const filtered = data.filter(v => v.ProductID === product.ProductID);
                setVariants(filtered);
            } catch (err) {
                console.error('Lỗi khi tải biến thể:', err);
            }
        };

        if (product) {
            fetchVariants();
            setSelectedSize('');
            setSelectedColor('');
            setQuantity(1);
            setSelectedVariant(null);
            setSelectedImage(
                product.ThumbnailURL || 'https://via.placeholder.com/600x400?text=No+Image'
            );
        }
    }, [product]);

    useEffect(() => {
        const allSizes = Array.from(new Set(variants.map(v => v.size?.SizeID)))
            .map(id => variants.find(v => v.size?.SizeID === id)?.size);

        const allColors = Array.from(new Set(variants.map(v => v.color?.ColorID)))
            .map(id => variants.find(v => v.color?.ColorID === id)?.color);

        setAvailableSizes(allSizes);
        setAvailableColors(allColors);

        if (selectedSize && selectedColor) {
            const matchedVariant = variants.find(
                v => v.SizeID === parseInt(selectedSize) && v.ColorID === parseInt(selectedColor)
            );
            setSelectedVariant(matchedVariant || null);

            if (matchedVariant?.ImageURL) {
                setSelectedImage(matchedVariant.ImageURL);
            }

            if (matchedVariant && quantity > matchedVariant.StockQuantity) {
                setQuantity(matchedVariant.StockQuantity);
            }
        } else {
            setSelectedVariant(null);
        }
    }, [selectedSize, selectedColor, variants]);

    const increaseQuantity = () => {
        if (selectedVariant) {
            setQuantity(prev => Math.min(prev + 1, selectedVariant.StockQuantity || 1));
        }
    };

    const decreaseQuantity = () => {
        setQuantity(prev => Math.max(1, prev - 1));
    };

    const handleAddToCart = async () => {
        if (!selectedVariant) {
            alert('Vui lòng chọn size và màu.');
            return;
        }

        if (selectedVariant.StockQuantity === 0) {
            alert('❌ Biến thể này hiện đã hết hàng.');
            return;
        }

        try {
            addToCart(selectedVariant, quantity);
            alert('🛒 Đã thêm vào giỏ hàng!');
            onClose();

            await OrderService.create({
                items: [{ VariantID: selectedVariant.VariantID, Quantity: quantity }]
            });

            console.log('🧾 Đặt hàng thành công');
        } catch (err) {
            console.error('❌ Lỗi đặt hàng:', err);
        }
    };

    if (!product) return null;

    return (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered" style={{ maxWidth: '1000px' }}>
                <div className="modal-content p-4 rounded-3">
                    <div className="modal-header border-0">
                        <h5 className="modal-title fw-bold">{product.ProductName}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>

                    <div className="modal-body">
                        <div className="row">
                            <div className="col-md-6 d-flex">
                                <div className="flex-grow-1 d-flex justify-content-center align-items-center">
                                    <img
                                        src={selectedImage}
                                        alt="main"
                                        className="img-fluid"
                                        style={{ maxHeight: 400, objectFit: 'contain' }}
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <p className="text-muted">{product.Description}</p>
                                <p><strong>Giới tính:</strong> {product.Gender}</p>
                                <p><strong>Danh mục:</strong> {product.category?.CategoryName || 'Không rõ'}</p>
                                <p className="fw-bold fs-5 text-dark">
                                    {(selectedVariant?.Price || product.Price)?.toLocaleString('vi-VN')} đ
                                </p>

                                {selectedVariant && (
                                    <>
                                        <p><strong>Tồn kho:</strong> {selectedVariant.StockQuantity}</p>
                                        {selectedVariant.StockQuantity === 0 && (
                                            <p className="text-danger"><strong>Hết hàng</strong></p>
                                        )}
                                    </>
                                )}

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Size</label>
                                    <select
                                        className="form-select"
                                        value={selectedSize}
                                        onChange={(e) => setSelectedSize(e.target.value)}
                                    >
                                        <option value="">Chọn size</option>
                                        {availableSizes.map(size => (
                                            <option key={size.SizeID} value={size.SizeID}>{size.SizeName}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Màu</label>
                                    <select
                                        className="form-select"
                                        value={selectedColor}
                                        onChange={(e) => setSelectedColor(e.target.value)}
                                    >
                                        <option value="">Chọn màu</option>
                                        {availableColors.map(color => (
                                            <option key={color.ColorID} value={color.ColorID}>{color.ColorName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="d-flex align-items-center gap-3 mb-4">
                                    <div className="input-group" style={{ width: 130 }}>
                                        <button className="btn btn-outline-secondary" onClick={decreaseQuantity}>–</button>
                                        <input type="text" className="form-control text-center" value={quantity} readOnly />
                                        <button className="btn btn-outline-secondary" onClick={increaseQuantity}>+</button>
                                    </div>
                                    <button
                                        className="btn btn-primary px-4 rounded-pill fw-bold"
                                        onClick={handleAddToCart}
                                        disabled={!selectedVariant}
                                    >
                                        ADD TO CART
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickViewModal;
