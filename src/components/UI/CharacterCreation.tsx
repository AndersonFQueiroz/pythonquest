import React, { useState } from 'react';
import { useGameStore } from '../../hooks/useGameStore';

interface CharacterCreationProps {
  onFinish: () => void;
}

const CharacterCreation: React.FC<CharacterCreationProps> = ({ onFinish }) => {
  const setProfile = useGameStore(state => state.setProfile);
  const [name, setName] = useState('DEV_APRENDIZ');
  const [color, setColor] = useState('#3776ab');

  const COLORS = [
    { name: 'AZUL', hex: '#3776ab' },
    { name: 'PRETO', hex: '#221f1f' },
    { name: 'LARANJA', hex: '#e26116' },
    { name: 'VERMELHO', hex: '#cc2e2e' }
  ];

  const handleStart = () => {
    setProfile(name, color);
    onFinish();
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      background: 'linear-gradient(180deg, #141e30 0%, #243b55 100%)',
      padding: '20px',
      textAlign: 'center',
      color: '#fff'
    }}>
      <h2 style={{ fontSize: '12px', marginBottom: '30px', color: '#ffd43b' }}>[ REGISTRO DE DESENVOLVEDOR ]</h2>
      
      <div style={{ marginBottom: '30px', width: '100%' }}>
        <p style={{ fontSize: '7px', marginBottom: '10px', color: '#3776ab' }}>USERNAME:</p>
        <input 
          value={name}
          onChange={(e) => setName(e.target.value.toUpperCase().slice(0, 12))}
          style={{
            fontFamily: '"Press Start 2P", monospace',
            border: '2px solid #3776ab',
            padding: '12px',
            textAlign: 'center',
            fontSize: '10px',
            backgroundColor: 'rgba(0,0,0,0.3)',
            color: '#fff',
            outline: 'none',
            width: '80%'
          }}
        />
      </div>

      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '7px', marginBottom: '10px', color: '#3776ab' }}>COR DO TRAJE:</p>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          {COLORS.map(c => (
            <div 
              key={c.hex}
              onClick={() => setColor(c.hex)}
              style={{
                width: '35px',
                height: '35px',
                backgroundColor: c.hex,
                border: color === c.hex ? '4px solid #fff' : '2px solid #000',
                cursor: 'pointer',
                boxShadow: color === c.hex ? '0 0 10px rgba(255,255,255,0.5)' : 'none'
              }}
            />
          ))}
        </div>
      </div>

      <button 
        onClick={handleStart}
        style={{
          fontFamily: '"Press Start 2P", monospace',
          padding: '15px 30px',
          backgroundColor: '#ff8c00',
          color: '#fff',
          border: '4px solid #000',
          cursor: 'pointer',
          fontSize: '10px',
          boxShadow: '0 4px 0 #9e5200'
        }}
      >
        INICIAR AVENTURA
      </button>
    </div>
  );
};

export default CharacterCreation;
