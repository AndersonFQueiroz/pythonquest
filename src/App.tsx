import { useState } from 'react';
import './styles/global.css';
import TitleScreen from './components/UI/TitleScreen';

export type GameState = 'title' | 'loading' | 'map' | 'dialog' | 'battle' | 'gameover';

function App() {
  const [gameState, setGameState] = useState<GameState>('title');

  return (
    <div id="game-container">
      {gameState === 'title' && <TitleScreen onStart={() => setGameState('map')} />}
      
      {/* 
        Próximas fases:
        {gameState === 'map' && <WorldSelect />}
        {gameState === 'battle' && <BattleScreen />}
      */}
    </div>
  );
}

export default App;
