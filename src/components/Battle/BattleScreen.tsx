import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../hooks/useGameStore';
import { sounds } from '../../lib/sounds';
import { usePyodide } from '../../hooks/usePyodide';
import { WORLD1_ENEMIES, WORLD2_ENEMIES } from '../../data/bugs';
import type { BugEnemy, BugStage } from '../../data/bugs';
import CodeEditor from './CodeEditor';
import { BugSprite } from './BugSprite';

interface BattleScreenProps {
  onWin: () => void;
  onLose: (isDead: boolean) => void;
  mapId: string;
}

const BattleScreen: React.FC<BattleScreenProps> = ({ onWin, onLose, mapId }) => {
  const name = useGameStore(state => state.name);
  const hp = useGameStore(state => state.hp);
  const maxHp = useGameStore(state => state.maxHp);
  const color = useGameStore(state => state.color);
  const level = useGameStore(state => state.level);
  const gainGold = useGameStore(state => state.gainGold);
  const gainXp = useGameStore(state => state.gainXp);
  const deductXp = useGameStore(state => state.deductXp);
  const recordBugDefeat = useGameStore(state => state.recordBugDefeat);
  const takeDamage = useGameStore(state => state.takeDamage);

  const { isReady, isLoading, runCode } = usePyodide();

  const [enemy, setEnemy] = useState<BugEnemy>(WORLD1_ENEMIES[0]);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [enemyHp, setEnemyHp] = useState(100);
  const [message, setMessage] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [userCode, setUserCode] = useState('');
  const [chestError, setChestError] = useState<string | null>(null);

  const currentStage: BugStage = enemy.stages[currentStageIndex];

  useEffect(() => {
    const enemyPool = mapId === 'world2' ? WORLD2_ENEMIES : WORLD1_ENEMIES;
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
    deductXp(5);
    setMessage(`[DICA -5XP] ${currentStage.hint}`);
  };

  const actionBtnStyle: React.CSSProperties = {
    flex: '1', padding: '10px', backgroundColor: '#3776ab', color: '#fff',
    border: '2px solid #0f172a', fontFamily: '"Press Start 2P", monospace',
    fontSize: '7px', cursor: 'pointer'
  };

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
        {/* PLAYER COM DETALHES */}
        <div style={{ position: 'relative', width: '64px', height: '64px', transform: 'scale(1.5)' }}>
            {/* Sombras e Detalhes do Corpo */}
            <div style={{ position: 'absolute', left: '8px', top: '32px', width: '16px', height: '12px', backgroundColor: color, border: '2px solid #000' }} />
            <div style={{ position: 'absolute', left: '10px', top: '16px', width: '12px', height: '16px', backgroundColor: '#ffdbac', border: '2px solid #000' }} />
            {/* Cabelo/Boné */}
            <div style={{ position: 'absolute', left: '10px', top: '16px', width: '12px', height: '4px', backgroundColor: '#0f172a' }} />
            {/* Mochila */}
            <div style={{ position: 'absolute', left: '4px', top: '34px', width: '6px', height: '10px', backgroundColor: '#3776ab', border: '1px solid #000' }} />
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
          <button style={actionBtnStyle} disabled={!isReady} onClick={() => { sounds.playSelect(); setShowEditor(true); }}>DEBUGAR</button>
          <button style={actionBtnStyle} onClick={handleHint}>DICA (-5 XP)</button>
          <button style={actionBtnStyle} onClick={handleExecute}>EXECUTAR</button>
          <button style={actionBtnStyle} onClick={handleFlee}>FUGIR</button>
        </div>
      </div>
    </div>
  );
};

export default BattleScreen;
