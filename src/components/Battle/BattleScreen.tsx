import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../hooks/useGameStore';
import { sounds } from '../../lib/sounds';
import { usePyodide } from '../../hooks/usePyodide';
import { WORLD1_ENEMIES } from '../../data/bugs';
import type { BugEnemy, BugStage } from '../../data/bugs';
import CodeEditor from './CodeEditor';

interface BattleScreenProps {
  onWin: () => void;
  onLose: (isDead: boolean) => void;
}

const BattleScreen: React.FC<BattleScreenProps> = ({ onWin, onLose }) => {
  // Extraindo os estados do store em tempo real
  const name = useGameStore(state => state.name);
  const hp = useGameStore(state => state.hp);
  const maxHp = useGameStore(state => state.maxHp);
  const color = useGameStore(state => state.color);
  const level = useGameStore(state => state.level);
  const gainGold = useGameStore(state => state.gainGold);
  const gainXp = useGameStore(state => state.gainXp);
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
    const randomIndex = Math.floor(Math.random() * WORLD1_ENEMIES.length);
    const targetEnemy = WORLD1_ENEMIES[randomIndex];
    setEnemy(targetEnemy);
    setEnemyHp(targetEnemy.hp);
    setMessage(targetEnemy.stages[0].description);
  }, []);

  const handleExecute = async () => {
    sounds.playSelect();
    setChestError(null);
    setShowEditor(false);
    setMessage('O Python está processando seu comando...');

    const result = await runCode(userCode);

    if (result.success && result.output === currentStage.expectedOutput) {
      sounds.playHit();
      const isLastStage = currentStageIndex === enemy.stages.length - 1;
      const damage = isLastStage ? enemyHp : enemy.hp / enemy.stages.length;
      setEnemyHp(prev => Math.max(0, prev - damage));
      
      if (isLastStage) {
        const { leveledUp } = gainXp(enemy.xpReward);
        gainGold(enemy.goldReward);
        recordBugDefeat(enemy.id);
        
        let victoryMsg = `VITÓRIA! +${enemy.xpReward} XP e +${enemy.goldReward} GOLD.`;
        if (leveledUp) victoryMsg += `\nLEVEL UP! Vida máxima aumentada!`;
        
        setMessage(victoryMsg);
        setTimeout(onWin, 3000);
      } else {
        setMessage('CÓDIGO ACEITO! O Bug sofreu dano.');
        setCurrentStageIndex(prev => prev + 1);
        setUserCode('');
        setTimeout(() => setMessage(enemy.stages[currentStageIndex + 1].description), 2000);
      }
    } else {
      // DANO NO JOGADOR AO ERRAR
      sounds.playHit(); // Som de explosão/dano
      const { isDead } = takeDamage(20); 
      
      if (isDead) {
        setMessage('SISTEMA CRÍTICO! Você desmaiou...');
        setTimeout(() => onLose(true), 2500);
      } else {
        const errorDetail = result.success ? "Saída incorreta!" : "Erro de Sintaxe!";
        setChestError(`${errorDetail} O Bug contra-atacou! (-20 HP)`);
        setMessage("Seu código falhou e você sofreu danos!");
        setShowEditor(true);
      }
    }
  };

  const actionBtnStyle: React.CSSProperties = {
    flex: '1', padding: '10px', backgroundColor: 'var(--gb-white)',
    border: '2px solid var(--gb-darkest)', fontFamily: '"Press Start 2P", monospace',
    fontSize: '8px', cursor: 'pointer'
  };

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--gb-white)', display: 'flex', flexDirection: 'column', padding: '10px', position: 'relative' }}>
      
      {showEditor && (
        <CodeEditor 
          problem={currentStage.problem}
          code={userCode} 
          onChange={setUserCode} 
          onExecute={handleExecute} 
          onClose={() => setShowEditor(false)}
          errorFeedback={chestError}
        />
      )}

      {/* HUD Inimigo */}
      <div style={{ alignSelf: 'flex-start', border: '2px solid var(--gb-darkest)', padding: '5px', width: '220px', marginBottom: '15px' }}>
        <div style={{ fontSize: '8px', marginBottom: '4px' }}>{enemy.name} (Nv.{enemy.level})</div>
        <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--gb-darkest)' }}>
          <div style={{ width: `${(enemyHp / enemy.hp) * 100}%`, height: '100%', backgroundColor: 'var(--gb-light)' }} />
        </div>
      </div>

      {/* Arena */}
      <div style={{ flex: '1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 40px' }}>
        {/* Player Sprite */}
        <div style={{ position: 'relative', width: '32px', height: '32px', transform: 'scale(2) rotateY(180deg)' }}>
            <div style={{ position: 'absolute', left: '8px', top: '24px', width: '6px', height: '6px', backgroundColor: 'var(--gb-darkest)' }} />
            <div style={{ position: 'absolute', left: '18px', top: '24px', width: '6px', height: '6px', backgroundColor: 'var(--gb-darkest)' }} />
            <div style={{ position: 'absolute', left: '8px', top: '16px', width: '16px', height: '12px', backgroundColor: color }} />
            <div style={{ position: 'absolute', left: '10px', top: '4px', width: '12px', height: '12px', backgroundColor: '#ffdbac' }} />
            <div style={{ position: 'absolute', left: '10px', top: '4px', width: '12px', height: '4px', backgroundColor: 'var(--gb-darkest)' }} />
        </div>

        {/* Bug Sprite */}
        <div style={{ position: 'relative', width: '40px', height: '40px', transform: 'scale(1.5)' }}>
            <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--gb-darkest)', clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%)', animation: 'glitch 0.2s infinite' }} />
            <div style={{ position: 'absolute', left: '10px', top: '15px', width: '5px', height: '5px', backgroundColor: 'red' }} />
            <div style={{ position: 'absolute', right: '10px', top: '15px', width: '5px', height: '5px', backgroundColor: 'red' }} />
        </div>
      </div>

      {/* HUD Player */}
      <div style={{ alignSelf: 'flex-end', border: '2px solid var(--gb-darkest)', padding: '5px', width: '200px', marginBottom: '10px' }}>
        <div style={{ fontSize: '8px', marginBottom: '4px' }}>{name} (Nv.{level})</div>
        <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--gb-darkest)' }}>
          <div style={{ width: `${(hp / maxHp) * 100}%`, height: '100%', backgroundColor: (hp/maxHp) > 0.3 ? '#2ecc71' : '#e74c3c' }} />
        </div>
        <div style={{ fontSize: '8px', textAlign: 'right', marginTop: '2px' }}>{hp}/{maxHp}</div>
      </div>

      {/* Caixa de Mensagem */}
      <div style={{ height: '110px', border: '4px double var(--gb-darkest)', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
        <div style={{ flex: '1', padding: '10px', fontSize: '7px', lineHeight: '1.4' }}>
          {isLoading ? 'Conectando ao terminal...' : message}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
          <button style={actionBtnStyle} disabled={!isReady} onClick={() => { sounds.playSelect(); setShowEditor(true); }}>DEBUGAR</button>
          <button style={actionBtnStyle} onClick={() => { sounds.playSelect(); setMessage(currentStage.hint); }}>DICA (-5 XP)</button>
          <button style={actionBtnStyle} onClick={handleExecute}>EXECUTAR</button>
          <button style={actionBtnStyle} onClick={() => onLose(false)}>FUGIR</button>
        </div>
      </div>

      <style>{` @keyframes glitch { 0% { transform: translate(0); } 50% { transform: translate(2px, -2px); } 100% { transform: translate(-2px, 2px); } } `}</style>
    </div>
  );
};

export default BattleScreen;
