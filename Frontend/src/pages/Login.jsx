import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { login } from '../services/authService';
import { PATHS } from '../constants/paths';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await login(username, password);
            window.location.reload(); // reload để xác định lại quyền
        } catch (err) {
            setError(err.message || 'Đăng nhập thất bại');
        }
    };

    return (
        <div className="container py-5 d-flex justify-content-center">
            <div className="card shadow-sm p-4 w-100" style={{ maxWidth: 500 }}>
                <h3 className="mb-4 text-center fw-bold">Đăng nhập</h3>

                {error && (
                    <div className="alert alert-danger text-center py-2">{error}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold">Tên đăng nhập</label>
                        <input
                            type="text"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Nhập tên đăng nhập"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold">Mật khẩu</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nhập mật khẩu"
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100 fw-semibold">
                        Đăng nhập
                    </button>

                    <div className="mt-4 text-center">
                        <span>Chưa có tài khoản? </span>
                        <Link to={PATHS.REGISTER}>Đăng ký</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
