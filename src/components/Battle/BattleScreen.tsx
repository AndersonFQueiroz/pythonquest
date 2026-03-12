import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../hooks/useGameStore';
import { sounds } from '../../lib/sounds';
import { usePyodide } from '../../hooks/usePyodide';
import { WORLD1_ENEMIES, WORLD2_ENEMIES, WORLD3_ENEMIES, WORLD4_ENEMIES, WORLD5_ENEMIES } from '../../data/bugs';
import type { BugEnemy, BugStage } from '../../data/bugs';
import CodeEditor from './CodeEditor';
import { BugSprite } from './BugSprite';

interface BattleScreenProps {
  onWin: () => void;
  onLose: (isDead: boolean) => void;
  mapId: string;
}

const BattleScreen: React.FC<BattleScreenProps> = ({ onWin, onLose, mapId }) => {
  const { 
    name, hp, maxHp, color, level, hasTerminal, inventory,
    gainGold, gainXp, recordBugDefeat, takeDamage, useItem 
  } = useGameStore();

  const { isReady, isLoading, runCode } = usePyodide();

  const [enemy, setEnemy] = useState<BugEnemy>(WORLD1_ENEMIES[0]);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [enemyHp, setEnemyHp] = useState(100);
  const [message, setMessage] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [userCode, setUserCode] = useState('');
  const [chestError, setChestError] = useState<string | null>(null);

  const currentStage: BugStage = enemy.stages[currentStageIndex];
  const hasDocItem = inventory.some(i => i.id === 'doc_offline' && i.quantity > 0);

  useEffect(() => {
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
  }, [mapId]);

  const handleExecute = async () => {
    sounds.playSelect();
    setChestError(null);
    setShowEditor(false);
    setMessage('Processando correção...');

    const result = await runCode(userCode);

    if (result.success && result.output === currentStage.expectedOutput) {
      sounds.playHit();
      const isLastStage = currentStageIndex === enemy.stages.length - 1;
      const damage = isLastStage ? enemyHp : enemy.hp / enemy.stages.length;
      setEnemyHp(prev => Math.max(0, prev - damage));
      if (isLastStage) {
        gainXp(enemy.xpReward); gainGold(enemy.goldReward); recordBugDefeat(enemy.id);
        setMessage(`VITÓRIA! +${enemy.xpReward} XP e +${enemy.goldReward} GOLD.`);
        setTimeout(onWin, 3000);
      } else {
        setMessage('CÓDIGO ACEITO! O Bug sofreu dano.');
        setCurrentStageIndex(prev => prev + 1);
        setUserCode('');
        setTimeout(() => setMessage(enemy.stages[currentStageIndex + 1].description), 2000);
      }
    } else {
      sounds.playHit();
      const { isDead } = takeDamage(20); 
      if (isDead) {
        setMessage('SISTEMA CRÍTICO! Você desmaiou...');
        setTimeout(() => onLose(true), 2500);
      } else {
        setChestError(result.success ? "Saída incorreta! O Bug contra-atacou!" : "Erro de Sintaxe!");
        setShowEditor(true);
      }
    }
  };

  const handleFlee = () => {
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
    fontSize: '7px', cursor: 'pointer',
    filter: disabled ? 'grayscale(1)' : 'none'
  });

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#141e30', display: 'flex', flexDirection: 'column', padding: '10px', position: 'relative' }}>
      
      {showEditor && (
        <CodeEditor problem={currentStage.problem} code={userCode} onChange={setUserCode} onExecute={handleExecute} onClose={() => setShowEditor(false)} errorFeedback={chestError} />
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
        
        {/* PLAYER VISÃO LATERAL */}
        <div style={{ position: 'relative', width: '64px', height: '80px', transform: 'scale(1.5)' }}>
            <div style={{ position: 'absolute', left: '0px', top: '30px', width: '12px', height: '20px', backgroundColor: '#1e293b', border: '2px solid #000', borderRadius: '4px' }} />
            <div style={{ position: 'absolute', left: '2px', top: '22px', width: '8px', height: '10px', backgroundColor: '#cbd5e1', border: '1px solid #000' }} />
            <div style={{ position: 'absolute', left: '10px', top: '32px', width: '18px', height: '22px', backgroundColor: color, border: '2px solid #000' }} />
            <div style={{ position: 'absolute', left: '12px', top: '14px', width: '16px', height: '18px', backgroundColor: '#ffdbac', border: '2px solid #000' }} />
            <div style={{ position: 'absolute', left: '12px', top: '14px', width: '16px', height: '6px', backgroundColor: '#4b2c20' }} />
            <div style={{ position: 'absolute', left: '24px', top: '14px', width: '4px', height: '12px', backgroundColor: '#4b2c20' }} />
            <div style={{ position: 'absolute', left: '22px', top: '22px', width: '3px', height: '4px', backgroundColor: '#000' }} />
            <div style={{ position: 'absolute', left: '18px', top: '38px', width: '14px', height: '6px', backgroundColor: '#ffdbac', border: '1px solid #000', borderRadius: '3px', transform: 'rotate(-20deg)' }} />
            
            {hasTerminal && (
                <div style={{ position: 'absolute', left: '28px', top: '30px', width: '12px', height: '16px', backgroundColor: '#0f172a', border: '1px solid #3776ab', borderRadius: '2px', animation: 'terminal-glow 1s infinite alternate' }}>
                    <div style={{ width: '8px', height: '6px', backgroundColor: '#3776ab', margin: '2px auto', opacity: 0.8 }} />
                </div>
            )}

            <div style={{ position: 'absolute', left: '12px', top: '54px', width: '6px', height: '8px', backgroundColor: '#0f172a' }} />
            <div style={{ position: 'absolute', left: '20px', top: '54px', width: '6px', height: '8px', backgroundColor: '#0f172a' }} />
        </div>

        {/* ENEMY COM SPRITE DINÂMICO */}
        <div style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
          <button style={actionBtnStyle(!isReady)} disabled={!isReady} onClick={() => { sounds.playSelect(); setShowEditor(true); }}>DEBUGAR</button>
          <button style={actionBtnStyle(!hasDocItem)} onClick={handleHint}>DICA</button>
          <button style={actionBtnStyle()} onClick={handleExecute}>EXECUTAR</button>
          <button style={actionBtnStyle()} onClick={handleFlee}>FUGIR</button>
        </div>
      </div>

      <style>{`
        @keyframes terminal-glow { from { box-shadow: 0 0 2px #3776ab; } to { box-shadow: 0 0 10px #3776ab; } }
      `}</style>
    </div>
  );
};

export default BattleScreen;
