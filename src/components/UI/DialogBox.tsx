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
  const isTerminalGet = fullText.startsWith("ITEM_GET:TERMINAL_MÁGICO");
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

  if (isTerminalGet || isGoldGet) {
    return (
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '320px', height: '180px', backgroundColor: 'rgba(20, 30, 48, 0.95)',
        border: '6px solid #ffd43b', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', zIndex: 2000, textAlign: 'center', padding: '20px',
        boxShadow: '0 0 30px rgba(255, 212, 59, 0.3)'
      }} onClick={handleNext}>
        <div style={{ fontSize: '10px', marginBottom: '20px', color: '#3776ab' }}>[ SISTEMA ATUALIZADO ]</div>
        <div style={{ fontSize: '12px', color: '#fff', fontWeight: 'bold', lineHeight: '1.5' }}>
          VOCÊ OBTEVE:<br/>
          <span style={{ color: '#ffd43b' }}>{displayedText}</span>
        </div>
        <div style={{ marginTop: '25px', fontSize: '7px', color: '#aaa' }}>[ PRESSIONE ENTER ]</div>
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
