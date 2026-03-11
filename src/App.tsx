import { useState } from 'react';
import TitleScreen from './components/UI/TitleScreen';
import CharacterCreation from './components/UI/CharacterCreation';
import MapCanvas from './components/Map/MapCanvas';
import BattleScreen from './components/Battle/BattleScreen';
import DialogBox from './components/UI/DialogBox';
import StatusBar from './components/UI/StatusBar';
import CodeEditor from './components/Battle/CodeEditor';
import { world1Map } from './maps/world1';
import { villageMap } from './maps/village';
import { sounds } from './lib/sounds';
import { useGameStore } from './hooks/useGameStore';
import { usePyodide } from './hooks/usePyodide';

export type GameState = 'title' | 'char_creation' | 'loading' | 'map' | 'battle';

function App() {
  const [gameState, setGameState] = useState<GameState>('title');
  const [currentMap, setCurrentMap] = useState(villageMap);
  const [flash, setFlash] = useState(false);
  const [activeDialog, setActiveDialog] = useState<{ name: string, messages: string[], onFinish?: () => void } | null>(null);
  
  const [activeChest, setActiveChest] = useState<any | null>(null);
  const [chestCode, setChestCode] = useState('');
  const [chestError, setChestError] = useState<string | null>(null);
  
  const { runCode } = usePyodide();
  const { gainGold, setPlayerPos, openedChests, openChest, resetPlayer } = useGameStore();

  const handleStartGame = () => { sounds.playSelect(); setGameState('char_creation'); };
  const handleFinishCreation = () => { sounds.playSelect(); setGameState('map'); };

  const triggerBattle = () => {
    if (activeDialog || activeChest) return;
    sounds.playEncounter();
    setFlash(true);
    setTimeout(() => { setGameState('battle'); setFlash(false); }, 500);
  };

  const handleInteract = (interaction: any) => {
    if (!interaction || activeDialog || activeChest) return;

    if (interaction.type === 'npc' || interaction.type === 'sign') {
      setActiveDialog({ name: interaction.data.name, messages: interaction.data.dialog });
    } else if (interaction.type === 'chest') {
      const chest = interaction.data;
      const chestId = `${currentMap.id}_${chest.tileX}_${chest.tileY}`;

      if (openedChests.includes(chestId)) {
        setActiveDialog({ name: 'COFRE ABERTO', messages: ['Este cofre já foi depurado e está vazio.'] });
        return;
      }

      setActiveChest({ ...chest, uniqueId: chestId });
      setChestCode(''); 
      setChestError(null);
      setActiveDialog({
        name: 'COFRE CORROMPIDO',
        messages: [chest.description, 'Acesse o terminal para inserir o código de correção.']
      });
    }
  };

  const handleExecuteChest = async () => {
    if (!activeChest) return;
    sounds.playSelect();
    setChestError(null);
    const result = await runCode(chestCode);
    
    if (result.success && result.output === activeChest.expected) {
        sounds.playHit();
        gainGold(activeChest.reward);
        openChest(activeChest.uniqueId); 
        setActiveChest(null);
        setActiveDialog({ name: 'SISTEMA', messages: ['Código validado com sucesso!', `Você recebeu ${activeChest.reward} GOLD.`] });
    } else {
        sounds.playHit(); 
        setChestError(result.success ? `Saída incorreta: "${result.output}"` : result.error.split('\n').pop() || 'Erro');
    }
  };

  const handlePortal = (targetMapId: string, x: number, y: number) => {
    sounds.playSelect(); setFlash(true);
    setTimeout(() => {
      if (targetMapId === 'world1') setCurrentMap(world1Map);
      else if (targetMapId === 'village') setCurrentMap(villageMap);
      setPlayerPos({ x, y });
      setFlash(false);
    }, 300);
  };

  const handleEndBattle = (isDead: boolean) => {
    if (isDead) {
        resetPlayer(); // Volta vida e posição no estado global
        setCurrentMap(villageMap); // Força visualmente o mapa da vila
        setFlash(true);
        setGameState('map');
        setTimeout(() => {
            setFlash(false);
            setActiveDialog({
                name: 'Mentora PEP-8',
                messages: [
                    "Seu sistema falhou, mas não desista!",
                    "Até os maiores Desenvolvedores já cometeram erros de sintaxe.",
                    "Vou restaurar seus dados básicos. Pratique um pouco mais antes de voltar à Floresta.",
                    "Lembre-se: o erro é o melhor professor do programador!"
                ]
            });
        }, 500);
    } else {
        setGameState('map');
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      
      {gameState === 'title' && <TitleScreen onStart={handleStartGame} />}
      {gameState === 'char_creation' && <CharacterCreation onFinish={handleFinishCreation} />}
      
      {(gameState === 'map' || gameState === 'battle') && (
        <>
          <div style={{ backgroundColor: 'var(--gb-darkest)', color: 'var(--gb-white)', padding: '5px', fontSize: '7px', textAlign: 'center' }}>
            [ WASD = Andar | ENTER = Interagir ]
          </div>
          <StatusBar />
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: '#000' }}>
            <div style={{ display: gameState === 'map' ? 'block' : 'none', height: '100%' }}>
              <MapCanvas 
                key={currentMap.id}
                map={currentMap} 
                spawnPos={null} 
                onEncounter={triggerBattle} 
                onInteract={handleInteract}
                onPortal={handlePortal}
                isDialogActive={!!activeDialog || !!activeChest}
              />
            </div>
            {gameState === 'battle' && <BattleScreen onWin={() => handleEndBattle(false)} onLose={(dead) => handleEndBattle(dead)} />}
            {activeDialog && <DialogBox name={activeDialog.name} messages={activeDialog.messages} onComplete={() => { activeDialog.onFinish?.(); setActiveDialog(null); }} />}
            {activeChest && !activeDialog && <CodeEditor problem={activeChest.puzzle} code={chestCode} onChange={setChestCode} onExecute={handleExecuteChest} onClose={() => setActiveChest(null)} errorFeedback={chestError} />}
          </div>
        </>
      )}
      {flash && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'white', zIndex: 9999, animation: 'flash-fade 0.3s ease-out' }} />}
      <style>{` @keyframes flash-fade { from { opacity: 1; } to { opacity: 0; } } `}</style>
    </div>
  );
}

export default App;
