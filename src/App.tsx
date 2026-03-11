import { useState } from 'react';
import TitleScreen from './components/UI/TitleScreen';
import CharacterCreation from './components/UI/CharacterCreation';
import MapCanvas from './components/Map/MapCanvas';
import BattleScreen from './components/Battle/BattleScreen';
import { world1Map } from './maps/world1';
import { sounds } from './lib/sounds';

export type GameState = 'title' | 'char_creation' | 'loading' | 'map' | 'dialog' | 'battle' | 'gameover';

function App() {
  const [gameState, setGameState] = useState<GameState>('title');
  const [flash, setFlash] = useState(false);

  const handleStartGame = () => {
    sounds.playSelect();
    setGameState('char_creation');
  };

  const handleFinishCreation = () => {
    sounds.playSelect();
    setGameState('map');
  };

  const triggerBattle = () => {
    sounds.playEncounter();
    setFlash(true);
    setTimeout(() => {
      setGameState('battle');
      setFlash(false);
    }, 500); // Meio segundo de flash branco
  };

  const endBattle = () => {
    sounds.playSelect();
    setGameState('map');
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {gameState === 'title' && <TitleScreen onStart={handleStartGame} />}
      
      {gameState === 'char_creation' && <CharacterCreation onFinish={handleFinishCreation} />}
      
      {gameState === 'map' && <MapCanvas map={world1Map} onEncounter={triggerBattle} />}

      {gameState === 'battle' && <BattleScreen onWin={endBattle} onLose={endBattle} />}

      {/* Camada de Flash Visual */}
      {flash && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'white',
          zIndex: 9999,
          animation: 'flash-fade 0.5s ease-out'
        }} />
      )}

      <style>{`
        @keyframes flash-fade {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default App;
