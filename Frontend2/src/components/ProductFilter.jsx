import React, { useState, useEffect } from "react";
import { debounce } from "lodash";
import CategoryService from "../services/categoryService";

const ProductFilter = ({ onFilterChange }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
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
      search: searchQuery,
      sortBy
    });
  }, [selectedTag, selectedGender, selectedCategory, searchQuery, sortBy]);

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
          /* Base styles for buttons */
          .art-btn {
            background: linear-gradient(135deg, #6b7280, #4b5563);
            color: white;
            border: none;
            border-radius: 20px;
            padding: clamp(6px, 1.5vw, 8px) clamp(12px, 3vw, 16px);
            font-weight: 500;
            font-size: clamp(0.8rem, 2vw, 0.9rem);
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            min-width: clamp(70px, 15vw, 80px);
            text-align: center;
            cursor: pointer;
          }
          .art-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
            background: linear-gradient(135deg, #5f6775, #3f4855);
          }
          .art-btn.active {
            background: linear-gradient(135deg, #00c4cc, #00a3e0);
            box-shadow: 0 3px 6px rgba(0, 195, 204, 0.3);
          }

          /* Badge styles */
          .art-badge {
            border-radius: 20px;
            padding: clamp(5px, 1.5vw, 6px) clamp(10px, 2.5vw, 12px);
            font-weight: 500;
            font-size: clamp(0.75rem, 2vw, 0.85rem);
            transition: all 0.2s ease;
            cursor: pointer;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          }
          .art-badge.active {
            background: linear-gradient(135deg, #00c4cc, #00a3e0);
            color: white;
            box-shadow: 0 2px 5px rgba(0, 195, 204, 0.2);
          }
          .art-badge:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          }

          /* Search container */
          .search-container {
            background: #fff;
            border-radius: 25px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
            padding: clamp(6px, 1.5vw, 8px) clamp(10px, 2.5vw, 12px);
            transition: all 0.2s ease;
            width: 100%;
            max-width: clamp(300px, 80vw, 500px);
            margin: 0 auto;
          }
          .search-container:hover {
            box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
          }
          .search-input {
            border: none;
            border-radius: 20px;
            padding: clamp(6px, 1.5vw, 8px) clamp(10px, 2.5vw, 12px);
            font-size: clamp(0.8rem, 2vw, 0.9rem);
            transition: all 0.2s ease;
            width: 100%;
            outline: none;
          }
          .search-input:focus {
            box-shadow: 0 0 0 2px rgba(0, 163, 224, 0.2);
            background: #f8fafc;
          }

          /* Clear button */
          .clear-btn {
            border-radius: 50%;
            padding: clamp(3px, 1vw, 4px);
            font-size: clamp(0.7rem, 1.8vw, 0.8rem);
            transition: all 0.2s ease;
          }
          .clear-btn:hover {
            background: #f87171;
            color: white;
          }

          /* Filter container */
          .filter-container {
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
            padding: clamp(12px, 3vw, 16px);
            width: 100%;
            margin: 0 auto;
          }

          /* Form controls */
          .form-control, .form-select {
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            font-size: clamp(0.8rem, 2vw, 0.9rem);
            padding: clamp(6px, 1.5vw, 8px) clamp(10px, 2.5vw, 12px);
            transition: all 0.2s ease;
          }
          .form-control:focus, .form-select:focus {
            border-color: #00a3e0;
            box-shadow: 0 0 0 2px rgba(0, 163, 224, 0.1);
          }

          /* Reset button */
          .reset-btn {
            border-radius: 20px;
            padding: clamp(5px, 1.5vw, 6px) clamp(12px, 3vw, 16px);
            font-size: clamp(0.75rem, 2vw, 0.85rem);
            transition: all 0.2s ease;
          }
          .reset-btn:hover {
            background: #f87171;
            color: white;
            border-color: #f87171;
          }

          /* Filter heading */
          .filter-heading {
            font-size: clamp(0.85rem, 2.2vw, 0.95rem);
            margin-bottom: 0.75rem;
            font-weight: 600;
          }

          /* Filter section */
          .filter-section {
            margin-bottom: clamp(0.75rem, 2vw, 1rem);
          }

          /* Filter controls */
          .filter-controls {
            display: flex;
            flex-wrap: wrap;
            gap: clamp(0.5rem, 1.5vw, 0.75rem);
            justify-content: center;
            align-items: center;
          }

          /* Responsive adjustments */
          @media (max-width: 575px) {
            .art-btn {
              padding: clamp(5px, 1.2vw, 6px) clamp(10px, 2.5vw, 12px);
              font-size: clamp(0.75rem, 1.8vw, 0.8rem);
              min-width: clamp(60px, 12vw, 70px);
            }
            .art-badge {
              padding: clamp(4px, 1.2vw, 5px) clamp(8px, 2vw, 10px);
              font-size: clamp(0.7rem, 1.8vw, 0.75rem);
            }
            .search-container {
              padding: clamp(5px, 1.2vw, 6px) clamp(8px, 2vw, 10px);
              max-width: 100%;
            }
            .search-input {
              padding: clamp(5px, 1.2vw, 6px) clamp(8px, 2vw, 10px);
              font-size: clamp(0.75rem, 1.8vw, 0.8rem);
            }
            .clear-btn {
              padding: clamp(2px, 0.8vw, 3px);
            }
            .filter-container {
              padding: clamp(10px, 2.5vw, 12px);
            }
            .form-control, .form-select {
              font-size: clamp(0.75rem, 1.8vw, 0.8rem);
              padding: clamp(5px, 1.2vw, 6px) clamp(8px, 2vw, 10px);
            }
            .reset-btn {
              padding: clamp(4px, 1.2vw, 5px) clamp(10px, 2.5vw, 12px);
              font-size: clamp(0.7rem, 1.8vw, 0.75rem);
            }
            .filter-heading {
              font-size: clamp(0.8rem, 2vw, 0.85rem);
            }
            .filter-controls {
              gap: clamp(0.4rem, 1.2vw, 0.5rem);
            }
            .d-flex.gap-2 {
              gap: clamp(0.4rem, 1.2vw, 0.5rem);
              justify-content: center;
            }
            .justify-content-between {
              flex-direction: column;
              align-items: center;
              gap: clamp(0.75rem, 2vw, 1rem);
            }
          }

          @media (min-width: 576px) and (max-width: 767px) {
            .art-btn {
              padding: clamp(6px, 1.5vw, 7px) clamp(12px, 3vw, 14px);
              font-size: clamp(0.8rem, 2vw, 0.85rem);
              min-width: clamp(65px, 13vw, 75px);
            }
            .art-badge {
              padding: clamp(5px, 1.5vw, 6px) clamp(10px, 2.5vw, 12px);
              font-size: clamp(0.75rem, 2vw, 0.8rem);
            }
            .search-container {
              padding: clamp(6px, 1.5vw, 7px) clamp(10px, 2.5vw, 12px);
              max-width: 100%;
            }
            .search-input {
              padding: clamp(6px, 1.5vw, 7px) clamp(10px, 2.5vw, 12px);
              font-size: clamp(0.8rem, 2vw, 0.85rem);
            }
            .filter-container {
              padding: clamp(12px, 3vw, 14px);
            }
            .form-control, .form-select {
              font-size: clamp(0.8rem, 2vw, 0.85rem);
              padding: clamp(6px, 1.5vw, 7px) clamp(10px, 2.5vw, 12px);
            }
            .reset-btn {
              padding: clamp(5px, 1.5vw, 6px) clamp(12px, 3vw, 14px);
              font-size: clamp(0.75rem, 2vw, 0.8rem);
            }
            .filter-heading {
              font-size: clamp(0.85rem, 2.2vw, 0.9rem);
            }
            .filter-controls {
              gap: clamp(0.5rem, 1.5vw, 0.75rem);
            }
          }

          @media (min-width: 768px) {
            .justify-content-between {
              flex-direction: row;
              align-items: center;
            }
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
              className={`art-btn btn btn-sm ${
                selectedTag === tag ? "active" : ""
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
        <div className="filter-controls">
          <button
            onClick={toggleFilter}
            className={`art-btn btn btn-sm ${
              showFilter ? "active" : ""
            } d-flex align-items-center gap-1`}
          >
            <i className={`bi ${showFilter ? "bi-x" : "bi-filter"}`}></i>
            <span className="ms-1">Filter</span>
          </button>
          <button
            onClick={toggleSearch}
            className={`art-btn btn btn-sm ${
              showSearch ? "active" : ""
            } d-flex align-items-center gap-1`}
          >
            <i className={`bi ${showSearch ? "bi-x" : "bi-search"}`}></i>
            <span className="ms-1">Search</span>
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
            <p className="text-muted text-center">Loading categories...</p>
          ) : error ? (
            <p className="text-danger text-center">{error}</p>
          ) : (
            <div className="row gy-3">
              {/* Gender filter */}
              <div className="col-12 col-sm-6 col-md-4 filter-section">
                <h6 className="fw-bold text-uppercase filter-heading">
                  Gender
                </h6>
                <div className="d-flex flex-wrap gap-2">
                  {genderOptions.map((g, i) => (
                    <span
                      key={i}
                      onClick={() => setSelectedGender(g)}
                      className={`art-badge badge ${
                        selectedGender === g ? "active" : "bg-light text-dark"
                      }`}
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              {/* Category filter */}
              <div className="col-12 col-sm-6 col-md-4 filter-section">
                <h6 className="fw-bold text-uppercase filter-heading">
                  Category
                </h6>
                <div className="d-flex flex-wrap gap-2">
                  {categories.map((cat, i) => (
                    <span
                      key={i}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`art-badge badge ${
                        selectedCategory === cat.name
                          ? "active"
                          : "bg-light text-dark"
                      }`}
                    >
                      {cat.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sort options */}
              <div className="col-12 col-sm-6 col-md-4 filter-section">
                <h6 className="fw-bold text-uppercase filter-heading">
                  Sort By
                </h6>
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
          <div className="mt-3 text-end">
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
