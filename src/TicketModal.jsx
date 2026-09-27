import React, { useState } from 'react';
import './Modal.css';

export default function TicketModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('Game History');
  
  const tabs = ['Game History', 'Report', 'Result', 'Log Data'];

  return (
    <div className="modal-overlay">
      <div className="modal-content ticket-modal">
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="ticket-header">
          <h2 className="ticket-title">Ticket</h2>
        </div>
        
        <div className="tabs">
          {tabs.map(tab => (
            <button 
              key={tab} 
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="tab-content">
          {activeTab === 'Game History' && (
            <div className="tab-pane">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Barcode</th><th>Ticket Time</th><th>Game No.</th><th>Draw Time</th>
                    <th>Play Point</th><th>Win Point</th><th>Claim Point</th><th>Result</th>
                    <th>Multiply</th><th>Claim</th><th>Cancel</th><th>Print</th><th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Empty state for demo */}
                </tbody>
              </table>
              <div className="bottom-actions">
                <button className="green-btn">All Ticket</button>
                <button className="green-btn">All Claim</button>
              </div>
            </div>
          )}
          
          {activeTab === 'Report' && (
            <div className="tab-pane">
               <div className="filter-row">
                 <select><option>2026</option></select>
                 <select><option>September</option></select>
                 <select><option>26</option></select>
                 <span>To</span>
                 <select><option>2026</option></select>
                 <select><option>September</option></select>
                 <select><option>26</option></select>
                 <button className="green-btn small">Show</button>
               </div>
               <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th><th>Sale</th><th>Claim</th><th>Commi</th><th>Bonus</th><th>NTP</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Empty */}
                </tbody>
              </table>
              <div className="report-totals">
                <span>0.00</span><span>0.00</span><span>0.00</span><span>0.00</span><span>0.00</span>
              </div>
              <div className="bottom-actions report-actions">
                <div className="date-hint">26-09-2026 -<br/>26-09-2026</div>
                <button className="green-btn">Today</button>
                <button className="green-btn">Yesterday</button>
                <button className="green-btn">This week</button>
                <button className="green-btn">Last Week</button>
                <button className="green-btn">This month</button>
                <button className="green-btn">Last Month</button>
                <button className="green-btn">Print Report</button>
              </div>
            </div>
          )}
          
          {activeTab === 'Result' && (
            <div className="tab-pane">
               <div className="filter-row center-filter">
                 <select><option>2026</option></select>
                 <select><option>September</option></select>
                 <select><option>26</option></select>
                 <button className="green-btn small">Show</button>
               </div>
               <div className="results-list">
                 {['03:22:00 PM', '03:20:00 PM', '03:18:00 PM', '03:16:00 PM', '03:14:00 PM'].map((time, i) => (
                   <div key={i} className="result-row">
                     <span className="res-time">{time}</span>
                     <span className="res-num">{[7,3,4,2,9][i]}</span>
                     <span className="res-status">N</span>
                   </div>
                 ))}
               </div>
            </div>
          )}
          
          {activeTab === 'Log Data' && (
            <div className="tab-pane">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Barcode</th><th>Game</th><th>Start Point</th><th>+ Point</th>
                    <th>- Point</th><th>End Point</th><th>Time</th><th>Type</th>
                  </tr>
                </thead>
                <tbody>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
