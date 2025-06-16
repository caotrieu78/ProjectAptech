import React, { useState, useEffect } from 'react';
import CategoryService from '../services/categoryService';

const ProductFilter = ({ onFilterChange }) => {
    const [showFilter, setShowFilter] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    const [selectedTag, setSelectedTag] = useState('All');
    const [selectedGender, setSelectedGender] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        CategoryService.getAll().then(setCategories).catch(console.error);
    }, []);

    useEffect(() => {
        onFilterChange?.({
            tag: selectedTag,
            gender: selectedGender,
            category: selectedCategory,
            minPrice,
            maxPrice
        });
    }, [selectedTag, selectedGender, selectedCategory, minPrice, maxPrice]);

    const toggleFilter = () => {
        setShowFilter(prev => !prev);
        if (showSearch) setShowSearch(false);
    };

    const toggleSearch = () => {
        setShowSearch(prev => !prev);
        if (showFilter) setShowFilter(false);
    };

    const topFilters = ['All', 'Bán chạy', 'Mới ra mắt'];
    const genderOptions = ['Nam', 'Nữ', 'Unisex'];

    return (
        <div className="mb-5 position-relative">
            {/* Top filters */}
            <div className="d-flex flex-wrap align-items-center justify-content-between mb-3">
                <div className="d-flex flex-wrap gap-3">
                    {topFilters.map((tag, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedTag(tag)}
                            className={`btn btn-sm category-btn ${selectedTag === tag ? 'active' : ''}`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                <div className="d-flex gap-2 mt-3 mt-md-0">
                    <button
                        className={`btn ${showFilter ? 'btn-dark' : 'btn-outline-dark'} btn-sm d-flex align-items-center gap-1`}
                        onClick={toggleFilter}
                    >
                        <i className={`bi ${showFilter ? 'bi-x' : 'bi-filter'}`}></i> Bộ lọc
                    </button>
                    <button
                        className={`btn ${showSearch ? 'btn-dark' : 'btn-outline-dark'} btn-sm d-flex align-items-center gap-1`}
                        onClick={toggleSearch}
                    >
                        <i className={`bi ${showSearch ? 'bi-x' : 'bi-search'}`}></i> Tìm kiếm
                    </button>
                </div>
            </div>

            {/* Search box */}
            {showSearch && (
                <div className="bg-light p-3 rounded shadow-sm mb-4">
                    <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-search text-muted"></i>
                        <input
                            type="text"
                            className="form-control border-0 shadow-none"
                            placeholder="Tìm kiếm sản phẩm..."
                        />
                    </div>
                </div>
            )}

            {/* Dropdown filters */}
            {showFilter && (
                <div className="bg-light p-4 rounded shadow-sm">
                    <div className="row gy-4">
                        {/* Gender filter */}
                        <div className="col-md-4">
                            <h6 className="fw-bold mb-3">Giới tính</h6>
                            <div className="d-flex flex-wrap gap-2">
                                {genderOptions.map((g, i) => (
                                    <span
                                        key={i}
                                        onClick={() => setSelectedGender(g)}
                                        className={`badge px-3 py-2 rounded-pill ${selectedGender === g ? 'bg-dark text-white' : 'bg-secondary-subtle text-dark'}`}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {g}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Category filter */}
                        <div className="col-md-4">
                            <h6 className="fw-bold mb-3">Danh mục</h6>
                            <div className="d-flex flex-wrap gap-2">
                                {categories.map((cat, i) => (
                                    <span
                                        key={i}
                                        onClick={() => setSelectedCategory(cat.name)}
                                        className={`badge px-3 py-2 rounded-pill ${selectedCategory === cat.name ? 'bg-dark text-white' : 'bg-secondary-subtle text-dark'}`}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {cat.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Price filter */}
                        <div className="col-md-4">
                            <h6 className="fw-bold mb-3">Khoảng giá</h6>
                            <div className="d-flex gap-2 align-items-center">
                                <input
                                    type="number"
                                    placeholder="Từ"
                                    className="form-control"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                />
                                <span>-</span>
                                <input
                                    type="number"
                                    placeholder="Đến"
                                    className="form-control"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductFilter;
