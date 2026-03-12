import React from 'react';

interface CodeEditorProps {
  problem: string;
  code: string;
  onChange: (newCode: string) => void;
  onExecute: () => void;
  onClose: () => void;
  errorFeedback: string | null;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ problem, code, onChange, onExecute, onClose, errorFeedback }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Impede que a tecla disparada aqui ative atalhos no App.tsx ou MapCanvas
    e.stopPropagation();
    
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onExecute();
    }
  };

  return (
    <div style={{
      position: 'absolute', top: '10px', left: '10px', right: '10px', bottom: '10px',
      backgroundColor: 'rgba(15, 23, 42, 0.98)', border: '4px solid #3776ab',
      zIndex: 100, display: 'flex', flexDirection: 'column', padding: '15px',
      boxShadow: '0 0 20px rgba(55, 118, 171, 0.5)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid #3776ab', paddingBottom: '5px' }}>
        <span style={{ color: '#ffd43b', fontSize: '8px' }}>PYTHON_TERMINAL.v1</span>
        <button onClick={onClose} style={{ color: '#ff4757', border: 'none', background: 'none', cursor: 'pointer', fontFamily: '"Press Start 2P"', fontSize: '10px' }}>X</button>
      </div>

      {/* CÓDIGO CORROMPIDO COM QUEBRA DE LINHA FIXADA */}
      <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid #1e293b', overflowX: 'auto' }}>
        <p style={{ color: '#ff8c00', fontSize: '7px', marginBottom: '8px' }}># CÓDIGO CORROMPIDO:</p>
        <pre style={{ 
            color: '#ff4757', 
            fontSize: '11px', 
            fontFamily: 'monospace', 
            whiteSpace: 'pre-wrap', 
            wordBreak: 'break-all',
            margin: 0,
            lineHeight: '1.4'
        }}>
            {problem}
        </pre>
      </div>

      <p style={{ color: '#3776ab', fontSize: '7px', marginBottom: '5px' }}># DIGITE A CORREÇÃO:</p>
      
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        autoFocus
        placeholder="# Sua resposta aqui..."
        style={{
          flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid #3776ab',
          color: '#ffd43b', fontFamily: 'monospace', fontSize: '14px', padding: '10px',
          resize: 'none', outline: 'none', lineHeight: '1.4'
        }}
      />

      {errorFeedback && (
        <div style={{ 
          marginTop: '10px', padding: '8px', backgroundColor: 'rgba(255, 71, 87, 0.1)', 
          border: '1px solid #ff4757', color: '#ff4757', fontSize: '7px', lineHeight: '1.4' 
        }}>
          {">"} ERRO DETECTADO:<br/>
          {errorFeedback}
        </div>
      )}

      <button 
        onClick={onExecute}
        style={{
          marginTop: '10px', padding: '12px', backgroundColor: '#ffd43b',
          border: 'none', fontFamily: '"Press Start 2P"', fontSize: '8px', cursor: 'pointer',
          color: '#0f172a', fontWeight: 'bold'
        }}
      >
        [ EXECUTAR SCRIPT ]
      </button>
    </div>
  );
};

export default CodeEditor;
