import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import StatisticsService from '../../../services/StatisticsService';

const ReportPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await StatisticsService.getAll();
                setStats(data);
            } catch (err) {
                console.error('Lỗi khi tải thống kê:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const formatCurrency = (value) =>
        new Intl.NumberFormat('vi-VN').format(value) + ' đ';

    if (loading) {
        return <p>Đang tải dữ liệu thống kê...</p>;
    }

    if (!stats) {
        return <p>Không có dữ liệu thống kê để hiển thị.</p>;
    }

    return (
        <div className="container py-4">
            <h2 className="mb-4 fw-bold">Thống kê & Báo cáo</h2>

            <div className="row g-4 mb-4">
                <div className="col-md-4">
                    <div className="border rounded p-3 shadow-sm bg-light">
                        <h5>Tổng doanh thu</h5>
                        <h3 className="text-success">{formatCurrency(stats.totalRevenue)}</h3>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="border rounded p-3 shadow-sm bg-light">
                        <h5>Tổng số đơn hàng</h5>
                        <h3>{stats.totalOrders}</h3>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="border rounded p-3 shadow-sm bg-light">
                        <h5>Sản phẩm bán chạy</h5>
                        <ul className="mb-0">
                            {stats.topProducts.map((item, index) => (
                                <li key={index}>
                                    {item.ProductName} ({item.total} đơn)
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="border rounded p-4 shadow-sm bg-white">
                <h5 className="mb-3">Biểu đồ doanh thu theo tháng</h5>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.revenueChart}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="revenue" fill="#82ca9d" name="Doanh thu" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ReportPage;
