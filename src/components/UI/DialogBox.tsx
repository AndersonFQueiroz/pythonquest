import React, { useState, useEffect } from 'react';
import { sounds } from '../../lib/sounds';

interface DialogBoxProps {
  name: string;
  messages: string[];
  onComplete: () => void;
}

const DialogBox: React.FC<DialogBoxProps> = ({ name, messages, onComplete }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const fullText = messages[currentMessageIndex];

  useEffect(() => {
    setDisplayedText("");
    setIsTyping(true);
    let index = 0;
    
    const interval = setInterval(() => {
      setDisplayedText(fullText.slice(0, index + 1));
      index++;
      
      if (index >= fullText.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [currentMessageIndex, fullText]);

  const handleNext = () => {
    sounds.playSelect();
    if (isTyping) {
      setDisplayedText(fullText);
      setIsTyping(false);
    } else if (currentMessageIndex < messages.length - 1) {
      setCurrentMessageIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  // Suporte para usar Enter/E para avançar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key.toLowerCase() === 'e') {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTyping, currentMessageIndex, messages.length]);

  return (
    <div 
      onClick={handleNext}
      style={{
        position: 'absolute', bottom: '10px', left: '10px', right: '10px',
        height: '80px', backgroundColor: 'var(--gb-white)',
        border: '4px double var(--gb-darkest)', padding: '10px',
        zIndex: 1000, cursor: 'pointer', display: 'flex', flexDirection: 'column'
      }}
    >
      <div style={{ fontSize: '8px', color: 'var(--gb-dark)', marginBottom: '5px', fontWeight: 'bold' }}>
        {name.toUpperCase()}
      </div>
      <div style={{ fontSize: '8px', lineHeight: '1.4', flex: 1, color: 'var(--gb-darkest)' }}>
        {displayedText}
        {!isTyping && <span style={{ marginLeft: '5px', animation: 'blink 0.8s infinite' }}>▼</span>}
      </div>
      <style>{`@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`}</style>
    </div>
  );
};

export default DialogBox;
