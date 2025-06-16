import React, { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ProductVariantService from '../../../services/productVariantService';
import ConfirmModal from '../../../components/ConfirmModal';
import ToastMessage from '../../../components/ToastMessage';
import ProductVariantModal from './ProductVariantModal';
import ImagePreviewModal from '../../Component/ImagePreviewModal';


const ProductV2Page = () => {
    const [variants, setVariants] = useState([]);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [showConfirm, setShowConfirm] = useState(false);
    const [variantToDelete, setVariantToDelete] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editVariant, setEditVariant] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null); // 👁️ modal ảnh
    const navigate = useNavigate();

    const fetchVariants = async () => {
        try {
            const data = await ProductVariantService.getAll();
            setVariants(Array.isArray(data) ? data : []);
        } catch (err) {
            showToast('Lỗi khi tải danh sách biến thể', 'error');
        }
    };

    useEffect(() => {
        fetchVariants();
    }, []);

    const showToast = (message, type = 'success') => {
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
                showToast('Cập nhật biến thể thành công');
            } else {
                await ProductVariantService.create(formData);
                showToast('Thêm biến thể thành công');
            }
            fetchVariants();
            setShowModal(false);
        } catch (err) {
            showToast('Lỗi khi lưu biến thể', 'error');
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
            showToast('Đã xoá biến thể');
        } catch (err) {
            showToast('Lỗi khi xoá biến thể', 'error');
        }
    };

    const formatCurrency = (value) => {
        if (!value) return '0 đ';
        return parseInt(value).toLocaleString('vi-VN') + ' vnđ';
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4 fw-bold">Quản lý biến thể sản phẩm</h2>
            <div className="mb-3 d-flex justify-content-between">
                <div>
                    <button className="btn btn-outline-secondary me-2" onClick={() => navigate('/dashboard/size')}>
                        Kích cỡ
                    </button>
                    <button className="btn btn-outline-secondary" onClick={() => navigate('/dashboard/color')}>
                        Màu sắc
                    </button>
                </div>
                <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleCreate}>
                    <FaPlus /> Thêm biến thể
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Ảnh</th>
                            <th>Sản phẩm</th>
                            <th>Màu</th>
                            <th>Size</th>
                            <th>Giá</th>
                            <th>Tồn kho</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {variants.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center">Không có dữ liệu</td>
                            </tr>
                        ) : (
                            variants.map((variant) => (
                                <tr key={variant.VariantID}>
                                    <td>
                                        <img
                                            src={variant.ImageURL || 'https://via.placeholder.com/80?text=No+Image'}
                                            alt="variant"
                                            width="60"
                                            height="60"
                                            className="img-thumbnail"
                                            style={{ objectFit: 'cover', cursor: 'zoom-in' }}
                                            onClick={() => setSelectedImage(variant.ImageURL)}
                                        />
                                    </td>
                                    <td>{variant.product?.ProductName || 'Không rõ'}</td>
                                    <td>{variant.color?.ColorName || 'Không rõ'}</td>
                                    <td>{variant.size?.SizeName || 'Không rõ'}</td>
                                    <td>{formatCurrency(variant.Price)}</td>
                                    <td>{variant.StockQuantity}</td>
                                    <td className="text-nowrap">
                                        <button
                                            className="btn btn-outline-primary btn-sm me-2"
                                            title="Sửa"
                                            onClick={() => handleEdit(variant)}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() => confirmDelete(variant)}
                                            title="Xoá"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <ProductVariantModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleModalSubmit}
                initialData={editVariant}
            />

            <ConfirmModal
                show={showConfirm}
                title="Xác nhận xoá biến thể"
                message={`Bạn có chắc muốn xoá biến thể sản phẩm "${variantToDelete?.product?.ProductName}"?`}
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
