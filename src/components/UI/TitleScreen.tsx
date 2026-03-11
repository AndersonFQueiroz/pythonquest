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
      background: 'linear-gradient(180deg, #141e30 0%, #243b55 100%)',
      textAlign: 'center',
      padding: '20px'
    }}>
      {/* Exibindo a Logo do Jogo */}
      <img 
        src="/logo.png" 
        alt="PythonQuest Logo" 
        style={{ 
          width: '320px', 
          marginBottom: '20px',
          filter: 'drop-shadow(0 0 10px rgba(55, 118, 171, 0.5))',
          imageRendering: 'auto'
        }} 
        onError={(e) => {
          // Fallback caso a imagem não tenha sido copiada corretamente ainda
          e.currentTarget.style.display = 'none';
          const parent = e.currentTarget.parentElement;
          if (parent) {
            const h1 = document.createElement('h1');
            h1.innerText = 'PYTHON QUEST';
            h1.style.color = '#ffd43b';
            h1.style.fontSize = '24px';
            h1.style.marginBottom = '40px';
            parent.prepend(h1);
          }
        }}
      />
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        width: '200px'
      }}>
        <button 
          onClick={onStart}
          style={{
            backgroundColor: '#ff8c00',
            border: '4px solid #000',
            padding: '12px',
            fontFamily: '"Press Start 2P", monospace',
            cursor: 'pointer',
            fontSize: '10px',
            color: '#fff',
            boxShadow: '0 4px 0 #9e5200'
          }}
        >
          NOVO JOGO
        </button>
        
        <button 
          style={{
            backgroundColor: '#3776ab',
            border: '4px solid #000',
            padding: '12px',
            fontFamily: '"Press Start 2P", monospace',
            cursor: 'pointer',
            fontSize: '10px',
            color: '#fff',
            boxShadow: '0 4px 0 #1e4a7a'
          }}
        >
          CONTINUAR
        </button>
      </div>
      
      <p style={{
        marginTop: '40px',
        fontSize: '7px',
        color: 'rgba(255,255,255,0.5)',
        letterSpacing: '1px'
      }}>
        © 2026 PYTHORIA DEV TEAM
      </p>
    </div>
  );
};

export default TitleScreen;
