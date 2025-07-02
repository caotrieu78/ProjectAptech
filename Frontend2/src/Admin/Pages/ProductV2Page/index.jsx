import React, { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaPen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ProductVariantService from "../../../services/productVariantService";
import ConfirmModal from "../../../components/ConfirmModal";
import ToastMessage from "../../../components/ToastMessage";
import ProductVariantModal from "./ProductVariantModal";
import ImagePreviewModal from "../../Component/ImagePreviewModal";

const ProductV2Page = ({ isSidebarOpen }) => {
  const [variants, setVariants] = useState([]);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success"
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [variantToDelete, setVariantToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editVariant, setEditVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  const fetchVariants = async () => {
    try {
      const data = await ProductVariantService.getAll();
      setVariants(Array.isArray(data) ? data : []);
    } catch (err) {
      showToast("Error loading variant list", "error");
    }
  };

  useEffect(() => {
    fetchVariants();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const handleCreate = () => {
    setEditVariant(null);
    setShowModal(true);
  };

  const handleEdit = (variant) => {
    setEditVariant(variant);
    setShowModal(true);
  };

  const handleModalSubmit = async (formData) => {
    try {
      if (editVariant) {
        await ProductVariantService.update(editVariant.VariantID, formData);
        showToast("Variant updated successfully");
      } else {
        await ProductVariantService.create(formData);
        showToast("Variant added successfully");
      }
      fetchVariants();
      setShowModal(false);
    } catch (err) {
      showToast("Error saving variant", "error");
    }
  };

  const confirmDelete = (variant) => {
    setVariantToDelete(variant);
    setShowConfirm(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await ProductVariantService.delete(variantToDelete.VariantID);
      setShowConfirm(false);
      setVariantToDelete(null);
      fetchVariants();
      showToast("Variant deleted successfully");
    } catch (err) {
      showToast("Error deleting variant", "error");
    }
  };

  const formatCurrency = (value) => {
    if (!value) return "0 đ";
    return parseInt(value).toLocaleString("vi-VN") + " đ";
  };

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
      <h2 className="mb-4 fw-bold text-center">Product Variant Management</h2>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary d-flex align-items-center gap-1"
            onClick={() => navigate("/dashboard/size")}
            title="Edit Size"
          >
            <FaPen /> Size
          </button>
          <button
            className="btn btn-outline-secondary d-flex align-items-center gap-1"
            onClick={() => navigate("/dashboard/color")}
            title="Edit Color"
          >
            <FaPen /> Color
          </button>
        </div>
        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={handleCreate}
        >
          <FaPlus /> Add Variant
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Image</th>
                  <th>Product</th>
                  <th>Color</th>
                  <th>Size</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {variants.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No data available
                    </td>
                  </tr>
                ) : (
                  variants.map((variant) => (
                    <tr key={variant.VariantID}>
                      <td>
                        <img
                          src={
                            variant.ImageURL ||
                            "https://via.placeholder.com/60?text=No+Image"
                          }
                          alt={variant.product?.ProductName || "Product"}
                          className="rounded"
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            cursor: "zoom-in"
                          }}
                          onClick={() => setSelectedImage(variant.ImageURL)}
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/60?text=Error";
                          }}
                        />
                      </td>
                      <td>{variant.product?.ProductName || "Unknown"}</td>
                      <td>{variant.color?.ColorName || "Unknown"}</td>
                      <td>{variant.size?.SizeName || "Unknown"}</td>
                      <td>{formatCurrency(variant.Price)}</td>
                      <td>{variant.StockQuantity}</td>
                      <td className="text-center">
                        <div className="d-flex gap-2 justify-content-center">
                          <button
                            className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                            onClick={() => handleEdit(variant)}
                            title="Edit"
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                            onClick={() => confirmDelete(variant)}
                            title="Delete"
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ProductVariantModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleModalSubmit}
        initialData={editVariant}
      />

      <ConfirmModal
        show={showConfirm}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the product variant "${variantToDelete?.product?.ProductName}"?`}
        onConfirm={handleDeleteConfirmed}
        onClose={() => setShowConfirm(false)}
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

export default ProductV2Page;
