import React, { useEffect, useState } from 'react';
import ProductService from '../../services/ProductService';
import ProductCard from '../../components/ProductCard';
import ProductFilter from '../../components/ProductFilter';
import QuickViewModal from '../../components/QuickViewModal';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage] = useState(8);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({});

    const fetchData = async (page) => {
        try {
            setLoading(true);
            const data = await ProductService.getPaginated(page, perPage);
            const enriched = data.data.map((product) => {
                if (product.Variants?.length > 0) {
                    const sorted = [...product.Variants].sort((a, b) => a.Price - b.Price);
                    return { ...product, SelectedVariant: sorted[0] };
                }
                return product;
            });
            setProducts(enriched);
            setTotalPages(data.last_page);
        } catch (err) {
            console.error('Lỗi khi tải sản phẩm:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(currentPage);
        window.scrollTo(0, 0);
    }, [currentPage]);

    const handleFilterChange = (filter) => {
        setFilters(filter);
        setCurrentPage(1); // reset về page 1 khi lọc
    };

    // Apply filters on current page
    const applyClientFilters = () => {
        let filtered = [...products];

        if (filters.tag === 'Bán chạy') {
            filtered = filtered.filter(p => p.isBestSeller);
        } else if (filters.tag === 'Mới ra mắt') {
            filtered = filtered.filter(p =>
                new Date(p.createdAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            );
        }

        if (filters.gender) {
            filtered = filtered.filter(p => p.Gender === filters.gender);
        }

        if (filters.category) {
            filtered = filtered.filter(p => p.category?.CategoryName === filters.category);
        }

        if (filters.minPrice || filters.maxPrice) {
            filtered = filtered.filter(p => {
                const price = p.SelectedVariant?.Price || 0;
                return (!filters.minPrice || price >= parseInt(filters.minPrice)) &&
                    (!filters.maxPrice || price <= parseInt(filters.maxPrice));
            });
        }

        return filtered;
    };

    const filteredProducts = applyClientFilters();

    const handleQuickView = (product) => {
        setSelectedProduct(product);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    return (
        <div className="container py-5">
            <h3 className="mb-4">Danh sách sản phẩm</h3>

            <ProductFilter onFilterChange={handleFilterChange} />

            {loading ? (
                <div className="text-center">Đang tải sản phẩm...</div>
            ) : (
                <>
                    <div className="row">
                        {filteredProducts.map(product => (
                            <ProductCard
                                key={product.ProductID}
                                product={product}
                                onQuickView={handleQuickView}
                            />
                        ))}
                    </div>

                    <div className="text-center mt-4 d-flex justify-content-center align-items-center gap-3">
                        <button
                            className="btn btn-outline-secondary"
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                        >
                            Trang trước
                        </button>
                        <span>Trang {currentPage} / {totalPages}</span>
                        <button
                            className="btn btn-outline-secondary"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                        >
                            Trang sau
                        </button>
                    </div>
                </>
            )}
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
