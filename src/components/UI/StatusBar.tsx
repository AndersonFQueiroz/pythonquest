import React from 'react';
import { useGameStore } from '../../hooks/useGameStore';

const StatusBar: React.FC = () => {
  const { name, level, hp, maxHp, xp, gold } = useGameStore();

  const xpNeeded = level * 100;
  const xpPercent = Math.min(100, (xp / xpNeeded) * 100);
  const hpPercent = Math.max(0, Math.min(100, (hp / maxHp) * 100));

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#1e293b',
      borderBottom: '3px solid #3776ab',
      padding: '8px 15px',
      color: '#ffffff',
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '7px'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ color: '#ffd43b', fontSize: '8px' }}>{name} (Nv.{level})</div>
        <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ color: '#ff4757' }}>HP</span>
                <div style={{ width: '70px', height: '6px', backgroundColor: '#000', border: '1px solid #444' }}>
                    <div style={{ width: `${hpPercent}%`, height: '100%', backgroundColor: hpPercent > 30 ? '#2ecc71' : '#ff4757', transition: 'width 0.3s' }} />
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ color: '#3776ab' }}>XP</span>
                <div style={{ width: '70px', height: '6px', backgroundColor: '#000', border: '1px solid #444' }}>
                    <div style={{ width: `${xpPercent}%`, height: '100%', backgroundColor: '#3776ab', transition: 'width 0.3s' }} />
                </div>
            </div>
        </div>
      </div>

      <div style={{ textAlign: 'right' }}>
        <div style={{ color: '#ffd43b', fontSize: '6px', marginBottom: '4px' }}>OURO</div>
        <div style={{ fontSize: '10px', color: '#ffffff' }}>{gold}<span style={{ color: '#ffd43b', marginLeft: '2px' }}>G</span></div>
      </div>
    </div>
  );
};

export default StatusBar;
