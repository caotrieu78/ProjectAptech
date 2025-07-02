import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaAngleLeft,
  FaAngleRight
} from "react-icons/fa";
import ConfirmModal from "../../../components/ConfirmModal";
import ToastMessage from "../../../components/ToastMessage";
import ProductModal from "./ProductModal";
import ImagePreviewModal from "../../Component/ImagePreviewModal";
import ProductService from "../../../services/ProductService";

const ProductPage = ({ isSidebarOpen }) => {
  const [products, setProducts] = useState([]);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success"
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProducts = async () => {
    try {
      const data = await ProductService.getAll();
      setProducts(data);
    } catch (err) {
      showToast("❌ Error loading products", "error");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const handleCreate = () => {
    setEditProduct(null);
    setShowModal(true);
  };

  const handleEdit = (product) => {
    setEditProduct(product);
    setShowModal(true);
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (editProduct) {
        await ProductService.update(editProduct.ProductID, formData);
        showToast("Product updated successfully");
      } else {
        await ProductService.create(formData);
        showToast("Product added successfully");
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      showToast("Error saving product", "error");
    }
  };

  const confirmDelete = (product) => {
    setProductToDelete(product);
    setShowConfirm(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await ProductService.delete(productToDelete.ProductID);
      setShowConfirm(false);
      setProductToDelete(null);
      fetchProducts();
      showToast("Product deleted successfully");
    } catch (err) {
      showToast("Error deleting product", "error");
    }
  };

  const handleImageClick = (url) => {
    setSelectedImage(url);
  };

  // Pagination logic
  const itemsPerPage = 5;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div
      className="container-fluid p-4"
      style={{
        marginLeft: isSidebarOpen ? "260px" : "0",
        transition: "margin-left 0.3s ease-in-out",
        width: isSidebarOpen ? "calc(100% - 260px)" : "100%",
        minHeight: "calc(100vh - 70px)"
      }}
    >
      <h2 className="mb-4 fw-bold text-center">Product Management</h2>

      <div className="d-flex justify-content-end mb-3">
        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={handleCreate}
        >
          <FaPlus /> Add Product
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Gender</th>
                  <th>Category</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((prod) => (
                  <tr key={prod.ProductID}>
                    <td>
                      <img
                        src={
                          prod.ThumbnailURL ||
                          "https://via.placeholder.com/60?text=No+Image"
                        }
                        alt={prod.ProductName || "Product"}
                        className="rounded"
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          cursor: "zoom-in"
                        }}
                        onClick={() => handleImageClick(prod.ThumbnailURL)}
                      />
                    </td>
                    <td>
                      <div className="fw-medium">
                        {prod.ProductName || "(No product name)"}
                      </div>
                      {prod.Description && (
                        <div className="text-muted small">
                          {prod.Description}
                        </div>
                      )}
                    </td>
                    <td>
                      <div>
                        {prod.Price
                          ? prod.Price.toLocaleString("vi-VN") + " đ"
                          : "Not available"}
                      </div>
                    </td>
                    <td>{prod.Gender || "Unknown"}</td>
                    <td>{prod.category?.CategoryName || "None"}</td>
                    <td className="text-center">
                      <div className="d-flex gap-2 justify-content-center">
                        <button
                          className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                          onClick={() => handleEdit(prod)}
                          title="Edit"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                          onClick={() => confirmDelete(prod)}
                          title="Delete"
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {products.length > itemsPerPage && (
          <div className="card-footer d-flex justify-content-center gap-2">
            <button
              className={`btn btn-outline-primary ${
                currentPage === 1 ? "disabled" : ""
              }`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <FaAngleLeft /> Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`btn btn-outline-primary ${
                  currentPage === page ? "btn-primary" : ""
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className={`btn btn-outline-primary ${
                currentPage === totalPages ? "disabled" : ""
              }`}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next <FaAngleRight />
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        show={showConfirm}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${productToDelete?.ProductName}"?`}
        onConfirm={handleDeleteConfirmed}
        onClose={() => setShowConfirm(false)}
      />

      <ProductModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleModalSubmit}
        initialData={editProduct}
      />

      {toast.show && (
        <ToastMessage
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}

      <ImagePreviewModal
        imageUrl={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
};

export default ProductPage;
