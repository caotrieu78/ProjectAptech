import React, { useEffect, useState } from 'react';
import ProductService from '../../services/ProductService';
import ProductCard from '../../components/ProductCard';
import ProductFilter from '../../components/ProductFilter';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [visibleCount, setVisibleCount] = useState(8);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await ProductService.getAll();

                const enriched = data.map((product) => {
                    if (product.Variants && product.Variants.length > 0) {
                        const sorted = [...product.Variants].sort((a, b) => a.Price - b.Price);
                        return {
                            ...product,
                            SelectedVariant: sorted[0],
                        };
                    }
                    return product;
                });

                setProducts(enriched);
                setFilteredProducts(enriched);
            } catch (err) {
                console.error('Lỗi khi tải sản phẩm:', err);
            }
        };

        fetchData();
        window.scrollTo(0, 0);
    }, []);

    const handleFilterChange = (filter) => {
        let filtered = [...products];

        // Tag
        if (filter.tag === 'Bán chạy') {
            filtered = filtered.filter(p => p.isBestSeller);
        } else if (filter.tag === 'Mới ra mắt') {
            filtered = filtered.filter(p =>
                new Date(p.createdAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            );
        }

        // Gender
        if (filter.gender) {
            filtered = filtered.filter(p => p.Gender === filter.gender);
        }

        // Category
        if (filter.category) {
            filtered = filtered.filter(p => p.category?.CategoryName === filter.category);
        }

        // Price range (nếu có)
        if (filter.minPrice || filter.maxPrice) {
            filtered = filtered.filter(p => {
                const price = p.SelectedVariant?.Price || 0;
                return (!filter.minPrice || price >= parseInt(filter.minPrice)) &&
                    (!filter.maxPrice || price <= parseInt(filter.maxPrice));
            });
        }

        setFilteredProducts(filtered);
    };

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 4);
    };

    const handleQuickView = (product) => {
        setSelectedProduct(product);
    };

    return (
        <div className="container py-5">
            <h3 className="mb-4">Danh sách sản phẩm</h3>

            <ProductFilter onFilterChange={handleFilterChange} />

            <div className="row">
                {filteredProducts.slice(0, visibleCount).map(product => (
                    <ProductCard
                        key={product.ProductID}
                        product={product}
                        onQuickView={handleQuickView}
                    />
                ))}
            </div>

            {visibleCount < filteredProducts.length && (
                <div className="text-center mt-4">
                    <button className="btn btn-primary" onClick={handleLoadMore}>
                        Load More
                    </button>
                </div>
            )}

            {selectedProduct && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{selectedProduct.ProductName}</h5>
                                <button type="button" className="btn-close" onClick={() => setSelectedProduct(null)}></button>
                            </div>
                            <div className="modal-body">
                                <img
                                    src={selectedProduct.SelectedVariant?.ImageURL || selectedProduct.ThumbnailURL || 'https://via.placeholder.com/600x400?text=No+Image'}
                                    alt={selectedProduct.ProductName}
                                    className="img-fluid mb-3"
                                />
                                <p>{selectedProduct.Description}</p>
                                <p><strong>Giới tính:</strong> {selectedProduct.Gender}</p>
                                <p><strong>Danh mục:</strong> {selectedProduct.category?.CategoryName || 'Không rõ'}</p>
                                <p><strong>Giá:</strong> {selectedProduct.SelectedVariant?.Price?.toLocaleString('vi-VN')} đ</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductList;
