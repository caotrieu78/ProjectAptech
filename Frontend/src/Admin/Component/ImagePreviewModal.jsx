import React, { useState } from "react";
import PropTypes from "prop-types";
import {
    FaTimes,
    FaSearchPlus,
    FaSearchMinus,
    FaUndo,
    FaRedo
} from "react-icons/fa";

const ImagePreviewModal = ({ imageUrl, onClose }) => {
    const [scale, setScale] = useState(1);
    const [rotation, setRotation] = useState(0);

    if (!imageUrl) return null;

    const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3));
    const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));
    const rotateLeft = () => setRotation((prev) => prev - 90);
    const rotateRight = () => setRotation((prev) => prev + 90);
    const reset = () => {
        setScale(1);
        setRotation(0);
    };

    return (
        <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.85)" }}
            tabIndex="-1"
            onClick={onClose}
        >
            <div
                className="modal-dialog modal-xl modal-dialog-centered"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-content bg-transparent border-0">
                    <div className="modal-body d-flex justify-content-center align-items-center p-0 position-relative">
                        <img
                            src={imageUrl}
                            alt="Preview"
                            className="img-fluid rounded"
                            style={{
                                transform: `scale(${scale}) rotate(${rotation}deg)`,
                                transition: "transform 0.3s ease-in-out",
                                maxHeight: "85vh",
                                maxWidth: "100%",
                                boxShadow: "0 0 15px rgba(0, 212, 255, 0.3)"
                            }}
                        />

                        {/* Control panel */}
                        <div
                            className="position-absolute top-0 end-0 m-3 p-2 bg-dark bg-opacity-75 rounded-3"
                            style={{ zIndex: 10, backdropFilter: "blur(5px)" }}
                        >
                            <div className="d-flex flex-column gap-2">
                                <button
                                    className="btn btn-outline-light btn-sm rounded-circle"
                                    onClick={zoomIn}
                                    title="Phóng to"
                                    style={{ width: "40px", height: "40px" }}
                                >
                                    <FaSearchPlus />
                                </button>
                                <button
                                    className="btn btn-outline-light btn-sm rounded-circle"
                                    onClick={zoomOut}
                                    title="Thu nhỏ"
                                    style={{ width: "40px", height: "40px" }}
                                >
                                    <FaSearchMinus />
                                </button>
                                <button
                                    className="btn btn-outline-light btn-sm rounded-circle"
                                    onClick={rotateLeft}
                                    title="Xoay trái"
                                    style={{ width: "40px", height: "40px" }}
                                >
                                    <FaUndo />
                                </button>
                                <button
                                    className="btn btn-outline-light btn-sm rounded-circle"
                                    onClick={rotateRight}
                                    title="Xoay phải"
                                    style={{ width: "40px", height: "40px" }}
                                >
                                    <FaRedo />
                                </button>
                                <button
                                    className="btn btn-outline-light btn-sm rounded-circle"
                                    onClick={reset}
                                    title="Đặt lại"
                                    style={{ width: "40px", height: "40px" }}
                                >
                                    R
                                </button>
                                <button
                                    className="btn btn-outline-danger btn-sm rounded-circle mt-2"
                                    onClick={onClose}
                                    title="Đóng"
                                    style={{ width: "40px", height: "40px" }}
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

ImagePreviewModal.propTypes = {
    imageUrl: PropTypes.string,
    onClose: PropTypes.func.isRequired
};

export default ImagePreviewModal;
