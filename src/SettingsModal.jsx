import React from 'react';
import './Modal.css';

export default function SettingsModal({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content settings-modal">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2 className="modal-title settings-title">Settings</h2>
        
        <div className="settings-grid">
          <div className="settings-col">
            <div className="setting-row">
              <label>Auto Bet</label>
              <label className="switch"><input type="checkbox" /><span className="slider"></span></label>
            </div>
            <div className="setting-row">
              <label>Auto claim</label>
              <label className="switch"><input type="checkbox" defaultChecked /><span className="slider"></span></label>
            </div>
            <div className="setting-row">
              <label>Print Ticket</label>
              <label className="switch"><input type="checkbox" defaultChecked /><span className="slider"></span></label>
            </div>
            <div className="setting-row">
              <label>Print Claim</label>
              <label className="switch"><input type="checkbox" defaultChecked /><span className="slider"></span></label>
            </div>
            <div className="setting-row">
              <label>Print Cancel</label>
              <label className="switch"><input type="checkbox" defaultChecked /><span className="slider"></span></label>
            </div>
          </div>
          
          <div className="settings-col right-col">
            <select className="bt-select">
              <option>Bluetooth Printer</option>
            </select>
            
            <div className="setting-row bt-row">
              <label>Bluetooth</label>
              <label className="switch"><input type="checkbox" /><span className="slider"></span></label>
            </div>
            
            <div className="printer-search">
              <button className="icon-btn search-btn">🔍</button>
              <select className="search-select"><option></option></select>
              <button className="icon-btn save-icon-btn">💾</button>
            </div>
            <p className="printer-hint">Search and choose printer name then click - Save</p>
            
            <button className="save-btn" onClick={onClose}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
