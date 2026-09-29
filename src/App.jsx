import React, { useState } from 'react';
import Spin2Win from './Spin2Win';
import DoubleChance from './DoubleChance';
import './App.css'; // Spin2Win styles and Global App styles

const GAMES = [
  { id: 'spin2win', name: 'SPIN 2 WIN' },
  { id: 'doublechance', name: 'DOUBLE CHANCE' }
];

function App() {
  const [currentGame, setCurrentGame] = useState('doublechance');

  return (
    <div className="main-wrapper" style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      {/* Render selected game */}
      {currentGame === 'spin2win' && <Spin2Win />}
      {currentGame === 'doublechance' && <DoubleChance />}
      
      {/* Game Selector at Bottom Left */}
      <div className="game-selector">
        {GAMES.map(game => (
          <div 
            key={game.id} 
            className={`game-thumb ${currentGame === game.id ? 'active' : ''}`}
            onClick={() => setCurrentGame(game.id)}
          >
            {game.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
