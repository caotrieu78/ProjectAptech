import React, { useState, useEffect } from "react";
import { debounce } from "lodash";
import CategoryService from "../services/categoryService";
import { Range } from "react-range";

const ProductFilter = ({ onFilterChange }) => {
    const [showFilter, setShowFilter] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTag, setSelectedTag] = useState("All");
    const [selectedGender, setSelectedGender] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [priceRange, setPriceRange] = useState([0, 1000000]);
    const [sortBy, setSortBy] = useState("");
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const debouncedFilterChange = debounce((filters) => {
        onFilterChange?.(filters);
        console.log("Filters sent to parent:", filters);
    }, 300);

    useEffect(() => {
        setLoading(true);
        CategoryService.getAll()
            .then((data) => {
                setCategories(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Unable to load categories");
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        debouncedFilterChange({
            tag: selectedTag,
            gender: selectedGender,
            category: selectedCategory,
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
            search: searchQuery,
            sortBy
        });
    }, [
        selectedTag,
        selectedGender,
        selectedCategory,
        priceRange,
        searchQuery,
        sortBy
    ]);

    const toggleFilter = () => {
        setShowFilter((prev) => !prev);
        if (showSearch) setShowSearch(false);
    };

    const toggleSearch = () => {
        setShowSearch((prev) => !prev);
        if (showFilter) setShowFilter(false);
    };

    const resetFilters = () => {
        setSelectedTag("All");
        setSelectedGender("");
        setSelectedCategory("");
        setPriceRange([0, 1000000]);
        setSearchQuery("");
        setSortBy("");
    };

    const topFilters = ["All", "Best Seller", "New Arrival"];
    const genderOptions = ["Men", "Women", "Unisex"];
    const sortOptions = [
        { value: "price-asc", label: "Price: Low to High" },
        { value: "price-desc", label: "Price: High to Low" },
        { value: "newest", label: "Newest" }
    ];

    return (
        <div className="mb-5 position-relative">
            <style>
                {`
          .art-btn {
            background: linear-gradient(135deg, #6b7280, #4b5563);
            color: white;
            border: none;
            border-radius: 20px;
            padding: 8px 20px;
            font-weight: 500;
            transition: all 0.3s ease;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
          }
          .art-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 12px rgba(0, 0, 0, 0.15);
            background: linear-gradient(135deg, #5f6775, #3f4855);
          }
          .art-btn.active {
            background: linear-gradient(135deg, #00c4cc, #00a3e0);
            box-shadow: 0 5px 12px rgba(0, 195, 204, 0.3);
          }
          .art-badge {
            border-radius: 20px;
            padding: 8px 16px;
            font-weight: 500;
            transition: all 0.3s ease;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          }
          .art-badge.active {
            background: linear-gradient(135deg, #00c4cc, #00a3e0);
            color: white;
            box-shadow: 0 4px 8px rgba(0, 195, 204, 0.2);
          }
          .art-badge:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .search-container {
            background: #fff;
            border-radius: 25px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            padding: 10px 15px;
            transition: all 0.3s ease;
          }
          .search-container:hover {
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
          }
          .search-input {
            border: none;
            border-radius: 20px;
            padding: 10px 15px;
            transition: all 0.3s ease;
            width: 100%;
            outline: none;
          }
          .search-input:focus {
            box-shadow: 0 0 0 3px rgba(0, 163, 224, 0.2);
            background: #f8fafc;
          }
          .clear-btn {
            border-radius: 50%;
            padding: 4px;
            transition: all 0.3s ease;
          }
          .clear-btn:hover {
            background: #f87171;
            color: white;
          }
          .filter-container {
            background: #fff;
            border-radius: 15px;
            box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
            padding: 20px;
          }
          .range-track {
            height: 6px;
            background: #e5e7eb;
            border-radius: 3px;
          }
          .range-thumb {
            height: 16px;
            width: 16px;
            background: linear-gradient(135deg, #00c4cc, #00a3e0);
            border: none;
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            cursor: pointer;
          }
          .form-control, .form-select {
            border-radius: 10px;
            border: 1px solid #e5e7eb;
            transition: all 0.3s ease;
          }
          .form-control:focus, .form-select:focus {
            border-color: #00a3e0;
            box-shadow: 0 0 0 3px rgba(0, 163, 224, 0.1);
          }
          .reset-btn {
            border-radius: 20px;
            padding: 8px 20px;
            transition: all 0.3s ease;
          }
          .reset-btn:hover {
            background: #f87171;
            color: white;
            border-color: #f87171;
          }
        `}
            </style>

            {/* Top filters and buttons */}
            <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
                <div className="d-flex flex-wrap gap-2">
                    {topFilters.map((tag, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedTag(tag)}
                            className={`art-btn btn btn-sm ${selectedTag === tag ? "active" : ""
                                }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
                <div className="d-flex gap-2 mt-3 mt-md-0">
                    <button
                        onClick={toggleFilter}
                        className={`art-btn btn btn-sm ${showFilter ? "active" : ""
                            } d-flex align-items-center gap-1`}
                    >
                        <i className={`bi ${showFilter ? "bi-x" : "bi-filter"}`}></i>
                        <span className="d-none d-md-inline ms-1">Filter</span>
                    </button>
                    <button
                        onClick={toggleSearch}
                        className={`art-btn btn btn-sm ${showSearch ? "active" : ""
                            } d-flex align-items-center gap-1`}
                    >
                        <i className={`bi ${showSearch ? "bi-x" : "bi-search"}`}></i>
                        <span className="d-none d-md-inline ms-1">Search</span>
                    </button>
                </div>
            </div>

            {/* Search box */}
            {showSearch && (
                <div className="search-container mb-4">
                    <div className="d-flex align-items-center gap-2">
                        <i className="bi bi-search text-muted"></i>
                        <input
                            type="text"
                            className="search-input form-control"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                className="clear-btn btn btn-outline-secondary btn-sm"
                                onClick={() => setSearchQuery("")}
                            >
                                <i className="bi bi-x"></i>
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Dropdown filters */}
            {showFilter && (
                <div className="filter-container">
                    {loading ? (
                        <p className="text-muted">Loading categories...</p>
                    ) : error ? (
                        <p className="text-danger">{error}</p>
                    ) : (
                        <div className="row gy-4">
                            {/* Gender filter */}
                            <div className="col-12 col-md-3">
                                <h6 className="fw-bold mb-3 text-uppercase">Gender</h6>
                                <div className="d-flex flex-wrap gap-2">
                                    {genderOptions.map((g, i) => (
                                        <span
                                            key={i}
                                            onClick={() => setSelectedGender(g)}
                                            className={`art-badge badge ${selectedGender === g ? "active" : "bg-light text-dark"
                                                }`}
                                        >
                                            {g}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Category filter */}
                            <div className="col-12 col-md-3">
                                <h6 className="fw-bold mb-3 text-uppercase">Category</h6>
                                <div className="d-flex flex-wrap gap-2">
                                    {categories.map((cat, i) => (
                                        <span
                                            key={i}
                                            onClick={() => setSelectedCategory(cat.name)}
                                            className={`art-badge badge ${selectedCategory === cat.name
                                                    ? "active"
                                                    : "bg-light text-dark"
                                                }`}
                                        >
                                            {cat.name}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Price filter with slider */}
                            <div className="col-12 col-md-3">
                                <h6 className="fw-bold mb-3 text-uppercase">Price Range</h6>
                                <div className="mb-3">
                                    <Range
                                        values={priceRange}
                                        step={10000}
                                        min={0}
                                        max={1000000}
                                        onChange={(values) => setPriceRange(values)}
                                        renderTrack={({ props, children }) => (
                                            <div
                                                {...props}
                                                className="range-track"
                                                style={{ ...props.style, marginBottom: "10px" }}
                                            >
                                                {children}
                                            </div>
                                        )}
                                        renderThumb={({ props }) => (
                                            <div
                                                {...props}
                                                className="range-thumb"
                                                style={{ ...props.style }}
                                            />
                                        )}
                                    />
                                    <div className="d-flex justify-content-between text-muted">
                                        <span>{priceRange[0].toLocaleString()}</span>
                                        <span>{priceRange[1].toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Sort options */}
                            <div className="col-12 col-md-3">
                                <h6 className="fw-bold mb-3 text-uppercase">Sort By</h6>
                                <select
                                    className="form-select"
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                >
                                    <option value="">Default</option>
                                    {sortOptions.map((opt, i) => (
                                        <option key={i} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                    <div className="mt-4 text-end">
                        <button
                            className="reset-btn btn btn-outline-danger btn-sm"
                            onClick={resetFilters}
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductFilter;
