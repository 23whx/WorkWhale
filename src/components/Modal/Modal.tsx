import React from 'react';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  icon?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, message, icon = '❌' }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal">
        <div className="modal-header">
          <span className="modal-icon">{icon}</span>
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p className="modal-message">{message}</p>
        </div>
        <div className="modal-footer">
          <button className="modal-btn" onClick={onClose}>确定</button>
        </div>
      </div>
    </>
  );
};

