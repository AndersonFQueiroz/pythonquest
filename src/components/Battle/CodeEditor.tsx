import React from 'react';

interface CodeEditorProps {
  problem: string;
  code: string;
  onChange: (newCode: string) => void;
  onExecute: () => void;
  onClose: () => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ problem, code, onChange, onExecute, onClose }) => {
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Impede o pulo de linha padrão
      onExecute();        // Chama a validação
    }
    // Se for Shift+Enter, o pulo de linha acontece normalmente (comportamento padrão)
  };

  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      left: '10px',
      right: '10px',
      bottom: '10px',
      backgroundColor: 'rgba(15, 56, 15, 0.98)',
      border: '4px double var(--gb-lightest)',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      padding: '15px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span style={{ color: 'var(--gb-lightest)', fontSize: '8px' }}>DEBUGGER_CONSOLE.PY</span>
        <button onClick={onClose} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontFamily: '"Press Start 2P"', fontSize: '10px' }}>X</button>
      </div>

      <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid var(--gb-dark)' }}>
        <p style={{ color: '#aaa', fontSize: '8px', marginBottom: '5px' }}># CÓDIGO COM BUG:</p>
        <code style={{ color: '#e74c3c', fontSize: '12px', fontFamily: 'monospace' }}>{problem}</code>
      </div>

      <p style={{ color: 'var(--gb-lightest)', fontSize: '8px', marginBottom: '5px' }}># DIGITE A FORMA CORRETA (ENTER PARA VALIDAR):</p>
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        autoFocus
        placeholder="print(...)"
        style={{
          flex: 1,
          backgroundColor: 'rgba(255,255,255,0.05)',
          border: '1px solid var(--gb-lightest)',
          color: '#2ecc71',
          fontFamily: 'monospace',
          fontSize: '14px',
          padding: '10px',
          resize: 'none',
          outline: 'none'
        }}
      />

      <button 
        onClick={onExecute}
        style={{
          marginTop: '10px',
          padding: '12px',
          backgroundColor: 'var(--gb-light)',
          border: 'none',
          fontFamily: '"Press Start 2P"',
          fontSize: '8px',
          cursor: 'pointer'
        }}
      >
        [ VALIDAR CORREÇÃO ]
      </button>
    </div>
  );
};

export default CodeEditor;
