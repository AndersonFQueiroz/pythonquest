import React, { useState, useEffect, useRef } from 'react';
import { sounds } from '../../lib/sounds';
import { useGameStore } from '../../hooks/useGameStore';

interface DialogBoxProps {
  name: string;
  messages: string[];
  onComplete: () => void;
}

const DialogBox: React.FC<DialogBoxProps> = ({ name, messages, onComplete }) => {
  const { gainTerminal } = useGameStore();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fullText = messages[currentMessageIndex];
  const isTerminalGet = fullText.includes("ITEM_GET:TERMINAL_MÁGICO");
  const isGoldGet = fullText.startsWith("ITEM_GET:") && fullText.endsWith("_GOLD");

  const startTyping = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setDisplayedText("");
    setIsTyping(true);
    let index = 0;
    
    if (isTerminalGet) {
      setDisplayedText("TERMINAL MÁGICO");
      setIsTyping(false);
      gainTerminal();
      return;
    }

    if (isGoldGet) {
      const amount = fullText.split(":")[1].split("_")[0];
      setDisplayedText(`${amount} OURO`);
      setIsTyping(false);
      return;
    }

    timerRef.current = setInterval(() => {
      index++;
      setDisplayedText(fullText.slice(0, index));
      if (index >= fullText.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsTyping(false);
      }
    }, 25);
  };

  useEffect(() => {
    startTyping();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [currentMessageIndex]);

  const handleNext = () => {
    if (isTyping) {
      if (timerRef.current) clearInterval(timerRef.current);
      setDisplayedText(fullText);
      setIsTyping(false);
    } else {
      sounds.playSelect();
      if (currentMessageIndex < messages.length - 1) {
        setCurrentMessageIndex(prev => prev + 1);
      } else {
        onComplete();
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key.toLowerCase() === 'e') {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTyping, currentMessageIndex, messages]);

  // TELA DE CONQUISTA ESTILIZADA
  if (isTerminalGet || isGoldGet) {
    return (
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '320px', height: '220px', backgroundColor: 'rgba(20, 30, 48, 0.98)',
        border: '6px solid #ffd43b', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', zIndex: 2000, textAlign: 'center', padding: '20px',
        boxShadow: '0 0 40px rgba(255, 212, 59, 0.4)'
      }} onClick={handleNext}>
        <div style={{ fontSize: '8px', marginBottom: '15px', color: '#3776ab' }}>[ NOVO ITEM OBTIDO ]</div>
        
        {/* ÍCONE DO TERMINAL BRILHANDO */}
        {isTerminalGet && (
            <div style={{
                width: '60px', height: '45px', backgroundColor: '#000', border: '3px solid #3776ab',
                borderRadius: '4px', position: 'relative', marginBottom: '20px',
                boxShadow: '0 0 20px #3776ab', animation: 'glow 1.5s infinite alternate'
            }}>
                <div style={{ position: 'absolute', left: '10px', top: '10px', width: '10px', height: '2px', backgroundColor: '#ffd43b' }} />
                <div style={{ position: 'absolute', left: '10px', top: '15px', width: '20px', height: '2px', backgroundColor: '#2ecc71' }} />
                <div style={{ position: 'absolute', right: '10px', bottom: '10px', width: '15px', height: '15px', backgroundColor: '#3776ab', opacity: 0.3 }} />
            </div>
        )}

        {/* ÍCONE DE OURO */}
        {isGoldGet && (
            <div style={{
                width: '40px', height: '40px', backgroundColor: '#ffd43b', borderRadius: '50%',
                border: '4px solid #f39c12', marginBottom: '20px', fontSize: '20px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f39c12',
                animation: 'glow 1s infinite alternate'
            }}>$</div>
        )}

        <div style={{ fontSize: '12px', color: '#fff', fontWeight: 'bold', lineHeight: '1.5' }}>
          {displayedText}
        </div>
        <div style={{ marginTop: '20px', fontSize: '7px', color: '#aaa' }}>[ PRESSIONE ENTER ]</div>

        <style>{`
            @keyframes glow {
                from { filter: drop-shadow(0 0 5px #ffd43b); transform: scale(1); }
                to { filter: drop-shadow(0 0 20px #3776ab); transform: scale(1.1); }
            }
        `}</style>
      </div>
    );
  }

  return (
    <div 
      onClick={handleNext}
      style={{
        position: 'absolute', bottom: '15px', left: '15px', right: '15px',
        height: '90px', backgroundColor: 'rgba(15, 23, 42, 0.95)',
        border: '4px solid #3776ab', padding: '12px',
        zIndex: 1000, cursor: 'pointer', display: 'flex', flexDirection: 'column',
        boxShadow: '0 5px 15px rgba(0,0,0,0.5)'
      }}
    >
      <div style={{ fontSize: '8px', color: '#ffd43b', marginBottom: '8px', fontWeight: 'bold' }}>
        {name.toUpperCase()}
      </div>
      <div style={{ fontSize: '8px', lineHeight: '1.6', flex: 1, color: '#fff' }}>
        {displayedText}
        {!isTyping && <span style={{ marginLeft: '8px', color: '#3776ab', animation: 'blink 0.8s infinite' }}>▶</span>}
      </div>
      <style>{` @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } } `}</style>
    </div>
  );
};

export default DialogBox;
