import { useState, useEffect } from 'react';
import TitleScreen from './components/UI/TitleScreen';
import CharacterCreation from './components/UI/CharacterCreation';
import MapCanvas from './components/Map/MapCanvas';
import BattleScreen from './components/Battle/BattleScreen';
import DialogBox from './components/UI/DialogBox';
import { world1Map } from './maps/world1';
import { villageMap } from './maps/village';
import { sounds } from './lib/sounds';

export type GameState = 'title' | 'char_creation' | 'loading' | 'map' | 'dialog' | 'battle' | 'gameover';

function App() {
  const [gameState, setGameState] = useState<GameState>('title');
  const [currentMap, setCurrentMap] = useState(villageMap);
  const [flash, setFlash] = useState(false);
  const [activeDialog, setActiveDialog] = useState<{ name: string, messages: string[] } | null>(null);

  // Disparar diálogo inicial apenas na Vila
  useEffect(() => {
    if (gameState === 'map' && currentMap.id === 'village') {
      const pep8 = currentMap.npcs.find(n => n.id === 'pep8');
      if (pep8) {
        setTimeout(() => {
          setActiveDialog({ name: pep8.name, messages: pep8.dialog });
        }, 500);
      }
    }
  }, [gameState, currentMap.id]);

  const handleStartGame = () => {
    sounds.playSelect();
    setGameState('char_creation');
  };

  const handleFinishCreation = () => {
    sounds.playSelect();
    setCurrentMap(villageMap); // Sempre inicia na vila
    setGameState('map');
  };

  const triggerBattle = () => {
    if (activeDialog) return;
    sounds.playEncounter();
    setFlash(true);
    setTimeout(() => {
      setGameState('battle');
      setFlash(false);
    }, 500);
  };

  const handleInteract = (npc: any) => {
    if (npc && npc.name && npc.dialog) {
      setActiveDialog({ name: npc.name, messages: npc.dialog });
    }
  };

  const handlePortal = (targetMapId: string) => {
    sounds.playSelect();
    setFlash(true); // Faz a tela piscar ao mudar de mapa
    
    setTimeout(() => {
      if (targetMapId === 'world1') {
        setCurrentMap(world1Map);
      } else if (targetMapId === 'village') {
        setCurrentMap(villageMap);
      }
      setFlash(false);
    }, 300);
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {gameState === 'title' && <TitleScreen onStart={handleStartGame} />}
      
      {gameState === 'char_creation' && <CharacterCreation onFinish={handleFinishCreation} />}
      
      {(gameState === 'map' || gameState === 'battle') && (
        <div style={{ width: '100%', height: '100%', display: gameState === 'map' ? 'block' : 'none' }}>
          <MapCanvas 
            map={currentMap} 
            onEncounter={triggerBattle} 
            onInteract={handleInteract}
            onPortal={handlePortal}
            isDialogActive={!!activeDialog}
          />
        </div>
      )}

      {activeDialog && (
        <DialogBox 
          name={activeDialog.name} 
          messages={activeDialog.messages} 
          onComplete={() => setActiveDialog(null)} 
        />
      )}

      {gameState === 'battle' && (
        <BattleScreen 
          onWin={() => setGameState('map')} 
          onLose={() => setGameState('map')} 
        />
      )}

      {/* Camada de Flash Visual (Batalha e Portais) */}
      {flash && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'white', zIndex: 9999, animation: 'flash-fade 0.3s ease-out'
        }} />
      )}

      <style>{`
        @keyframes flash-fade { from { opacity: 1; } to { opacity: 0; } }
      `}</style>
    </div>
  );
}

export default App;
