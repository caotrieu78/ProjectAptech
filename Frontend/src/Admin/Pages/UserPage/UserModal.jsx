import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { FaEdit, FaPlus } from 'react-icons/fa';

const UserModal = ({ show, onClose, onSubmit, initialData }) => {
    const [form, setForm] = useState({
        FullName: '',
        Email: '',
        IsActive: true,
        RoleID: '',
    });

    const [avatarFile, setAvatarFile] = useState(null);
    const [existingAvatar, setExistingAvatar] = useState('');

    useEffect(() => {
        if (initialData) {
            setForm({
                FullName: initialData.FullName || '',
                Email: initialData.Email || '',
                IsActive: initialData.IsActive ?? true,
                RoleID: initialData.RoleID || '',
            });
            setExistingAvatar(initialData.Avatar || '');
            setAvatarFile(null);
        } else {
            setForm({
                FullName: '',
                Email: '',
                IsActive: true,
                RoleID: '',
            });
            setExistingAvatar('');
            setAvatarFile(null);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setAvatarFile(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('FullName', form.FullName);
        formData.append('Email', form.Email);
        formData.append('IsActive', form.IsActive ? '1' : '0'); // ✅ Fix kiểu boolean
        formData.append('RoleID', form.RoleID);
        if (avatarFile) {
            formData.append('Avatar', avatarFile);
        }
        onSubmit(formData);
    };

    return (
        <Modal show={show} onHide={onClose} backdrop="static" centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    {initialData ? (
                        <><FaEdit className="me-2 text-primary" /> Sửa người dùng</>
                    ) : (
                        <><FaPlus className="me-2 text-success" /> Thêm người dùng</>
                    )}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit} encType="multipart/form-data">
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Label className="fw-bold">Họ tên</Form.Label>
                            <Form.Control
                                type="text"
                                name="FullName"
                                value={form.FullName}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                        <Col md={6}>
                            <Form.Label className="fw-bold">Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="Email"
                                value={form.Email}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Label className="fw-bold">Vai trò (RoleID)</Form.Label>
                            <Form.Control
                                type="number"
                                name="RoleID"
                                value={form.RoleID}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                        <Col md={6} className="d-flex align-items-end">
                            <Form.Check
                                type="checkbox"
                                label="Kích hoạt"
                                name="IsActive"
                                checked={form.IsActive}
                                onChange={handleChange}
                            />
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col>
                            <Form.Label className="fw-bold">Ảnh đại diện (Avatar)</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            {existingAvatar && (
                                <div className="mt-2">
                                    <small>Ảnh hiện tại:</small>
                                    <div>
                                        <img
                                            src={existingAvatar}
                                            alt="avatar"
                                            width="80"
                                            height="80"
                                            className="rounded border"
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                </div>
                            )}
                        </Col>
                    </Row>

                    <div className="text-end mt-3">
                        <Button variant="secondary" onClick={onClose} className="me-2">
                            Huỷ
                        </Button>
                        <Button type="submit" variant="primary">
                            {initialData ? 'Cập nhật' : 'Thêm'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default UserModal;
