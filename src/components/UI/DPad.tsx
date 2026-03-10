import React from 'react';
import { Direction } from '../../hooks/useMapEngine';

interface DPadProps {
  onMove: (dir: Direction) => void;
  onInteract: () => void;
}

const DPad: React.FC<DPadProps> = ({ onMove, onInteract }) => {
  const btnStyle: React.CSSProperties = {
    width: '40px',
    height: '40px',
    backgroundColor: 'var(--gb-darkest)',
    border: '4px solid var(--gb-dark)',
    color: 'var(--gb-white)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '18px',
    cursor: 'pointer',
    userSelect: 'none',
    touchAction: 'none'
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: '10px',
      left: '0',
      right: '0',
      padding: '0 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      pointerEvents: 'none'
    }}>
      {/* D-Pad Direcional */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 40px)', gap: '2px', pointerEvents: 'auto' }}>
        <div />
        <button style={btnStyle} onPointerDown={() => onMove('up')}>↑</button>
        <div />
        <button style={btnStyle} onPointerDown={() => onMove('left')}>←</button>
        <div style={{ ...btnStyle, backgroundColor: 'transparent', border: 'none' }} />
        <button style={btnStyle} onPointerDown={() => onMove('right')}>→</button>
        <div />
        <button style={btnStyle} onPointerDown={() => onMove('down')}>↓</button>
        <div />
      </div>

      {/* Botão A de Interação */}
      <div style={{ pointerEvents: 'auto' }}>
        <button 
          onPointerDown={onInteract}
          style={{
            ...btnStyle,
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            fontSize: '24px',
            backgroundColor: '#c0392b', // Vermelho para destacar o botão A
            border: '4px solid #96281b'
          }}
        >
          A
        </button>
      </div>
    </div>
  );
};

export default DPad;
