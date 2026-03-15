import React, { useCallback } from 'react';
import type { Direction } from '../../hooks/useMapEngine';

interface DPadProps {
  onMoveStart: (dir: Direction) => void;
  onMoveEnd: () => void;
  onInteract: () => void;
}

const DPad: React.FC<DPadProps> = ({ onMoveStart, onMoveEnd, onInteract }) => {

  // Tamanho dos botões direcionais — maior = mais fácil de tocar
  const BTN = 52;
  const GAP = 4;
  const DPAD_SIZE = BTN * 3 + GAP * 2;

  const btnStyle: React.CSSProperties = {
    width: `${BTN}px`,
    height: `${BTN}px`,
    backgroundColor: '#3776ab',
    border: '3px solid #141e30',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    userSelect: 'none',
    // Desabilita comportamentos padrão de toque que interferem
    touchAction: 'none',
    WebkitTapHighlightColor: 'transparent',
    WebkitUserSelect: 'none',
    boxShadow: '0 4px 0 #0f172a',
    borderRadius: '6px',
    padding: 0,
    margin: 0,
    boxSizing: 'border-box',
    position: 'absolute',
    // Garante que o botão seja clicável mesmo com overlays
    zIndex: 10,
  };

  const Triangle = ({ dir }: { dir: Direction }) => {
    const s = { width: 0, height: 0 };
    if (dir === 'up')    return <div style={{ ...s, borderLeft: '9px solid transparent', borderRight: '9px solid transparent', borderBottom: '14px solid white', marginBottom: '2px' }} />;
    if (dir === 'down')  return <div style={{ ...s, borderLeft: '9px solid transparent', borderRight: '9px solid transparent', borderTop: '14px solid white',    marginTop: '2px' }} />;
    if (dir === 'left')  return <div style={{ ...s, borderTop: '9px solid transparent', borderBottom: '9px solid transparent', borderRight: '14px solid white',  marginRight: '2px' }} />;
    if (dir === 'right') return <div style={{ ...s, borderTop: '9px solid transparent', borderBottom: '9px solid transparent', borderLeft: '14px solid white',   marginLeft: '2px' }} />;
    return null;
  };

  // Handler unificado para mouse e touch — sem delay
  const makeHandlers = useCallback((dir: Direction) => ({
    // Mouse
    onMouseDown: (e: React.MouseEvent) => { e.preventDefault(); onMoveStart(dir); },
    onMouseUp:   (e: React.MouseEvent) => { e.preventDefault(); onMoveEnd(); },
    onMouseLeave:(e: React.MouseEvent) => { e.preventDefault(); onMoveEnd(); },
    // Touch — sem o delay de 300ms do onClick
    onTouchStart:(e: React.TouchEvent) => { e.preventDefault(); e.stopPropagation(); onMoveStart(dir); },
    onTouchEnd:  (e: React.TouchEvent) => { e.preventDefault(); e.stopPropagation(); onMoveEnd(); },
    onTouchCancel:(e: React.TouchEvent) => { e.preventDefault(); e.stopPropagation(); onMoveEnd(); },
  }), [onMoveStart, onMoveEnd]);

  const interactHandlers = useCallback(() => ({
    onMouseDown: (e: React.MouseEvent) => { e.preventDefault(); onInteract(); },
    onTouchStart:(e: React.TouchEvent) => { e.preventDefault(); e.stopPropagation(); onInteract(); },
    onTouchEnd:  (e: React.TouchEvent) => { e.preventDefault(); e.stopPropagation(); },
    onTouchCancel:(e: React.TouchEvent) => { e.preventDefault(); e.stopPropagation(); },
  }), [onInteract]);

  return (
    <div style={{
      position: 'absolute',
      bottom: '10px',
      left: '10px',
      right: '10px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      pointerEvents: 'auto',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      paddingLeft:   'env(safe-area-inset-left, 0px)',
      paddingRight:  'env(safe-area-inset-right, 0px)',
    }}>

      {/* D-PAD DIRECIONAL */}
      <div style={{
        position: 'relative',
        width: `${DPAD_SIZE}px`,
        height: `${DPAD_SIZE}px`,
        pointerEvents: 'auto',
        flexShrink: 0,
      }}>
        {/* CIMA */}
        <button
          style={{ ...btnStyle, top: 0, left: `${BTN + GAP}px` }}
          {...makeHandlers('up')}
        ><Triangle dir="up" /></button>

        {/* ESQUERDA */}
        <button
          style={{ ...btnStyle, top: `${BTN + GAP}px`, left: 0 }}
          {...makeHandlers('left')}
        ><Triangle dir="left" /></button>

        {/* DIREITA */}
        <button
          style={{ ...btnStyle, top: `${BTN + GAP}px`, right: 0 }}
          {...makeHandlers('right')}
        ><Triangle dir="right" /></button>

        {/* BAIXO */}
        <button
          style={{ ...btnStyle, bottom: 0, left: `${BTN + GAP}px` }}
          {...makeHandlers('down')}
        ><Triangle dir="down" /></button>
      </div>

      {/* BOTÃO A (INTERAGIR) */}
      <div style={{ pointerEvents: 'auto', paddingBottom: '8px', flexShrink: 0 }}>
        <button
          {...interactHandlers()}
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            backgroundColor: '#ff8c00',
            border: '4px solid #141e30',
            color: '#fff',
            fontFamily: '"Press Start 2P"',
            fontSize: '26px',
            cursor: 'pointer',
            boxShadow: '0 5px 0 #856404',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 0,
            boxSizing: 'border-box',
            lineHeight: 1,
            paddingTop: '4px',
            paddingLeft: '2px',
            touchAction: 'none',
            WebkitTapHighlightColor: 'transparent',
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
        >
          A
        </button>
      </div>
    </div>
  );
};

export default DPad;
