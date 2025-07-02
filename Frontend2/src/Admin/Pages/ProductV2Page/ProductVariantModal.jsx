import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { FaEdit, FaPlus } from "react-icons/fa";

import SizeService from "../../../services/sizeService";
import ColorService from "../../../services/colorService";
import ProductService from "../../../services/ProductService";

const ProductVariantModal = ({ show, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState({
    ProductID: "",
    SizeID: "",
    ColorID: "",
    Price: "",
    StockQuantity: ""
  });

  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState("");

  const [products, setProducts] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, s, c] = await Promise.all([
          ProductService.getAll(),
          SizeService.getAll(),
          ColorService.getAll()
        ]);
        setProducts(p);
        setSizes(s);
        setColors(c);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (show) fetchData();
  }, [show]);

  useEffect(() => {
    if (initialData) {
      setForm({
        ProductID: initialData.ProductID || "",
        SizeID: initialData.SizeID || "",
        ColorID: initialData.ColorID || "",
        Price: initialData.Price || "",
        StockQuantity: initialData.StockQuantity || ""
      });
      setExistingImage(initialData.ImageURL || "");
      setImageFile(null);
    } else {
      setForm({
        ProductID: "",
        SizeID: "",
        ColorID: "",
        Price: "",
        StockQuantity: ""
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
    formData.append("ProductID", form.ProductID);
    formData.append("SizeID", form.SizeID);
    formData.append("ColorID", form.ColorID);
    formData.append("Price", form.Price);
    formData.append("StockQuantity", form.StockQuantity);

    if (imageFile) {
      formData.append("Image", imageFile);
    }

    onSubmit(formData);
  };

  return (
    <Modal show={show} onHide={onClose} backdrop="static" centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {initialData ? (
            <>
              <FaEdit className="me-2 text-primary" /> Edit Variant
            </>
          ) : (
            <>
              <FaPlus className="me-2 text-success" /> Add Variant
            </>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" /> Loading data...
          </div>
        ) : (
          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <Row className="mb-3">
              <Col md={6}>
                <Form.Label className="fw-bold">Product</Form.Label>
                <Form.Select
                  name="ProductID"
                  value={form.ProductID}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Product --</option>
                  {products.map((p) => (
                    <option key={p.ProductID} value={p.ProductID}>
                      {p.ProductName}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Label className="fw-bold">Size</Form.Label>
                <Form.Select
                  name="SizeID"
                  value={form.SizeID}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Size --</option>
                  {sizes.map((s) => (
                    <option key={s.SizeID} value={s.SizeID}>
                      {s.SizeName}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={3}>
                <Form.Label className="fw-bold">Color</Form.Label>
                <Form.Select
                  name="ColorID"
                  value={form.ColorID}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Color --</option>
                  {colors.map((c) => (
                    <option key={c.ColorID} value={c.ColorID}>
                      {c.ColorName}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Label className="fw-bold">Price</Form.Label>
                <Form.Control
                  type="number"
                  name="Price"
                  value={form.Price}
                  onChange={handleChange}
                  required
                />
              </Col>
              <Col md={6}>
                <Form.Label className="fw-bold">Stock Quantity</Form.Label>
                <Form.Control
                  type="number"
                  name="StockQuantity"
                  value={form.StockQuantity}
                  onChange={handleChange}
                  required
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Label className="fw-bold">Variant Image</Form.Label>
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
                        alt="preview"
                        width="100"
                        className="rounded border"
                      />
                    </div>
                  </div>
                )}
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
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ProductVariantModal;
