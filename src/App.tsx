import { useState, useEffect } from 'react';
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
  
  // Efeito Dark Souls
  const [areaTitle, setAreaTitle] = useState<string | null>(null);

  const [activeChest, setActiveChest] = useState<any | null>(null);
  const [chestCode, setChestCode] = useState('');
  const [chestError, setChestError] = useState<string | null>(null);
  
  const { runCode } = usePyodide();
  const { gainGold, setPlayerPos, openedChests, openChest, resetPlayer, merchantMessage, clearMerchantMessage } = useGameStore();

  const handleStartGame = () => { sounds.playSelect(); setGameState('char_creation'); };
  
  const handleFinishCreation = () => { 
    sounds.playSelect(); 
    setGameState('map');
    triggerAreaTitle(villageMap.name);
  };

  const triggerAreaTitle = (name: string) => {
    setAreaTitle(name);
    setTimeout(() => setAreaTitle(null), 4000);
  };

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
    } else if (interaction.type === 'merchant') {
        setActiveDialog({ name: 'MERCADOR GLITCH', messages: ["Hehehe... Bem-vindo, estranho!", "O que um depurador como você faz por aqui?", "(Loja em breve!)"] });
    } else if (interaction.type === 'chest') {
      const chest = interaction.data;
      const chestId = `${currentMap.id}_${chest.tileX}_${chest.tileY}`;
      if (openedChests.includes(chestId)) {
        setActiveDialog({ name: 'COFRE ABERTO', messages: ['Este cofre já foi depurado.'] });
        return;
      }
      setActiveChest({ ...chest, uniqueId: chestId });
      setChestCode(''); 
      setChestError(null);
      setActiveDialog({ name: 'COFRE CORROMPIDO', messages: [chest.description] });
    }
  };

  const handleExecuteChest = async () => {
    if (!activeChest) return;
    sounds.playSelect();
    const result = await runCode(chestCode);
    if (result.success && result.output === activeChest.expected) {
        sounds.playHit(); gainGold(activeChest.reward); openChest(activeChest.uniqueId); 
        setActiveChest(null);
        setActiveDialog({ name: 'SISTEMA', messages: ['Código validado!', `Recebido ${activeChest.reward} GOLD.`] });
    } else {
        sounds.playHit(); 
        setChestError(result.success ? `Saída incorreta: "${result.output}"` : result.error.split('\n').pop() || 'Erro');
    }
  };

  const handlePortal = (targetMapId: string, x: number, y: number) => {
    sounds.playSelect(); setFlash(true);
    setTimeout(() => {
      const target = targetMapId === 'world1' ? world1Map : villageMap;
      setCurrentMap(target);
      setPlayerPos({ x, y });
      setFlash(false);
      triggerAreaTitle(target.name);
    }, 300);
  };

  const handleEndBattle = (isDead: boolean) => {
    if (isDead) {
        resetPlayer(); setCurrentMap(villageMap); setFlash(true); setGameState('map');
        setTimeout(() => {
            setFlash(false);
            setActiveDialog({
                name: 'Mentora PEP-8',
                messages: ["Seu sistema falhou...", "Vou restaurar seus dados. Não desista!"]
            });
        }, 500);
    } else { setGameState('map'); }
  };

  useEffect(() => {
    if (merchantMessage) {
        const timer = setTimeout(clearMerchantMessage, 5000);
        return () => clearTimeout(timer);
    }
  }, [merchantMessage, clearMerchantMessage]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      
      {gameState === 'title' && <TitleScreen onStart={handleStartGame} />}
      {gameState === 'char_creation' && <CharacterCreation onFinish={handleFinishCreation} />}
      
      {(gameState === 'map' || gameState === 'battle') && (
        <>
          <div style={{ backgroundColor: '#0f172a', color: '#fff', padding: '5px', fontSize: '7px', textAlign: 'center', borderBottom: '2px solid #3776ab' }}>
            [ WASD = Andar | E/ENTER = Interagir ]
          </div>
          <StatusBar />
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: '#000' }}>
            
            {/* TÍTULO DA ÁREA (ESTILO DARK SOULS) */}
            {areaTitle && (
                <div style={{
                    position: 'absolute', top: '40px', left: 0, right: 0, zIndex: 1000,
                    display: 'flex', justifyContent: 'center', pointerEvents: 'none', animation: 'title-in-out 4s forwards'
                }}>
                    <div style={{
                        backgroundColor: 'rgba(15, 23, 42, 0.9)', padding: '15px 30px', border: '2px solid #3776ab',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.5)', textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '10px', color: '#ffffff', letterSpacing: '2px' }}>
                            {areaTitle.toUpperCase()}
                        </div>
                        <div style={{ width: '80%', height: '2px', backgroundColor: '#ffd43b', margin: '8px auto 0 auto' }} />
                    </div>
                </div>
            )}

            {merchantMessage && (
                <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', backgroundColor: '#ff8c00', color: '#000', border: '4px double #000', padding: '8px', zIndex: 500, fontSize: '6px', textAlign: 'center', animation: 'slide-down 0.5s ease-out' }}>
                    {merchantMessage}
                </div>
            )}

            <div style={{ display: gameState === 'map' ? 'block' : 'none', height: '100%' }}>
              <MapCanvas key={currentMap.id} map={currentMap} spawnPos={null} onEncounter={triggerBattle} onInteract={handleInteract} onPortal={handlePortal} isDialogActive={!!activeDialog || !!activeChest} />
            </div>
            {gameState === 'battle' && <BattleScreen onWin={() => handleEndBattle(false)} onLose={(dead) => handleEndBattle(dead)} mapId={currentMap.id} />}
            {activeDialog && <DialogBox name={activeDialog.name} messages={activeDialog.messages} onComplete={() => { activeDialog.onFinish?.(); setActiveDialog(null); }} />}
            {activeChest && !activeDialog && <CodeEditor problem={activeChest.puzzle} code={chestCode} onChange={setChestCode} onExecute={handleExecuteChest} onClose={() => setActiveChest(null)} errorFeedback={chestError} />}
          </div>
        </>
      )}
      {flash && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'white', zIndex: 9999, animation: 'flash-fade 0.3s ease-out' }} />}
      <style>{` 
        @keyframes flash-fade { from { opacity: 1; } to { opacity: 0; } } 
        @keyframes slide-down { from { transform: translateY(-100%); } to { transform: translateY(0); } }
        @keyframes title-in-out {
            0% { opacity: 0; transform: scale(0.8); }
            20% { opacity: 1; transform: scale(1); }
            80% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}

export default App;
