import React, { useState } from 'react';
import { useGameStore } from '../../hooks/useGameStore';

interface CharacterCreationProps {
  onFinish: () => void;
}

const CharacterCreation: React.FC<CharacterCreationProps> = ({ onFinish }) => {
  const setProfile = useGameStore(state => state.setProfile);
  const [name, setName] = useState('DEV_APRENDIZ');
  const [color, setColor] = useState('#3498db');

  const COLORS = [
    { name: 'AZUL', hex: '#3498db' },
    { name: 'VERMELHO', hex: '#e74c3c' },
    { name: 'VERDE', hex: '#2ecc71' },
    { name: 'AMARELO', hex: '#f1c40f' }
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
      backgroundColor: 'var(--gb-white)',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h2 style={{ fontSize: '14px', marginBottom: '30px' }}>[ QUEM É VOCÊ? ]</h2>
      
      <div style={{ marginBottom: '30px' }}>
        <p style={{ fontSize: '8px', marginBottom: '10px' }}>SEU USERNAME:</p>
        <input 
          value={name}
          onChange={(e) => setName(e.target.value.toUpperCase().slice(0, 12))}
          style={{
            fontFamily: '"Press Start 2P", monospace',
            border: '2px solid var(--gb-darkest)',
            padding: '10px',
            textAlign: 'center',
            fontSize: '10px',
            backgroundColor: 'transparent',
            outline: 'none'
          }}
        />
      </div>

      <div style={{ marginBottom: '40px' }}>
        <p style={{ fontSize: '8px', marginBottom: '10px' }}>COR DO TRAJE:</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          {COLORS.map(c => (
            <div 
              key={c.hex}
              onClick={() => setColor(c.hex)}
              style={{
                width: '30px',
                height: '30px',
                backgroundColor: c.hex,
                border: color === c.hex ? '4px solid var(--gb-darkest)' : '2px solid #ccc',
                cursor: 'pointer'
              }}
            />
          ))}
        </div>
      </div>

      <button 
        onClick={handleStart}
        style={{
          fontFamily: '"Press Start 2P", monospace',
          padding: '10px 20px',
          backgroundColor: 'var(--gb-dark)',
          color: 'var(--gb-white)',
          border: 'none',
          cursor: 'pointer',
          fontSize: '10px'
        }}
      >
        INICIAR JORNADA
      </button>
    </div>
  );
};

export default CharacterCreation;
