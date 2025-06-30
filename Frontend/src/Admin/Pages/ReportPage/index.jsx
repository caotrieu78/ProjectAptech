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

const ReportPage = () => {
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
        } catch (err) {
            console.error("Lỗi khi tải thống kê:", err);
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
            alert("Chưa có dữ liệu để xuất báo cáo.");
            return;
        }

        if (exportFormat === "pdf") {
            const doc = new jsPDF();
            doc.setFontSize(16);
            doc.text("BÁO CÁO THỐNG KÊ", 14, 20);

            doc.setFontSize(12);
            doc.text(
                `Năm: ${exportYear} ${exportMonth ? `- Tháng: ${exportMonth}` : ""}`,
                14,
                30
            );
            doc.text(
                `Tổng doanh thu: ${formatCurrency(overview.totalRevenue)}`,
                14,
                40
            );
            doc.text(`Tổng đơn hàng: ${overview.totalOrders}`, 14, 50);

            autoTable(doc, {
                startY: 60,
                head: [["Trạng thái", "Số lượng đơn"]],
                body: overview.byStatus.map((item) => [item.Status, item.count])
            });

            autoTable(doc, {
                startY: doc.autoTable.previous.finalY + 10,
                head: [["Tháng", "Doanh thu", "Số đơn"]],
                body: monthly.map((item) => [
                    `Tháng ${item.month}`,
                    formatCurrency(item.revenue),
                    item.orders
                ])
            });

            doc.save(`BaoCao_${exportYear}_${exportMonth || "CaNam"}.pdf`);
        } else {
            const wsData = [
                ["Tháng", "Doanh thu", "Số đơn"],
                ...monthly.map((item) => [
                    `Tháng ${item.month}`,
                    item.revenue,
                    item.orders
                ])
            ];

            const ws = XLSX.utils.aoa_to_sheet(wsData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "BaoCao");

            const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
            saveAs(
                new Blob([wbout], { type: "application/octet-stream" }),
                `BaoCao_${exportYear}_${exportMonth || "CaNam"}.xlsx`
            );
        }

        setShowModal(false);
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4 fw-bold">Thống kê & Báo cáo</h2>

            <form className="row g-3 align-items-end mb-4" onSubmit={handleFilter}>
                <div className="col-auto">
                    <label className="form-label">Năm:</label>
                    <select
                        className="form-select"
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
                    <label className="form-label">Tháng:</label>
                    <select
                        className="form-select"
                        value={filterMonth}
                        onChange={(e) => setFilterMonth(e.target.value)}
                    >
                        <option value="">-- Tất cả --</option>
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>{`Tháng ${i + 1}`}</option>
                        ))}
                    </select>
                </div>
                <div className="col-auto d-flex gap-2">
                    <button className="btn btn-primary" type="submit">
                        Lọc
                    </button>
                    <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setShowModal(true)}
                    >
                        Xuất báo cáo
                    </button>
                </div>
            </form>

            {loading ? (
                <p>Đang tải dữ liệu thống kê...</p>
            ) : overview && overview.totalRevenue >= 0 ? (
                <>
                    <div className="row g-4 mb-4">
                        <div className="col-md-4">
                            <div className="border rounded p-3 shadow-sm bg-light">
                                <h5>Tổng doanh thu</h5>
                                <h3 className="text-success">
                                    {formatCurrency(overview.totalRevenue)}
                                </h3>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="border rounded p-3 shadow-sm bg-light">
                                <h5>Tổng số đơn hàng</h5>
                                <h3>{overview.totalOrders}</h3>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="border rounded p-3 shadow-sm bg-light">
                                <h5>Trạng thái đơn hàng</h5>
                                <ul className="mb-0">
                                    {overview.byStatus.map((item, idx) => (
                                        <li key={idx}>
                                            {item.Status}: {item.count} đơn
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="border rounded p-4 shadow-sm bg-white">
                        <h5 className="mb-3">Biểu đồ doanh thu theo tháng</h5>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={monthly}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                                <Legend />
                                <Bar dataKey="revenue" fill="#82ca9d" name="Doanh thu" />
                                <Bar dataKey="orders" fill="#8884d8" name="Số đơn" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </>
            ) : (
                <p>Chưa có dữ liệu cho thời gian này.</p>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xuất báo cáo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label className="form-label">Năm:</label>
                        <select
                            className="form-select"
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
                        <label className="form-label">Tháng:</label>
                        <select
                            className="form-select"
                            value={exportMonth}
                            onChange={(e) => setExportMonth(e.target.value)}
                        >
                            <option value="">-- Cả năm --</option>
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i + 1} value={i + 1}>{`Tháng ${i + 1}`}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Loại tệp:</label>
                        <select
                            className="form-select"
                            value={exportFormat}
                            onChange={(e) => setExportFormat(e.target.value)}
                        >
                            <option value="pdf">PDF</option>
                            <option value="excel">Excel</option>
                        </select>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleExport}>
                        Xuất báo cáo
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ReportPage;
