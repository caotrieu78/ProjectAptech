import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import StatisticsService from "../../../services/StatisticsService";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ReportPage = ({ isSidebarOpen }) => {
  const [overview, setOverview] = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState("");
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [filterMonth, setFilterMonth] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [exportFormat, setExportFormat] = useState("pdf");
  const [exportMonth, setExportMonth] = useState("");
  const [exportYear, setExportYear] = useState(new Date().getFullYear());

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN").format(value) + " đ";

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [overviewData, monthlyData] = await Promise.all([
        StatisticsService.getOverview({
          year: filterYear,
          month: filterMonth || undefined
        }),
        StatisticsService.getMonthly(filterYear)
      ]);
      setOverview(overviewData);
      setMonthly(monthlyData.reverse());
      console.log("Monthly data for chart:", monthlyData); // Debug dữ liệu
    } catch (err) {
      console.error("Error loading statistics:", err);
      setOverview({ totalRevenue: 0, totalOrders: 0, byStatus: [] });
      setMonthly([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    setYear(filterYear);
    setMonth(filterMonth);
    fetchStats();
  };

  const handleExport = () => {
    if (!overview || !monthly.length) {
      alert("No data available to export report.");
      return;
    }

    if (exportFormat === "pdf") {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text("STATISTICS REPORT", 14, 22);

      doc.setFontSize(12);
      doc.text(
        `Year: ${exportYear} ${exportMonth ? `- Month: ${exportMonth}` : ""}`,
        14,
        32
      );
      doc.text(
        `Total Revenue: ${formatCurrency(overview.totalRevenue)}`,
        14,
        42
      );
      doc.text(`Total Orders: ${overview.totalOrders}`, 14, 52);

      autoTable(doc, {
        startY: 62,
        head: [["Status", "Order Count"]],
        body: overview.byStatus.map((item) => [item.Status, item.count])
      });

      autoTable(doc, {
        startY: doc.autoTable.previous.finalY + 10,
        head: [["Month", "Revenue", "Orders"]],
        body: monthly.map((item) => [
          `Month ${item.month}`,
          formatCurrency(item.revenue),
          item.orders
        ])
      });

      doc.save(`Report_${exportYear}_${exportMonth || "FullYear"}.pdf`);
    } else {
      const wsData = [
        ["Month", "Revenue", "Orders"],
        ...monthly.map((item) => [
          `Month ${item.month}`,
          item.revenue,
          item.orders
        ])
      ];

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Report");

      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      saveAs(
        new Blob([wbout], { type: "application/octet-stream" }),
        `Report_${exportYear}_${exportMonth || "FullYear"}.xlsx`
      );
    }

    setShowModal(false);
  };

  return (
    <div
      className="report-page"
      style={{
        marginLeft: isSidebarOpen ? "260px" : "0",
        transition: "margin-left 0.3s ease-in-out",
        width: isSidebarOpen ? "calc(100% - 260px)" : "100%",
        boxSizing: "border-box",
        padding: "20px",
        minHeight: "calc(100vh - 70px)"
      }}
    >
      <style>{`
        * {
          box-sizing: border-box;
        }

        .report-page {
          position: relative;
          z-index: 900;
          background-color: #f0f4f8;
          min-height: calc(100vh - 70px);
        }

        .report-page h2 {
          font-size: 2.5rem; /* Tăng cỡ chữ tiêu đề */
          color: #1e3a8a;
          margin-bottom: 2rem;
          font-weight: 700;
          text-transform: uppercase;
          text-align: center;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .dashboard-card {
          background-color: #ffffff;
          border-radius: 15px; /* Bo góc lớn hơn */
          padding: 2rem;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          margin-bottom: 2.5rem;
          transition: all 0.3s ease;
        }

        .dashboard-card:hover {
          box-shadow: 0 12px 30px rgba(42, 82, 152, 0.2);
          transform: translateY(-5px);
        }

        .stats-card {
          border: none;
          border-radius: 15px;
          padding: 1.5rem;
          background: linear-gradient(135deg, #eef2f7, #ffffff);
          text-align: center;
          transition: all 0.3s ease;
          height: 100%;
        }

        .stats-card:hover {
          background: linear-gradient(135deg, #e0e7ff, #ffffff);
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
          transform: translateY(-5px);
        }

        .stats-card h5 {
          color: #1e3a8a;
          font-size: 1.2rem;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
        }

        .stats-card h3 {
          color: #3b82f6;
          font-size: 1.8rem;
          font-weight: 700;
        }

        .product-table-container {
          display: flex;
          justify-content: center;
          width: 100%;
        }

        .product-table {
          width: 100%;
          max-width: 1200px;
          border-collapse: separate;
          border-spacing: 0;
          border-radius: 15px;
          overflow: hidden;
        }

        .product-table th,
        .product-table td {
          padding: 1.25rem 1.5rem;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
          vertical-align: middle;
        }

        .product-table th {
          background-color: #f1f5f9;
          color: #1e293b;
          font-weight: 600;
        }

        .product-table td {
          background-color: #ffffff;
          transition: all 0.3s ease;
        }

        .product-table tr:hover td {
          background-color: #f1f5f9;
          border-color: #3b82f6;
        }

        .form-control-custom {
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          color: #1e293b;
          transition: all 0.3s ease;
          padding: 0.75rem 1rem;
          background-color: #f9fafb;
          width: 100%;
          font-size: 1rem;
        }

        .form-control-custom:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
          color: #0f172a;
          background-color: #ffffff;
        }

        .btn-custom {
          border-radius: 10px;
          padding: 0.75rem 1.25rem;
          transition: all 0.3s ease;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .btn-custom:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 15px rgba(59, 130, 246, 0.4);
        }

        .btn-primary.btn-custom {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border: none;
          color: #ffffff;
        }

        .btn-primary.btn-custom:hover {
          background: linear-gradient(135deg, #2563eb, #1e40af);
        }

        .btn-outline-secondary.btn-custom {
          color: #64748b;
          border: 2px solid #64748b;
          background-color: transparent;
        }

        .btn-outline-secondary.btn-custom:hover {
          background-color: #64748b;
          color: #ffffff;
          border-color: #475569;
        }

        @media (max-width: 768px) {
          .report-page {
            margin-left: 0;
            padding: 10px;
          }
          .dashboard-card {
            padding: 1rem;
          }
          .stats-card {
            padding: 1rem;
            margin-bottom: 1rem;
          }
          .form-control-custom {
            padding: 0.5rem 0.75rem;
            font-size: 0.9rem;
          }
          .btn-custom {
            padding: 0.5rem 1rem;
          }
          .row {
            flex-direction: column;
          }
          .col-md-4 {
            width: 100%;
          }
        }
      `}</style>
      <h2 className="mb-4 fw-bold">Statistics & Reports</h2>

      <div className="dashboard-card">
        <form className="row g-4 align-items-end mb-4" onSubmit={handleFilter}>
          <div className="col-auto">
            <label className="form-label">Year:</label>
            <select
              className="form-select form-control-custom"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
            >
              {[...Array(5)].map((_, i) => {
                const y = new Date().getFullYear() - i;
                return (
                  <option key={y} value={y}>
                    {y}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="col-auto">
            <label className="form-label">Month:</label>
            <select
              className="form-select form-control-custom"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
            >
              <option value="">-- All --</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{`Month ${i + 1}`}</option>
              ))}
            </select>
          </div>
          <div className="col-auto d-flex gap-3">
            <button className="btn btn-primary btn-custom" type="submit">
              Filter
            </button>
            <button
              className="btn btn-outline-secondary btn-custom"
              type="button"
              onClick={() => setShowModal(true)}
            >
              Export Report
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="dashboard-card">
          <p className="text-center text-muted">Loading statistics data...</p>
        </div>
      ) : overview && overview.totalRevenue >= 0 ? (
        <>
          <div className="dashboard-card">
            <div className="row g-4 mb-4">
              <div className="col-md-4">
                <div className="stats-card">
                  <h5>Total Revenue</h5>
                  <h3>{formatCurrency(overview.totalRevenue)}</h3>
                </div>
              </div>
              <div className="col-md-4">
                <div className="stats-card">
                  <h5>Total Orders</h5>
                  <h3>{overview.totalOrders}</h3>
                </div>
              </div>
              <div className="col-md-4">
                <div className="stats-card">
                  <h5>Order Status</h5>
                  <ul className="mb-0">
                    {overview.byStatus.map((item, idx) => (
                      <li key={idx} className="text-left">
                        {item.Status}:{" "}
                        <span className="fw-bold">{item.count} orders</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <h5 className="mb-3 text-primary">Monthly Revenue Chart</h5>
            {monthly.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={monthly}
                  margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis
                    dataKey="month"
                    stroke="#1e3a8a"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis stroke="#1e3a8a" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "10px",
                      border: "1px solid #e2e8f0",
                      padding: "10px"
                    }}
                    formatter={(value) => formatCurrency(value)}
                  />
                  <Legend
                    wrapperStyle={{ color: "#1e3a8a", fontSize: "14px" }}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="#82ca9d"
                    name="Revenue"
                    barSize={25}
                    radius={[10, 10, 0, 0]}
                  />
                  <Bar
                    dataKey="orders"
                    fill="#8884d8"
                    name="Orders"
                    barSize={25}
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-muted">
                No data available for the chart.
              </p>
            )}
          </div>
        </>
      ) : (
        <div className="dashboard-card">
          <p className="text-center text-muted">
            No data available for this period.
          </p>
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={{ borderBottom: "none" }}>
          <Modal.Title style={{ color: "#1e3a8a", fontWeight: 700 }}>
            Export Report
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "2rem" }}>
          <div className="mb-3">
            <label className="form-label" style={{ color: "#1e3a8a" }}>
              Year:
            </label>
            <select
              className="form-select form-control-custom"
              value={exportYear}
              onChange={(e) => setExportYear(e.target.value)}
            >
              {[...Array(5)].map((_, i) => {
                const y = new Date().getFullYear() - i;
                return (
                  <option key={y} value={y}>
                    {y}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ color: "#1e3a8a" }}>
              Month:
            </label>
            <select
              className="form-select form-control-custom"
              value={exportMonth}
              onChange={(e) => setExportMonth(e.target.value)}
            >
              <option value="">-- All --</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{`Month ${i + 1}`}</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ color: "#1e3a8a" }}>
              File Type:
            </label>
            <select
              className="form-select form-control-custom"
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: "none", justifyContent: "center" }}>
          <Button
            variant="outline-secondary btn-custom"
            onClick={() => setShowModal(false)}
          >
            Close
          </Button>
          <Button variant="primary btn-custom" onClick={handleExport}>
            Export Report
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReportPage;
