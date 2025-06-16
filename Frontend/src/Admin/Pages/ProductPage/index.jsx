import React, { useEffect, useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

import ConfirmModal from '../../../components/ConfirmModal';
import ToastMessage from '../../../components/ToastMessage';
import ProductModal from './ProductModal';
import ImagePreviewModal from '../../Component/ImagePreviewModal';
import ProductService from '../../../services/ProductService';


const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const [showConfirm, setShowConfirm] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);

    const [selectedImage, setSelectedImage] = useState(null); // 👁️ ảnh được chọn

    const fetchProducts = async () => {
        try {
            const data = await ProductService.getAll();
            setProducts(data);
        } catch (err) {
            showToast('❌ Lỗi khi tải sản phẩm', 'error');
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const showToast = (message, type = 'success') => {
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
                showToast('Cập nhật sản phẩm thành công');
            } else {
                await ProductService.create(formData);
                showToast('Thêm sản phẩm thành công');
            }
            setShowModal(false);
            fetchProducts();
        } catch (err) {
            showToast('Lỗi khi lưu sản phẩm', 'error');
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
            showToast('Đã xoá sản phẩm');
        } catch (err) {
            showToast('Lỗi khi xoá sản phẩm', 'error');
        }
    };

    const handleImageClick = (url) => {
        setSelectedImage(url);
    };

    return (
        <div className="container py-4">
            <h2 className="mb-4 fw-bold">Quản lý sản phẩm</h2>
            <div className="mb-3 text-end">
                <button className="btn btn-primary d-flex align-items-center gap-2" onClick={handleCreate}>
                    <FaPlus /> Thêm sản phẩm
                </button>
            </div>

            <ul className="list-group shadow-sm">
                {products.map((prod) => (
                    <li
                        key={prod.ProductID}
                        className="list-group-item d-flex justify-content-between align-items-center flex-wrap p-3"
                    >
                        <div className="d-flex align-items-center gap-3 flex-grow-1">
                            <img
                                src={prod.ThumbnailURL || 'https://via.placeholder.com/80?text=No+Image'}
                                alt={prod.ProductName || 'Sản phẩm'}
                                width="80"
                                height="80"
                                className="img-thumbnail"
                                style={{ objectFit: 'cover', cursor: 'zoom-in' }}
                                onClick={() => handleImageClick(prod.ThumbnailURL)}
                            />

                            <div>
                                <h5 className="mb-1 fw-bold text-primary">
                                    {prod.ProductName || '(Chưa có tên sản phẩm)'}
                                </h5>
                                {prod.Description && (
                                    <p className="mb-1 text-muted">{prod.Description}</p>
                                )}
                                <small>
                                    <strong>Giới tính:</strong> {prod.Gender || 'Không rõ'}{' '}
                                    | <strong>Danh mục:</strong> {prod.category?.CategoryName || 'Không có'}
                                </small>
                            </div>
                        </div>

                        <div className="d-flex gap-2 mt-2 mt-md-0">
                            <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => handleEdit(prod)}
                                title="Sửa"
                            >
                                <FaEdit />
                            </button>
                            <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => confirmDelete(prod)}
                                title="Xoá"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Modal xác nhận xoá */}
            <ConfirmModal
                show={showConfirm}
                title="Xác nhận xoá sản phẩm"
                message={`Bạn có chắc chắn muốn xoá "${productToDelete?.ProductName}"?`}
                onConfirm={handleDeleteConfirmed}
                onClose={() => setShowConfirm(false)}
            />

            {/* Modal thêm / sửa sản phẩm */}
            <ProductModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleModalSubmit}
                initialData={editProduct}
            />

            {/* Toast thông báo */}
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
