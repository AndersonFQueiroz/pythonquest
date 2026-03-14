import React, { useState, useEffect } from 'react';
import { sounds } from '../../lib/sounds';

const VolumeControl: React.FC = () => {
  const [volume, setVolumeState] = useState(sounds.getRawVolume());
  const [muted, setMuted]        = useState(sounds.getMuted());
  const [expanded, setExpanded]  = useState(false);

  useEffect(() => {
    setVolumeState(sounds.getRawVolume());
    setMuted(sounds.getMuted());
  }, []);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolumeState(val);
    if (muted && val > 0) setMuted(false);
    sounds.setVolume(val);
  };

  const handleMute = () => {
    sounds.toggleMute();
    setMuted(sounds.getMuted());
  };

  const getIcon = () => {
    if (muted || volume === 0) return '🔇';
    if (volume < 0.4) return '🔈';
    if (volume < 0.7) return '🔉';
    return '🔊';
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        fontFamily: '"Press Start 2P"',
      }}
    >
      {/* Painel expandido — abre para cima */}
      {expanded && (
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            backgroundColor: 'rgba(15, 23, 42, 0.97)',
            border: '2px solid #3776ab',
            borderRadius: '6px',
            padding: '10px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            alignItems: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.7)',
            minWidth: '130px',
          }}
        >
          <div style={{ fontSize: '5px', color: '#ffd43b', letterSpacing: '1px' }}>
            VOLUME GERAL
          </div>

          {/* Slider */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            style={{
              width: '110px',
              height: '4px',
              cursor: 'pointer',
              accentColor: '#3776ab',
              backgroundColor: '#1e293b',
              borderRadius: '2px',
              outline: 'none',
              border: '1px solid #3776ab',
            }}
          />

          {/* Percentual */}
          <div style={{ fontSize: '5px', color: '#94a3b8' }}>
            {muted ? '[ MUDO ]' : `${Math.round(volume * 100)}%`}
          </div>

          {/* Botão mute */}
          <button
            onClick={handleMute}
            style={{
              width: '110px',
              padding: '6px 0',
              backgroundColor: muted ? 'rgba(255,71,87,0.2)' : 'rgba(55,118,171,0.15)',
              color: muted ? '#ff4757' : '#94a3b8',
              border: `1px solid ${muted ? '#ff4757' : '#3776ab'}`,
              borderRadius: '3px',
              fontSize: '5px',
              cursor: 'pointer',
              fontFamily: '"Press Start 2P"',
              letterSpacing: '0.5px',
            }}
          >
            {muted ? '🔊 ATIVAR SOM' : '🔇 MUTAR TUDO'}
          </button>

          <div style={{
            fontSize: '4px',
            color: '#475569',
            textAlign: 'center',
            lineHeight: '1.6',
          }}>
            AFETA MÚSICA E<br />EFEITOS SONOROS
          </div>
        </div>
      )}

      {/* Botão circular principal */}
      <button
        onClick={() => setExpanded(prev => !prev)}
        title={expanded ? 'Fechar controle de volume' : 'Volume'}
        style={{
          width: '32px',
          height: '32px',
          backgroundColor: expanded
            ? '#3776ab'
            : muted
            ? 'rgba(255,71,87,0.85)'
            : 'rgba(15,23,42,0.88)',
          border: `2px solid ${muted ? '#ff4757' : '#3776ab'}`,
          borderRadius: '50%',
          fontSize: '13px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
          padding: 0,
          lineHeight: 1,
        }}
      >
        {getIcon()}
      </button>
    </div>
  );
};

export default VolumeControl;
