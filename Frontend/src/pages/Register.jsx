import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authService';

const Register = () => {
    const [form, setForm] = useState({
        Username: '',
        Password: '',
        ConfirmPassword: '',
        Email: '',
        FullName: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (form.Password !== form.ConfirmPassword) {
            setError('Mật khẩu và xác nhận mật khẩu không khớp.');
            return;
        }

        try {
            await register(form);
            alert('Đăng ký thành công, vui lòng đăng nhập');
            navigate('/login');
        } catch (err) {
            setError(err.message || 'Đăng ký thất bại');
        }
    };

    return (
        <div className="container py-5 d-flex justify-content-center">
            <div className="card shadow-sm p-4 w-100" style={{ maxWidth: 500 }}>
                <h3 className="mb-4 text-center fw-bold">Đăng ký</h3>

                {error && (
                    <div className="alert alert-danger text-center py-2">{error}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Tên đăng nhập</label>
                        <input
                            type="text"
                            name="Username"
                            className="form-control"
                            value={form.Username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Mật khẩu</label>
                        <input
                            type="password"
                            name="Password"
                            className="form-control"
                            value={form.Password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Nhập lại mật khẩu</label>
                        <input
                            type="password"
                            name="ConfirmPassword"
                            className="form-control"
                            value={form.ConfirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-semibold">Email (tùy chọn)</label>
                        <input
                            type="email"
                            name="Email"
                            className="form-control"
                            value={form.Email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold">Họ tên (tùy chọn)</label>
                        <input
                            type="text"
                            name="FullName"
                            className="form-control"
                            value={form.FullName}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="btn btn-success w-100 fw-semibold">
                        Đăng ký
                    </button>

                    <div className="mt-4 text-center">
                        <span>Đã có tài khoản? </span>
                        <Link to="/login">Đăng nhập</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
