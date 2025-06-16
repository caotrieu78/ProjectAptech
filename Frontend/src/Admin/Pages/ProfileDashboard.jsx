import React, { useEffect, useState } from 'react';
import UserService from '../../services/userService';
import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';

const ProfileDashboard = () => {
    const [user, setUser] = useState(null);
    const [form, setForm] = useState({ FullName: '', Email: '' });
    const [avatarFile, setAvatarFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            const localUser = localStorage.getItem('user');
            if (localUser) {
                const parsed = JSON.parse(localUser);
                try {
                    const fullUser = await UserService.getById(parsed.UserID);
                    setUser(fullUser);
                    setForm({
                        FullName: fullUser.FullName || '',
                        Email: fullUser.Email || '',
                    });
                    setPreviewUrl(fullUser.Avatar || '');
                } catch (err) {
                    console.error('Lỗi khi tải thông tin người dùng:', err);
                    setUser(parsed);
                    setForm({ FullName: parsed.FullName || '', Email: parsed.Email || '' });
                    setPreviewUrl(parsed.Avatar || '');
                }
            }
        };

        fetchUser();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setAvatarFile(file);
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const formData = new FormData();
        formData.append('FullName', form.FullName);
        formData.append('Email', form.Email);
        if (avatarFile) formData.append('Avatar', avatarFile);

        try {
            const res = await UserService.updateSelf(formData);
            setUser(res.user);
            localStorage.setItem('user', JSON.stringify(res.user));
            setMessage('Cập nhật thông tin thành công!');
        } catch (err) {
            console.error('Lỗi cập nhật hồ sơ:', err);
            setMessage('Đã xảy ra lỗi khi cập nhật.');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <p>Đang tải hồ sơ...</p>;

    return (
        <div className="container py-4">
            <h2 className="mb-4 fw-bold">Thông tin cá nhân</h2>
            <Form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="card shadow-sm p-4">
                    <Row className="mb-4">
                        <Col md={3} className="text-center">
                            <img
                                src={previewUrl || '/images/admin-avatar.png'}
                                alt="avatar"
                                className="rounded-circle mb-3"
                                style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                            />
                            <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
                        </Col>
                        <Col md={9}>
                            <Form.Group className="mb-3">
                                <Form.Label>Họ tên</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="FullName"
                                    value={form.FullName}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="Email"
                                    value={form.Email}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Vai trò</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={user.role?.RoleName || 'Không rõ'}
                                    disabled
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <div className="text-end">
                        <Button type="submit" variant="primary" disabled={loading}>
                            {loading ? <Spinner size="sm" animation="border" /> : 'Lưu thay đổi'}
                        </Button>
                    </div>
                    {message && (
                        <div className="mt-3 alert alert-info mb-0">
                            {message}
                        </div>
                    )}
                </div>
            </Form>
        </div>
    );
};

export default ProfileDashboard;
