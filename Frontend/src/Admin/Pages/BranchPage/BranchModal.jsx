import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { FaEdit, FaPlus } from 'react-icons/fa';

const BranchModal = ({ show, onClose, onSubmit, initialData }) => {
    const [form, setForm] = useState({
        BranchName: '',
        Address: '',
        City: '',
        Latitude: '',
        Longitude: '',
        Phone: '',
        Email: '',
    });

    useEffect(() => {
        if (initialData) {
            setForm({
                BranchName: initialData.BranchName || '',
                Address: initialData.Address || '',
                City: initialData.City || '',
                Latitude: initialData.Latitude || '',
                Longitude: initialData.Longitude || '',
                Phone: initialData.Phone || '',
                Email: initialData.Email || '',
            });
        } else {
            setForm({
                BranchName: '',
                Address: '',
                City: '',
                Latitude: '',
                Longitude: '',
                Phone: '',
                Email: '',
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(form);
    };

    return (
        <Modal show={show} onHide={onClose} backdrop="static" centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    {initialData ? (
                        <><FaEdit className="me-2 text-primary" /> Sửa chi nhánh</>
                    ) : (
                        <><FaPlus className="me-2 text-success" /> Thêm chi nhánh</>
                    )}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Label>Tên chi nhánh</Form.Label>
                            <Form.Control
                                type="text"
                                name="BranchName"
                                value={form.BranchName}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                        <Col md={6}>
                            <Form.Label>Thành phố</Form.Label>
                            <Form.Control
                                type="text"
                                name="City"
                                value={form.City}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col>
                            <Form.Label>Địa chỉ</Form.Label>
                            <Form.Control
                                type="text"
                                name="Address"
                                value={form.Address}
                                onChange={handleChange}
                                required
                            />
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Label>Latitude</Form.Label>
                            <Form.Control
                                type="number"
                                name="Latitude"
                                value={form.Latitude}
                                onChange={handleChange}
                            />
                        </Col>
                        <Col md={6}>
                            <Form.Label>Longitude</Form.Label>
                            <Form.Control
                                type="number"
                                name="Longitude"
                                value={form.Longitude}
                                onChange={handleChange}
                            />
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Label>Số điện thoại</Form.Label>
                            <Form.Control
                                type="text"
                                name="Phone"
                                value={form.Phone}
                                onChange={handleChange}
                            />
                        </Col>
                        <Col md={6}>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="Email"
                                value={form.Email}
                                onChange={handleChange}
                            />
                        </Col>
                    </Row>

                    <div className="text-end">
                        <Button variant="secondary" onClick={onClose} className="me-2">Huỷ</Button>
                        <Button type="submit" variant="primary">
                            {initialData ? 'Cập nhật' : 'Thêm'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default BranchModal;
