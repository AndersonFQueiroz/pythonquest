import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../hooks/useGameStore';
import { sounds } from '../../lib/sounds';
import { usePyodide } from '../../hooks/usePyodide';
import { WORLD1_ENEMIES } from '../../data/bugs';
import type { BugEnemy, BugStage } from '../../data/bugs';
import CodeEditor from './CodeEditor';

interface BattleScreenProps {
  onWin: () => void;
  onLose: () => void;
}

const BattleScreen: React.FC<BattleScreenProps> = ({ onWin, onLose }) => {
  const { name, hp, maxHp, color, level } = useGameStore();
  const { isReady, isLoading, runCode } = usePyodide();

  const [enemy, setEnemy] = useState<BugEnemy>(WORLD1_ENEMIES[0]);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [enemyHp, setEnemyHp] = useState(100);
  const [message, setMessage] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [userCode, setUserCode] = useState('');

  const currentStage: BugStage = enemy.stages[currentStageIndex];

  useEffect(() => {
    // Inicializa o inimigo baseado no level (simplificado para WORLD1)
    const targetEnemy = WORLD1_ENEMIES[0];
    setEnemy(targetEnemy);
    setEnemyHp(targetEnemy.hp);
    setMessage(targetEnemy.stages[0].description);
  }, [level]);

  const handleExecute = async () => {
    sounds.playSelect();
    setShowEditor(false);
    setMessage('Analisando correção...');

    const result = await runCode(userCode);

    if (result.success && result.output === currentStage.expectedOutput) {
      sounds.playHit();
      
      // Se for a primeira fase, tira metade. Se for a última, zera.
      const isLastStage = currentStageIndex === enemy.stages.length - 1;
      const damage = isLastStage ? enemyHp : enemy.hp / enemy.stages.length;
      
      setEnemyHp(prev => Math.max(0, prev - damage));
      
      if (isLastStage) {
        setMessage('SISTEMA RESTAURADO! Você derrotou o Bug!');
        setTimeout(onWin, 2000);
      } else {
        setMessage('BOA! Primeira falha corrigida. Mas ainda há outro erro!');
        setCurrentStageIndex(prev => prev + 1);
        setUserCode(''); // Limpa para a próxima fase
        setTimeout(() => setMessage(enemy.stages[currentStageIndex + 1].description), 2000);
      }
    } else {
      sounds.playHit();
      setMessage(result.success 
        ? `SAÍDA INCORRETA: Recebi "${result.output}", mas o sistema ainda falha.` 
        : `ERRO DE SINTAXE: O Python não entendeu seu código!`);
    }
  };

  const actionBtnStyle: React.CSSProperties = {
    flex: '1',
    padding: '10px',
    backgroundColor: 'var(--gb-white)',
    border: '2px solid var(--gb-darkest)',
    fontFamily: '"Press Start 2P", monospace',
    fontSize: '8px',
    cursor: 'pointer'
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
        />
      )}

      {/* HUD Inimigo */}
      <div style={{ alignSelf: 'flex-start', border: '2px solid var(--gb-darkest)', padding: '5px', width: '240px', marginBottom: '15px' }}>
        <div style={{ fontSize: '8px', marginBottom: '4px' }}>{enemy.name} (Fase {currentStageIndex + 1}/2)</div>
        <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--gb-darkest)' }}>
          <div style={{ width: `${(enemyHp / enemy.hp) * 100}%`, height: '100%', backgroundColor: 'var(--gb-light)' }} />
        </div>
      </div>

      {/* Arena */}
      <div style={{ flex: '1', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 40px' }}>
        {/* Personagem do Jogador */}
        <div style={{ position: 'relative', width: '32px', height: '32px', transform: 'scale(2) rotateY(180deg)' }}>
            <div style={{ position: 'absolute', left: '8px', top: '24px', width: '6px', height: '6px', backgroundColor: 'var(--gb-darkest)' }} />
            <div style={{ position: 'absolute', left: '18px', top: '24px', width: '6px', height: '6px', backgroundColor: 'var(--gb-darkest)' }} />
            <div style={{ position: 'absolute', left: '8px', top: '16px', width: '16px', height: '12px', backgroundColor: color }} />
            <div style={{ position: 'absolute', left: '10px', top: '4px', width: '12px', height: '12px', backgroundColor: '#ffdbac' }} />
            <div style={{ position: 'absolute', left: '10px', top: '4px', width: '12px', height: '4px', backgroundColor: 'var(--gb-darkest)' }} />
        </div>

        {/* Bug Glitch */}
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
          <div style={{ width: `${(hp / maxHp) * 100}%`, height: '100%', backgroundColor: 'var(--gb-light)' }} />
        </div>
        <div style={{ fontSize: '8px', textAlign: 'right', marginTop: '2px' }}>{hp}/{maxHp}</div>
      </div>

      {/* Caixa de Mensagem */}
      <div style={{ height: '110px', border: '4px double var(--gb-darkest)', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
        <div style={{ flex: '1', padding: '10px', fontSize: '7px', lineHeight: '1.4' }}>
          {isLoading ? 'Carregando Pythoria...' : message}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
          <button style={actionBtnStyle} disabled={!isReady} onClick={() => { sounds.playSelect(); setShowEditor(true); }}>DEBUGAR</button>
          <button style={actionBtnStyle} onClick={() => { sounds.playSelect(); setMessage(currentStage.hint); }}>DICA (-5 XP)</button>
          <button style={actionBtnStyle} onClick={handleExecute}>EXECUTAR</button>
          <button style={actionBtnStyle} onClick={onLose}>FUGIR</button>
        </div>
      </div>

      <style>{`
        @keyframes glitch {
          0% { transform: translate(0); }
          50% { transform: translate(2px, -2px); }
          100% { transform: translate(-2px, 2px); }
        }
      `}</style>
    </div>
  );
};

export default BattleScreen;
