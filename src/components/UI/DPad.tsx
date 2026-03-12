import React from 'react';
import type { Direction } from '../../hooks/useMapEngine';

interface DPadProps {
  onMoveStart: (dir: Direction) => void;
  onMoveEnd: () => void;
  onInteract: () => void;
}

const DPad: React.FC<DPadProps> = ({ onMoveStart, onMoveEnd, onInteract }) => {
  const btnStyle: React.CSSProperties = {
    width: '44px',
    height: '44px',
    backgroundColor: '#3776ab',
    border: '3px solid #141e30',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    userSelect: 'none',
    touchAction: 'none',
    boxShadow: '0 4px 0 #0f172a',
    borderRadius: '4px',
    padding: 0,
    margin: 0,
    boxSizing: 'border-box',
    position: 'absolute'
  };

  const Triangle = ({ dir }: { dir: Direction }) => {
    const baseStyle = { width: 0, height: 0 };
    if (dir === 'up') return <div style={{ ...baseStyle, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: '12px solid white', marginBottom: '2px' }} />;
    if (dir === 'down') return <div style={{ ...baseStyle, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '12px solid white', marginTop: '2px' }} />;
    if (dir === 'left') return <div style={{ ...baseStyle, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderRight: '12px solid white', marginRight: '2px' }} />;
    if (dir === 'right') return <div style={{ ...baseStyle, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: '12px solid white', marginLeft: '2px' }} />;
    return null;
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: '15px',
      left: '15px',
      right: '25px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      pointerEvents: 'none'
    }}>
      <div style={{ 
        position: 'relative',
        width: '136px',
        height: '136px',
        pointerEvents: 'auto'
      }}>
        <button 
          style={{ ...btnStyle, top: 0, left: '46px' }}
          onMouseDown={() => onMoveStart('up')} onMouseUp={onMoveEnd} onMouseLeave={onMoveEnd}
          onTouchStart={(e) => { e.preventDefault(); onMoveStart('up'); }} onTouchEnd={onMoveEnd}
        ><Triangle dir="up" /></button>

        <button 
          style={{ ...btnStyle, top: '46px', left: 0 }}
          onMouseDown={() => onMoveStart('left')} onMouseUp={onMoveEnd} onMouseLeave={onMoveEnd}
          onTouchStart={(e) => { e.preventDefault(); onMoveStart('left'); }} onTouchEnd={onMoveEnd}
        ><Triangle dir="left" /></button>

        <button 
          style={{ ...btnStyle, top: '46px', right: 0 }}
          onMouseDown={() => onMoveStart('right')} onMouseUp={onMoveEnd} onMouseLeave={onMoveEnd}
          onTouchStart={(e) => { e.preventDefault(); onMoveStart('right'); }} onTouchEnd={onMoveEnd}
        ><Triangle dir="right" /></button>

        <button 
          style={{ ...btnStyle, bottom: 0, left: '46px' }}
          onMouseDown={() => onMoveStart('down')} onMouseUp={onMoveEnd} onMouseLeave={onMoveEnd}
          onTouchStart={(e) => { e.preventDefault(); onMoveStart('down'); }} onTouchEnd={onMoveEnd}
        ><Triangle dir="down" /></button>
      </div>

      <div style={{ pointerEvents: 'auto', paddingBottom: '10px' }}>
        <button 
          onClick={onInteract}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#ff8c00',
            border: '4px solid #141e30',
            color: '#fff',
            fontFamily: '"Press Start 2P"',
            fontSize: '24px',
            cursor: 'pointer',
            boxShadow: '0 5px 0 #856404',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 0,
            boxSizing: 'border-box',
            lineHeight: 1,
            paddingTop: '4px',
            paddingLeft: '2px' // Ajuste fino milimétrico para compensar o kerning da fonte retro
          }}
        >
          A
        </button>
      </div>
    </div>
  );
};

export default DPad;
