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

    let requestRef: number;

    const render = () => {
      ctx.clearRect(0, 0, 80, 80);
      const now  = Date.now();
      const pulse = Math.sin(now / 200) * 5;

      // ── BOSSES ────────────────────────────────────────────────────────────────

      if (id === 'glitch_byte') {
        const centerX = 40; const centerY = 40;
        ctx.fillStyle = '#111'; ctx.fillRect(15 + (Math.sin(now/50)*2), 15, 50, 50);
        ctx.strokeStyle = `rgba(55,118,171,${0.5 - Math.sin(now/200)*0.5})`;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(centerX, centerY, 20 + Math.sin(now/150)*10, 0, Math.PI*2); ctx.stroke();
        const colors = ['#3776ab','#ffd43b','#fff','#ff4757','#2ecc71','#9b59b6'];
        for (let i = 0; i < 60; i++) {
          ctx.fillStyle = colors[Math.floor(Math.random()*colors.length)];
          ctx.globalAlpha = Math.random() > 0.5 ? 1 : 0.4;
          ctx.fillRect(15 + Math.random()*50, 15 + Math.random()*50, 2 + Math.random()*12, 2 + Math.random()*4);
        }
        ctx.globalAlpha = 1.0;
        ctx.font = 'bold 12px "Courier New"'; ctx.fillStyle = '#fff';
        ctx.shadowBlur = 5; ctx.shadowColor = '#fff';
        const chars = ['!','@','#','$','%','&','*','?','X'];
        for (let i = 0; i < 8; i++) {
          const angle = (now / 800) + i*(Math.PI/4);
          const r = 25 + Math.sin(now/300 + i)*5;
          ctx.fillText(chars[i], centerX - 4 + Math.cos(angle)*r, centerY + 4 + Math.sin(angle)*r);
        }
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#000'; ctx.beginPath(); ctx.moveTo(30,40); ctx.lineTo(40,30); ctx.lineTo(50,40); ctx.lineTo(40,50); ctx.fill();
        ctx.fillStyle = '#ff4757'; ctx.fillRect(38, 38, 4, 4);
      }

      // ── LOGIC-VOID: paradoxo True/False com olho central e anéis orbitais ──
      else if (id === 'logic_void') {
        const centerX = 40; const centerY = 40;

        // Gradiente dual girando
        const rot = now / 1000;
        const voidGrd = ctx.createLinearGradient(
          centerX + Math.cos(rot)*30, centerY + Math.sin(rot)*30,
          centerX - Math.cos(rot)*30, centerY - Math.sin(rot)*30
        );
        voidGrd.addColorStop(0, '#3498db');
        voidGrd.addColorStop(0.45, '#111');
        voidGrd.addColorStop(0.55, '#111');
        voidGrd.addColorStop(1, '#e74c3c');
        ctx.fillStyle = voidGrd;
        ctx.beginPath(); ctx.arc(centerX, centerY, 30 + pulse, 0, Math.PI*2); ctx.fill();

        // Linha divisória central
        ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(centerX, centerY - 30); ctx.lineTo(centerX, centerY + 30); ctx.stroke();

        // Textos TRUE / FALSE
        ctx.font = '7px "Courier New"';
        ctx.fillStyle = '#3498db'; ctx.fillText('TRUE',  centerX - 28, centerY + 3);
        ctx.fillStyle = '#e74c3c'; ctx.fillText('FALSE', centerX + 4,  centerY + 3);

        // 3 anéis orbitais achatados
        const drawRing = (angleOff: number, color: string, radius: number) => {
          ctx.save(); ctx.translate(centerX, centerY);
          ctx.rotate(now / 500 + angleOff);
          ctx.scale(1, 0.28);
          ctx.strokeStyle = color; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(0, 0, radius, 0, Math.PI*2); ctx.stroke();
          ctx.fillStyle = '#fff';
          ctx.beginPath(); ctx.arc(radius, 0, 3, 0, Math.PI*2); ctx.fill();
          ctx.restore();
        };
        drawRing(0,           'rgba(52,152,219,0.8)',   35 + pulse);
        drawRing(Math.PI/3,   'rgba(231,76,60,0.8)',    35 - pulse);
        drawRing(Math.PI/1.5, 'rgba(255,255,255,0.5)',  38);

        // Olho central — glow alterna azul/vermelho a cada 500ms
        const eyeColor = Math.floor(now / 500) % 2 === 0 ? '#3498db' : '#e74c3c';
        ctx.shadowBlur = 15; ctx.shadowColor = eyeColor;
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.ellipse(centerX, centerY, 8, 15, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#000'; ctx.fillRect(centerX - 1, centerY - 5, 2, 10);
        ctx.shadowBlur = 0;

        // Símbolo == piscando na base
        ctx.globalAlpha = 0.5 + Math.sin(now / 200) * 0.5;
        ctx.fillStyle = '#ffd43b'; ctx.font = 'bold 11px "Courier New"';
        ctx.shadowBlur = 8; ctx.shadowColor = '#ffd43b';
        ctx.fillText('==', 32, 70);
        ctx.globalAlpha = 1.0; ctx.shadowBlur = 0;
      }

      else if (id === 'stack_overlord') {
        const centerX = 40; const centerY = 40;
        const furnaceGrd = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 38);
        furnaceGrd.addColorStop(0, '#e67e22'); furnaceGrd.addColorStop(0.6, '#d35400'); furnaceGrd.addColorStop(1, 'transparent');
        ctx.fillStyle = furnaceGrd; ctx.globalAlpha = 0.5 + Math.sin(now/200)*0.2;
        ctx.beginPath(); ctx.arc(centerX, centerY, 38, 0, Math.PI*2); ctx.fill(); ctx.globalAlpha = 1.0;
        ctx.fillStyle = '#1a1a1a'; ctx.fillRect(8, 10, 8, 60); ctx.fillRect(64, 10, 8, 60);
        const p1 = Math.sin(now/250)*20; const p2 = Math.cos(now/250)*20;
        ctx.fillStyle = '#f39c12'; ctx.fillRect(6, 40+p1-5, 12, 10); ctx.fillRect(62, 40+p2-5, 12, 10);
        for (let j = 4; j >= 1; j--) {
          ctx.save(); ctx.translate(centerX, centerY);
          ctx.rotate(now * 0.001 * (j%2===0?1:-1) * (5-j));
          ctx.beginPath();
          const radius = j*7;
          for (let i = 0; i < 8; i++) { const a=(Math.PI*2/8)*i; if(i===0) ctx.moveTo(Math.cos(a)*radius, Math.sin(a)*radius); else ctx.lineTo(Math.cos(a)*radius, Math.sin(a)*radius); }
          ctx.closePath();
          const gG = ctx.createLinearGradient(-radius,-radius,radius,radius);
          if(j%2===0){gG.addColorStop(0,'#7f8c8d');gG.addColorStop(1,'#2c3e50');}else{gG.addColorStop(0,'#95a5a6');gG.addColorStop(1,'#34495e');}
          ctx.fillStyle = gG; ctx.fill(); ctx.strokeStyle = '#f1c40f'; ctx.lineWidth = 1; ctx.stroke();
          ctx.fillStyle = '#e67e22'; for(let i=0;i<8;i++){ctx.rotate(Math.PI*2/8);ctx.fillRect(radius-2,-2,4,4);}
          ctx.restore();
        }
        const cG = ctx.createRadialGradient(centerX,centerY,0,centerX,centerY,7);
        cG.addColorStop(0,'#fff');cG.addColorStop(0.5,'#e74c3c');cG.addColorStop(1,'#c0392b');
        ctx.fillStyle=cG; ctx.beginPath(); ctx.arc(centerX,centerY,6+Math.sin(now/50)*1.5,0,Math.PI*2); ctx.fill();
        if(Math.floor(now/100)%5===0){ctx.strokeStyle='rgba(231,76,60,0.8)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(centerX,centerY);ctx.lineTo(centerX+(Math.random()-0.5)*60,centerY+(Math.random()-0.5)*60);ctx.stroke();}
      }

      else if (id === 'protocol_def') {
        const centerX = 40; const centerY = 40;
        const aG = ctx.createRadialGradient(centerX,centerY,5,centerX,centerY,35);
        aG.addColorStop(0,'rgba(155,89,182,0.8)');aG.addColorStop(1,'rgba(155,89,182,0)');
        ctx.fillStyle=aG; ctx.beginPath(); ctx.arc(centerX,centerY,35+pulse/2,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#8e44ad';
        ctx.beginPath();ctx.moveTo(centerX,centerY+20+pulse);ctx.quadraticCurveTo(centerX+30,centerY,centerX+15,centerY-15+pulse);ctx.lineTo(centerX-15,centerY-15+pulse);ctx.quadraticCurveTo(centerX-30,centerY,centerX,centerY+20+pulse);ctx.fill();
        ctx.fillStyle='#f1c40f';ctx.beginPath();ctx.ellipse(centerX,centerY-18+pulse,14,6,0,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='#00d2ff';ctx.beginPath();ctx.moveTo(centerX,centerY-25+pulse);ctx.lineTo(centerX+4,centerY-18+pulse);ctx.lineTo(centerX,centerY-15+pulse);ctx.lineTo(centerX-4,centerY-18+pulse);ctx.fill();
        const hP=Math.sin(now/150)*5;
        ctx.fillStyle='#9b59b6';ctx.beginPath();ctx.arc(centerX-25,centerY+hP,6,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(centerX+25,centerY-hP,6,0,Math.PI*2);ctx.fill();
        ctx.font='bold 8px Arial';ctx.fillStyle='#fff';ctx.shadowBlur=4;ctx.shadowColor='#fff';
        const o1=now/800;const o2=now/800+Math.PI;
        ctx.fillText('def()',centerX-10+Math.cos(o1)*25,centerY+Math.sin(o1)*10);
        ctx.fillText('return',centerX-12+Math.cos(o2)*25,centerY+Math.sin(o2)*10);
        ctx.shadowBlur=0;
      }

      // ── META-CLASS: octógono girando + 4 cópias orbitando ──────────────────
      else if (id === 'meta_class') {
        const centerX = 40; const centerY = 40;

        // Grade blueprint sutil (sem fundo sólido — o canvas da batalha já tem fundo)
        ctx.strokeStyle = 'rgba(55,118,171,0.15)'; ctx.lineWidth = 0.5;
        for (let i = 0; i < 80; i += 10) {
          ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 80); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(80, i); ctx.stroke();
        }

        // Octógono principal girando lentamente
        ctx.save(); ctx.translate(centerX, centerY); ctx.rotate(now / 8000);
        const sG = ctx.createLinearGradient(-22, -22, 22, 22);
        sG.addColorStop(0, '#dceeff'); sG.addColorStop(1, '#3776ab');
        ctx.fillStyle = sG;
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const a = (Math.PI*2/8)*i;
          if (i===0) ctx.moveTo(Math.cos(a)*22, Math.sin(a)*22);
          else ctx.lineTo(Math.cos(a)*22, Math.sin(a)*22);
        }
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
        ctx.shadowBlur = 12; ctx.shadowColor = '#3776ab'; ctx.stroke(); ctx.shadowBlur = 0;
        ctx.restore();

        // 4 cópias menores orbitando
        const activeCopy = Math.floor(now / 1500) % 4;
        for (let i = 0; i < 4; i++) {
          const angle = (Math.PI*2/4)*i + (now / 3000);
          const cx2 = centerX + Math.cos(angle)*30;
          const cy2 = centerY + Math.sin(angle)*30;
          // linha conectora tracejada
          ctx.save();
          ctx.setLineDash([3, 3]);
          ctx.strokeStyle = 'rgba(55,118,171,0.4)'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(centerX, centerY); ctx.lineTo(cx2, cy2); ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();
          // cópia
          ctx.save(); ctx.translate(cx2, cy2); ctx.rotate(-now / 3000);
          const isActive = i === activeCopy;
          const sc = isActive ? 0.9 + Math.sin((now % 1500) / 1500 * Math.PI) * 0.25 : 1;
          ctx.scale(sc, sc);
          ctx.fillStyle = `rgba(55,118,171,${isActive ? 0.9 : 0.55})`;
          ctx.strokeStyle = '#99ccff'; ctx.lineWidth = 1;
          if (isActive) { ctx.shadowBlur = 20; ctx.shadowColor = '#3776ab'; }
          ctx.beginPath();
          for (let j = 0; j < 8; j++) {
            const a2 = (Math.PI*2/8)*j;
            if (j===0) ctx.moveTo(Math.cos(a2)*9, Math.sin(a2)*9);
            else ctx.lineTo(Math.cos(a2)*9, Math.sin(a2)*9);
          }
          ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
          ctx.restore();
        }

        // Textos class + __init__
        ctx.fillStyle = '#ffd43b'; ctx.font = 'bold 9px "Courier New"';
        ctx.shadowBlur = 10; ctx.shadowColor = '#ffd43b';
        ctx.fillText('class', 22, 20 + Math.sin(now/600)*1.5);
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(200,220,255,0.6)'; ctx.font = '6px monospace';
        ctx.fillText('__init__', 18, 30 + Math.sin(now/600)*1.5);
      }

      else if (id === 'malwarech') {
        const centerX = 40; const centerY = 45;
        const aG2 = ctx.createRadialGradient(centerX,centerY,0,centerX,centerY,40);
        aG2.addColorStop(0,'rgba(192,57,43,0.4)');aG2.addColorStop(1,'transparent');
        ctx.fillStyle=aG2;ctx.fillRect(0,0,80,80);
        const wS=1+Math.sin(now/300)*0.15;
        ctx.fillStyle='#111';ctx.strokeStyle='#c0392b';ctx.lineWidth=1;
        const dW=(side:number)=>{ctx.beginPath();ctx.moveTo(centerX,centerY);ctx.quadraticCurveTo(centerX+20*side,centerY-40*wS,centerX+40*side,centerY-35*wS);ctx.lineTo(centerX+35*side,centerY-10);ctx.lineTo(centerX+15*side,centerY+15);ctx.fill();ctx.stroke();};
        dW(-1);dW(1);
        const bP=1+Math.sin(now/150)*0.05;
        ctx.save();ctx.translate(centerX,centerY);ctx.scale(bP,bP);
        const bG=ctx.createLinearGradient(-15,-10,15,20);bG.addColorStop(0,'#96281b');bG.addColorStop(1,'#000');
        ctx.fillStyle=bG;ctx.beginPath();ctx.moveTo(-20,-10);ctx.lineTo(20,-10);ctx.lineTo(10,25);ctx.lineTo(-10,25);ctx.fill();ctx.strokeStyle='#ff4757';ctx.lineWidth=2;ctx.stroke();
        const hA=Math.sin(now/400)*0.1;
        ctx.strokeStyle='#000';ctx.lineWidth=5;ctx.lineCap='round';
        ctx.save();ctx.translate(-12,-20);ctx.rotate(hA);ctx.beginPath();ctx.arc(0,0,15,Math.PI,Math.PI*1.5);ctx.stroke();ctx.restore();
        ctx.save();ctx.translate(12,-20);ctx.rotate(-hA);ctx.beginPath();ctx.arc(0,0,15,Math.PI*1.5,0);ctx.stroke();ctx.restore();
        ctx.fillStyle='#222';ctx.beginPath();ctx.moveTo(-12,-25);ctx.lineTo(12,-25);ctx.lineTo(8,-5);ctx.lineTo(-8,-5);ctx.fill();
        ctx.fillStyle='#ffdbac';ctx.shadowBlur=10;ctx.shadowColor='#ff4757';
        ctx.beginPath();ctx.moveTo(-10,-15);ctx.lineTo(-2,-12);ctx.lineTo(-10,-10);ctx.fill();
        ctx.beginPath();ctx.moveTo(10,-15);ctx.lineTo(2,-12);ctx.lineTo(10,-10);ctx.fill();
        ctx.shadowBlur=0;ctx.restore();
        ctx.fillStyle='#c0392b';ctx.font='bold 8px Arial';
        for(let i=0;i<5;i++){const px=centerX-30+Math.random()*60;const py=((now/10)+i*20)%80;ctx.fillText(Math.random()>0.5?'1':'0',px,py);}
      }

      // ── BUGMONS REINO 1 ────────────────────────────────────────────────────

      else if (id === 'syntax_wasp') {
        // Corpo
        const grd = ctx.createLinearGradient(30, 30, 50, 60);
        grd.addColorStop(0, '#ffd43b'); grd.addColorStop(1, '#f39c12');
        ctx.fillStyle = grd;
        ctx.beginPath(); ctx.ellipse(40, 45+pulse, 12, 18, 0, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = '#000'; ctx.lineWidth = 1; ctx.stroke();
        // Listras
        ctx.fillStyle = '#222';
        ctx.fillRect(30, 40+pulse, 20, 3); ctx.fillRect(28, 48+pulse, 24, 3);
        // Asas
        ctx.fillStyle = 'rgba(200,230,255,0.4)';
        ctx.beginPath(); ctx.ellipse(28, 38+pulse, 16, 6, -Math.PI/4, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(52, 38+pulse, 16, 6,  Math.PI/4, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 1; ctx.stroke();
        // Olhos
        ctx.fillStyle = '#ff4757';
        ctx.beginPath(); ctx.arc(35, 34+pulse, 3, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(45, 34+pulse, 3, 0, Math.PI*2); ctx.fill();
        // Ferrão
        ctx.fillStyle = '#3776ab'; ctx.font = 'bold 16px "Courier New"';
        ctx.fillText('"', 36, 72+pulse);
      }

      else if (id === 'type_goblin') {
        ctx.fillStyle = '#27ae60';
        ctx.beginPath(); ctx.moveTo(25,65+pulse); ctx.quadraticCurveTo(40,25+pulse,55,65+pulse); ctx.fill();
        ctx.fillStyle = '#2ecc71';
        ctx.beginPath(); ctx.moveTo(30,60+pulse); ctx.quadraticCurveTo(40,35+pulse,50,60+pulse); ctx.fill();
        // Orelhas
        ctx.fillStyle = '#27ae60';
        ctx.beginPath(); ctx.moveTo(32,45+pulse); ctx.lineTo(15,35+pulse); ctx.lineTo(33,52+pulse); ctx.fill();
        ctx.beginPath(); ctx.moveTo(48,45+pulse); ctx.lineTo(65,35+pulse); ctx.lineTo(47,52+pulse); ctx.fill();
        // Gorro
        ctx.fillStyle = '#34495e';
        ctx.beginPath(); ctx.moveTo(30,40+pulse); ctx.lineTo(40,20+pulse); ctx.lineTo(50,40+pulse); ctx.fill();
        // Bloco de tipo
        const bG2 = ctx.createLinearGradient(30,50,50,65);
        bG2.addColorStop(0,'#fff'); bG2.addColorStop(1,'#bdc3c7');
        ctx.fillStyle = bG2; ctx.fillRect(30, 50+pulse, 20, 12);
        ctx.strokeStyle = '#3498db'; ctx.lineWidth = 1; ctx.strokeRect(30, 50+pulse, 20, 12);
        ctx.fillStyle = '#3498db'; ctx.font = 'bold 8px Arial'; ctx.fillText('"10"', 32, 60+pulse);
      }

      else if (id === 'name_bat') {
        const bG3 = ctx.createRadialGradient(40, 40+pulse, 2, 40, 40+pulse, 12);
        bG3.addColorStop(0,'#2c3e50'); bG3.addColorStop(1,'#000');
        ctx.fillStyle = bG3;
        ctx.beginPath(); ctx.arc(40, 40+pulse, 12, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#1a1a1a';
        const dWing = (side: number) => {
          ctx.beginPath(); ctx.moveTo(40+8*side,40+pulse);
          ctx.bezierCurveTo(40+25*side,20+pulse,40+35*side,45+pulse,40+10*side,55+pulse);
          ctx.lineTo(40+20*side,48+pulse); ctx.lineTo(40+8*side,40+pulse); ctx.fill();
        };
        dWing(-1); dWing(1);
        ctx.fillStyle = '#ff4757';
        ctx.beginPath(); ctx.arc(36, 40+pulse, 2, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(44, 40+pulse, 2, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = 'rgba(255,71,87,0.6)'; ctx.font = 'bold 14px "Press Start 2P"';
        ctx.fillText('?', 35, 25+pulse+Math.sin(now/100)*3);
      }

      else if (id === 'print_ghost') {
        const gG2 = ctx.createLinearGradient(40, 20, 40, 75);
        gG2.addColorStop(0,'rgba(236,240,241,0.9)'); gG2.addColorStop(1,'rgba(236,240,241,0)');
        ctx.fillStyle = gG2;
        ctx.beginPath(); ctx.arc(40, 40+pulse, 20, Math.PI, 0);
        ctx.lineTo(60, 70+pulse);
        for (let i = 0; i < 4; i++) ctx.quadraticCurveTo(55-i*10, 80+pulse, 45-i*10, 70+pulse);
        ctx.lineTo(20, 40+pulse); ctx.fill();
        ctx.fillStyle = '#34495e';
        ctx.beginPath(); ctx.arc(33, 42+pulse, 4, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(47, 42+pulse, 4, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#3498db'; ctx.font = 'italic 7px "Courier New"';
        ctx.fillText('p', 20+pulse, 30); ctx.fillText('r', 55-pulse, 35); ctx.fillText('i', 30, 25+pulse);
      }

      // ── BUGMONS REINO 2 ────────────────────────────────────────────────────

      else if (id === 'if_slime') {
        const sG2 = ctx.createRadialGradient(40, 50+pulse, 5, 40, 50+pulse, 25);
        sG2.addColorStop(0,'rgba(52,152,219,0.8)'); sG2.addColorStop(1,'rgba(41,128,185,0.4)');
        ctx.fillStyle = sG2;
        ctx.beginPath(); ctx.moveTo(15,65+pulse); ctx.bezierCurveTo(20,15+pulse,60,15+pulse,65,65+pulse); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.beginPath(); ctx.arc(30,45+pulse,4,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(50,55+pulse,3,0,Math.PI*2); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.font = 'bold 14px "Press Start 2P"';
        ctx.shadowBlur = 10; ctx.shadowColor = '#fff';
        ctx.fillText(':', 37, 50+pulse); ctx.shadowBlur = 0;
      }

      else if (id === 'bool_bat') {
        ctx.beginPath(); ctx.arc(40, 40+pulse, 12, 0, Math.PI*2);
        const cG2 = ctx.createLinearGradient(30, 40, 50, 40);
        cG2.addColorStop(0.5,'#3498db'); cG2.addColorStop(0.5,'#e74c3c');
        ctx.fillStyle = cG2; ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 3;
        const bltWing = (side: number) => {
          ctx.beginPath(); ctx.moveTo(40+10*side,40+pulse);
          ctx.lineTo(40+25*side,30+pulse); ctx.lineTo(40+20*side,40+pulse);
          ctx.lineTo(40+35*side,45+pulse); ctx.stroke();
        };
        bltWing(-1); bltWing(1);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 10px Arial'; ctx.fillText('B', 36, 44+pulse);
      }

      else if (id === 'else_troll') {
        const rG = ctx.createLinearGradient(20,20,60,70);
        rG.addColorStop(0,'#95a5a6'); rG.addColorStop(1,'#2c3e50');
        ctx.fillStyle = rG; ctx.fillRect(20,30+pulse,40,40);
        ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(20,60+pulse,40,10);
        ctx.fillStyle = '#27ae60'; ctx.fillRect(22,32+pulse,10,5); ctx.fillRect(45,35+pulse,8,4);
        ctx.fillStyle = '#ff4757'; ctx.font = 'bold 18px Arial'; ctx.fillText('=', 32, 55+pulse);
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(30,40+pulse,6,2); ctx.fillRect(44,40+pulse,6,2);
      }

      else if (id === 'logic_snake') {
        const snkG = ctx.createLinearGradient(20,40,60,40);
        snkG.addColorStop(0,'#2ecc71'); snkG.addColorStop(1,'#27ae60');
        ctx.strokeStyle = snkG; ctx.lineWidth = 8; ctx.lineCap = 'round';
        ctx.beginPath();
        for (let i = 0; i < 12; i++) {
          const sx = 15+i*4.5; const sy = 45+Math.sin(now/150+i*0.8)*12;
          if (i===0) ctx.moveTo(sx,sy); else ctx.lineTo(sx,sy);
        }
        ctx.stroke();
        const hx=15+11*4.5; const hy=45+Math.sin(now/150+11*0.8)*12;
        ctx.fillStyle='#27ae60';ctx.beginPath();ctx.moveTo(hx,hy-8);ctx.lineTo(hx+12,hy);ctx.lineTo(hx,hy+8);ctx.lineTo(hx-4,hy);ctx.fill();
        ctx.strokeStyle='#ff4757';ctx.lineWidth=2;
        ctx.beginPath();ctx.moveTo(hx+10,hy);ctx.lineTo(hx+18,hy-4);ctx.moveTo(hx+10,hy);ctx.lineTo(hx+18,hy+4);ctx.stroke();
      }

      // ── BUGMONS REINO 3 ────────────────────────────────────────────────────

      else if (id === 'for_spider') {
        const gG3 = ctx.createRadialGradient(40,40+pulse,2,40,40+pulse,15);
        gG3.addColorStop(0,'#34495e'); gG3.addColorStop(1,'#1a1a1a');
        ctx.fillStyle = gG3; ctx.beginPath(); ctx.arc(40,40+pulse,14,0,Math.PI*2); ctx.fill();
        ctx.strokeStyle = '#7f8c8d'; ctx.lineWidth = 3;
        for (let i = 0; i < 8; i++) {
          const angle = i*(Math.PI/4)+(now/1000);
          const dist  = 30+Math.sin(now/200+i)*5;
          ctx.beginPath(); ctx.moveTo(40,40+pulse);
          ctx.lineTo(40+Math.cos(angle)*15, 40+pulse+Math.sin(angle)*15);
          ctx.lineTo(40+Math.cos(angle)*dist, 40+pulse+Math.sin(angle)*dist+10); ctx.stroke();
        }
        ctx.fillStyle='#3498db'; ctx.font='bold 8px Arial'; ctx.fillText('in',36,44+pulse);
      }

      else if (id === 'while_worm') {
        for (let i = 0; i < 6; i++) {
          const wx = 15+i*10; const wy = 45+Math.sin(now/100+i)*8;
          ctx.save(); ctx.translate(wx,wy); ctx.rotate(now/200);
          ctx.fillStyle = i%2===0 ? '#d35400' : '#e67e22';
          ctx.fillRect(-5,-5,10,10);
          ctx.fillStyle='#222'; ctx.beginPath(); ctx.arc(0,0,2,0,Math.PI*2); ctx.fill();
          ctx.restore();
        }
        const hx2=15+5*10; const hy2=45+Math.sin(now/100+5)*8;
        ctx.fillStyle='#2c3e50'; ctx.fillRect(hx2-6,hy2-6,12,12);
        ctx.fillStyle='#ff4757'; ctx.fillRect(hx2+2,hy2-2,6,2);
      }

      else if (id === 'range_rat') {
        // Corpo elíptico HORIZONTAL (era blob — refazer do zero)
        const rG2 = ctx.createLinearGradient(22,52,58,52);
        rG2.addColorStop(0,'#7f8c8d'); rG2.addColorStop(1,'#bdc3c7');
        ctx.fillStyle = rG2;
        ctx.beginPath(); ctx.ellipse(40,52+pulse,18,10,0,0,Math.PI*2); ctx.fill();
        ctx.strokeStyle='#555'; ctx.lineWidth=1; ctx.stroke();
        // Orelhas
        ctx.fillStyle='#95a5a6';
        ctx.beginPath(); ctx.arc(30,42+pulse,6,0,Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(50,42+pulse,6,0,Math.PI*2); ctx.fill();
        ctx.strokeStyle='#555'; ctx.lineWidth=1;
        ctx.beginPath(); ctx.arc(30,42+pulse,6,0,Math.PI*2); ctx.stroke();
        ctx.beginPath(); ctx.arc(50,42+pulse,6,0,Math.PI*2); ctx.stroke();
        // Olho
        ctx.fillStyle='#222'; ctx.beginPath(); ctx.arc(34,50+pulse,2,0,Math.PI*2); ctx.fill();
        // Bigodes
        ctx.strokeStyle='#444'; ctx.lineWidth=1;
        ctx.beginPath(); ctx.moveTo(55,52+pulse); ctx.lineTo(66,48+pulse); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(55,52+pulse); ctx.lineTo(66,56+pulse); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(55,52+pulse); ctx.lineTo(66,52+pulse); ctx.stroke();
        // Cauda
        ctx.strokeStyle='#666'; ctx.lineWidth=2;
        ctx.beginPath(); ctx.moveTo(22,52+pulse); ctx.quadraticCurveTo(12,48+pulse,10,40+pulse); ctx.stroke();
        // Números flutuando
        ctx.fillStyle='rgba(52,152,219,0.65)'; ctx.font='6px "Press Start 2P"';
        ctx.fillText('0 1 2', 23, 40+pulse);
      }

      else if (id === 'break_beetle') {
        const btG = ctx.createRadialGradient(40,45+pulse,5,40,45+pulse,25);
        btG.addColorStop(0,'#34495e'); btG.addColorStop(1,'#000');
        ctx.fillStyle=btG;
        ctx.beginPath(); ctx.ellipse(40,45+pulse,22,28,0,0,Math.PI*2); ctx.fill();
        ctx.strokeStyle='#fff'; ctx.lineWidth=3;
        ctx.beginPath(); ctx.moveTo(40,25+pulse); ctx.lineTo(45,10+pulse); ctx.lineTo(35,10+pulse); ctx.lineTo(40,-5+pulse); ctx.stroke();
        ctx.strokeStyle='#2c3e50'; ctx.lineWidth=5;
        const dPLeg=(side:number,y:number)=>{ctx.beginPath();ctx.moveTo(40+15*side,y+pulse);ctx.lineTo(40+35*side,y-5+pulse);ctx.stroke();ctx.fillStyle='#3498db';ctx.beginPath();ctx.arc(40+15*side,y+pulse,3,0,Math.PI*2);ctx.fill();};
        dPLeg(-1,40);dPLeg(1,40);dPLeg(-1,55);dPLeg(1,55);
      }

      // ── BUGMONS REINO 4 ────────────────────────────────────────────────────

      else if (id === 'def_dragon') {
        const dG = ctx.createLinearGradient(40,20,40,70);
        dG.addColorStop(0,'#e67e22'); dG.addColorStop(1,'#d35400');
        ctx.fillStyle=dG;
        ctx.beginPath();ctx.moveTo(40,15+pulse);ctx.lineTo(65,65+pulse);ctx.lineTo(40,55+pulse);ctx.lineTo(15,65+pulse);ctx.closePath();ctx.fill();
        ctx.fillStyle='rgba(192,57,43,0.6)';
        const dDrW=(side:number)=>{ctx.beginPath();ctx.moveTo(40+5*side,35+pulse);ctx.quadraticCurveTo(40+40*side,10+pulse,40+10*side,50+pulse);ctx.fill();};
        dDrW(-1);dDrW(1);
        ctx.fillStyle='#f1c40f';ctx.font='bold 9px Arial';ctx.fillText('def()',32,25+pulse);
      }

      else if (id === 'return_raven') {
        const rvG=ctx.createRadialGradient(40,40+pulse,2,40,40+pulse,15);
        rvG.addColorStop(0,'#4b148c');rvG.addColorStop(1,'#2c3e50');
        ctx.fillStyle=rvG;ctx.beginPath();ctx.arc(40,40+pulse,14,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='#f1c40f';ctx.beginPath();ctx.moveTo(52,38+pulse);ctx.lineTo(65,42+pulse);ctx.lineTo(52,46+pulse);ctx.fill();
        ctx.fillStyle='#fff';ctx.fillRect(55,42+pulse,12,6);
        ctx.fillStyle='#000';ctx.font='6px Arial';ctx.fillText('ret',56,47+pulse);
        ctx.fillStyle='#2c3e50';
        for(let i=0;i<3;i++){ctx.save();ctx.translate(30,40+pulse);ctx.rotate(-i*0.4+pulse/10);ctx.fillRect(-15,-2,15,4);ctx.restore();}
      }

      else if (id === 'param_pig') {
        const pG=ctx.createLinearGradient(20,30,60,70);
        pG.addColorStop(0,'#8d6e63');pG.addColorStop(1,'#5d4037');
        ctx.fillStyle=pG;ctx.beginPath();ctx.ellipse(40,50+pulse,25,20,0,0,Math.PI*2);ctx.fill();
        ctx.strokeStyle='#fff';ctx.lineWidth=4;ctx.lineCap='round';
        ctx.beginPath();ctx.arc(25,45+pulse,10,Math.PI*0.5,Math.PI*1.2);ctx.stroke();
        ctx.beginPath();ctx.arc(55,45+pulse,10,Math.PI*1.8,Math.PI*0.5);ctx.stroke();
        ctx.fillStyle='#a1887f';ctx.beginPath();ctx.ellipse(40,52+pulse,10,7,0,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='#222';ctx.font='bold 7px Arial';ctx.fillText('args',33,55+pulse);
      }

      else if (id === 'scope_scorp') {
        const scG=ctx.createLinearGradient(30,50,50,70);
        scG.addColorStop(0,'#6a1b9a');scG.addColorStop(1,'#4a148c');
        ctx.fillStyle=scG;ctx.fillRect(25,55+pulse,30,15);
        ctx.strokeStyle='#6a1b9a';ctx.lineWidth=5;
        ctx.beginPath();ctx.moveTo(40,55+pulse);ctx.lineTo(40,40+pulse);ctx.lineTo(50,40+pulse);ctx.lineTo(50,25+pulse);ctx.lineTo(65,25+pulse);ctx.stroke();
        ctx.fillStyle='#ffd43b';ctx.shadowBlur=10;ctx.shadowColor='#ffd43b';
        ctx.beginPath();ctx.moveTo(65,20+pulse);ctx.lineTo(75,25+pulse);ctx.lineTo(65,30+pulse);ctx.fill();
        ctx.shadowBlur=0;
      }

      // ── BUGMONS REINO 5 ────────────────────────────────────────────────────

      else if (id === 'class_cat') {
        const cCG=ctx.createLinearGradient(30,30,50,60);
        cCG.addColorStop(0,'#3776ab');cCG.addColorStop(1,'#1e293b');
        ctx.fillStyle=cCG;ctx.beginPath();ctx.arc(40,45+pulse,15,0,Math.PI*2);ctx.fill();
        // Orelhas apenas com stroke (estilo blueprint)
        ctx.strokeStyle='#ffd43b';ctx.lineWidth=2;
        ctx.beginPath();ctx.moveTo(30,35+pulse);ctx.lineTo(30,20+pulse);ctx.lineTo(38,35+pulse);ctx.stroke();
        ctx.beginPath();ctx.moveTo(50,35+pulse);ctx.lineTo(50,20+pulse);ctx.lineTo(42,35+pulse);ctx.stroke();
        ctx.fillStyle='#fff';ctx.font='bold 8px Arial';ctx.fillText('{}',35,48+pulse);
        ctx.strokeStyle='#3776ab';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(30,55+pulse);ctx.quadraticCurveTo(10,55+pulse,15,35+pulse);ctx.stroke();
      }

      else if (id === 'init_owl') {
        ctx.fillStyle='#5d4037';ctx.beginPath();ctx.arc(40,45+pulse,20,0,Math.PI*2);ctx.fill();
        const dLens=(x:number)=>{
          ctx.fillStyle='#222';ctx.beginPath();ctx.arc(x,42+pulse,8,0,Math.PI*2);ctx.fill();
          ctx.strokeStyle='#ffd43b';ctx.lineWidth=1;ctx.stroke();
          ctx.fillStyle='#00d2ff';ctx.beginPath();ctx.arc(x+2,40+pulse,2,0,Math.PI*2);ctx.fill();
        };
        dLens(30);dLens(50);
        ctx.fillStyle='#ffd43b';ctx.fillRect(22,30+pulse,10,2);ctx.fillRect(48,30+pulse,10,2);
        ctx.fillStyle='#f39c12';ctx.beginPath();ctx.moveTo(40,48+pulse);ctx.lineTo(44,55+pulse);ctx.lineTo(36,55+pulse);ctx.fill();
      }

      else if (id === 'self_squid') {
        const sqG=ctx.createRadialGradient(40,35+pulse,5,40,35+pulse,20);
        sqG.addColorStop(0,'rgba(0,210,255,0.8)');sqG.addColorStop(1,'rgba(0,210,255,0.2)');
        ctx.fillStyle=sqG;ctx.beginPath();ctx.arc(40,35+pulse,18,Math.PI,0);ctx.fill();
        ctx.fillStyle='#fff';ctx.shadowBlur=10;ctx.shadowColor='#fff';
        ctx.font='bold 10px Arial';ctx.fillText('self',30,38+pulse);ctx.shadowBlur=0;
        ctx.strokeStyle='rgba(0,210,255,0.6)';ctx.lineWidth=2;
        for(let i=0;i<6;i++){
          const tx=28+i*5;
          ctx.beginPath();ctx.moveTo(tx,35+pulse);ctx.bezierCurveTo(tx-10,60+pulse,tx+10,65+pulse,tx,75+pulse+Math.sin(now/200+i)*5);ctx.stroke();
        }
      }

      else if (id === 'method_monkey') {
        ctx.fillStyle='#3e2723';ctx.beginPath();ctx.arc(40,40+pulse,16,0,Math.PI*2);ctx.fill();
        ctx.beginPath();ctx.arc(24,35+pulse,7,0,Math.PI*2);ctx.fill();
        ctx.beginPath();ctx.arc(56,35+pulse,7,0,Math.PI*2);ctx.fill();
        ctx.strokeStyle='#3e2723';ctx.lineWidth=5;
        ctx.beginPath();ctx.moveTo(25,45+pulse);ctx.quadraticCurveTo(10,45+pulse,5,65+pulse);ctx.stroke();
        ctx.beginPath();ctx.moveTo(55,45+pulse);ctx.quadraticCurveTo(70,45+pulse,75,65+pulse);ctx.stroke();
        // Ponto dourado
        ctx.fillStyle='#ffd43b';ctx.beginPath();ctx.arc(40,52+pulse,5,0,Math.PI*2);ctx.fill();
        ctx.strokeStyle='#fff';ctx.lineWidth=1;ctx.stroke();
      }

      else {
        // Fallback
        const eG=ctx.createLinearGradient(30,30,50,50);
        eG.addColorStop(0,'#ff4757');eG.addColorStop(1,'#96281b');
        ctx.fillStyle=eG;ctx.fillRect(30,30+pulse,20,20);
        ctx.strokeStyle='#fff';ctx.strokeRect(30,30+pulse,20,20);
        ctx.fillStyle='#fff';ctx.font='10px Arial';ctx.fillText('!',38,45+pulse);
      }

      // Silhueta para BugDex
      if (shadow) {
        ctx.globalCompositeOperation = 'source-atop';
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.fillRect(0, 0, 80, 80);
        ctx.globalCompositeOperation = 'source-over';
      }

      requestRef = requestAnimationFrame(render);
    };

    requestRef = requestAnimationFrame(render);
    return () => cancelAnimationFrame(requestRef);
  }, [id, shadow]);

  return <canvas ref={canvasRef} width={80} height={80} />;
};
