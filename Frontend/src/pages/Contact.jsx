// Contact.js
import React, { useState, useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { ToastContainer, toast } from "react-toastify";
import { TypeAnimation } from "react-type-animation";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import BranchService from "../services/BranchService";
import FeedbackService from "../services/FeedbackService";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

// Custom marker icons
const mainOfficeIcon = new L.Icon({
    iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    iconRetinaUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const branchIcon = new L.Icon({
    iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
    iconRetinaUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


const tickerMessages = [
    "Chào mừng bạn đến với trang liên hệ của chúng tôi!",
    "Hỗ trợ 24/7, liên hệ ngay để được tư vấn!",
    "Khám phá các chi nhánh của chúng tôi tại TP.HCM!"
];

const calculateTimeLeft = () => {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    const diff = endOfDay - now;
    return {
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60)
    };
};

const Contact = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isTickerPaused, setIsTickerPaused] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    const [branches, setBranches] = useState([]);
    const mapRef = useRef(null);

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const data = await BranchService.getAll();
                setBranches(data);
            } catch (error) {
                toast.error("Không thể tải danh sách chi nhánh");
            }
        };
        fetchBranches();
    }, []);

    useEffect(() => {
        const savedData = localStorage.getItem("contactFormData");
        if (savedData) setFormData(JSON.parse(savedData));
    }, []);

    useEffect(() => {
        localStorage.setItem("contactFormData", JSON.stringify(formData));
    }, [formData]);

    useEffect(() => {
        if (!isTickerPaused) {
            const timer = setInterval(() => {
                setCurrentTime(new Date());
                setTimeLeft(calculateTimeLeft());
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isTickerPaused]);

    useEffect(() => {
        const hero = document.querySelector(".hero-section");
        const handleScroll = () => {
            if (hero) {
                const scrollPosition = window.pageYOffset;
                hero.style.backgroundPositionY = `${scrollPosition * 0.3}px`;
            }
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const validateForm = () => {
        const errors = {};
        if (!formData.name) errors.name = "Vui lòng nhập họ tên";
        if (!formData.email) errors.email = "Vui lòng nhập email";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            errors.email = "Email không hợp lệ";
        if (!formData.message) errors.message = "Vui lòng nhập nội dung";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setFormErrors({ ...formErrors, [e.target.name]: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);
        try {
            const payload = {
                Name: formData.name,
                Email: formData.email,
                Message: formData.message
            };
            await FeedbackService.create(payload);
            toast.success("Gửi phản hồi thành công!");
            setFormData({ name: "", email: "", message: "" });
            localStorage.removeItem("contactFormData");
            setFormErrors({});
        } catch (error) {
            toast.error(error.message || "Có lỗi xảy ra, vui lòng thử lại!");
        } finally {
            setIsSubmitting(false);
        }
    };

    const copyAddress = (address) => {
        navigator.clipboard.writeText(address);
        toast.success("Đã sao chép địa chỉ!");
    };

    const toggleTicker = () => setIsTickerPaused(!isTickerPaused);

    const handleBranchClick = (position, name) => {
        setSelectedLocation(position);
        setSelectedBranch(name);
        const map = mapRef.current;
        if (map) {
            map.flyTo(position, 16, { animate: true, duration: 1 });
            toast.info(`Đã chuyển bản đồ đến ${name}`, { autoClose: 2000 });
        }
    };

    const handleFeedbackFromLocation = (position, name) => {
        const locationInfo = `Phản hồi từ ${name} (Lat: ${position.lat}, Lng: ${position.lng})`;
        setFormData((prev) => ({
            ...prev,
            message: `${locationInfo}\n${prev.message}`
        }));
        toast.info(`Đã thêm thông tin địa điểm vào phản hồi: ${name}`, {
            autoClose: 2000
        });
    };

    const mapComponent = useMemo(() => (
        <MapContainer
            center={{ lat: 10.775, lng: 106.7 }} // vị trí mặc định
            zoom={14}
            style={{ height: "750px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
            ref={mapRef}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />

            {/* Marker Văn Phòng Chính cố định */}
            <Marker position={{ lat: 10.776, lng: 106.698 }} icon={mainOfficeIcon}>
                <Popup>
                    Văn Phòng Chính
                    <br />
                    <button
                        className="btn btn-primary btn-sm mt-2 w-100"
                        onClick={() =>
                            handleFeedbackFromLocation({ lat: 10.776, lng: 106.698 }, "Văn Phòng Chính")
                        }
                    >
                        Gửi Phản Hồi Từ Địa Điểm Này
                    </button>
                </Popup>
            </Marker>
            {/* Các chi nhánh khác từ API */}
            {branches.map((branch, index) => (
                <Marker
                    key={index}
                    position={{ lat: branch.Latitude, lng: branch.Longitude }}
                    icon={branchIcon}
                >
                    <Popup>
                        {branch.BranchName}
                        <br />
                        <button
                            className="btn btn-primary btn-sm mt-2 w-100"
                            onClick={() =>
                                handleFeedbackFromLocation(
                                    { lat: branch.Latitude, lng: branch.Longitude },
                                    branch.BranchName
                                )
                            }
                        >
                            Gửi Phản Hồi Từ Địa Điểm Này
                        </button>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    ), [branches, selectedBranch]);

    return (
        <div style={{ fontFamily: "'Roboto', sans-serif", backgroundColor: "#F3F4F6" }}>

            {/* Promotion Banner */}
            <div
                className="text-center text-white py-3"
                style={{
                    backgroundColor: "#28A745",
                    position: "relative",
                    zIndex: 1000
                }}
            >
                <p className="mb-0">
                    🎉 Ưu đãi đặc biệt: Giảm 15% cho đơn hàng hôm nay! ⏳ Còn{" "}
                    {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
                </p>
                <button
                    className="btn btn-light btn-sm mt-1"
                    onClick={() =>
                        setFormData((prev) => ({
                            ...prev,
                            message: "Tôi muốn đặt hàng với ưu đãi 15%!\n" + prev.message
                        }))
                    }
                >
                    Nhận ưu đãi ngay
                </button>
            </div>

            {/* Hero Section */}
            <div
                className="hero-section text-center text-white py-5"
                style={{
                    background: `linear-gradient(rgba(30, 58, 138, 0.6), rgba(30, 58, 138, 0.6)), url(https://images.unsplash.com/photo-1497366216548-37526070297c)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    minHeight: "280px",
                    position: "relative",
                    zIndex: 0
                }}
            >
                <h1 className="display-5 fw-bold mb-3">
                    <TypeAnimation
                        sequence={[
                            "Liên Hệ Với Chúng Tôi",
                            2000,
                            "Kết Nối Ngay Hôm Nay!",
                            2000,
                            "Hỗ Trợ 24/7!",
                            2000
                        ]}
                        wrapper="span"
                        speed={50}
                        repeat={Infinity}
                    />
                </h1>
                <p className="lead">
                    Chúng tôi luôn sẵn sàng hỗ trợ bạn với dịch vụ chuyên nghiệp!
                </p>
                <p className="text-warning">
                    Đội ngũ hỗ trợ đang trực tuyến - Gọi ngay +84 912 345 678!
                </p>
            </div>
            <div className="container py-5">
                <div className="row g-4">
                    {/* Cột bên trái: Thông tin công ty và bản đồ */}
                    <div className="col-lg-6">
                        {/* ... phần hiển thị thông tin công ty như cũ ... */}
                        {mapComponent}
                    </div>

                    {/* Cột bên phải: Chi nhánh và form phản hồi */}
                    <div className="col-lg-6">
                        <h3 className="text-primary mb-3">Chi Nhánh</h3>
                        <div className="card border-0 shadow-sm p-4 mb-4">
                            <div className="mb-3">

                                {branches.map((branch, index) => (
                                    <button
                                        key={index}
                                        className="btn btn-primary me-2 mb-2"
                                        onClick={() => handleBranchClick(
                                            { lat: branch.Latitude, lng: branch.Longitude },
                                            branch.BranchName
                                        )}
                                    >
                                        {branch.BranchName}
                                    </button>
                                ))}
                            </div>

                            <div className="accordion" id="branchesAccordion">
                                {branches.map((branch, index) => (
                                    <div key={index} className="accordion-item border-0 shadow-sm mb-2">
                                        <h2 className="accordion-header" id={`heading${index}`}>
                                            <button
                                                className="accordion-button collapsed text-primary"
                                                type="button"
                                                data-bs-toggle="collapse"
                                                data-bs-target={`#collapse${index}`}
                                                aria-expanded="false"
                                                aria-controls={`collapse${index}`}
                                            >
                                                {branch.BranchName}
                                            </button>
                                        </h2>
                                        <div
                                            id={`collapse${index}`}
                                            className="accordion-collapse collapse"
                                            aria-labelledby={`heading${index}`}
                                            data-bs-parent="#branchesAccordion"
                                        >
                                            <div className="accordion-body">
                                                <p className="mb-2 d-flex align-items-center">
                                                    <i className="fas fa-map-marker-alt text-primary me-2"></i>
                                                    {branch.Address}, {branch.City}
                                                    <button
                                                        className="btn btn-link text-primary p-0 ms-2"
                                                        onClick={() => copyAddress(`${branch.Address}, ${branch.City}`)}
                                                    >
                                                        <i className="fas fa-copy"></i>
                                                    </button>
                                                </p>
                                                <a
                                                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${branch.Address}, ${branch.City}`)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-outline-primary btn-sm"
                                                >
                                                    Tìm Đường
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Form phản hồi */}
                        <h3 className="text-primary mt-4 mb-3">Gửi Phản Hồi</h3>
                        <form onSubmit={handleSubmit} className="card border-0 shadow-sm p-4">
                            <div className="mb-3">
                                <label className="form-label text-primary">Họ Tên</label>
                                <input
                                    type="text"
                                    className={`form-control ${formErrors.name ? "is-invalid" : ""}`}
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                                {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-primary">Email</label>
                                <input
                                    type="email"
                                    className={`form-control ${formErrors.email ? "is-invalid" : ""}`}
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                                {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-primary">Nội Dung</label>
                                <textarea
                                    rows="4"
                                    className={`form-control ${formErrors.message ? "is-invalid" : ""}`}
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                ></textarea>
                                {formErrors.message && <div className="invalid-feedback">{formErrors.message}</div>}
                            </div>
                            <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                                {isSubmitting ? "Đang gửi..." : "Gửi Phản Hồi"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Footer, Ticker và Toast giữ nguyên như cũ */}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </div>
    );
};
export default Contact;
