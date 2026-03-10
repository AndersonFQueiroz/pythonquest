import React from 'react';

interface TitleScreenProps {
  onStart: () => void;
}

const TitleScreen: React.FC<TitleScreenProps> = ({ onStart }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      backgroundColor: 'var(--gb-white)',
      textAlign: 'center'
    }}>
      <h1 style={{
        fontSize: '24px',
        color: 'var(--gb-darkest)',
        marginBottom: '40px'
      }}>
        PYTHON<br />QUEST
      </h1>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <button 
          onClick={onStart}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            fontFamily: '"Press Start 2P", monospace',
            cursor: 'pointer',
            fontSize: '14px',
            color: 'var(--gb-dark)'
          }}
        >
          [ NOVO JOGO ]
        </button>
        
        <button 
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            fontFamily: '"Press Start 2P", monospace',
            cursor: 'pointer',
            fontSize: '14px',
            color: 'var(--gb-light)'
          }}
        >
          [ CONTINUAR ]
        </button>
      </div>
      
      <p style={{
        marginTop: '60px',
        fontSize: '8px',
        color: 'var(--gb-dark)'
      }}>
        © 2026 PYTHORIA DEV TEAM
      </p>
    </div>
  );
};

export default TitleScreen;
