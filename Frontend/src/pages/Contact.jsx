import React, {
    useState,
    useEffect,
    useMemo,
    useCallback,
    useRef
} from "react";
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
import "bootstrap/dist/js/bootstrap.bundle.min.js";

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

const companyAddress = {
    name: "Main Office",
    address: "123 ABC Street, District 1, Ho Chi Minh City, Vietnam",
    position: { lat: 10.776, lng: 106.698 }
};

const tickerMessages = [
    "Welcome to our contact page!",
    "24/7 support, contact us now for assistance!",
    "Explore our branches in Ho Chi Minh City!"
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

    // Fetch branches
    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const data = await BranchService.getAll();
                setBranches(Array.isArray(data) ? data : []);
            } catch (error) {
                toast.error("Unable to load branch list");
                console.error("Branch fetch error:", error);
            }
        };
        fetchBranches();
    }, []);

    // Load form data from localStorage
    useEffect(() => {
        const savedData = localStorage.getItem("contactFormData");
        if (savedData) {
            try {
                setFormData(JSON.parse(savedData));
            } catch (error) {
                console.error("Error parsing localStorage data:", error);
            }
        }
    }, []);

    // Save form data to localStorage
    useEffect(() => {
        try {
            localStorage.setItem("contactFormData", JSON.stringify(formData));
        } catch (error) {
            console.error("Error saving to localStorage:", error);
        }
    }, [formData]);

    // Update time and countdown
    useEffect(() => {
        if (!isTickerPaused) {
            const timer = setInterval(() => {
                setCurrentTime(new Date());
                setTimeLeft(calculateTimeLeft());
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isTickerPaused]);

    // Parallax effect for hero section
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

    const validateForm = useCallback(() => {
        const errors = {};
        if (!formData.name) errors.name = "Please enter your name";
        if (!formData.email) errors.email = "Please enter your email";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            errors.email = "Invalid email format";
        if (!formData.message) errors.message = "Please enter your message";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }, [formData]);

    const handleInputChange = useCallback((e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setFormErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }, []);

    const handleSubmit = useCallback(
        async (e) => {
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
                toast.success("Feedback sent successfully!");
                setFormData({ name: "", email: "", message: "" });
                localStorage.removeItem("contactFormData");
                setFormErrors({});
            } catch (error) {
                toast.error(error.message || "An error occurred, please try again!");
            } finally {
                setIsSubmitting(false);
            }
        },
        [formData, validateForm]
    );

    const copyAddress = useCallback((address) => {
        navigator.clipboard.writeText(address);
        toast.success("Address copied successfully!");
    }, []);

    const toggleTicker = useCallback(
        () => setIsTickerPaused((prev) => !prev),
        []
    );

    const handleBranchClick = useCallback((position, name) => {
        setSelectedLocation(position);
        setSelectedBranch(name);
        const map = mapRef.current;
        if (map) {
            map.flyTo(position, 16, { animate: true, duration: 1 });
            toast.info(`Map moved to ${name}`, { autoClose: 2000 });
        }
    }, []);

    const handleFeedbackFromLocation = useCallback((position, name) => {
        const locationInfo = `Feedback from ${name} (Lat: ${position.lat}, Lon: ${position.lng})`;
        setFormData((prev) => ({
            ...prev,
            message: `${locationInfo}\n${prev.message}`
        }));
        toast.info(`Location info added to feedback: ${name}`, { autoClose: 2000 });
    }, []);

    const mapComponent = useMemo(
        () => (
            <MapContainer
                center={companyAddress.position}
                zoom={14}
                style={{
                    height: "750px",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
                }}
                ref={mapRef}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                <Marker
                    position={companyAddress.position}
                    icon={
                        selectedBranch === companyAddress.name ? mainOfficeIcon : branchIcon
                    }
                >
                    <Popup>
                        {companyAddress.name}
                        <br />
                        <button
                            className="btn btn-primary btn-sm mt-2 w-100"
                            onClick={() =>
                                handleFeedbackFromLocation(
                                    companyAddress.position,
                                    companyAddress.name
                                )
                            }
                        >
                            Send Feedback From This Location
                        </button>
                    </Popup>
                </Marker>
                {branches.map((branch, index) => (
                    <Marker
                        key={index}
                        position={{ lat: branch.Latitude, lng: branch.Longitude }}
                        icon={
                            selectedBranch === branch.BranchName ? mainOfficeIcon : branchIcon
                        }
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
                                Send Feedback From This Location
                            </button>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        ),
        [branches, selectedBranch, handleFeedbackFromLocation]
    );

    const formatDateTime = useCallback(() => {
        return currentTime.toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    }, [currentTime]);

    return (
        <div
            style={{ fontFamily: "'Roboto', sans-serif", backgroundColor: "#F3F4F6" }}
        >
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
                    🎉 Special Offer: 15% off today’s orders! ⏳ {timeLeft.hours}h{" "}
                    {timeLeft.minutes}m {timeLeft.seconds}s left
                </p>
                <button
                    className="btn btn-light btn-sm mt-1"
                    onClick={() =>
                        setFormData((prev) => ({
                            ...prev,
                            message: "I want to order with the 15% discount!\n" + prev.message
                        }))
                    }
                >
                    Claim Offer Now
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
                            "Contact Us",
                            2000,
                            "Connect Today!",
                            2000,
                            "24/7 Support!",
                            2000
                        ]}
                        wrapper="span"
                        speed={50}
                        repeat={Infinity}
                    />
                </h1>
                <p className="lead">
                    We're always ready to assist you with professional service!
                </p>
                <p className="text-warning">
                    Our support team is online - Call now +84 912 345 678!
                </p>
            </div>

            <div className="container py-5">
                <div className="row g-4">
                    {/* Left Column: Company Info and Map */}
                    <div className="col-lg-6">{mapComponent}</div>

                    {/* Right Column: Branches and Feedback Form */}
                    <div className="col-lg-6">
                        <h3 className="text-primary mb-3">Branches</h3>
                        <div className="card border-0 shadow-sm p-4 mb-4">
                            <div className="mb-3">
                                {branches.map((branch, index) => (
                                    <button
                                        key={index}
                                        className="btn btn-primary me-2 mb-2"
                                        onClick={() =>
                                            handleBranchClick(
                                                { lat: branch.Latitude, lng: branch.Longitude },
                                                branch.BranchName
                                            )
                                        }
                                    >
                                        {branch.BranchName}
                                    </button>
                                ))}
                            </div>
                            <div className="accordion" id="branchesAccordion">
                                {branches.map((branch, index) => (
                                    <div
                                        key={index}
                                        className="accordion-item border-0 shadow-sm mb-2"
                                    >
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
                                                        onClick={() =>
                                                            copyAddress(`${branch.Address}, ${branch.City}`)
                                                        }
                                                    >
                                                        <i className="fas fa-copy"></i>
                                                    </button>
                                                </p>
                                                <a
                                                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                                                        `${branch.Address}, ${branch.City}`
                                                    )}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-outline-primary btn-sm"
                                                >
                                                    Get Directions
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Feedback Form */}
                        <h3 className="text-primary mt-4 mb-3">Send Feedback</h3>
                        <form
                            onSubmit={handleSubmit}
                            className="card border-0 shadow-sm p-4"
                        >
                            <div className="mb-3">
                                <label className="form-label text-primary">Name</label>
                                <input
                                    type="text"
                                    className={`form-control ${formErrors.name ? "is-invalid" : ""
                                        }`}
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                                {formErrors.name && (
                                    <div className="invalid-feedback">{formErrors.name}</div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-primary">Email</label>
                                <input
                                    type="email"
                                    className={`form-control ${formErrors.email ? "is-invalid" : ""
                                        }`}
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                                {formErrors.email && (
                                    <div className="invalid-feedback">{formErrors.email}</div>
                                )}
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-primary">Message</label>
                                <textarea
                                    rows={4}
                                    className={`form-control ${formErrors.message ? "is-invalid" : ""
                                        }`}
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                />
                                {formErrors.message && (
                                    <div className="invalid-feedback">{formErrors.message}</div>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Sending..." : "Send Feedback"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Ticker Section */}
            <div
                className="text-white py-2"
                style={{
                    backgroundColor: "#1E3A8A",
                    position: "fixed",
                    bottom: 0,
                    width: "100%",
                    zIndex: 1000,
                    overflow: "hidden",
                    whiteSpace: "nowrap"
                }}
            >
                <div
                    style={{
                        display: "inline-block",
                        paddingLeft: "100%",
                        animation: isTickerPaused ? "none" : "ticker 15s linear infinite"
                    }}
                >
                    <span className="me-4">{formatDateTime()}</span>
                    {tickerMessages.map((msg, index) => (
                        <span key={index} className="ticker-message">
                            {msg}
                        </span>
                    ))}
                </div>
                <button
                    className="btn btn-sm btn-light position-absolute top-50 end-0 translate-middle-y me-2"
                    onClick={toggleTicker}
                >
                    {isTickerPaused ? (
                        <i className="fas fa-play"></i>
                    ) : (
                        <i className="fas fa-pause"></i>
                    )}
                </button>
            </div>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
            />
        </div>
    );
};

// Add CSS for ticker animation and message styling
const styles = document.createElement("style");
styles.innerHTML = `
  @keyframes ticker {
    0% { transform: translateX(0); }
    100% { transform: translateX(-100%); }
  }
  .ticker-message {
    font-weight: bold;
    color: #FFD700;
    font-size: 16px;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
    transition: filter 0.3s ease;
    margin-right: 16px;
  }
  .ticker-message:hover {
    filter: brightness(1.2);
  }
  .ticker-message:not(:last-child)::after {
    content: " • ";
    color: #FFFFFF;
    margin-left: 16px;
  }
`;
document.head.appendChild(styles);

export default Contact;
