import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./popup.css";

function Popup() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const confirmResolveRef = React.useRef(null);

  useEffect(() => {
    window._showPopup = (msg) => {
      setMessage(String(msg));
      setVisible(true);
    };

    window._showConfirm = (msg) => {
      return new Promise((resolve) => {
        setConfirmMessage(String(msg));
        confirmResolveRef.current = resolve;
        setConfirmVisible(true);
      });
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      {visible && (
        <div className="popup-overlay" onClick={() => setVisible(false)}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <div className="popup-message">{message}</div>
            <div className="popup-actions">
              <button className="popup-ok" onClick={() => setVisible(false)}>OK</button>
            </div>
          </div>
        </div>
      )}

      {confirmVisible && (
        <div className="popup-overlay" onClick={() => { confirmResolveRef.current && confirmResolveRef.current(false); setConfirmVisible(false); }}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <div className="popup-message">{confirmMessage}</div>
            <div className="popup-actions">
              <button className="popup-cancel" onClick={() => { confirmResolveRef.current && confirmResolveRef.current(false); setConfirmVisible(false); }}>Cancel</button>
              <button className="popup-confirm" onClick={() => { confirmResolveRef.current && confirmResolveRef.current(true); setConfirmVisible(false); }}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function installPopup() {
  if (typeof window === "undefined") return;
  if (document.getElementById("app-popup-root")) return;

  const rootEl = document.createElement("div");
  rootEl.id = "app-popup-root";
  document.body.appendChild(rootEl);

  const root = createRoot(rootEl);
  root.render(<Popup />);

  window.alert = (msg) => {
    if (window._showPopup) window._showPopup(msg);
    else console.log(msg);
  };
}

export default Popup;

export function showConfirm(msg) {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (window._showConfirm) return window._showConfirm(msg);
  // fallback to native confirm wrapped in a Promise
  return Promise.resolve(Boolean(window.confirm ? window.confirm(msg) : false));
}
