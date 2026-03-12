import { useState, useEffect, useCallback } from 'react';
import TitleScreen from './components/UI/TitleScreen';
import CharacterCreation from './components/UI/CharacterCreation';
import MapCanvas from './components/Map/MapCanvas';
import BattleScreen from './components/Battle/BattleScreen';
import DialogBox from './components/UI/DialogBox';
import StatusBar from './components/UI/StatusBar';
import CodeEditor from './components/Battle/CodeEditor';
import { world1Map } from './maps/world1';
import { villageMap } from './maps/village';
import { world2Map } from './maps/world2';
import { world3Map } from './maps/world3';
import { world4Map } from './maps/world4';
import { sounds } from './lib/sounds';
import { logger } from './lib/logger'; // Importar logger
import { useGameStore } from './hooks/useGameStore';
import type { InventoryItem } from './hooks/useGameStore';
import { usePyodide } from './hooks/usePyodide';

export type GameState = 'title' | 'char_creation' | 'loading' | 'map' | 'battle';

const ItemIcon: React.FC<{ id: string }> = ({ id }) => {
    switch (id) {
        case 'ssd_1tb': return <div style={{ width: '12px', height: '15px', backgroundColor: '#cbd5e1', border: '1px solid #3776ab', borderRadius: '1px' }} />;
        case 'firewall_pro': return <div style={{ width: '14px', height: '14px', backgroundColor: '#ff4757', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />;
        case 'doc_offline': return <div style={{ width: '12px', height: '16px', backgroundColor: '#fff', border: '1px solid #ff8c00', position: 'relative' }}><div style={{ position: 'absolute', top: '4px', left: '2px', width: '8px', height: '1px', backgroundColor: '#333' }} /><div style={{ position: 'absolute', top: '8px', left: '2px', width: '8px', height: '1px', backgroundColor: '#333' }} /></div>;
        default: return null;
    }
};

const MERCHANT_STOCK: InventoryItem[] = [
    { id: 'ssd_1tb', name: 'SSD de 1TB', description: 'Aumento permanente de +20 no HP Máximo.', price: 1000, quantity: 1, type: 'permanent' },
    { id: 'firewall_pro', name: "Firewall 'Pro'", description: 'Garante 100% de chance de fuga.', price: 150, quantity: 1, type: 'consumable' },
    { id: 'doc_offline', name: 'Doc Offline', description: 'Uma dica grátis em batalha (sem gastar XP).', price: 80, quantity: 1, type: 'consumable' }
];

function App() {
  const [gameState, setGameState] = useState<GameState>('title');
  const [currentMap, setCurrentMap] = useState(villageMap);
  const [flash, setFlash] = useState(false);
  const [activeDialog, setActiveDialog] = useState<{ name: string, messages: string[], onFinish?: () => void } | null>(null);
  
  const [areaTitle, setAreaTitle] = useState<string | null>(null);
  const [showNotebook, setShowNotebook] = useState(false);
  const [showShop, setShowShop] = useState(false);

  const [activeChest, setActiveChest] = useState<any | null>(null);
  const [chestCode, setChestCode] = useState('');
  const [chestError, setChestError] = useState<string | null>(null);
  
  const { runCode } = usePyodide();
  const { 
    gold, inventory, gainGold, buyItem, setPlayerPos, openedChests, openChest, 
    resetPlayer, merchantMessage, clearMerchantMessage, addNote, hasNotebook, notebookNotes, hasTerminal,
    correctedBugs, setUnlockArrow, debugIgnoreBlocks, setDebugIgnoreBlocks
  } = useGameStore();

  // Monitora progresso de Bugmons para liberar o próximo Reino
  useEffect(() => {
    const kingdomBugs = {
        'world1': ['syntax_wasp', 'type_goblin', 'name_bat', 'print_ghost'],
        'world2': ['if_slime', 'bool_bat', 'else_troll', 'logic_snake'],
        'world3': ['for_spider', 'while_worm', 'range_rat', 'break_beetle'],
        'world4': ['def_dragon', 'return_raven', 'param_pig', 'scope_scorp']
    };

    const currentBugs = kingdomBugs[currentMap.id as keyof typeof kingdomBugs];
    if (currentBugs) {
        const cleared = currentBugs.every(id => correctedBugs.includes(id));
        if (cleared) {
            // Só dispara se acabamos de completar
            const count = correctedBugs.filter(id => currentBugs.includes(id)).length;
            if (count === 4) {
                // Ativa a seta por 5 segundos
                setUnlockArrow(true);
                setTimeout(() => setUnlockArrow(false), 5000);
            }
        }
    }
  }, [correctedBugs, currentMap.id, setUnlockArrow]);

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

  const triggerBattle = useCallback(() => {
    if (activeDialog || activeChest || showNotebook || showShop) return;
    sounds.playEncounter();
    setFlash(true);
    setTimeout(() => { setGameState('battle'); setFlash(false); }, 500);
  }, [activeDialog, activeChest, showNotebook, showShop]);

  const handleInteract = useCallback((interaction: any) => {
    if (!interaction || activeDialog || activeChest || showNotebook || showShop) return;

    if (interaction.type === 'npc' || interaction.type === 'sign') {
      let messages = interaction.data.dialog;
      
      // Diálogo de Lore após PEP-8 entregar os itens
      if (interaction.data.id === 'pep8' && hasTerminal) {
          messages = [
              "O mundo do PythonQuest é regido pelo Zen do Python.",
              "Os Bugs que você vê são fragmentos de lógica que perderam sua clareza.",
              "Sua missão é restaurar a ordem depurando cada um deles.",
              "Vá para o Leste, entre na Floresta das Variáveis e comece sua jornada!",
              "Lembre-se: 'Explícito é melhor que implícito'."
          ];
      }

      setActiveDialog({ name: interaction.data.name || 'PLACA', messages });
      
      // Salva no caderno se for uma placa de aula (começa com [ AULA ou BEM-VINDO)
      if (interaction.type === 'sign' && (messages[0].startsWith('[ AULA') || messages[0].startsWith('BEM-VINDO'))) {
          addNote(messages[0], messages);
      }
    } else if (interaction.type === 'merchant') {
        setActiveDialog({ 
            name: 'MERCADOR GLITCH', 
            messages: ["Hehehe... Bem-vindo, explorador!", "Tenho peças raras para o seu sistema.", "Deseja ver o meu estoque?"],
            onFinish: () => setShowShop(true)
        });
    } else if (interaction.type === 'chest') {
      const chest = interaction.data;
      const chestId = `${currentMap.id}_${chest.tileX}_${chest.tileY}`;
      if (openedChests.includes(chestId)) {
        setActiveDialog({ name: 'COFRE ABERTO', messages: ['Este cofre já foi depurado.'] });
        return;
      }
      setActiveChest({ ...chest, uniqueId: chestId });
      setChestCode(''); setChestError(null);
      setActiveDialog({ name: 'COFRE CORROMPIDO', messages: [chest.description] });
    }
  }, [activeDialog, activeChest, showNotebook, showShop, currentMap.id, openedChests, addNote, hasTerminal]);

  const handleExecuteChest = async () => {
    if (!activeChest) return;
    sounds.playSelect();
    const result = await runCode(chestCode);
    if (result.success && result.output?.trim() === activeChest.expected) {
        sounds.playHit(); gainGold(activeChest.reward); openChest(activeChest.uniqueId); 
        setActiveChest(null);
        setActiveDialog({ name: 'SISTEMA', messages: ['Código validado!', `Recebido ${activeChest.reward} GOLD.`] });
    } else {
        sounds.playHit(); 
        setChestError(result.success ? `Saída incorreta: "${result.output}"` : result.error.split('\n').pop() || 'Erro');
    }
  };

  const handlePortal = useCallback((targetMapId: string, x: number, y: number) => {
    sounds.playSelect(); setFlash(true);
    setTimeout(() => {
      let target;
      if (targetMapId === 'world1') target = world1Map;
      else if (targetMapId === 'world2') target = world2Map;
      else if (targetMapId === 'world3') target = world3Map;
      else if (targetMapId === 'world4') target = world4Map;
      else target = villageMap;
      setCurrentMap(target);
      setPlayerPos({ x, y });
      setFlash(false);
      triggerAreaTitle(target.name);
    }, 300);
  }, [setPlayerPos]);

  const handleEndBattle = (isDead: boolean) => {
    if (isDead) {
        resetPlayer(); setCurrentMap(villageMap); setFlash(true); setGameState('map');
        setTimeout(() => {
            setFlash(false);
            setActiveDialog({ name: 'Mentora PEP-8', messages: ["Seu sistema falhou...", "Vou restaurar seus dados. Não desista!"] });
        }, 500);
    } else { setGameState('map'); }
  };

  useEffect(() => {
    if (merchantMessage) {
        const timer = setTimeout(clearMerchantMessage, 5000);
        return () => clearTimeout(timer);
    }
  }, [merchantMessage, clearMerchantMessage]);

  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
        if (gameState !== 'map') return;
        
        // Bloqueio rigoroso: se o alvo do evento for um campo de texto, ignora o atalho
        const target = e.target as HTMLElement;
        if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT' || activeChest || activeDialog || showShop) return;
        
        if (e.key.toLowerCase() === 'c' && hasNotebook) setShowNotebook(prev => !prev);
    };
    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, [hasNotebook, gameState, activeChest, activeDialog, showShop]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>
      
      {gameState === 'title' && <TitleScreen onStart={handleStartGame} />}
      {gameState === 'char_creation' && <CharacterCreation onFinish={handleFinishCreation} />}
      
      {(gameState === 'map' || gameState === 'battle') && (
        <>
          <div style={{ backgroundColor: '#0f172a', color: '#fff', padding: '5px', fontSize: '7px', textAlign: 'center', borderBottom: '2px solid #3776ab', position: 'relative' }}>
            {hasNotebook ? '[ WASD = Andar | E = Interagir | C = Caderno ]' : '[ WASD = Andar | E/ENTER = Interagir ]'}
            
            {/* BOTÃO DEBUG - APENAS PARA TESTES */}
            <button 
                onClick={() => setDebugIgnoreBlocks(!debugIgnoreBlocks)}
                style={{
                    position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)',
                    fontSize: '5px', padding: '2px 5px', cursor: 'pointer',
                    backgroundColor: debugIgnoreBlocks ? '#2ecc71' : '#ff4757',
                    color: '#fff', border: 'none', borderRadius: '2px', fontFamily: '"Press Start 2P"'
                }}
            >
                {debugIgnoreBlocks ? 'LOCK: OFF' : 'LOCK: ON'}
            </button>
          </div>
          <StatusBar />
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: '#000' }}>
            
            {areaTitle && (
                <div style={{ position: 'absolute', top: '40px', left: 0, right: 0, zIndex: 1000, display: 'flex', justifyContent: 'center', pointerEvents: 'none', animation: 'title-in-out 4s forwards' }}>
                    <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', padding: '15px 30px', border: '2px solid #3776ab', boxShadow: '0 5px 15px rgba(0,0,0,0.5)', textAlign: 'center' }}>
                        <div style={{ fontSize: '10px', color: '#ffffff', letterSpacing: '2px' }}>{areaTitle.toUpperCase()}</div>
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
              <MapCanvas key={currentMap.id} map={currentMap} spawnPos={null} onEncounter={triggerBattle} onInteract={handleInteract} onPortal={handlePortal} onOpenNotebook={() => setShowNotebook(true)} isDialogActive={!!activeDialog || !!activeChest || showNotebook || showShop} />
            </div>

            {showNotebook && (
                <div style={{ position: 'absolute', inset: '20px', backgroundColor: '#fdf6e3', border: '8px double #856404', zIndex: 2000, padding: '20px', color: '#333', fontFamily: '"Press Start 2P"', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>
                    <h3 style={{ fontSize: '10px', textAlign: 'center', marginBottom: '20px', color: '#856404', borderBottom: '2px solid #856404', paddingBottom: '10px' }}>[ CADERNO E INVENTÁRIO ]</h3>
                    
                    <div style={{ display: 'flex', gap: '20px', flex: 1, overflow: 'hidden' }}>
                        <div style={{ flex: 1, overflowY: 'auto', fontSize: '6px', lineHeight: '1.8', borderRight: '1px solid #ddd', paddingRight: '10px' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#856404' }}>ANOTAÇÕES:</div>
                            {notebookNotes.length === 0 ? <p style={{opacity: 0.5}}>Sem notas.</p> : notebookNotes.map((note, i) => (
                                <div key={i} style={{ marginBottom: '15px' }}>
                                    <div style={{ fontWeight: 'bold', color: '#b58900' }}>{note.title}</div>
                                    {note.content.slice(1).map((line, j) => <div key={j} style={{ whiteSpace: 'pre-wrap' }}>• {line}</div>)}
                                </div>
                            ))}
                        </div>
                        <div style={{ width: '130px', fontSize: '6px' }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#856404' }}>MOCHILA:</div>
                            {inventory.filter(i => i.type === 'consumable').length === 0 ? <p style={{opacity: 0.5}}>Mochila vazia.</p> : 
                                inventory.filter(i => i.type === 'consumable').map(item => (
                                <div key={item.id} style={{ marginBottom: '10px', padding: '8px', border: '1px solid #856404', backgroundColor: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <ItemIcon id={item.id} />
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                                        <div style={{ color: '#856404', marginTop: '2px' }}>Qtd: {item.quantity}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* BOTÃO DE TELEMETRIA (DEBUG) */}
                    <button 
                        onClick={() => { sounds.playSelect(); logger.exportLogs(); }} 
                        style={{ marginTop: '10px', padding: '10px', backgroundColor: '#3776ab', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '6px', opacity: 0.8 }}
                    >
                        GERAR RELATÓRIO DE ERROS
                    </button>

                    <button onClick={() => setShowNotebook(false)} style={{ marginTop: '10px', padding: '10px', backgroundColor: '#856404', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '8px' }}>FECHAR (C)</button>
                </div>
            )}

            {showShop && (
                <div style={{ position: 'absolute', inset: '20px', backgroundColor: 'rgba(15, 23, 42, 0.98)', border: '4px solid #ff8c00', zIndex: 2000, padding: '20px', color: '#fff', fontFamily: '"Press Start 2P"', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '10px', textAlign: 'center', marginBottom: '15px', color: '#ff8c00' }}>[ LOJA DO MERCADOR ]</h3>
                    <div style={{ fontSize: '8px', textAlign: 'right', marginBottom: '10px', color: '#ffd43b' }}>SEU OURO: {gold} G</div>
                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {MERCHANT_STOCK.map(item => (
                            <div key={item.id} style={{ padding: '10px', border: '1px solid #3776ab', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                                    <div style={{ transform: 'scale(1.5)' }}>
                                        <ItemIcon id={item.id} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '7px', color: '#ffd43b' }}>{item.name} - {item.price} G</div>
                                        <div style={{ fontSize: '5px', marginTop: '4px', opacity: 0.8, lineHeight: '1.4' }}>{item.description}</div>
                                    </div>
                                </div>
                                <button onClick={() => { sounds.playSelect(); const r = buyItem(item); if(!r.success) alert(r.message); }} style={{ padding: '8px', backgroundColor: '#3776ab', color: '#fff', border: 'none', fontSize: '6px', cursor: 'pointer', boxShadow: '0 2px 0 #0f172a' }}>COMPRAR</button>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => setShowShop(false)} style={{ marginTop: '10px', padding: '10px', backgroundColor: '#ff4757', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '8px' }}>SAIR DA LOJA</button>
                </div>
            )}

            {gameState === 'battle' && <BattleScreen onWin={() => handleEndBattle(false)} onLose={(dead) => handleEndBattle(dead)} mapId={currentMap.id} />}
            {activeDialog && <DialogBox name={activeDialog.name} messages={activeDialog.messages} onComplete={() => { if(activeDialog.onFinish) activeDialog.onFinish(); setActiveDialog(null); }} />}
            {activeChest && !activeDialog && <CodeEditor problem={activeChest.puzzle} code={chestCode} onChange={setChestCode} onExecute={handleExecuteChest} onClose={() => setActiveChest(null)} errorFeedback={chestError} />}
          </div>
        </>
      )}
      {flash && <div style={{ position: 'absolute', inset: 0, backgroundColor: 'white', zIndex: 9999, animation: 'flash-fade 0.3s ease-out' }} />}
      <style>{` 
        @keyframes flash-fade { from { opacity: 1; } to { opacity: 0; } } 
        @keyframes slide-down { from { transform: translateY(-100%); } to { transform: translateY(0); } }
        @keyframes title-in-out { 0% { opacity: 0; transform: scale(0.8); } 20% { opacity: 1; transform: scale(1); } 80% { opacity: 1; transform: scale(1); } 100% { opacity: 0; transform: scale(1.1); } }
      `}</style>
    </div>
  );
}

export default App;
