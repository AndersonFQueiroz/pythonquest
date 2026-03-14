import { useState, useEffect, useCallback } from 'react';
import TitleScreen from './components/UI/TitleScreen';
import CharacterCreation from './components/UI/CharacterCreation';
import MapCanvas from './components/Map/MapCanvas';
import BattleScreen from './components/Battle/BattleScreen';
import CreditsScreen from './components/UI/CreditsScreen';
import DialogBox from './components/UI/DialogBox';
import StatusBar from './components/UI/StatusBar';
import CodeEditor from './components/Battle/CodeEditor';
import AuthScreen from './components/UI/AuthScreen';
import CutscenePlayer from './components/UI/CutscenePlayer';
import { world1Map } from './maps/world1';
import { villageMap } from './maps/village';
import { playerHouseMap } from './maps/player_house';
import { world2Map } from './maps/world2';
import { world3Map } from './maps/world3';
import { world4Map } from './maps/world4';
import { world5Map } from './maps/world5';
import { finalBossMap } from './maps/final_boss';
import { sounds } from './lib/sounds';
import { logger } from './lib/logger'; 
import { useGameStore } from './hooks/useGameStore';
import type { InventoryItem } from './hooks/useGameStore';
import { usePyodide } from './hooks/usePyodide';
import { BOSSES_ENEMIES } from './data/bugs';
import { supabase } from './lib/supabase';

export type GameState = 'auth' | 'title' | 'char_creation' | 'loading' | 'map' | 'battle' | 'credits' | 'cutscene';

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
  const [gameState, setGameState] = useState<GameState>('auth');
  const [activeCutscene, setActiveCutscene] = useState<string>('intro');
  const [currentMap, setCurrentMap] = useState(villageMap);
  const [flash, setFlash] = useState(false);
  const [shake, setShake] = useState(false);
  const [activeDialog, setActiveDialog] = useState<{ name: string, messages: string[], onFinish?: () => void } | null>(null);
  
  const [battleBoss, setBattleBoss] = useState<any | null>(null);
  const [showTPMenu, setShowTPMenu] = useState(false);

  const { 
    name: playerName, gold, inventory, gainGold, buyItem, setPlayerPos, openedChests, openChest, 
    resetPlayer, fullReset, logout, merchantMessage, clearMerchantMessage, addNote, hasNotebook, notebookNotes, hasTerminal,
    correctedBugs, setUnlockArrow, debugIgnoreBlocks, setDebugIgnoreBlocks, saveToCloud, userId, setUserId, loadFromCloud
  } = useGameStore();

  const [isSaving, setIsSaving] = useState(false);

  // VERIFICAÇÃO DE SESSÃO AO CARREGAR
  useEffect(() => {
      const checkSession = async () => {
          const { data } = await supabase.auth.getSession();
          if (data.session?.user) {
              setUserId(data.session.user.id);
              const hasSave = await loadFromCloud(data.session.user.id);
              if (hasSave) setGameState('title');
          }
      };
      checkSession();
  }, [setUserId, loadFromCloud]);

  const performSave = async () => {
    if (!userId) return;
    setIsSaving(true);
    await saveToCloud();
    // Mantém o ícone girando por mais 1 segundo para feedback visual agradável
    setTimeout(() => setIsSaving(false), 1000);
  };

  const triggerBossBattle = (bossId: string) => {
      const boss = BOSSES_ENEMIES.find(b => b.id === bossId);
      if (boss) {
          setBattleBoss(boss);
          sounds.playEncounter();
          setFlash(true);
          setTimeout(() => { setGameState('battle'); setFlash(false); }, 500);
      }
  };

  const getCurrentMapWithBoss = () => {
      const map = { ...currentMap };
      if (!map.lockConfig) return map;

      const hasAllBugs = map.lockConfig.requiredBugs.every(id => correctedBugs.includes(id));
      const bossId = map.id === 'world1' ? 'glitch_byte' : 
                     map.id === 'world2' ? 'logic_void' :
                     map.id === 'world3' ? 'stack_overlord' :
                     map.id === 'world4' ? 'protocol_def' :
                     map.id === 'world5' ? 'meta_class' : null;

      if ((hasAllBugs || debugIgnoreBlocks) && bossId && !correctedBugs.includes(bossId)) {
          const isWorld1 = map.id === 'world1';
          const bossNPC = {
              id: bossId,
              name: `BOSS: ${bossId.replace('_', ' ').toUpperCase()}`,
              tileX: isWorld1 ? 17 : map.lockConfig.gatePos.x,
              tileY: isWorld1 ? 6 : map.lockConfig.gatePos.y,
              dialog: ["PARE AI, APRENDIZ!", "Eu sou a Prova Final deste Reino.", "Se voce nao domina a materia, Pythoria sera o seu fim!", "PREPARE-SE PARA A DEPURACAO!"],
              isBoss: true
          };
          if (!map.npcs.some(n => n.id === bossId)) {
              map.npcs = [...map.npcs, bossNPC];
          }
      }
      return map;
  };

  const [areaTitle, setAreaTitle] = useState<string | null>(null);
  const [showNotebook, setShowNotebook] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [shopMessage, setShopMessage] = useState<string | null>(null);

  const [activeChest, setActiveChest] = useState<any | null>(null);
  const [chestCode, setChestCode] = useState('');
  const [chestError, setChestError] = useState<string | null>(null);

  const { runCode } = usePyodide();

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
            const count = correctedBugs.filter(id => currentBugs.includes(id)).length;
            if (count === 4) {
                setUnlockArrow(true);
                setTimeout(() => setUnlockArrow(false), 5000);
            }
        }
    }
  }, [correctedBugs, currentMap.id, setUnlockArrow]);

  const handleStartGame = () => { 
    sounds.playSelect(); 
    fullReset(); // Garante que tudo volte ao zero para um novo jogo
    setGameState('char_creation'); 
  };

  const handleFinishCreation = () => { 
    sounds.playSelect(); 
    setActiveCutscene('intro');
    setGameState('cutscene');
  };

  const handleCutsceneComplete = (cutsceneId: string) => {
    if (cutsceneId === 'intro') {
      setGameState('map');
      triggerAreaTitle(villageMap.name);
      performSave();
    } else if (cutsceneId === 'final') {
      setGameState('credits');
      performSave();
    } else {
      // fragments 1-5
      setGameState('map');
      performSave();
    }
  };

  const triggerAreaTitle = (name: string) => {
    setAreaTitle(name);
    setTimeout(() => setAreaTitle(null), 4000);
  };

  const triggerShake = useCallback(() => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }, []);

  // AUTOSAVE SILENCIOSO A CADA 2 MINUTOS
  useEffect(() => {
      if (gameState === 'auth' || gameState === 'title') return;

      const autoSaveInterval = setInterval(() => {
          if (userId) {
              performSave();
          }
      }, 120000); // 120 segundos

      return () => clearInterval(autoSaveInterval);
  }, [gameState, userId]);

  const triggerBattle = useCallback(() => {
    if (activeDialog || activeChest || showNotebook || showShop) return;
    sounds.playEncounter();
    setFlash(true);
    setTimeout(() => { setGameState('battle'); setFlash(false); }, 500);
  }, [activeDialog, activeChest, showNotebook, showShop]);

  const handleInteract = useCallback((interaction: any) => {
    if (!interaction || activeDialog || activeChest || showNotebook || showShop) return;

    if (interaction.type === 'npc' || interaction.type === 'sign') {
      const npc = interaction.data;
      let messages = npc.messages || npc.dialog; // Suporta as duas propriedades

      // LOGICA DA CAMA (SAVE)
      if (messages && messages[0] === 'bed_save') {
          setActiveDialog({
              name: 'CAMA',
              messages: ["Deseja descansar e salvar o jogo?"],
              onFinish: () => {
                  sounds.playSelect();
                  performSave();
                  setFlash(true);
                  setTimeout(() => setFlash(false), 300);
                  setActiveDialog({ name: 'SISTEMA', messages: ['Progresso sincronizado com a Nuvem.'] });
              }
          });
          return;
      }
      if (npc.id === 'pep8' && hasTerminal) {
          messages = [
              "O mundo do PythonQuest é regido pelo Zen do Python.",
              "Os Bugs que você vê são fragmentos de lógica que perderam sua clareza.",
              "Sua missão é restaurar a ordem depurando cada um deles.",
              "Vá para o Leste, entre na Floresta das Variáveis e comece sua jornada!",
              "Lembre-se: 'Explícito é melhor que implícito'."
          ];
      }

      setActiveDialog({ 
          name: npc.name || 'PLACA', 
          messages,
          onFinish: npc.isBoss ? () => triggerBossBattle(npc.id) : undefined
      });

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
        performSave();
    } else {
        sounds.playHit(); 
        triggerShake();
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
      else if (targetMapId === 'world5') target = world5Map;
      else if (targetMapId === 'player_house') target = playerHouseMap;
      else if (targetMapId === 'final_boss') target = finalBossMap;
      else target = villageMap;
      setCurrentMap(target);
      setPlayerPos({ x, y });
      setFlash(false);
      triggerAreaTitle(target.name);
      performSave();
    }, 300);
  }, [setPlayerPos]);

  const handleEndBattle = (isDead: boolean) => {
    const wasBoss = !!battleBoss;

    if (isDead) {        resetPlayer(); 
        setCurrentMap(villageMap); 
        setPlayerPos({ x: 10, y: 10 });
        setFlash(true); 
        setGameState('map');
        setTimeout(() => {
            setFlash(false);
            setActiveDialog({ name: 'Mentora PEP-8', messages: ["Seu sistema falhou...", "Vou restaurar seus dados. Não desista!"] });
            performSave();
        }, 500);
    } else {
        const bossFragmentMap: Record<string, string> = {
            'glitch_byte':    'fragment_1',
            'logic_void':     'fragment_2',
            'stack_overlord': 'fragment_3',
            'protocol_def':   'fragment_4',
            'meta_class':     'fragment_5',
            'malwarech':      'final',
        };

        if (wasBoss && battleBoss) {
            const fragment = bossFragmentMap[battleBoss.id];
            if (fragment) {
                setActiveCutscene(fragment);
                setGameState('cutscene');
                setBattleBoss(null);
                return;
            }
        }

        // Batalhas comuns
        setGameState('map');
        performSave();
    }
    setBattleBoss(null);
  };
  const handleEndAuth = () => {
      // O usuário pediu pra SEMPRE ir pra tela inicial apos o login.
      setGameState('title');
  };  useEffect(() => {
    if (merchantMessage) {
        const timer = setTimeout(clearMerchantMessage, 5000);
        return () => clearTimeout(timer);
    }
  }, [merchantMessage, clearMerchantMessage]);

  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
        if (gameState !== 'map') return;
        const target = e.target as HTMLElement;
        if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT' || activeChest || activeDialog || showShop) return;
        if (e.key.toLowerCase() === 'c' && hasNotebook) setShowNotebook(prev => !prev);
    };
    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, [hasNotebook, gameState, activeChest, activeDialog, showShop]);

  return (
    <div className={shake ? 'shake' : ''} style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', flexDirection: 'column' }}>

      {gameState === 'auth' && (
        <AuthScreen 
            onLoginSuccess={handleEndAuth} 
            onSkip={() => setGameState('title')} 
        />
      )}
      {gameState === 'title' && <TitleScreen onStart={handleStartGame} onContinue={() => { sounds.playSelect(); setGameState('map'); }} />}
      {gameState === 'char_creation' && <CharacterCreation onFinish={handleFinishCreation} />}
      {gameState === 'cutscene' && (
        <CutscenePlayer 
            cutsceneId={activeCutscene as any}
            playerName={playerName}
            onComplete={() => handleCutsceneComplete(activeCutscene)}
        />
      )}

      {(gameState === 'map' || gameState === 'battle' || gameState === 'credits') && (
        <>
          <div style={{ backgroundColor: '#0f172a', color: '#fff', padding: '5px', fontSize: '7px', textAlign: 'center', borderBottom: '2px solid #3776ab', position: 'relative' }}>
            {hasNotebook ? '[ WASD = Andar | E = Interagir | C = Caderno ]' : '[ WASD = Andar | E/ENTER = Interagir ]'}

            <button 
                onClick={() => setShowTPMenu(!showTPMenu)}
                style={{
                    position: 'absolute', left: '5px', top: '50%', transform: 'translateY(-50%)',
                    fontSize: '5px', padding: '2px 5px', cursor: 'pointer',
                    backgroundColor: '#3776ab',
                    color: '#fff', border: 'none', borderRadius: '2px', fontFamily: '"Press Start 2P"'
                }}
            >
                TP
            </button>

            {/* ÍCONE DE AUTOSAVE */}
            {isSaving && (
                <div style={{
                    position: 'absolute', right: '70px', top: '50%', transform: 'translateY(-50%)',
                    fontSize: '6px', color: '#ffd43b', display: 'flex', alignItems: 'center', gap: '8px',
                    backgroundColor: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: '4px', border: '1px solid #ffd43b'
                }}>
                    <div style={{ 
                        width: '8px', height: '8px', border: '2px solid #ffd43b', 
                        borderTopColor: 'transparent', borderRadius: '50%', 
                        animation: 'spin 0.6s linear infinite' 
                    }} />
                    SALVANDO...
                </div>
            )}

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

            {userId && (
                <button 
                    onClick={async () => { 
                        if(window.confirm("Deseja encerrar a sessão? O progresso não salvo será perdido.")) {
                            await logout(); 
                            setGameState('auth'); 
                        }
                    }}
                    style={{
                        position: 'absolute', right: '5px', top: '-25px',
                        fontSize: '5px', padding: '4px 8px', cursor: 'pointer',
                        backgroundColor: '#1e293b',
                        color: '#ff4757', border: '1px solid #ff4757', borderRadius: '4px', fontFamily: '"Press Start 2P"'
                    }}
                >
                    LOGOUT
                </button>
            )}
          </div>
          <StatusBar />          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: '#000' }}>
            
            {gameState === 'credits' && <CreditsScreen playerName={playerName} onFinish={() => { resetPlayer(); setGameState('title'); }} />}

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
              <MapCanvas key={currentMap.id} map={getCurrentMapWithBoss()} spawnPos={null} onEncounter={triggerBattle} onInteract={handleInteract} onPortal={handlePortal} onOpenNotebook={() => setShowNotebook(true)} isDialogActive={!!activeDialog || !!activeChest || showNotebook || showShop} />
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
                    <button onClick={() => { sounds.playSelect(); logger.exportLogs(); }} style={{ marginTop: '10px', padding: '10px', backgroundColor: '#3776ab', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '6px', opacity: 0.8 }}>GERAR RELATÓRIO DE ERROS</button>
                    <button onClick={() => setShowNotebook(false)} style={{ marginTop: '10px', padding: '10px', backgroundColor: '#856404', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '8px' }}>FECHAR (C)</button>
                </div>
            )}

            {showTPMenu && (
                <div style={{ position: 'absolute', left: '5px', top: '5px', backgroundColor: 'rgba(15, 23, 42, 0.95)', border: '2px solid #3776ab', zIndex: 5000, padding: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <div style={{ fontSize: '5px', color: '#ffd43b', marginBottom: '5px', textAlign: 'center' }}>TELEPORTE RÁPIDO</div>
                    {[
                        { id: 'village', name: 'VILA', x: 10, y: 10 },
                        { id: 'world1', name: 'R1: VARIÁVEIS', x: 1, y: 6 },
                        { id: 'world2', name: 'R2: DECISÕES', x: 1, y: 7 },
                        { id: 'world3', name: 'R3: LOOPS', x: 1, y: 7 },
                        { id: 'world4', name: 'R4: FUNÇÕES', x: 1, y: 7 },
                        { id: 'world5', name: 'R5: OOP', x: 1, y: 7 },
                        { id: 'final_boss', name: 'BOSS FINAL', x: 11, y: 21 }
                    ].map(loc => (
                        <button key={loc.id} onClick={() => { handlePortal(loc.id, loc.x, loc.y); setShowTPMenu(false); }} style={{ padding: '5px', fontSize: '5px', fontFamily: '"Press Start 2P"', cursor: 'pointer', backgroundColor: '#1e293b', color: '#fff', border: '1px solid #3776ab' }}>
                            {loc.name}
                        </button>
                    ))}
                    <button onClick={() => setShowTPMenu(false)} style={{ marginTop: '5px', padding: '5px', fontSize: '5px', color: '#ff4757', border: 'none', background: 'none', cursor: 'pointer' }}>[X] FECHAR</button>
                </div>
            )}

            {showShop && (
                <div style={{ position: 'absolute', inset: '20px', backgroundColor: 'rgba(15, 23, 42, 0.98)', border: '4px solid #ff8c00', zIndex: 2000, padding: '20px', color: '#fff', fontFamily: '"Press Start 2P"', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '10px', textAlign: 'center', marginBottom: '15px', color: '#ff8c00' }}>[ LOJA DO MERCADOR ]</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
                        <div style={{ fontSize: '6px', color: shopMessage?.includes('INSUFICIENTE') ? '#ff4757' : '#2ecc71', height: '10px' }}>{shopMessage}</div>
                        <div style={{ fontSize: '8px', color: '#ffd43b' }}>SEU OURO: {gold} G</div>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {MERCHANT_STOCK.map(item => (
                            <div key={item.id} style={{ padding: '10px', border: '1px solid #3776ab', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                                    <div style={{ transform: 'scale(1.5)' }}><ItemIcon id={item.id} /></div>
                                    <div>
                                        <div style={{ fontSize: '7px', color: '#ffd43b' }}>{item.name} - {item.price} G</div>
                                        <div style={{ fontSize: '5px', marginTop: '4px', opacity: 0.8, lineHeight: '1.4' }}>{item.description}</div>
                                    </div>
                                </div>
                                <button onClick={() => { sounds.playSelect(); const r = buyItem(item); setShopMessage(r.message); performSave(); setTimeout(() => setShopMessage(null), 3000); }} style={{ padding: '8px', backgroundColor: '#3776ab', color: '#fff', border: 'none', fontSize: '6px', cursor: 'pointer', boxShadow: '0 2px 0 #0f172a' }}>COMPRAR</button>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => { setShowShop(false); setShopMessage(null); }} style={{ marginTop: '10px', padding: '10px', backgroundColor: '#ff4757', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '8px' }}>SAIR DA LOJA</button>
                </div>
            )}

            {gameState === 'battle' && <BattleScreen onWin={() => handleEndBattle(false)} onLose={(dead) => handleEndBattle(dead)} mapId={currentMap.id} bossOverride={battleBoss} />}
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
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default App;

// Vercel Force Update: 03/14/2026 00:15:48
