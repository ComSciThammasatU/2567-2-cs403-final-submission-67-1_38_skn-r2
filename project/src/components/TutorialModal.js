import React from 'react';
import './Tutorial.css';

export default function TutorialModal({ isOpen, onClose, title, steps, gifUrl }) {
  if (!isOpen) return null;

  return (
    <div className="tutorial-modal-backdrop" onClick={onClose}>
      <div className="tutorial-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>

        {gifUrl && (
          <div className="tutorial-gif-wrapper">
            <img src={gifUrl} alt="ตัวอย่างการใช้งาน" className="tutorial-gif" />
          </div>
        )}

        <ul>
          {steps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ul>

        <div className="close-tutorial-wrapper">
          <button className="close-tutorial-btn" onClick={onClose}>ปิด</button>
        </div>
      </div>
    </div>
  );
}
