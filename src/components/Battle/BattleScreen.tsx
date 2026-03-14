import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../hooks/useGameStore';
import { sounds } from '../../lib/sounds';
import { usePyodide } from '../../hooks/usePyodide';
import { WORLD1_ENEMIES, WORLD2_ENEMIES, WORLD3_ENEMIES, WORLD4_ENEMIES, WORLD5_ENEMIES } from '../../data/bugs';
import type { BugEnemy, BugStage } from '../../data/bugs';
import CodeEditor from './CodeEditor';
import { BugSprite } from './BugSprite';

const HeroBattleSprite: React.FC<{ color: string; gender: string; hasTerminal: boolean }> = ({ color, gender, hasTerminal }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let requestRef: number;
    const render = () => {
      ctx.clearRect(0, 0, 80, 80);
      const now = Date.now();
      const pulse = Math.sin(now / 300) * 2; // Respiração suave
      
      const px = 20;
      const py = 20 + pulse; // O corpo inteiro sobe e desce levemente

      ctx.save();
      // Sombra no chão (não sobe com o pulso)
      ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(px + 8, 20 + 28 + 2, 16, 4); 

      // 1. Capa Longa Rasgada (Atrás)
      ctx.fillStyle = color || '#1e293b'; 
      ctx.beginPath();
      ctx.moveTo(px + 12, py + 16);
      ctx.lineTo(px + 4, py + 34); 
      ctx.lineTo(px + 22, py + 34);
      ctx.lineTo(px + 18, py + 16);
      ctx.fill();
      // Detalhes de rasgos na capa
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(px + 8, py + 30, 2, 4);
      ctx.fillRect(px + 16, py + 31, 2, 3);

      // 2. Braço Esquerdo (Trás) e Ombreira
      const bY = py + 18;
      ctx.fillStyle = '#2c3e50'; ctx.fillRect(px + 10, bY, 4, 8); // Manga
      ctx.fillStyle = '#000'; ctx.fillRect(px + 10, bY + 6, 4, 4); // Luva
      ctx.fillStyle = '#455a64'; ctx.fillRect(px + 9, py + 16, 6, 5); // Ombreira traseira

      // 3. Peitoral de Couro e Cinto (Visão Lateral)
      ctx.fillStyle = '#3e2723'; ctx.fillRect(px + 12, py + 16, 10, 12); // Couro Base (estreito)
      ctx.fillStyle = color || '#5d4037'; ctx.fillRect(px + 13, py + 18, 8, 8); // Detalhe Peito
      
      // Cinto
      ctx.fillStyle = '#1a1a1a'; ctx.fillRect(px + 12, py + 25, 10, 3); 
      ctx.fillStyle = '#ffd43b'; ctx.fillRect(px + 18, py + 25, 3, 3); // Fivela na frente

      // 4. Cabeça: Cabelo Estiloso e Cachecol
      ctx.fillStyle = color || '#96281b'; ctx.fillRect(px + 10, py + 13, 12, 4); // Cachecol
      ctx.fillStyle = '#ffdbac'; ctx.fillRect(px + 10, py + 4, 12, 10); // Rosto
      
      // CABELO (Baseado no gênero)
      ctx.fillStyle = '#21100b'; 
      
      if (gender === 'f') {
          ctx.fillRect(px + 7, py + 1, 18, 6); 
          ctx.fillRect(px + 6, py + 4, 4, 18); 
          ctx.fillRect(px + 22, py + 4, 4, 18); 
          ctx.fillStyle = '#3e2723'; 
          ctx.fillRect(px + 8, py + 0, 16, 3);
          ctx.beginPath();
          ctx.moveTo(px+10, py+6); ctx.lineTo(px+12, py+10); ctx.lineTo(px+14, py+6);
          ctx.moveTo(px+15, py+6); ctx.lineTo(px+17, py+9); ctx.lineTo(px+19, py+6);
          ctx.moveTo(px+20, py+6); ctx.lineTo(px+21, py+10); ctx.lineTo(px+23, py+6);
          ctx.fill();
          ctx.fillStyle = '#5d4037'; 
          ctx.fillRect(px + 11, py + 1, 3, 1); ctx.fillRect(px + 18, py + 1, 3, 1);
          ctx.fillRect(px + 7, py + 8, 1, 4); ctx.fillRect(px + 24, py + 8, 1, 4); 
      } else {
          ctx.fillRect(px + 8, py + 1, 16, 6);
          ctx.fillRect(px + 7, py + 4, 3, 10); 
          ctx.fillRect(px + 22, py + 4, 3, 10); 
          ctx.fillStyle = '#3e2723'; 
          ctx.fillRect(px + 9, py + 0, 14, 3);
          ctx.beginPath();
          ctx.moveTo(px+10, py+6); ctx.lineTo(px+11, py+11); ctx.lineTo(px+13, py+6); 
          ctx.moveTo(px+14, py+6); ctx.lineTo(px+16, py+10); ctx.lineTo(px+18, py+6); 
          ctx.moveTo(px+19, py+6); ctx.lineTo(px+21, py+11); ctx.lineTo(px+22, py+6); 
          ctx.fill();
          ctx.fillStyle = '#5d4037'; 
          ctx.fillRect(px + 11, py + 1, 2, 1); ctx.fillRect(px + 18, py + 1, 3, 1);
      }

      // 5. Olhos Binários (Perfil)
      ctx.fillStyle = 'black'; ctx.fillRect(px + 18, py + 8, 2, 3); // Apenas um olho visível
      ctx.fillStyle = 'white'; ctx.fillRect(px + 18, py + 8, 1, 1);

      // 6. Braço Direito (Frente) e Ombreira
      ctx.fillStyle = '#455a64'; ctx.fillRect(px + 13, py + 16, 8, 6); // Ombreira Frontal
      ctx.fillStyle = '#90a4ae'; ctx.fillRect(px + 14, py + 17, 2, 2); // Brilho

      if (hasTerminal) {
          // Braço erguido interagindo com o holograma
          ctx.fillStyle = '#2c3e50'; ctx.fillRect(px + 16, bY, 12, 5); // Manga estendida
          ctx.fillStyle = '#000'; ctx.fillRect(px + 28, bY, 5, 5); // Luva avançada
      } else {
          // Braço para baixo
          ctx.fillStyle = '#2c3e50'; ctx.fillRect(px + 15, bY, 5, 9); // Manga da frente
          ctx.fillStyle = '#000'; ctx.fillRect(px + 15, bY + 7, 5, 5); // Luva
      }

      // 7. Terminal Holográfico
      if (hasTerminal) {
          const tmx = px + 35;
          const tmy = py + 8;
          const float = Math.sin(now / 150) * 1.5; // Tremulação rápida (digitando)
          
          // Feixe de luz ligando a luva ao terminal
          ctx.strokeStyle = 'rgba(0, 255, 255, 0.4)'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(px + 33, py + 20); ctx.lineTo(tmx, tmy + 10 + float); ctx.stroke();

          // Painel de Código
          ctx.fillStyle = 'rgba(15, 23, 42, 0.85)'; // Fundo escuro
          ctx.fillRect(tmx, tmy + float, 18, 16);
          ctx.strokeStyle = '#00ffff'; ctx.strokeRect(tmx, tmy + float, 18, 16);
          
          // Linhas de código "Matrix" rolando
          ctx.fillStyle = '#2ecc71';
          if(Math.random() > 0.2) ctx.fillRect(tmx+2, tmy+3+float, 14, 1);
          if(Math.random() > 0.2) ctx.fillRect(tmx+4, tmy+7+float, 10, 1);
          if(Math.random() > 0.2) ctx.fillRect(tmx+2, tmy+11+float, 8, 1);
          
          // Glow holográfico
          ctx.fillStyle = 'rgba(0, 255, 255, 0.15)'; 
          ctx.fillRect(tmx, tmy + float, 18, 16);
      }

      // 7. Olhos Binários
      ctx.fillStyle = 'black'; ctx.fillRect(px + 18, py + 8, 2, 3); // Apenas um olho visível lateralmente
      ctx.fillStyle = 'white'; ctx.fillRect(px + 18, py + 8, 1, 1);

      ctx.restore();
      
      requestRef = requestAnimationFrame(render);
    };
    
    requestRef = requestAnimationFrame(render);
    return () => cancelAnimationFrame(requestRef);
  }, [color, gender, hasTerminal]);

  return <canvas ref={canvasRef} width={80} height={80} style={{ transform: 'scale(1.5)', imageRendering: 'pixelated' }} />;
};

interface BattleScreenProps {
  onWin: () => void;
  onLose: (isDead: boolean) => void;
  mapId: string;
  bossOverride?: BugEnemy | null;
}

const BattleScreen: React.FC<BattleScreenProps> = ({ onWin, onLose, mapId, bossOverride }) => {
  const { 
    name, gender, hp, maxHp, color, level, hasTerminal, inventory,
    gainGold, gainXp, recordBugDefeat, takeDamage, useItem 
  } = useGameStore();

  const { isReady, isLoading, runCode } = usePyodide();

  const [enemy, setEnemy] = useState<BugEnemy>(bossOverride || WORLD1_ENEMIES[0]);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [enemyHp, setEnemyHp] = useState(bossOverride ? bossOverride.hp : 100);
  const [message, setMessage] = useState(bossOverride ? bossOverride.stages[0].description : '');
  const [showEditor, setShowEditor] = useState(false);
  const [userCode, setUserCode] = useState('');
  const [chestError, setChestError] = useState<string | null>(null);
  
  const [shake, setShake] = useState(false);
  const [captureFlash, setCaptureFlash] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);

  const currentStage: BugStage = enemy.stages[currentStageIndex];
  const hasDocItem = inventory.some(i => i.id === 'doc_offline' && i.quantity > 0);

  // Dano base do Boss (aumenta com o estágio)
  const getBossDamage = () => {
      if (!bossOverride) return 20;
      return 20 + (currentStageIndex * 15); // Ex: F1=20, F2=35, F3=50
  };

  useEffect(() => {
    // Inicia a música de batalha baseada no tipo de inimigo
    if (bossOverride) {
        if (bossOverride.id === 'malwarech') sounds.playBattleMusic('final');
        else sounds.playBattleMusic('boss');
    } else {
        sounds.playBattleMusic('common');
    }

    return () => sounds.stopMusic(); // Para a música ao sair
  }, [bossOverride]);

  useEffect(() => {
    if (bossOverride) {
        setEnemy(bossOverride);
        setEnemyHp(bossOverride.hp);
        setMessage(bossOverride.stages[0].description);
        return;
    }

    let enemyPool = WORLD1_ENEMIES;
    if (mapId === 'world2') enemyPool = WORLD2_ENEMIES;
    else if (mapId === 'world3') enemyPool = WORLD3_ENEMIES;
    else if (mapId === 'world4') enemyPool = WORLD4_ENEMIES;
    else if (mapId === 'world5') enemyPool = WORLD5_ENEMIES;

    const randomIndex = Math.floor(Math.random() * enemyPool.length);
    const targetEnemy = enemyPool[randomIndex];
    setEnemy(targetEnemy);
    setEnemyHp(targetEnemy.hp);
    setMessage(targetEnemy.stages[0].description);
  }, [mapId, bossOverride]);

  const handleExecute = async () => {
    if (isTransforming || captureFlash || enemyHp <= 0) return;
    sounds.playSelect();
    setChestError(null);
    setShowEditor(false);
    setMessage('Processando correção...');

    const result = await runCode(userCode);

    if (result.success && result.output === currentStage.expectedOutput) {
      sounds.playHit();
      const isLastStage = currentStageIndex === enemy.stages.length - 1;
      const damagePerStage = enemy.hp / enemy.stages.length;
      setEnemyHp(prev => Math.max(0, prev - damagePerStage));

      if (isLastStage) {
        setCaptureFlash(true);
        gainXp(enemy.xpReward); gainGold(enemy.goldReward); recordBugDefeat(enemy.id);
        setMessage(`VITÓRIA SUPREMA! ${enemy.name} foi depurado. +${enemy.xpReward} XP e +${enemy.goldReward} G.`);
        setTimeout(onWin, 3500);
      } else {
        setIsTransforming(true);
        sounds.playHit();
        setMessage(`FASE ${currentStageIndex + 1} CONCLUÍDA! O Boss está enfurecido!`);
        setTimeout(() => {
            setIsTransforming(false);
            setCurrentStageIndex(prev => prev + 1);
            setUserCode('');
            setMessage(enemy.stages[currentStageIndex + 1].description);
        }, 3000);
      }
    } else {
      sounds.playHit();
      setShake(true);
      setTimeout(() => setShake(false), 500);
      const damage = getBossDamage();
      const { isDead } = takeDamage(damage); 
      if (isDead) {
        setMessage('SISTEMA CRÍTICO! O Boss destruiu seus dados...');
        setTimeout(() => onLose(true), 2500);
      } else {
        setChestError(result.success ? `Saída incorreta! Recebeu ${damage} de Dano!` : "Erro de Sintaxe! O sistema tremeu!");
        setShowEditor(true);
      }
    }
  };

  const handleFlee = () => {
    if (isTransforming || captureFlash) return;
    if (bossOverride) {
        setMessage("VOCÊ NÃO PODE FUGIR DE UMA PROVA FINAL!");
        return;
    }
    sounds.playSelect();
    const firewall = inventory.find(i => i.id === 'firewall_pro' && i.quantity > 0);
    
    if (firewall) {
        useItem('firewall_pro');
        setMessage("FIREWALL ATIVADO! Fuga 100% garantida.");
        setTimeout(() => onLose(false), 1500);
        return;
    }

    const chance = Math.random();
    if (chance <= 0.70) {
      setMessage('Fugiu com sucesso!');
      setTimeout(() => onLose(false), 1500);
    } else {
      sounds.playHit();
      const { isDead } = takeDamage(20); 
      if (isDead) {
        setMessage('Você tropeçou! SISTEMA CRÍTICO!');
        setTimeout(() => onLose(true), 2500);
      } else {
        setMessage('Falha ao fugir! O Bug te atacou pelas costas! (-20 HP)');
      }
    }
  };

  const handleHint = () => {
    if (isTransforming || captureFlash) return;
    sounds.playSelect();
    if (hasDocItem) {
        useItem('doc_offline');
        setMessage(`[DOC OFFLINE USADA] ${currentStage.hint}`);
    } else {
        setMessage("VOCÊ PRECISA DO ITEM 'DOC OFFLINE' PARA PEDIR DICAS! COMPRE NO MERCADOR.");
    }
  };

  const actionBtnStyle = (disabled: boolean = false): React.CSSProperties => ({
    flex: '1', padding: '10px', 
    backgroundColor: disabled ? '#475569' : '#3776ab', 
    color: disabled ? '#94a3b8' : '#fff',
    border: '2px solid #0f172a', fontFamily: '"Press Start 2P", monospace',
    fontSize: '7px', cursor: (disabled || isTransforming || captureFlash) ? 'not-allowed' : 'pointer',
    filter: disabled ? 'grayscale(1)' : 'none'
  });

  return (
    <div className={`${shake ? 'shake' : ''} ${captureFlash ? 'capture-flash' : ''} ${isTransforming ? 'boss-transform' : ''}`} style={{ width: '100%', height: '100%', backgroundColor: '#141e30', display: 'flex', flexDirection: 'column', padding: '10px', position: 'relative' }}>
      
      {showEditor && (
        <CodeEditor problem={currentStage?.problem || ''} code={userCode} onChange={setUserCode} onExecute={handleExecute} onClose={() => setShowEditor(false)} errorFeedback={chestError} />
      )}

      {/* HUD Inimigo */}
      <div style={{ alignSelf: 'flex-start', border: '2px solid #3776ab', padding: '8px', width: '220px', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '4px' }}>
        <div style={{ fontSize: '7px', marginBottom: '6px', color: '#ffd43b' }}>{enemy.name} (Nv.{enemy.level})</div>
        <div style={{ width: '100%', height: '6px', backgroundColor: '#000', border: '1px solid #444' }}>
          <div style={{ width: `${(enemyHp / enemy.hp) * 100}%`, height: '100%', backgroundColor: '#2ecc71', transition: 'width 0.3s' }} />
        </div>
      </div>

      {/* Arena Visual */}
      <div style={{ flex: '1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 40px' }}>
        
        {/* PLAYER VISÃO LATERAL (Agora em Canvas) */}
        <div style={{ position: 'relative', width: '64px', height: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <HeroBattleSprite color={color} gender={gender} hasTerminal={hasTerminal} />
        </div>

        {/* ENEMY COM SPRITE DINÂMICO */}
        <div style={{ 
            position: 'relative', width: '80px', height: '80px', 
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            transform: `scale(${1 + currentStageIndex * 0.2})`, 
            filter: `hue-rotate(${currentStageIndex * 20}deg) brightness(${1 + currentStageIndex * 0.1})` 
        }}>
            <BugSprite id={enemy.id} />
        </div>
      </div>

      {/* HUD Player */}
      <div style={{ alignSelf: 'flex-end', border: '2px solid #3776ab', padding: '8px', width: '200px', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '4px' }}>
        <div style={{ fontSize: '7px', marginBottom: '6px', color: '#fff' }}>{name} (Nv.{level})</div>
        <div style={{ width: '100%', height: '6px', backgroundColor: '#000', border: '1px solid #444' }}>
          <div style={{ width: `${(hp / maxHp) * 100}%`, height: '100%', backgroundColor: (hp/maxHp) > 0.3 ? '#2ecc71' : '#ff4757', transition: 'width 0.3s' }} />
        </div>
      </div>

      {/* Caixa de Texto */}
      <div style={{ height: '100px', border: '4px double #3776ab', display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(15, 23, 42, 0.95)', borderRadius: '4px' }}>
        <div style={{ flex: '1', padding: '10px', fontSize: '7px', lineHeight: '1.5', color: '#fff' }}>
          {isLoading ? 'Conectando ao terminal...' : message}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
          <button style={actionBtnStyle(!isReady || isTransforming || captureFlash)} disabled={!isReady || isTransforming || captureFlash} onClick={() => { sounds.playSelect(); setShowEditor(true); }}>DEBUGAR</button>
          <button style={actionBtnStyle(!hasDocItem || isTransforming || captureFlash)} disabled={!hasDocItem || isTransforming || captureFlash} onClick={handleHint}>DICA</button>
          <button style={actionBtnStyle(isTransforming || captureFlash)} disabled={isTransforming || captureFlash} onClick={handleExecute}>EXECUTAR</button>
          <button style={actionBtnStyle(!!bossOverride || isTransforming || captureFlash)} disabled={!!bossOverride || isTransforming || captureFlash} onClick={handleFlee}>FUGIR</button>
        </div>
      </div>

      <style>{`
        @keyframes terminal-glow { from { box-shadow: 0 0 2px #3776ab; } to { box-shadow: 0 0 10px #3776ab; } }
        .boss-transform { animation: transform-flash 0.5s infinite; }
        @keyframes transform-flash { 0% { background-color: #141e30; } 50% { background-color: #96281b; } 100% { background-color: #141e30; } }
      `}</style>
    </div>
  );
};

export default BattleScreen;
