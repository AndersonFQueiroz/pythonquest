import React, { useEffect, useState } from 'react';
import { sounds } from '../../lib/sounds';

interface CreditsScreenProps {
  playerName: string;
  onFinish: () => void;
}

const CreditsScreen: React.FC<CreditsScreenProps> = ({ playerName, onFinish }) => {
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    // Toca uma música de vitória ou som de celebração se houver
    sounds.playSelect();
    
    // Mostra o certificado após 8 segundos de créditos
    const timer = setTimeout(() => {
      setShowCertificate(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#0f172a',
      color: '#fff',
      fontFamily: '"Press Start 2P", cursive',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* CRÉDITOS ROLANDO */}
      <div className="credits-roll" style={{
        textAlign: 'center',
        position: 'absolute',
        top: '100%',
        animation: showCertificate ? 'none' : 'roll 10s linear forwards'
      }}>
        <h2 style={{ color: '#ffd43b', marginBottom: '40px' }}>MISSÃO CUMPRIDA</h2>
        <p style={{ fontSize: '10px', marginBottom: '20px' }}>O NÚCLEO FOI DEPURADO</p>
        <p style={{ fontSize: '8px', marginBottom: '40px' }}>PYTHORIA ESTÁ EM PAZ</p>
        
        <h3 style={{ color: '#3776ab', marginBottom: '20px' }}>CRÉDITOS</h3>
        <p style={{ fontSize: '7px', marginBottom: '10px' }}>DESIGN, LORE E DESENVOLVIMENTO</p>
        <p style={{ fontSize: '9px', marginBottom: '30px', color: '#ffd43b' }}>ANDERSON E EQUIPE DEMENTECH</p>
        
        <p style={{ fontSize: '7px', marginBottom: '10px' }}>TECNOLOGIAS</p>
        <p style={{ fontSize: '6px', marginBottom: '5px' }}>REACT & TYPESCRIPT</p>
        <p style={{ fontSize: '6px', marginBottom: '5px' }}>PYODIDE (PYTHON IN BROWSER)</p>
        <p style={{ fontSize: '6px', marginBottom: '40px' }}>ZUSTAND STATE ENGINE</p>
        
        <p style={{ fontSize: '8px', color: '#2ecc71' }}>OBRIGADO POR JOGAR!</p>
      </div>

      {/* CERTIFICADO FINAL */}
      {showCertificate && (
        <div style={{
          width: '90%',
          height: '80%',
          backgroundColor: '#fdf6e3',
          border: '10px double #856404',
          borderRadius: '4px',
          color: '#333',
          padding: '30px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 100,
          boxShadow: '0 0 50px rgba(255, 212, 59, 0.5)',
          animation: 'popIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '12px', color: '#856404', marginBottom: '10px', textDecoration: 'underline' }}>CERTIFICADO DE CONCLUSÃO</h1>
            <p style={{ fontSize: '6px', color: '#666' }}>ACADEMIA DE DEPURADORES DE PYTHORIA</p>
          </div>

          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <p style={{ fontSize: '8px', marginBottom: '15px' }}>Certificamos que o desenvolvedor</p>
            <h2 style={{ fontSize: '14px', color: '#3776ab', borderBottom: '2px solid #3776ab', paddingBottom: '10px' }}>{playerName.toUpperCase()}</h2>
            <p style={{ fontSize: '7px', marginTop: '15px', lineHeight: '1.6' }}>
              Dominou as artes das Variáveis, Decisões, Loops e Funções,<br />
              derrotou o vírus Malwarech e provou ser um<br />
              <span style={{ color: '#ffd43b', backgroundColor: '#0f172a', padding: '2px 5px' }}>MESTRE ARQUITETO DE SOFTWARE</span>.
            </p>
          </div>

          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '100px', borderTop: '1px solid #333' }}></div>
              <p style={{ fontSize: '5px', marginTop: '5px' }}>MENTORA PEP-8</p>
            </div>
            <div style={{ width: '50px', height: '50px', backgroundColor: '#ffd43b', borderRadius: '50%', border: '4px double #856404', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>🐍</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '100px', borderTop: '1px solid #333' }}></div>
              <p style={{ fontSize: '5px', marginTop: '5px' }}>ZEN DO PYTHON</p>
            </div>
          </div>

          <button onClick={onFinish} style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#0f172a',
            color: '#fff',
            border: 'none',
            fontFamily: '"Press Start 2P"',
            fontSize: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 0 #000'
          }}>VOLTAR AO INÍCIO</button>
        </div>
      )}

      <style>{`
        @keyframes roll {
          from { top: 100%; }
          to { top: -150%; }
        }
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default CreditsScreen;
