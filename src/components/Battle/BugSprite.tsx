import React from 'react';

interface BugSpriteProps {
  id: string;
  shadow?: boolean;
}

export const BugSprite: React.FC<BugSpriteProps> = ({ id, shadow = false }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, 80, 80);
    if (shadow) {
        ctx.fillStyle = '#000';
        ctx.beginPath(); ctx.arc(40, 40, 30, 0, Math.PI * 2); ctx.fill();
        return;
    }

    const now = Date.now();
    const pulse = Math.sin(now / 200) * 5;
    const fastPulse = Math.sin(now / 50) * 2;

    // --- BOSSES ---
    if (id === 'glitch_byte') {
        // Camada de Estática de Fundo
        ctx.fillStyle = '#222';
        ctx.fillRect(15 + fastPulse, 15, 50, 50);
        
        // Pixels de Glitch Coloridos
        const colors = ['#3776ab', '#ffd43b', '#fff', '#ff4757', '#2ecc71'];
        for(let i=0; i<40; i++) {
            ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
            const x = 15 + Math.random() * 50;
            const y = 15 + Math.random() * 50;
            const w = 2 + Math.random() * 8;
            const h = 2 + Math.random() * 4;
            ctx.fillRect(x, y, w, h);
        }

        // Caracteres Flutuantes (0, 1, x, y, ?)
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        const chars = ['0', '1', 'x', 'y', '{', '}', '?', '!', ';'];
        for(let i=0; i<6; i++) {
            const char = chars[(Math.floor(now/100) + i) % chars.length];
            ctx.fillText(char, 20 + i*8, 30 + Math.sin(now/150 + i)*10);
        }

        // Núcleo Distorcido (Octógono)
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
        ctx.beginPath();
        for(let i=0; i<8; i++) {
            const angle = (Math.PI * 2 / 8) * i + (now / 500);
            const r = 15 + pulse;
            const px = 40 + Math.cos(angle) * r;
            const py = 40 + Math.sin(angle) * r;
            if(i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();

        // Scanlines de Glitch (Linhas horizontais rápidas)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        const scanY = (now / 5) % 80;
        ctx.fillRect(10, scanY, 60, 1);
        ctx.fillRect(10, (scanY + 20) % 80, 60, 2);
    } 
    else if (id === 'logic_void') {
        // Aura de Contradição
        const gradient = ctx.createRadialGradient(40, 40, 5, 40, 40, 35 + pulse);
        gradient.addColorStop(0, '#000');
        gradient.addColorStop(0.4, '#3498db'); // True Blue
        gradient.addColorStop(0.6, '#e74c3c'); // False Red
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath(); ctx.arc(40, 40, 35 + pulse, 0, Math.PI*2); ctx.fill();

        // Anéis de Lógica que giram
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(40, 40, 20 + pulse, now/1000, now/1000 + Math.PI); ctx.stroke();
        ctx.beginPath(); ctx.arc(40, 40, 20 + pulse, now/1000 + Math.PI, now/1000 + Math.PI*2); ctx.stroke();
        
        // O Olho Binário
        ctx.fillStyle = '#fff';
        const binary = Math.floor(now/500) % 2 === 0 ? "1" : "0";
        ctx.font = '12px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText(binary, 40, 45);
    }
    else if (id === 'stack_overlord') {
        // Base da Torre de Engrenagens
        ctx.fillStyle = '#2c3e50';
        ctx.fillRect(25, 10, 30, 60);
        
        // Engrenagens Animadas
        const drawGear = (cx: number, cy: number, r: number, speed: number) => {
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(now * speed);
            ctx.fillStyle = '#7f8c8d';
            for(let i=0; i<8; i++) {
                ctx.rotate(Math.PI/4);
                ctx.fillRect(-r-2, -r-2, (r+2)*2, (r+2)*2);
            }
            ctx.fillStyle = '#95a5a6';
            ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = '#2c3e50';
            ctx.beginPath(); ctx.arc(0, 0, r/3, 0, Math.PI*2); ctx.fill();
            ctx.restore();
        };

        drawGear(40, 25 + pulse, 12, 0.002);
        drawGear(40, 55 - pulse, 12, -0.002);

        // Luzes de Alerta
        ctx.fillStyle = '#ff4757';
        if (Math.floor(now/200) % 2 === 0) {
            ctx.beginPath(); ctx.arc(40, 40, 4, 0, Math.PI*2); ctx.fill();
        }
    }
    else if (id === 'protocol_def') {
        // Manto do Arcanista
        ctx.fillStyle = '#4b0082';
        ctx.beginPath();
        ctx.moveTo(40, 10 + pulse);
        ctx.lineTo(70, 70 + pulse);
        ctx.lineTo(10, 70 + pulse);
        ctx.closePath();
        ctx.fill();

        // Aura de Pergaminho
        ctx.strokeStyle = '#9b59b6'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(40, 40 + pulse, 30, 0, Math.PI*2); ctx.stroke();

        // Runas de Código
        ctx.fillStyle = '#ffd43b';
        ctx.font = '8px Arial';
        ctx.fillText("def", 32, 45 + pulse);
        ctx.fillText("()", 35, 55 + pulse);
        ctx.fillText(":", 38, 65 + pulse);
    }
    else if (id === 'meta_class') {
        // Cristal Polimórfico
        const r = 30 + pulse;
        const gradient = ctx.createLinearGradient(40-r, 40-r, 40+r, 40+r);
        gradient.addColorStop(0, '#00d2ff');
        gradient.addColorStop(1, '#3a7bd5');
        ctx.fillStyle = gradient;
        
        ctx.beginPath();
        ctx.moveTo(40, 40 - r); // Topo
        ctx.lineTo(40 + r, 40); // Direita
        ctx.lineTo(40, 40 + r); // Baixo
        ctx.lineTo(40 - r, 40); // Esquerda
        ctx.closePath();
        ctx.fill();

        // Brilho Interno
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath(); ctx.moveTo(40, 40-r); ctx.lineTo(40, 40+r); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(40-r, 40); ctx.lineTo(40+r, 40); ctx.stroke();
    }
    else if (id === 'malwarech') {
        // O Grande Touro Demoníaco (Apenas parte superior na batalha)
        ctx.fillStyle = '#96281b';
        ctx.fillRect(10, 20, 60, 60); // Corpo
        
        // Chifres de Parênteses
        ctx.strokeStyle = '#000'; ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(20, 25, 15, Math.PI, Math.PI*1.5); ctx.stroke(); // (
        ctx.beginPath();
        ctx.arc(60, 25, 15, Math.PI*1.5, 0); ctx.stroke(); // )

        // Olhos de Cursor
        ctx.fillStyle = '#ffd43b';
        if (Math.floor(now/300) % 2 === 0) {
            ctx.fillRect(20, 35, 15, 5);
            ctx.fillRect(45, 35, 15, 5);
        }

        // Aura de Erro (Fumaça vermelha)
        ctx.fillStyle = 'rgba(192, 57, 43, 0.3)';
        for(let i=0; i<5; i++) {
            ctx.beginPath();
            ctx.arc(10 + Math.random()*60, 20 + Math.random()*20, 10, 0, Math.PI*2);
            ctx.fill();
        }
    }
    // --- BUGMONS COMUNS ---
    else if (id.includes('wasp') || id.includes('bat') || id.includes('raven') || id.includes('owl')) {
      ctx.fillStyle = id.includes('syntax') ? '#ffd43b' : '#333';
      ctx.beginPath(); ctx.arc(40, 40 + pulse, 15, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.fillRect(20, 35 + pulse, 10, 5); ctx.fillRect(50, 35 + pulse, 10, 5);
    } else if (id.includes('goblin') || id.includes('troll') || id.includes('pig') || id.includes('monkey')) {
      ctx.fillStyle = '#2ecc71';
      ctx.fillRect(25, 30 + pulse, 30, 30);
      ctx.fillStyle = '#000'; ctx.fillRect(30, 40 + pulse, 5, 5); ctx.fillRect(45, 40 + pulse, 5, 5);
    } else if (id.includes('slime') || id.includes('worm') || id.includes('snake') || id.includes('squid')) {
      ctx.fillStyle = '#3498db';
      ctx.beginPath(); ctx.ellipse(40, 50 + pulse, 25, 15, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(35, 45 + pulse, 4, 0, Math.PI * 2); ctx.arc(45, 45 + pulse, 4, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.fillStyle = '#e74c3c';
      ctx.fillRect(30, 30 + pulse, 20, 20);
    }
  }, [id, shadow]);

  return <canvas ref={canvasRef} width={80} height={80} />;
};
