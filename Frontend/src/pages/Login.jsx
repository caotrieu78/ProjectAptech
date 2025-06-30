import React, { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "../services/authService";
import { PATHS } from "../constants/paths";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa"; // Added FaEye and FaEyeSlash

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await login(username, password);
            window.location.reload(); // reload to re-determine permissions
        } catch (err) {
            setError(err.message || "Login failed");
        }
    };

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div
            className="container py-5 d-flex justify-content-center"
            style={{ minHeight: "80vh", alignItems: "center" }}
        >
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');

                    .login-container {
                        background: linear-gradient(135deg, #f0f4f8 0%, #ffffff 100%);
                        min-height: 100vh;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        padding: 2rem 0;
                    }

                    .login-card {
                        background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
                        border-radius: 15px;
                        padding: 2.5rem;
                        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                        border: 1px solid transparent;
                        border-image: linear-gradient(45deg, #1a73e8, #4dabf7) 1;
                        animation: fadeIn 0.5s ease-in-out;
                        max-width: 500px;
                        width: 100%;
                        position: relative;
                        overflow: hidden;
                    }

                    .login-card::before {
                        content: '';
                        position: absolute;
                        top: -50%;
                        left: -50%;
                        width: 200%;
                        height: 200%;
                        background: radial-gradient(circle, rgba(26, 115, 232, 0.1) 0%, transparent 70%);
                        animation: rotate 10s linear infinite;
                        z-index: 0;
                    }

                    .login-card > * {
                        position: relative;
                        z-index: 1;
                    }

                    .login-title {
                        font-size: 2rem;
                        color: #2c3e50;
                        margin-bottom: 2rem;
                        text-align: center;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    }

                    .form-label {
                        font-size: 1.1rem;
                        font-weight: 500;
                        color: #34495e;
                        margin-bottom: 0.75rem;
                        display: block;
                    }

                    .form-control {
                        border: 2px solid #e0e6f0;
                        border-radius: 10px;
                        padding: 1rem 1.5rem;
                        font-size: 1.1rem;
                        background: #ffffff;
                        transition: all 0.3s ease;
                        position: relative;
                        z-index: 1;
                    }

                    .form-control:focus {
                        border-color: #1a73e8;
                        box-shadow: 0 0 12px rgba(26, 115, 232, 0.3);
                        background: #f9fbff;
                    }

                    .input-group {
                        position: relative;
                        margin-bottom: 1.5rem;
                    }

                    .input-icon {
                        position: absolute;
                        left: 1.2rem;
                        top: 50%;
                        transform: translateY(-50%);
                        color: #7f8c8d;
                        font-size: 1.2rem;
                        transition: all 0.3s ease;
                    }

                    .form-control:focus + .input-icon {
                        color: #1a73e8;
                        animation: pulse 0.5s ease;
                    }

                    .toggle-password {
                        position: absolute;
                        right: 1.2rem;
                        top: 50%;
                        transform: translateY(-50%);
                        color: #7f8c8d;
                        font-size: 1.2rem;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        z-index: 2;
                    }

                    .toggle-password:hover {
                        color: #1a73e8;
                    }

                    @keyframes pulse {
                        0% { transform: translateY(-50%) scale(1); }
                        50% { transform: translateY(-50%) scale(1.2); }
                        100% { transform: translateY(-50%) scale(1); }
                    }

                    .btn-primary {
                        background: linear-gradient(90deg, #1a73e8, #4dabf7);
                        border: none;
                        padding: 0.9rem;
                        font-size: 1.1rem;
                        font-weight: 600;
                        border-radius: 10px;
                        box-shadow: 0 4px 15px rgba(26, 115, 232, 0.4);
                        transition: all 0.3s ease;
                    }

                    .btn-primary:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 6px 20px rgba(26, 115, 232, 0.5);
                    }

                    .btn-primary:active {
                        transform: translateY(0);
                        box-shadow: 0 2px 10px rgba(26, 115, 232, 0.3);
                    }

                    .alert-danger {
                        border-radius: 10px;
                        font-size: 1rem;
                        margin-bottom: 1.5rem;
                        background: #ffebee;
                        border: 1px solid #ef5350;
                        color: #c62828;
                    }

                    .register-link {
                        color: #1a73e8;
                        text-decoration: none;
                        font-weight: 500;
                        transition: color 0.3s ease;
                    }

                    .register-link:hover {
                        color: #1565c0;
                        text-decoration: underline;
                    }

                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }

                    @keyframes rotate {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }

                    @media (max-width: 576px) {
                        .login-card {
                            padding: 1.5rem;
                            margin: 0 1rem;
                        }
                        .login-title {
                            font-size: 1.5rem;
                        }
                        .form-control {
                            font-size: 1rem;
                            padding: 0.75rem 1.2rem;
                        }
                        .input-icon {
                            font-size: 1rem;
                            left: 0.8rem;
                        }
                        .toggle-password {
                            font-size: 1rem;
                            right: 0.8rem;
                        }
                        .btn-primary {
                            font-size: 1rem;
                            padding: 0.75rem;
                        }
                    }
                `}
            </style>
            <div className="login-card">
                <h3 className="login-title fw-bold">Login</h3>

                {error && (
                    <div className="alert alert-danger text-center py-2">{error}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            required
                        />
                        <FaUser className="input-icon" size={18} />
                    </div>

                    <div className="input-group mb-4">
                        <input
                            type={showPassword ? "text" : "password"} // Toggle between text and password
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                        />
                        <FaLock className="input-icon" size={18} />
                        <span
                            className="toggle-password"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </span>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 fw-semibold">
                        Login
                    </button>

                    <div className="mt-4 text-center">
                        <span>Don't have an account? </span>
                        <Link to={PATHS.REGISTER} className="register-link">
                            Register
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
