import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/authService";
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaUserCircle,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";
import ToastMessage from "../components/ToastMessage";

const Register = () => {
  const [form, setForm] = useState({
    Username: "",
    Password: "",
    ConfirmPassword: "",
    Email: "",
    FullName: ""
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success"
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (form.Password !== form.ConfirmPassword) {
      setError("Password and confirm password do not match.");
      setIsLoading(false);
      return;
    }

    try {
      await register(form);
      setToast({
        show: true,
        message: "Registration successful, redirecting to login...",
        type: "success"
      });
      setTimeout(() => {
        navigate("/login");
      }, 3000); // Redirect after 3 seconds
    } catch (err) {
      setError(err.message || "Registration failed");
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div
      className="container py-5 d-flex justify-content-center"
      style={{ minHeight: "80vh", alignItems: "center" }}
    >
      <div className="register-card">
        <h3 className="register-title fw-bold">Register</h3>

        {error && (
          <div className="alert alert-danger text-center py-2">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group mb-3">
            <input
              type="text"
              name="Username"
              className="form-control"
              value={form.Username}
              onChange={handleChange}
              placeholder="Enter username"
              required
            />
            <FaUser className="input-icon" size={18} />
          </div>

          <div className="input-group mb-3">
            <input
              type={showPassword ? "text" : "password"}
              name="Password"
              className="form-control"
              value={form.Password}
              onChange={handleChange}
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

          <div className="input-group mb-3">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="ConfirmPassword"
              className="form-control"
              value={form.ConfirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              required
            />
            <FaLock className="input-icon" size={18} />
            <span
              className="toggle-password"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? (
                <FaEyeSlash size={18} />
              ) : (
                <FaEye size={18} />
              )}
            </span>
          </div>

          <div className="input-group mb-3">
            <input
              type="email"
              name="Email"
              className="form-control"
              value={form.Email}
              onChange={handleChange}
              placeholder="Enter email (optional)"
            />
            <FaEnvelope className="input-icon" size={18} />
          </div>

          <div className="input-group mb-4">
            <input
              type="text"
              name="FullName"
              className="form-control"
              value={form.FullName}
              onChange={handleChange}
              placeholder="Enter full name (optional)"
            />
            <FaUserCircle className="input-icon" size={18} />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 fw-semibold"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading-container">
                <span className="spinner"></span>
                Registering...
              </span>
            ) : (
              "Register"
            )}
          </button>

          <div className="mt-4 text-center">
            <span>Already have an account? </span>
            <Link to="/login" className="login-link">
              Login
            </Link>
          </div>
        </form>

        {toast.show && (
          <ToastMessage
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ ...toast, show: false })}
          />
        )}
      </div>
    </div>
  );
};

export default Register;
