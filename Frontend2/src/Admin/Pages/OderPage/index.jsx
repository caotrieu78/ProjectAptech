import React, { useEffect, useState } from "react";
import OrderService from "../../../services/orderService";
import ToastMessage from "../../../components/ToastMessage";
import { FaEye, FaTrash, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import OrderModal from "./OrderModal";

const OrderPage = ({ isSidebarOpen }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success"
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const fetchOrders = async () => {
    try {
      const data = await OrderService.getAllForAdmin();
      setOrders(data);
    } catch (error) {
      showToast("Error loading orders", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(value);

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete order #${id}?`))
      return;
    try {
      await OrderService.remove(id);
      showToast("Order deleted successfully");
      fetchOrders();
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleOpenModal = (order) => {
    setSelectedOrder({ ...order });
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-secondary";
      case "Processing":
        return "bg-info";
      case "Shipped":
        return "bg-success";
      case "Cancelled":
        return "bg-danger";
      case "Success":
        return "bg-success";
      default:
        return "bg-dark";
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  useEffect(() => {
    fetchOrders();
  }, []);

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
      <h2 className="mb-4 fw-bold text-center">
        Order List <span className="text-muted fs-6">(Admin)</span>
      </h2>

      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-bordered">
              <thead className="table-light">
                <tr>
                  <th>
                    <input type="checkbox" className="form-check-input" />
                  </th>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Order Date</th>
                  <th>Status</th>
                  <th>Total Amount</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      Loading orders...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">
                      No data available
                    </td>
                  </tr>
                ) : (
                  currentOrders.map((order) => (
                    <tr key={order.OrderID}>
                      <td>
                        <input type="checkbox" className="form-check-input" />
                      </td>
                      <td>
                        <a href="#!" className="text-primary fw-semibold">
                          #{order.OrderID}
                        </a>
                      </td>
                      <td>{order.user?.FullName || order.user?.Username}</td>
                      <td>
                        {new Date(
                          order.OrderDate ?? order.created_at
                        ).toLocaleString()}
                      </td>
                      <td>
                        <span
                          className={`badge ${getStatusBadgeClass(
                            order.Status
                          )} text-uppercase`}
                        >
                          {order.Status}
                        </span>
                      </td>
                      <td>{formatCurrency(order.TotalAmount)}</td>
                      <td className="text-center">
                        <div className="btn-group" role="group">
                          <button
                            className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                            onClick={() => handleOpenModal(order)}
                            title="View Details"
                          >
                            <FaEye /> View
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
                            onClick={() => handleDelete(order.OrderID)}
                            title="Delete Order"
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
        {orders.length > itemsPerPage && (
          <div className="card-footer d-flex justify-content-center gap-2 py-3">
            <button
              className="btn btn-outline-secondary"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <FaAngleLeft /> Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`btn ${
                  currentPage === page ? "btn-primary" : "btn-outline-secondary"
                } px-3`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="btn btn-outline-secondary"
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

      {selectedOrder && (
        <OrderModal
          show={true}
          onHide={handleCloseModal}
          order={selectedOrder}
        />
      )}

      {toast.show && (
        <ToastMessage
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
};

export default OrderPage;
