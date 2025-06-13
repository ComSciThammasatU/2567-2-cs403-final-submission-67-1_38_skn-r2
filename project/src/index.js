import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// ใส่ใน index.js (ก่อน ReactDOM.render)
const observerErr = window.ResizeObserver;
window.ResizeObserver = class extends observerErr {
  constructor(callback) {
    super((entries, observer) => {
      try {
        callback(entries, observer);
      } catch (e) {
        // บล็อก loop error
      }
    });
  }
};


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
