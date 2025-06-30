import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaChevronDown } from "react-icons/fa";

const Blog = () => {
    const [blogs, setBlogs] = useState([]);
    const [originalBlogs, setOriginalBlogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPost, setSelectedPost] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedTag, setSelectedTag] = useState("");
    const [sortBy, setSortBy] = useState("date-desc");
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 2;

    useEffect(() => {
        fetch("/posts.json")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                console.log("Blogs fetched from /posts.json:", data);
                setBlogs(data);
                setOriginalBlogs(data);
            })
            .catch((error) => {
                console.error("Error fetching blogs:", error);
            });
    }, []);

    const filterBlogs = (term, category, tag, sort) => {
        let filtered = [...originalBlogs];

        if (term && term.trim() !== "") {
            const cleanTerm = term.toLowerCase().trim().replace(/\s+/g, " ");
            filtered = filtered.filter(
                (blog) =>
                    blog.title.toLowerCase().includes(cleanTerm) ||
                    blog.excerpt.toLowerCase().includes(cleanTerm) ||
                    blog.content.toLowerCase().includes(cleanTerm)
            );
        }

        if (category && category !== "") {
            filtered = filtered.filter((blog) => blog.category === category);
        }

        if (tag && tag !== "") {
            filtered = filtered.filter((blog) => blog.tags.includes(tag));
        }

        if (sort === "date-desc") {
            filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sort === "date-asc") {
            filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        }

        setBlogs(filtered);
        setCurrentPage(1);
    };

    useEffect(() => {
        filterBlogs(searchTerm, selectedCategory, selectedTag, sortBy);
    }, [searchTerm, selectedCategory, selectedTag, sortBy]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchClick = () => {
        filterBlogs(searchTerm, selectedCategory, selectedTag, sortBy);
    };

    const handleCategoryFilter = (category) => {
        setSelectedCategory(category);
    };

    const handleTagFilter = (tag) => {
        setSelectedTag(tag);
    };

    const handleSort = (e) => {
        setSortBy(e.target.value);
    };

    const handleReset = () => {
        setSearchTerm("");
        setSelectedCategory("");
        setSelectedTag("");
        setSortBy("date-desc");
        setSelectedPost(null);
        setCurrentPage(1);
        setBlogs([...originalBlogs]);
    };

    const handleReadMore = (blog) => {
        setSelectedPost(blog);
    };

    const handleBack = () => {
        setSelectedPost(null);
    };

    const handleShare = (blog) => {
        const shareUrl = `https://maverick-dresses.com/blog/${blog.slug}`;
        navigator.clipboard
            .writeText(shareUrl)
            .then(() => {
                alert("Link copied to clipboard!");
            })
            .catch(() => {
                alert("Failed to copy link, please try again!");
            });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const totalPages = Math.ceil(blogs.length / postsPerPage);
    const paginatedBlogs = blogs.slice(
        (currentPage - 1) * postsPerPage,
        currentPage * postsPerPage
    );

    const textVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 40, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { duration: 0.7, ease: "easeOut" }
        }
    };

    const buttonVariants = {
        hover: { scale: 1.03, transition: { duration: 0.2 } },
        tap: { scale: 0.98 }
    };

    return (
        <section id="blog" className="blog-section py-5">
            <div className="container">
                {selectedPost ? (
                    <motion.div
                        className="post-detail"
                        initial="hidden"
                        animate="visible"
                        variants={textVariants}
                    >
                        <motion.button
                            className="btn btn-primary mb-4"
                            onClick={handleBack}
                            whileHover="hover"
                            whileTap="tap"
                            variants={buttonVariants}
                        >
                            <i className="fas fa-arrow-left me-2"></i> Back
                        </motion.button>
                        <h3 className="playfair">{selectedPost.title}</h3>
                        <img src={selectedPost.image} alt={selectedPost.title} />
                        <p>{selectedPost.content}</p>
                        <div className="meta-info">
                            <span>By Admin</span>
                            <span>
                                {new Date(selectedPost.date).toLocaleDateString("en-US", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric"
                                })}
                            </span>
                            <span>{selectedPost.tags.join(", ")}</span>
                            <span>{selectedPost.comments} Comments</span>
                        </div>
                        <motion.button
                            className="btn btn-share"
                            onClick={() => handleShare(selectedPost)}
                            whileHover="hover"
                            whileTap="tap"
                            variants={buttonVariants}
                        >
                            Share
                        </motion.button>
                    </motion.div>
                ) : (
                    <div className="row">
                        <div className="col-lg-8">
                            <motion.h2
                                className="mb-4 playfair"
                                initial="hidden"
                                animate="visible"
                                variants={textVariants}
                            >
                                Maverick Dresses Blog
                            </motion.h2>
                            <motion.div
                                className="search-bar"
                                initial="hidden"
                                animate="visible"
                                variants={textVariants}
                                transition={{ delay: 0.2 }}
                            >
                                <FaSearch className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search blog posts..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                />
                                <button onClick={handleSearchClick}>Search</button>
                            </motion.div>
                            <motion.div
                                className="filter-bar"
                                initial="hidden"
                                animate="visible"
                                variants={textVariants}
                                transition={{ delay: 0.4 }}
                            >
                                <div className="select-wrapper">
                                    <select
                                        onChange={(e) => handleCategoryFilter(e.target.value)}
                                        value={selectedCategory}
                                        className="form-select"
                                    >
                                        <option value="">All Categories</option>
                                        <option value="Fashion">Fashion</option>
                                        <option value="Lifestyle">Lifestyle</option>
                                        <option value="Street Style">Street Style</option>
                                        <option value="DIY & Crafts">DIY & Crafts</option>
                                    </select>
                                    <FaChevronDown className="select-icon" />
                                </div>
                                <div className="select-wrapper">
                                    <select
                                        onChange={(e) => handleTagFilter(e.target.value)}
                                        value={selectedTag}
                                        className="form-select"
                                    >
                                        <option value="">All Tags</option>
                                        <option value="School Uniforms">School Uniforms</option>
                                        <option value="Fashion">Fashion</option>
                                        <option value="Winter">Winter</option>
                                        <option value="Trends">Trends</option>
                                        <option value="Spring">Spring</option>
                                        <option value="Accessories">Accessories</option>
                                        <option value="Style">Style</option>
                                        <option value="Sustainable">Sustainable</option>
                                        <option value="Eco-Friendly">Eco-Friendly</option>
                                        <option value="DIY">DIY</option>
                                        <option value="Crafts">Crafts</option>
                                        <option value="Layering">Layering</option>
                                        <option value="Festivals">Festivals</option>
                                    </select>
                                    <FaChevronDown className="select-icon" />
                                </div>
                                <div className="select-wrapper">
                                    <select
                                        onChange={handleSort}
                                        value={sortBy}
                                        className="form-select"
                                    >
                                        <option value="date-desc">Newest First</option>
                                        <option value="date-asc">Oldest First</option>
                                    </select>
                                    <FaChevronDown className="select-icon" />
                                </div>
                                <button onClick={handleReset} className="btn">
                                    Clear Filters
                                </button>
                            </motion.div>
                            <motion.p
                                className="text-center"
                                initial="hidden"
                                animate="visible"
                                variants={textVariants}
                                transition={{ delay: 0.6 }}
                            >
                                Found {blogs.length} posts
                            </motion.p>
                            {paginatedBlogs.length === 0 ? (
                                <motion.p
                                    className="text-center"
                                    style={{ color: "#1a202c" }}
                                    initial="hidden"
                                    animate="visible"
                                    variants={textVariants}
                                >
                                    No posts found. Try a different search or filter!
                                </motion.p>
                            ) : (
                                paginatedBlogs.map((blog, index) => (
                                    <motion.div
                                        key={blog.id}
                                        className="blog-card"
                                        initial="hidden"
                                        animate="visible"
                                        variants={cardVariants}
                                        transition={{ delay: 0.2 * index }}
                                    >
                                        <img src={blog.image} alt={blog.title} />
                                        <div className="card-body">
                                            <h4 className="card-title playfair">{blog.title}</h4>
                                            <p className="card-text">{blog.excerpt}</p>
                                            <div className="meta-info">
                                                <span>By Admin</span>
                                                <span>
                                                    {new Date(blog.date).toLocaleDateString("en-US", {
                                                        day: "2-digit",
                                                        month: "short",
                                                        year: "numeric"
                                                    })}
                                                </span>
                                                <span>{blog.tags.join(", ")}</span>
                                                <span>{blog.comments} Comments</span>
                                            </div>
                                            <motion.a
                                                href={`/blog/${blog.slug}`}
                                                className="btn btn-primary"
                                                onClick={() => handleReadMore(blog)}
                                                whileHover="hover"
                                                whileTap="tap"
                                                variants={buttonVariants}
                                            >
                                                Read More
                                            </motion.a>
                                            <motion.button
                                                className="btn btn-share"
                                                onClick={() => handleShare(blog)}
                                                whileHover="hover"
                                                whileTap="tap"
                                                variants={buttonVariants}
                                            >
                                                Share
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                            <nav aria-label="Page navigation">
                                <ul className="pagination">
                                    <li
                                        className={`page-item ${currentPage === 1 ? "disabled" : ""
                                            }`}
                                    >
                                        <motion.a
                                            className="page-link prev-next"
                                            href="#"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            whileHover="hover"
                                            whileTap="tap"
                                            variants={buttonVariants}
                                            tabIndex={currentPage === 1 ? "-1" : "0"}
                                        >
                                            Previous
                                        </motion.a>
                                    </li>
                                    {(() => {
                                        const pages = [];
                                        const maxPagesToShow = 5;
                                        const startPage = Math.max(
                                            1,
                                            currentPage - Math.floor(maxPagesToShow / 2)
                                        );
                                        const endPage = Math.min(
                                            totalPages,
                                            startPage + maxPagesToShow - 1
                                        );

                                        if (startPage > 1) {
                                            pages.push(
                                                <li key={1} className="page-item">
                                                    <motion.a
                                                        className="page-link"
                                                        href="#"
                                                        onClick={() => handlePageChange(1)}
                                                        whileHover="hover"
                                                        whileTap="tap"
                                                        variants={buttonVariants}
                                                    >
                                                        1
                                                    </motion.a>
                                                </li>
                                            );
                                            if (startPage > 2) {
                                                pages.push(
                                                    <li key="start-ellipsis" className="page-item">
                                                        <span className="page-link ellipsis">...</span>
                                                    </li>
                                                );
                                            }
                                        }

                                        for (let page = startPage; page <= endPage; page++) {
                                            pages.push(
                                                <li
                                                    key={page}
                                                    className={`page-item ${currentPage === page ? "active" : ""
                                                        }`}
                                                >
                                                    <motion.a
                                                        className="page-link"
                                                        href="#"
                                                        onClick={() => handlePageChange(page)}
                                                        whileHover="hover"
                                                        whileTap="tap"
                                                        variants={buttonVariants}
                                                    >
                                                        {page}
                                                        {currentPage === page && (
                                                            <span className="sr-only">(current)</span>
                                                        )}
                                                    </motion.a>
                                                </li>
                                            );
                                        }

                                        if (endPage < totalPages) {
                                            if (endPage < totalPages - 1) {
                                                pages.push(
                                                    <li key="end-ellipsis" className="page-item">
                                                        <span className="page-link ellipsis">...</span>
                                                    </li>
                                                );
                                            }
                                            pages.push(
                                                <li key={totalPages} className="page-item">
                                                    <motion.a
                                                        className="page-link"
                                                        href="#"
                                                        onClick={() => handlePageChange(totalPages)}
                                                        whileHover="hover"
                                                        whileTap="tap"
                                                        variants={buttonVariants}
                                                    >
                                                        {totalPages}
                                                    </motion.a>
                                                </li>
                                            );
                                        }

                                        return pages;
                                    })()}
                                    <li
                                        className={`page-item ${currentPage === totalPages ? "disabled" : ""
                                            }`}
                                    >
                                        <motion.a
                                            className="page-link prev-next"
                                            href="#"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            whileHover="hover"
                                            whileTap="tap"
                                            variants={buttonVariants}
                                            tabIndex={currentPage === totalPages ? "-1" : "0"}
                                        >
                                            Next
                                        </motion.a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                        <div className="col-lg-4">
                            <div className="side-menu">
                                <motion.div
                                    className="mt-4"
                                    initial="hidden"
                                    animate="visible"
                                    variants={textVariants}
                                    transition={{ delay: 0.6 }}
                                >
                                    <h4 className="playfair">Categories</h4>
                                    <ul>
                                        {[
                                            "",
                                            "Fashion",
                                            "Lifestyle",
                                            "Street Style",
                                            "DIY & Crafts"
                                        ].map((category, index) => (
                                            <motion.li
                                                key={index}
                                                initial="hidden"
                                                animate="visible"
                                                variants={textVariants}
                                                transition={{ delay: 0.2 * index + 0.8 }}
                                            >
                                                <a
                                                    href="#"
                                                    className={
                                                        category === selectedCategory ? "active" : ""
                                                    }
                                                    onClick={() => handleCategoryFilter(category)}
                                                >
                                                    {category || "All"}
                                                </a>
                                            </motion.li>
                                        ))}
                                    </ul>
                                </motion.div>
                                <motion.div
                                    className="mt-4"
                                    initial="hidden"
                                    animate="visible"
                                    variants={textVariants}
                                    transition={{ delay: 1.0 }}
                                >
                                    <h4 className="playfair">Tags</h4>
                                    <div className="tag-cloud">
                                        {[
                                            "",
                                            "School Uniforms",
                                            "Fashion",
                                            "Winter",
                                            "Trends",
                                            "Spring",
                                            "Accessories",
                                            "Style",
                                            "Sustainable",
                                            "Eco-Friendly",
                                            "DIY",
                                            "Crafts",
                                            "Layering",
                                            "Festivals"
                                        ].map((tag, index) => (
                                            <motion.a
                                                key={index}
                                                href="#"
                                                className={tag === selectedTag ? "active" : ""}
                                                onClick={() => handleTagFilter(tag)}
                                                initial="hidden"
                                                animate="visible"
                                                variants={textVariants}
                                                transition={{ delay: 0.2 * index + 1.2 }}
                                            >
                                                {tag || "All"}
                                            </motion.a>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Blog;
