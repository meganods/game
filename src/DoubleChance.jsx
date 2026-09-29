import React, { useState, useEffect } from 'react';
import './DoubleChance.css';
import SettingsModal from './SettingsModal';
import TicketModal from './TicketModal';

const CHIPS = [
  { value: 2, color: '#33cc33' },
  { value: 5, color: '#cc6600' },
  { value: 10, color: '#3366cc' },
  { value: 20, color: '#cc3366' },
  { value: 50, color: '#9933cc' },
  { value: 100, color: '#999999' },
  { value: 200, color: '#cc3333' },
  { value: 500, color: '#ffcc00' }
];

const OUTER_NUMBERS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const INNER_NUMBERS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const playSound = (type) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    
    if (type === 'chime') {
      const osc = ctx.createOscillator();
      osc.connect(gain);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(554.37, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.2);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.3); // extra high note for win
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2.0);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 2.0);
    } else if (type === 'clunk') {
      const osc = ctx.createOscillator();
      osc.connect(gain);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(80, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.6, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'click') {
      const osc = ctx.createOscillator();
      osc.connect(gain);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(700, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    }
  } catch (e) {
    console.log('Audio error:', e);
  }
};

function DoubleChance() {
  const [activeChip, setActiveChip] = useState(2);
  const [timeLeft, setTimeLeft] = useState(90);
  const [isSpinning, setIsSpinning] = useState(false);
  const [outerRotation, setOuterRotation] = useState(0);
  const [innerRotation, setInnerRotation] = useState(0);
  const [currentWin, setCurrentWin] = useState('');
  const [balance, setBalance] = useState(100000);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTicketOpen, setIsTicketOpen] = useState(false);

  const [andarBets, setAndarBets] = useState(Array(10).fill(0));
  const [baharBets, setBaharBets] = useState(Array(10).fill(0));
  const [jodiBets, setJodiBets] = useState(Array(100).fill(0));
  const [lastBets, setLastBets] = useState(null);
  
  const [history, setHistory] = useState([
    { time: '05:00 PM', andar: '-', bahar: '-', jodi: '--' },
    { time: '04:50 PM', andar: '-', bahar: '-', jodi: '--' },
    { time: '04:40 PM', andar: '-', bahar: '-', jodi: '--' },
    { time: '04:30 PM', andar: '-', bahar: '-', jodi: '--' },
  ]);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [alertMsg, setAlertMsg] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const speakMessage = (msg) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(msg);
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (isSpinning) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, [isSpinning]);

  useEffect(() => {
    if (isSpinning) return;
    if (timeLeft === 15) {
      speakMessage("Last chance!");
      setAlertMsg("Last chance!");
      setTimeout(() => setAlertMsg(''), 2000);
    } else if (timeLeft === 5) {
      speakMessage("No more bets!");
      setAlertMsg("No more bets!");
      setTimeout(() => setAlertMsg(''), 2000);
    } else if (timeLeft === 0) {
      handleSpin();
    }
  }, [timeLeft, isSpinning]);

  const handleSpin = () => {
    setIsSpinning(true);
    setCurrentWin('?');

    const jodi = Math.floor(Math.random() * 100);
    const andar = Math.floor(jodi / 10);
    const bahar = jodi % 10;
    
    const outerIndex = OUTER_NUMBERS.indexOf(andar);
    const innerIndex = INNER_NUMBERS.indexOf(bahar);

    setOuterRotation(prev => {
      const currentMod = prev % 360;
      const targetMod = (360 - (outerIndex * 36)) % 360;
      let diff = targetMod - currentMod;
      if (diff <= 0) diff += 360;
      return prev + (12 * 360) + diff;
    });

    setInnerRotation(prev => {
      const currentMod = prev % 360;
      const targetMod = (360 - (innerIndex * 36)) % 360;
      let diff = targetMod - currentMod;
      if (diff <= 0) diff += 360;
      return prev + (18 * 360) + diff; 
    });

    setTimeout(() => {
      playSound('clunk');
    }, 10000);

    setTimeout(() => {
      playSound('clunk');
      playSound('chime');
      setIsSpinning(false);
      setCurrentWin(jodi.toString().padStart(2, '0'));
      setTimeLeft(90); 
      setHistory(prev => {
        const timeStr = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
        const newHist = [{ time: timeStr, andar, bahar, jodi: jodi.toString().padStart(2, '0') }, ...prev];
        return newHist.slice(0, 4);
      });
      
      const totalWin = (jodiBets[jodi] || 0) * 90 + (andarBets[andar] || 0) * 9 + (baharBets[bahar] || 0) * 9;
      if (totalWin > 0) {
        setBalance(b => b + totalWin);
      }
      
      setLastBets({ jodi: [...jodiBets], andar: [...andarBets], bahar: [...baharBets] });
      setJodiBets(Array(100).fill(0));
      setAndarBets(Array(10).fill(0));
      setBaharBets(Array(10).fill(0));
    }, 15000);
  };

  const handleRowAllClick = (rowIndex) => {
    playSound('click');
    if (isSpinning || timeLeft <= 5) return;
    const cost = activeChip * 10;
    if (balance < cost) return;
    setBalance(prev => prev - cost);
    const newBets = [...jodiBets];
    for (let i = 0; i < 10; i++) {
      newBets[rowIndex * 10 + i] += activeChip;
    }
    setJodiBets(newBets);
  };

  const handleColAllClick = (colIndex) => {
    playSound('click');
    if (isSpinning || timeLeft <= 5) return;
    const cost = activeChip * 10;
    if (balance < cost) return;
    setBalance(prev => prev - cost);
    const newBets = [...jodiBets];
    for (let i = 0; i < 10; i++) {
      newBets[i * 10 + colIndex] += activeChip;
    }
    setJodiBets(newBets);
  };

  const handleJodiClick = (index) => {
    playSound('click');
    if (isSpinning || timeLeft <= 5) return;
    if (balance < activeChip) return;
    setBalance(prev => prev - activeChip);
    const newBets = [...jodiBets];
    newBets[index] += activeChip;
    setJodiBets(newBets);
  };

  const handleAndarClick = (index) => {
    playSound('click');
    if (isSpinning || timeLeft <= 5) return;
    if (balance < activeChip) return;
    setBalance(prev => prev - activeChip);
    const newBets = [...andarBets];
    newBets[index] += activeChip;
    setAndarBets(newBets);
  };

  const handleBaharClick = (index) => {
    playSound('click');
    if (isSpinning || timeLeft <= 5) return;
    if (balance < activeChip) return;
    setBalance(prev => prev - activeChip);
    const newBets = [...baharBets];
    newBets[index] += activeChip;
    setBaharBets(newBets);
  };

  const handleClear = () => {
    playSound('click');
    if (isSpinning || timeLeft <= 5) return;
    const totalBet = jodiBets.reduce((a,b)=>a+b,0) + andarBets.reduce((a,b)=>a+b,0) + baharBets.reduce((a,b)=>a+b,0);
    if (totalBet > 0) {
      setBalance(prev => prev + totalBet);
      setJodiBets(Array(100).fill(0));
      setAndarBets(Array(10).fill(0));
      setBaharBets(Array(10).fill(0));
    }
  };

  const handleDoubleUp = () => {
    playSound('click');
    if (isSpinning || timeLeft <= 5) return;
    const totalBet = jodiBets.reduce((a,b)=>a+b,0) + andarBets.reduce((a,b)=>a+b,0) + baharBets.reduce((a,b)=>a+b,0);
    if (totalBet > 0 && balance >= totalBet) {
      setBalance(prev => prev - totalBet);
      setJodiBets(prev => prev.map(b => b * 2));
      setAndarBets(prev => prev.map(b => b * 2));
      setBaharBets(prev => prev.map(b => b * 2));
    } else if (totalBet > 0) {
      setAlertMsg("Insufficient balance to double up!");
      setTimeout(() => setAlertMsg(''), 2000);
    }
  };

  const handleRepeat = () => {
    playSound('click');
    if (isSpinning || timeLeft <= 5 || !lastBets) return;
    const totalLastBet = lastBets.jodi.reduce((a,b)=>a+b,0) + lastBets.andar.reduce((a,b)=>a+b,0) + lastBets.bahar.reduce((a,b)=>a+b,0);
    if (balance >= totalLastBet) {
      setBalance(prev => prev - totalLastBet);
      setJodiBets([...lastBets.jodi]);
      setAndarBets([...lastBets.andar]);
      setBaharBets([...lastBets.bahar]);
    } else {
      setAlertMsg("Insufficient balance to repeat!");
      setTimeout(() => setAlertMsg(''), 2000);
    }
  };

  const handleDummy = (name) => {
    playSound('click');
    setAlertMsg(`${name} action not implemented yet.`);
    setTimeout(() => setAlertMsg(''), 2000);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.log(err));
    } else {
      document.exitFullscreen();
    }
  };

  const handleClose = () => {
    if(window.confirm("Are you sure you want to close the game?")) {
      window.location.reload();
    }
  };

  // Format timer
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  const drawTimeStr = new Date(currentTime.getTime() + timeLeft * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="dc-container">
      {alertMsg && <div className="alert-overlay">{alertMsg}</div>}
      {/* Top Bar */}
      <div className="dc-top-bar">
        <div className="dc-top-left">
          <div className="dc-lobby-btn">LOBBY</div>
          <div className="dc-tab active">
            Double Chance
            <span className="dc-tab-close">✖</span>
          </div>
        </div>
        <div className="dc-top-right">
          <input type="text" className="dc-ticket-input" placeholder="Enter Ticket" />
          <button className="dc-claim-btn">CLAIM</button>
          <div className="dc-welcome">Welcome, pb113</div>
          <div className="dc-balance-box">
            <span className="dc-balance-label">POINTS BALANCE</span>
            <span className="dc-balance-value">{balance}</span>
          </div>
          <div className="dc-window-controls">
            <button className="dc-ctrl-btn settings" onClick={() => setIsSettingsOpen(true)}>⚙</button>
            <button className="dc-ctrl-btn min" onClick={handleFullscreen}>−</button>
            <button className="dc-ctrl-btn close" onClick={handleClose}>✖</button>
          </div>
        </div>
      </div>

      <div className="dc-main-area">
        {/* Left Side (Grid and Bets) */}
        <div className="dc-left-panel">
          
          <div className="dc-grid-container">
            <div className="dc-grid">
              {Array.from({ length: 10 }).map((_, row) => (
                <div key={row} className="dc-grid-row">
                  <div className="dc-grid-all-btn row-all" onClick={() => handleRowAllClick(row)}>ALL</div>
                  {Array.from({ length: 10 }).map((_, col) => {
                    const num = row * 10 + col;
                    const val = num.toString().padStart(2, '0');
                    return (
                      <div 
                        key={num} 
                        className="dc-grid-cell"
                        onClick={() => handleJodiClick(num)}
                      >
                        {val}
                        {jodiBets[num] > 0 && <div className="dc-grid-chip">{jodiBets[num]}</div>}
                      </div>
                    );
                  })}
                </div>
              ))}
              <div className="dc-grid-row">
                <div className="dc-grid-all-btn empty"></div>
                {Array.from({ length: 10 }).map((_, col) => (
                  <div key={col} className="dc-grid-all-btn col-all" onClick={() => handleColAllClick(col)}>ALL</div>
                ))}
              </div>
            </div>
          </div>

          <div className="dc-mid-controls">
            <div className="dc-green-bar"></div>
            <div className="dc-chips-row">
              {CHIPS.map(chip => (
                <div 
                  key={chip.value}
                  className={`dc-chip ${activeChip === chip.value ? 'active' : ''}`}
                  onClick={() => setActiveChip(chip.value)}
                >
                  <div className="dc-chip-inner" style={{ borderColor: chip.color }}>
                    {chip.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dc-slots-container">
            <div className="dc-slots-row andar">
              <div className="dc-slot-label andar-label">A<br/>N<br/>D<br/>A<br/>R</div>
              <div className="dc-slots">
                {[0,1,2,3,4,5,6,7,8,9].map(num => (
                  <div key={num} className="dc-slot andar-slot" onClick={() => handleAndarClick(num)}>
                    <div className="dc-slot-header">{num}</div>
                    <div className="dc-slot-body">{andarBets[num] > 0 ? andarBets[num] : ''}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="dc-slots-row bahar">
              <div className="dc-slot-label bahar-label">B<br/>A<br/>H<br/>A<br/>R</div>
              <div className="dc-slots">
                {[0,1,2,3,4,5,6,7,8,9].map(num => (
                  <div key={num} className="dc-slot bahar-slot" onClick={() => handleBaharClick(num)}>
                    <div className="dc-slot-header">{num}</div>
                    <div className="dc-slot-body">{baharBets[num] > 0 ? baharBets[num] : ''}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="dc-bottom-info">
            <div className="dc-play-info">PLAY <span>{jodiBets.reduce((a,b)=>a+b,0) + andarBets.reduce((a,b)=>a+b,0) + baharBets.reduce((a,b)=>a+b,0)}</span></div>
            <div className="dc-win-info">WIN : </div>
          </div>
        </div>

        {/* Right Side (Wheel and Info) */}
        <div className="dc-right-panel">
          <div className="dc-time-header">
            <div className="dc-current-time">Current Time : {currentTime.toLocaleDateString('en-GB')} {currentTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit'})}</div>
          </div>
          
          <div className="dc-draw-info">
            <div className="dc-seconds-box">
              <div className="dc-seconds-label">Seconds Left</div>
              <div className="dc-seconds-val">{timeString}</div>
            </div>
          </div>

          <div className="dc-wheel-section">
            <div className="dc-wheel-wrapper">
              <div className="dc-wheel-outer-ring" style={{ transform: `rotate(${outerRotation}deg)`, transition: isSpinning ? 'transform 10s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none' }}>
                  {OUTER_NUMBERS.map((num, i) => (
                    <div key={`out-${i}`} className="dc-wheel-num outer-num" style={{ transform: `rotate(${i * 36}deg)` }}>
                      <span>{num}</span>
                    </div>
                  ))}
                 <div className="dc-wheel-inner" style={{ transform: `rotate(${innerRotation - outerRotation}deg)`, transition: isSpinning ? 'transform 15s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none' }}>
                    {INNER_NUMBERS.map((num, i) => (
                      <div key={`in-${i}`} className="dc-wheel-num inner-num" style={{ transform: `rotate(${i * 36}deg)` }}>
                        <span>{num}</span>
                      </div>
                    ))}
                   <div className="dc-wheel-center" style={{ transform: `rotate(${-innerRotation}deg)`, transition: isSpinning ? 'transform 15s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none' }}>
                     <span className="dc-wheel-result">{currentWin}</span>
                   </div>
                 </div>
              </div>
              <div className="dc-wheel-pointer"></div>
            </div>
          </div>

          <div className="dc-history-table">
            <div className="dc-history-header">
              <div className="dc-hist-col">TIME</div>
              {history.map((h, i) => <div key={i} className="dc-hist-col time-col">{h.time}</div>)}
            </div>
            <div className="dc-history-row andar-row">
              <div className="dc-hist-col label">ANDAR</div>
              {history.map((h, i) => <div key={i} className="dc-hist-col val">{h.andar}</div>)}
            </div>
            <div className="dc-history-row bahar-row">
              <div className="dc-hist-col label">BAHAR</div>
              {history.map((h, i) => <div key={i} className="dc-hist-col val">{h.bahar}</div>)}
            </div>
            <div className="dc-history-row jodi-row">
              <div className="dc-hist-col label">JODI</div>
              {history.map((h, i) => <div key={i} className="dc-hist-col val">{h.jodi}</div>)}
            </div>
          </div>

          <div className="dc-action-buttons">
            <button className="dc-btn report" onClick={() => setIsTicketOpen(true)}>
              <span className="btn-icon"><i>i</i></span>
              <span className="btn-text">REPORT</span>
            </button>
            <button className="dc-btn advance">
              <span className="btn-icon">⬆️</span>
              <span className="btn-text">ADVANCE</span>
            </button>
            <button className="dc-btn clear" onClick={handleClear}>
              <span className="btn-icon" style={{ fontSize: '22px', marginTop: '-3px' }}>⟳</span>
              <span className="btn-text">CLEAR</span>
            </button>
            <button className="dc-btn repeat" onClick={handleRepeat}>
              <span className="btn-icon">🔁</span>
              <span className="btn-text">REPEAT</span>
            </button>
            <button className="dc-btn double" onClick={handleDoubleUp}>
              <span className="btn-icon">2X</span>
              <span className="btn-text">DOUBLE UP</span>
            </button>
            <button className="dc-btn print">
              <span className="btn-icon">🖨️</span>
              <span className="btn-text">PRINT</span>
            </button>
          </div>
        </div>
      </div>
      
      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
      {isTicketOpen && <TicketModal onClose={() => setIsTicketOpen(false)} />}
    </div>
  );
}

export default DoubleChance;
