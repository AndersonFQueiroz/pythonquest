import React from 'react';
import { useGameStore } from '../../hooks/useGameStore';

interface TitleScreenProps {
  onStart: () => void;
  onContinue: () => void;
}

const TitleScreen: React.FC<TitleScreenProps> = ({ onStart, onContinue }) => {
  const { name, level, correctedBugs } = useGameStore();
  
  // Consideramos que existe um save se o jogador não é o 'Dev' padrão de nível 1 ou se já matou algum bug
  const hasSaveData = name !== 'Dev' || level > 1 || correctedBugs.length > 0;

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
        src="/Logo_PythonQuest.png" 
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
        width: '240px'
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
          {hasSaveData ? 'SOBRESCREVER / NOVO' : 'NOVO JOGO'}
        </button>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <button 
              onClick={onContinue}
              disabled={!hasSaveData}
              style={{
                backgroundColor: hasSaveData ? '#3776ab' : '#475569',
                border: '4px solid #000',
                padding: '12px',
                fontFamily: '"Press Start 2P", monospace',
                cursor: hasSaveData ? 'pointer' : 'not-allowed',
                fontSize: '10px',
                color: hasSaveData ? '#fff' : '#94a3b8',
                boxShadow: hasSaveData ? '0 4px 0 #1e4a7a' : 'none'
              }}
            >
              CONTINUAR
            </button>

            {hasSaveData && (
                <div style={{ 
                    backgroundColor: 'rgba(0,0,0,0.4)', 
                    border: '2px solid #3776ab', 
                    padding: '8px', 
                    borderRadius: '4px',
                    fontSize: '7px',
                    color: '#ffd43b',
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                }}>
                    <div style={{ color: '#fff', fontSize: '6px', opacity: 0.8 }}>SAVE ATUAL:</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>NOME: {name.toUpperCase()}</span>
                        <span>NV: {level}</span>
                    </div>
                </div>
            )}
        </div>
      </div>
      
      <p style={{
        marginTop: '40px',
        fontSize: '7px',
        color: 'rgba(255,255,255,0.5)',
        letterSpacing: '1px'
      }}>
        © 2026 EQUIPE DEMENTECH
      </p>
    </div>
  );
};

export default TitleScreen;
