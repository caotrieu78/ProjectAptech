import React from "react";
import { Modal, Button } from "react-bootstrap";

const ConfirmModal = ({
  show = false,
  title = "Confirmation",
  message = "Are you sure you want to proceed with this action?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onClose,
  confirmVariant = "danger",
  size = "lg"
}) => {
  return (
    <>
      <Modal
        show={show}
        onHide={onClose}
        backdrop="static"
        centered
        size={size}
        className="custom-confirm-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="modal-title">{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="modal-message">{message}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={onClose}
            className="modal-btn modal-btn-cancel"
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            className="modal-btn modal-btn-confirm"
          >
            {confirmText}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ConfirmModal;
