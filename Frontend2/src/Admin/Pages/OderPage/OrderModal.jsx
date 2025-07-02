import React from "react";
import { Modal, Button } from "react-bootstrap";

const OrderModal = ({ show, onHide, order }) => {
  if (!order) return null;

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(value);

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Order Details #{order.OrderID}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-4">
          <h5 className="mb-3">Order Information</h5>
          <div className="row g-3">
            <div className="col-md-6">
              <strong>Customer:</strong>
              <br />
              {order.user?.FullName || order.user?.Username}
            </div>
            <div className="col-md-6">
              <strong>Order Date:</strong>
              <br />
              {new Date(order.OrderDate).toLocaleString()}
            </div>
            <div className="col-md-6">
              <strong>Total Amount:</strong>
              <br />
              {formatCurrency(order.TotalAmount)}
            </div>
            <div className="col-md-6">
              <strong>Payment Method:</strong>
              <br />
              {order.PaymentMethod || "---"}
            </div>
            <div className="col-md-6">
              <strong>Payment Status:</strong>
              <br />
              {order.PaymentStatus || "NOT PAID"}
            </div>
            <div className="col-md-6">
              <strong>Order Status:</strong>
              <br />
              {order.Status}
            </div>
          </div>
        </div>

        <hr />
        <h5 className="mb-3">Product Details</h5>
        {order.details?.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>Image</th>
                  <th>Product</th>
                  <th>Size</th>
                  <th>Color</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {order.details.map((item) => (
                  <tr key={item.OrderDetailID}>
                    <td style={{ width: 80 }}>
                      <img
                        src={item.variant?.ImageURL}
                        alt="image"
                        style={{ width: 60, height: 60, objectFit: "cover" }}
                      />
                    </td>
                    <td>{item.variant?.product?.ProductName || "---"}</td>
                    <td>{item.variant?.size?.SizeName || "---"}</td>
                    <td>{item.variant?.color?.ColorName || "---"}</td>
                    <td>{item.Quantity}</td>
                    <td>{formatCurrency(item.Price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No products in this order.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderModal;
