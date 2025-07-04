import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { FaEdit, FaPlus } from "react-icons/fa";
import CategoryService from "../../../services/categoryService";

const ProductModal = ({ show, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState({
    ProductName: "",
    Description: "",
    Gender: "Unisex",
    CategoryID: "",
    Price: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState("");

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState(null);

  useEffect(() => {
    if (show) {
      setLoadingCategories(true);
      CategoryService.getAll()
        .then((data) => {
          setCategories(data);
          setCategoryError(null);
        })
        .catch((err) => {
          console.error("Error loading categories:", err);
          setCategoryError("Unable to load categories");
        })
        .finally(() => setLoadingCategories(false));
    }
  }, [show]);

  useEffect(() => {
    if (initialData) {
      setForm({
        ProductName: initialData.ProductName || "",
        Description: initialData.Description || "",
        Gender: initialData.Gender || "Unisex",
        CategoryID: initialData.CategoryID || "",
        Price: initialData.Price || ""
      });
      setExistingImage(initialData.ThumbnailURL || "");
      setImageFile(null);
    } else {
      setForm({
        ProductName: "",
        Description: "",
        Gender: "Unisex",
        CategoryID: ""
      });
      setExistingImage("");
      setImageFile(null);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("ProductName", form.ProductName);
    formData.append("Description", form.Description);
    formData.append("Gender", form.Gender);
    formData.append("CategoryID", form.CategoryID);
    formData.append("Price", form.Price);
    if (imageFile) {
      formData.append("Thumbnail", imageFile);
    }
    onSubmit(formData);
  };

  return (
    <Modal show={show} onHide={onClose} backdrop="static" centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {initialData ? (
            <>
              <FaEdit className="me-2 text-primary" /> Edit Product
            </>
          ) : (
            <>
              <FaPlus className="me-2 text-success" /> Add Product
            </>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
          <Row className="mb-3">
            <Col md={6}>
              <Form.Label className="fw-bold text-dark">
                Product Name
              </Form.Label>
              <Form.Control
                type="text"
                name="ProductName"
                value={form.ProductName}
                onChange={handleChange}
                required
              />
            </Col>
            <Col md={6}>
              <Form.Label className="fw-bold text-dark">Gender</Form.Label>
              <Form.Select
                name="Gender"
                value={form.Gender}
                onChange={handleChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Unisex">Unisex</option>
              </Form.Select>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Label className="fw-bold text-dark">Category</Form.Label>
              {loadingCategories ? (
                <div className="d-flex align-items-center">
                  <Spinner animation="border" size="sm" className="me-2" />
                  <span>Loading categories...</span>
                </div>
              ) : categoryError ? (
                <div className="text-danger">{categoryError}</div>
              ) : (
                <Form.Select
                  name="CategoryID"
                  value={form.CategoryID}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Form.Select>
              )}
            </Col>
            <Col md={6}>
              <Form.Label className="fw-bold text-dark">
                Product Image
              </Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {existingImage && (
                <div className="mt-2">
                  <small>Current Image:</small>
                  <div>
                    <img
                      src={existingImage}
                      alt="thumbnail"
                      width="100"
                      className="rounded border"
                    />
                  </div>
                </div>
              )}
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Label className="fw-bold text-dark">Price (USD)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                step="0.01"
                name="Price"
                value={form.Price}
                onChange={handleChange}
                placeholder="Enter product price"
                required
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Label className="fw-bold text-dark">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="Description"
                value={form.Description}
                onChange={handleChange}
              />
            </Col>
          </Row>

          <div className="text-end mt-4">
            <Button variant="secondary" onClick={onClose} className="me-2">
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {initialData ? "Update" : "Add"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
export default ProductModal;
