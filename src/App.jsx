import React, { useState } from 'react';
import './App.css';
import SettingsModal from './SettingsModal';
import TicketModal from './TicketModal';

const CHIPS = [
  { value: 1, color: '#cc9900' },
  { value: 2, color: '#33cc33' },
  { value: 5, color: '#cc6600' },
  { value: 10, color: '#3366cc' },
  { value: 20, color: '#cc3366' },
  { value: 50, color: '#9933cc' },
  { value: 100, color: '#999999' },
  { value: 500, color: '#cc3333' }
];

const WHEEL_NUMBERS = [7, 9, 2, 5, 4, 8, 0, 6, 3, 1];
const WHEEL_COLORS = [
  'var(--wheel-blue)', 'var(--wheel-purple)', 'var(--wheel-green)', 
  'var(--wheel-red)', 'var(--wheel-purple)', 'var(--wheel-yellow)', 
  'var(--wheel-yellow)', 'var(--wheel-purple)', 'var(--wheel-red)', 'var(--wheel-yellow)'
];

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [balance, setBalance] = useState(6798);
  const [activeChip, setActiveChip] = useState(10);
  const [bets, setBets] = useState(Array(10).fill(0)); // slots 0-9
  const [history, setHistory] = useState([5, 8, 7, 2, 2, 6, 5, 1]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const handleSlotClick = (index) => {
    if (isSpinning) return;
    if (balance >= activeChip) {
      const newBets = [...bets];
      newBets[index] += activeChip;
      setBets(newBets);
      setBalance(balance - activeChip);
    }
  };

  const handleClear = () => {
    if (isSpinning) return;
    const totalBet = bets.reduce((a, b) => a + b, 0);
    setBalance(balance + totalBet);
    setBets(Array(10).fill(0));
  };

  const handleDouble = () => {
    if (isSpinning) return;
    const totalBet = bets.reduce((a, b) => a + b, 0);
    if (balance >= totalBet) {
      setBalance(balance - totalBet);
      setBets(bets.map(b => b * 2));
    }
  };

  const handleBetAndSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    
    // Calculate winning number randomly
    const winIndex = Math.floor(Math.random() * 10);
    const winNumber = WHEEL_NUMBERS[winIndex];
    
    // Each slice is 36 degrees. We want the center of the winning slice to be at the top (0 degrees).
    // The visual wheel has 7 at the top natively.
    // We just rotate it randomly with extra spins.
    const extraSpins = 5 * 360;
    const sliceAngle = 36;
    const targetRotation = extraSpins + (360 - (winIndex * sliceAngle));
    
    setRotation(rotation + targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      // Process win/loss
      const winSlotIndex = winNumber === 0 ? 9 : winNumber - 1; 
      const amountWon = bets[winSlotIndex] * 9; // 9x payout for single number hit
      
      if (amountWon > 0) {
        setBalance(prev => prev + amountWon);
      }
      
      setHistory(prev => [winNumber, ...prev.slice(0, 7)]);
      setBets(Array(10).fill(0));
    }, 5000); // 5s spin duration
  };

  return (
    <div className="app-container">
      {/* Top Bar */}
      <div className="top-bar glass-panel">
        <div className="top-bar-left">
          <div className="top-bar-text" style={{color: '#ffcc00'}}>PLAY GOLDEN CASINO</div>
          <div className="top-bar-text">For Amusement Only</div>
          <div className="info-box">R001</div>
          <div className="info-box">Game ID: 3922728</div>
        </div>
        <div className="top-bar-right">
          <input type="text" className="claim-input" placeholder="Ticket No" />
          <button className="claim-btn">CLAIM</button>
          <div className="balance-box">
            <span className="balance-label">BALANCE</span>
            <span className="balance-value">{balance}</span>
          </div>
          <div style={{display: 'flex', gap: '5px'}}>
            <button style={{background:'#0066cc', color:'white', border:'2px solid white', borderRadius:'50%', width:'30px', height:'30px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center'}}>🔒</button>
            <button style={{background:'#cc3300', color:'white', border:'2px solid white', borderRadius:'50%', width:'30px', height:'30px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center'}} onClick={() => setIsSettingsOpen(true)}>⚙️</button>
            <button style={{background:'#ffcc00', color:'white', border:'2px solid white', borderRadius:'50%', width:'30px', height:'30px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center'}}>➖</button>
            <button style={{background:'#ff3333', color:'white', border:'2px solid white', borderRadius:'50%', width:'30px', height:'30px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center'}}>❌</button>
          </div>
        </div>
      </div>

      {/* Main Area */}
      <div className="main-content">
        {/* Left Panel */}
        <div className="left-panel">
          <div className="glass-panel" style={{padding: '10px'}}>
            <div className="play-win-labels">
              <span>PLAY</span>
              <span>WIN</span>
            </div>
            <div className="timer-box">
              <div className="timer-text">01:55</div>
              <div className="timer-bar-container">
                <div className="timer-bar"></div>
              </div>
            </div>
          </div>
          
          <div className="history-box">
            <div className="history-title">HISTORY</div>
            <div className="history-items">
              {history.map((num, i) => (
                <div key={i} className="history-item" style={{background: 
                  num === 7 ? '#00cccc' : 
                  num === 2 || num === 6 ? '#cc00cc' :
                  num === 5 ? '#ff6600' : 
                  num === 8 || num === 1 ? '#ffcc00' : '#fff'
                }}>
                  {num}
                </div>
              ))}
            </div>
          </div>
          
          <div className="glass-panel" style={{flex: 1, minHeight: '50px'}}></div>
        </div>

        {/* Center Panel (Wheel) */}
        <div className="center-panel">
          <div className="wheel-arrow"></div>
          <div className="wheel-container">
            <div className="wheel-outer">
              <div 
                className="wheel" 
                style={{ transform: `rotate(${rotation}deg)` }}
              >
                {/* We render the numbers in a circle */}
                <div className="wheel-numbers">
                  {WHEEL_NUMBERS.map((num, i) => (
                    <div 
                      key={i} 
                      className="wheel-number"
                      style={{ transform: `rotate(${i * 36}deg)` }}
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>
              <div className="wheel-center"></div>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="right-panel">
          <div className="logo-box gold-border">
            <h2>SPIN 2 WIN<br/><span style={{fontSize: '24px', color: '#00bfff'}}>TIMER</span></h2>
          </div>
          
          <div className="glass-panel chips-box">
            {CHIPS.map(chip => (
              <div 
                key={chip.value}
                className={`chip ${activeChip === chip.value ? 'active' : ''}`}
                style={{ background: chip.color }}
                onClick={() => setActiveChip(chip.value)}
              >
                {chip.value}
              </div>
            ))}
          </div>
          
          <div className="glass-panel draw-time">
            DRAW TIME : 03:10 PM
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bottom-bar">
        <div className="bet-slots">
          {[1,2,3,4,5,6,7,8,9,0].map((num, idx) => (
            <div key={idx} className="bet-slot" onClick={() => handleSlotClick(idx)}>
              <div className="bet-slot-number">{num}</div>
              <div className="bet-slot-value">{bets[idx] > 0 ? bets[idx] : ''}</div>
            </div>
          ))}
        </div>
        
        <div className="action-buttons">
          <button className="action-btn" onClick={() => setIsTicketOpen(true)}>INFO</button>
          <button className="action-btn">ADVANCE</button>
          <button className="action-btn" onClick={handleDouble}>DOUBLE</button>
          <button className="action-btn">REPEAT</button>
          <button className="action-btn" onClick={handleClear}>CLEAR</button>
          <button className="action-btn bet" onClick={handleBetAndSpin}>BET</button>
        </div>
      </div>

      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
      {isTicketOpen && <TicketModal onClose={() => setIsTicketOpen(false)} />}
    </div>
  );
}

export default App;
