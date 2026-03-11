import React from 'react';
import type { Direction } from '../../hooks/useMapEngine';

interface DPadProps {
  onMoveStart: (dir: Direction) => void;
  onMoveEnd: () => void;
  onInteract: () => void;
}

const DPad: React.FC<DPadProps> = ({ onMoveStart, onMoveEnd, onInteract }) => {
  const btnStyle: React.CSSProperties = {
    width: '48px', 
    height: '48px', 
    backgroundColor: '#3776ab',
    border: '4px solid #141e30', 
    color: '#ffffff',
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    fontSize: '20px', 
    cursor: 'pointer', 
    userSelect: 'none', 
    touchAction: 'none',
    boxShadow: '0 4px 0 #1e4a7a',
    borderRadius: '4px'
  };

  return (
    <div style={{
      position: 'absolute', 
      bottom: '15px', 
      left: '0', 
      right: '0', 
      padding: '0 20px',
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'flex-end', 
      pointerEvents: 'none'
    }}>
      {/* Direcionais */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 48px)', gap: '4px', pointerEvents: 'auto' }}>
        <div />
        <button style={btnStyle} onPointerDown={() => onMoveStart('up')} onPointerUp={onMoveEnd} onPointerLeave={onMoveEnd}>▲</button>
        <div />
        <button style={btnStyle} onPointerDown={() => onMoveStart('left')} onPointerUp={onMoveEnd} onPointerLeave={onMoveEnd}>◀</button>
        <div style={{ ...btnStyle, backgroundColor: 'transparent', border: 'none', boxShadow: 'none' }} />
        <button style={btnStyle} onPointerDown={() => onMoveStart('right')} onPointerUp={onMoveEnd} onPointerLeave={onMoveEnd}>▶</button>
        <div />
        <button style={btnStyle} onPointerDown={() => onMoveStart('down')} onPointerUp={onMoveEnd} onPointerLeave={onMoveEnd}>▼</button>
        <div />
      </div>

      {/* Botão A */}
      <div style={{ pointerEvents: 'auto' }}>
        <button 
          onPointerDown={onInteract} 
          style={{ 
            ...btnStyle, 
            width: '70px', 
            height: '70px', 
            borderRadius: '50%', 
            fontSize: '28px', 
            backgroundColor: '#ff8c00', 
            border: '4px solid #9e5200',
            boxShadow: '0 6px 0 #6d3a00'
          }}
        >
          A
        </button>
      </div>
    </div>
  );
};

export default DPad;
