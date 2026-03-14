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
        
        // Se for shadow, vamos desenhar o sprite normalmente mas aplicar um efeito de silhueta ao final
        const isShadow = shadow;

        const now = Date.now();
        const pulse = Math.sin(now / 200) * 5;
        const fastPulse = Math.sin(now / 50) * 2;

    // --- BOSSES ULTRA DETALHADOS ---
    if (id === 'glitch_byte') {
        const centerX = 40; const centerY = 40;
        // 1. Núcleo de Estática
        ctx.fillStyle = '#111';
        ctx.fillRect(15 + fastPulse, 15, 50, 50);
        
        // 2. Ondas de Corrupção (Anéis expandindo)
        ctx.strokeStyle = `rgba(55, 118, 171, ${0.5 - Math.sin(now/200)*0.5})`;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(centerX, centerY, 20 + Math.sin(now/150)*10, 0, Math.PI*2); ctx.stroke();
        
        // 3. Matriz de Glitch Pixelada
        const colors = ['#3776ab', '#ffd43b', '#fff', '#ff4757', '#2ecc71', '#9b59b6'];
        for(let i=0; i<60; i++) {
            ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
            const x = 15 + Math.random() * 50; const y = 15 + Math.random() * 50;
            const w = 2 + Math.random() * 12; const h = 2 + Math.random() * 4;
            ctx.globalAlpha = Math.random() > 0.5 ? 1 : 0.4;
            ctx.fillRect(x, y, w, h);
        }
        ctx.globalAlpha = 1.0;

        // 4. Caracteres Ilegais Giratórios
        ctx.font = 'bold 12px "Courier New"';
        ctx.fillStyle = '#fff';
        ctx.shadowBlur = 5; ctx.shadowColor = '#fff';
        const chars = ['!', '@', '#', '$', '%', '&', '*', '?', 'X'];
        for(let i=0; i<8; i++) {
            const angle = (now / 800) + i * (Math.PI / 4);
            const r = 25 + Math.sin(now/300 + i)*5;
            const px = centerX - 4 + Math.cos(angle) * r;
            const py = centerY + 4 + Math.sin(angle) * r;
            ctx.fillText(chars[i], px, py);
        }
        ctx.shadowBlur = 0;

        // 5. Olho do Glitch (Centro estilhaçado)
        ctx.fillStyle = '#000'; ctx.beginPath(); ctx.moveTo(30,40); ctx.lineTo(40,30); ctx.lineTo(50,40); ctx.lineTo(40,50); ctx.fill();
        ctx.fillStyle = '#ff4757'; ctx.fillRect(38, 38, 4, 4);
    } 
    else if (id === 'logic_void') {
        const centerX = 40; const centerY = 40;
        // 1. O Vazio Paradoxal (Gradiente Dual giratório)
        const rot = now / 1000;
        const voidGrd = ctx.createLinearGradient(
            centerX + Math.cos(rot)*30, centerY + Math.sin(rot)*30,
            centerX - Math.cos(rot)*30, centerY - Math.sin(rot)*30
        );
        voidGrd.addColorStop(0, '#3498db'); // True Blue
        voidGrd.addColorStop(0.45, '#111'); // Vazio
        voidGrd.addColorStop(0.55, '#111'); // Vazio
        voidGrd.addColorStop(1, '#e74c3c'); // False Red
        
        ctx.fillStyle = voidGrd;
        ctx.beginPath(); ctx.arc(centerX, centerY, 30 + pulse, 0, Math.PI*2); ctx.fill();

        // 2. Anéis Orbitais de Contradição (X, Y, Z)
        ctx.lineWidth = 2;
        const drawRing = (angleOff: number, color: string, radius: number) => {
            ctx.save(); ctx.translate(centerX, centerY);
            ctx.rotate(now / 500 + angleOff);
            ctx.scale(1, 0.3); // Achatado para parecer 3D
            ctx.strokeStyle = color;
            ctx.beginPath(); ctx.arc(0, 0, radius, 0, Math.PI*2); ctx.stroke();
            // Nódulos de lógica nos anéis
            ctx.fillStyle = '#fff';
            ctx.beginPath(); ctx.arc(radius, 0, 4, 0, Math.PI*2); ctx.fill();
            ctx.restore();
        };
        drawRing(0, 'rgba(52, 152, 219, 0.8)', 35 + pulse);
        drawRing(Math.PI/3, 'rgba(231, 76, 60, 0.8)', 35 - pulse);
        drawRing(Math.PI/1.5, 'rgba(255, 255, 255, 0.6)', 40);

        // 3. Olho do Paradoxo Central
        ctx.fillStyle = '#fff';
        ctx.shadowBlur = 15; ctx.shadowColor = Math.floor(now/200)%2===0 ? '#3498db' : '#e74c3c';
        ctx.beginPath(); ctx.ellipse(centerX, centerY, 8, 15, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#000'; ctx.fillRect(centerX-1, centerY-5, 2, 10);
        ctx.shadowBlur = 0;
    }
    else if (id === 'stack_overlord') {
        const centerX = 40;
        const centerY = 40;
        
        // 1. Fornalha do Loop (Fundo pulsante)
        const furnaceGrd = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 38);
        furnaceGrd.addColorStop(0, '#e67e22');
        furnaceGrd.addColorStop(0.6, '#d35400');
        furnaceGrd.addColorStop(1, 'transparent');
        ctx.fillStyle = furnaceGrd;
        ctx.globalAlpha = 0.5 + Math.sin(now/200)*0.2;
        ctx.beginPath(); ctx.arc(centerX, centerY, 38, 0, Math.PI*2); ctx.fill();
        ctx.globalAlpha = 1.0;

        // 2. Pilares Industriais (Pistões do While)
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(8, 10, 8, 60); // Esquerda
        ctx.fillRect(64, 10, 8, 60); // Direita
        
        // Peças móveis dos pistões
        const piston1 = Math.sin(now/250) * 20; // Sobe e desce
        const piston2 = Math.cos(now/250) * 20; // Fora de sincronia
        ctx.fillStyle = '#f39c12';
        ctx.fillRect(6, 40 + piston1 - 5, 12, 10);
        ctx.fillRect(62, 40 + piston2 - 5, 12, 10);
        // Trilhos centrais dos pistões
        ctx.fillStyle = '#f1c40f';
        ctx.fillRect(11, 40 + piston1 - 5, 2, 60);
        ctx.fillRect(67, 40 + piston2 - 5, 2, 60);

        // 3. Estruturas Aninhadas (Nested Loops)
        // Engrenagens octogonais concêntricas girando infinitamente
        for(let j = 4; j >= 1; j--) {
            ctx.save();
            ctx.translate(centerX, centerY);
            
            // Rotação: direções alternadas e velocidades diferentes conforme a profundidade
            const dir = j % 2 === 0 ? 1 : -1;
            ctx.rotate(now * 0.001 * dir * (5-j));
            
            // Corpo do octógono
            ctx.beginPath();
            const radius = j * 7; // Raios: 28, 21, 14, 7
            for(let i=0; i<8; i++) {
                const angle = (Math.PI * 2 / 8) * i;
                const px = Math.cos(angle) * radius;
                const py = Math.sin(angle) * radius;
                if(i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.closePath();
            
            // Gradiente metálico para cada camada
            const gearGrd = ctx.createLinearGradient(-radius, -radius, radius, radius);
            if (j % 2 === 0) {
                gearGrd.addColorStop(0, '#7f8c8d'); gearGrd.addColorStop(1, '#2c3e50');
            } else {
                gearGrd.addColorStop(0, '#95a5a6'); gearGrd.addColorStop(1, '#34495e');
            }
            ctx.fillStyle = gearGrd;
            ctx.fill();
            
            // Borda brilhante
            ctx.strokeStyle = '#f1c40f'; 
            ctx.lineWidth = 1;
            ctx.stroke();
            
            // Dentes da engrenagem
            ctx.fillStyle = '#e67e22';
            for(let i=0; i<8; i++) {
                ctx.rotate(Math.PI * 2 / 8);
                ctx.fillRect(radius - 2, -2, 4, 4);
            }
            ctx.restore();
        }

        // 4. O Núcleo de Memória ("The Stack")
        const coreGrd = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 7);
        coreGrd.addColorStop(0, '#fff');
        coreGrd.addColorStop(0.5, '#e74c3c');
        coreGrd.addColorStop(1, '#c0392b');
        ctx.fillStyle = coreGrd;
        const corePulse = 6 + Math.sin(now/50)*1.5; // Pulsa agressivamente
        ctx.beginPath(); ctx.arc(centerX, centerY, corePulse, 0, Math.PI*2); ctx.fill();

        // 5. Erro de Stack Overflow (Raios vermelhos)
        if (Math.floor(now/100) % 5 === 0) {
            ctx.strokeStyle = 'rgba(231, 76, 60, 0.8)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX + (Math.random()-0.5)*60, centerY + (Math.random()-0.5)*60);
            ctx.stroke();
        }
    }
    else if (id === 'protocol_def') {
        const centerX = 40; const centerY = 40;
        // 1. Aura Mágica do Gênio
        const auraGrd = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 35);
        auraGrd.addColorStop(0, 'rgba(155, 89, 182, 0.8)');
        auraGrd.addColorStop(1, 'rgba(155, 89, 182, 0)');
        ctx.fillStyle = auraGrd;
        ctx.beginPath(); ctx.arc(centerX, centerY, 35 + pulse/2, 0, Math.PI*2); ctx.fill();

        // 2. Corpo do Gênio Translúcido
        ctx.fillStyle = '#8e44ad';
        ctx.beginPath();
        ctx.moveTo(centerX, centerY + 20 + pulse);
        ctx.quadraticCurveTo(centerX + 30, centerY, centerX + 15, centerY - 15 + pulse);
        ctx.lineTo(centerX - 15, centerY - 15 + pulse);
        ctx.quadraticCurveTo(centerX - 30, centerY, centerX, centerY + 20 + pulse);
        ctx.fill();

        // 3. Turbante e Diamante
        ctx.fillStyle = '#f1c40f'; // Ouro
        ctx.beginPath(); ctx.ellipse(centerX, centerY - 18 + pulse, 14, 6, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#00d2ff'; // Diamante
        ctx.beginPath(); ctx.moveTo(centerX, centerY - 25 + pulse); ctx.lineTo(centerX + 4, centerY - 18 + pulse); ctx.lineTo(centerX, centerY - 15 + pulse); ctx.lineTo(centerX - 4, centerY - 18 + pulse); ctx.fill();

        // 4. Mãos mágicas flutuando e escrevendo código
        ctx.fillStyle = '#9b59b6';
        const handPulse = Math.sin(now/150)*5;
        ctx.beginPath(); ctx.arc(centerX - 25, centerY + handPulse, 6, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(centerX + 25, centerY - handPulse, 6, 0, Math.PI*2); ctx.fill();

        // 5. Pergaminhos de Código Orbitando (def, return)
        ctx.font = 'bold 8px Arial'; ctx.fillStyle = '#fff'; ctx.shadowBlur = 4; ctx.shadowColor = '#fff';
        const orbit1 = now/800; const orbit2 = now/800 + Math.PI;
        ctx.fillText("def()", centerX - 10 + Math.cos(orbit1)*25, centerY + Math.sin(orbit1)*10);
        ctx.fillText("return", centerX - 12 + Math.cos(orbit2)*25, centerY + Math.sin(orbit2)*10);
        ctx.shadowBlur = 0;
    }
    else if (id === 'meta_class') {
        const centerX = 40; const centerY = 40;
        // 1. Estrutura de Mármore Branco e Plasma (A Cidadela)
        const structGrd = ctx.createLinearGradient(15, 15, 65, 65);
        structGrd.addColorStop(0, '#fdf6e3'); structGrd.addColorStop(1, '#95a5a6');
        
        ctx.save(); ctx.translate(centerX, centerY);
        ctx.rotate(Math.sin(now/1000)*0.2); // Balanço leve
        
        // Polígono Base (Hexágono)
        ctx.fillStyle = structGrd;
        ctx.beginPath();
        for(let i=0; i<6; i++) {
            const angle = (Math.PI*2/6) * i + Math.PI/2;
            const px = Math.cos(angle) * 25; const py = Math.sin(angle) * 25;
            if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
        }
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = '#3498db'; ctx.lineWidth = 2; ctx.stroke();

        // 2. Linhas de Blueprint e Moldes Internos
        ctx.strokeStyle = 'rgba(52, 152, 219, 0.5)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(-25, 0); ctx.lineTo(25, 0); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, -25); ctx.lineTo(0, 25); ctx.stroke();
        
        // 3. Cristal de Instânciação Flutuante
        const r = 12 + Math.sin(now/200)*3;
        const crystalGrd = ctx.createLinearGradient(-r, -r, r, r);
        crystalGrd.addColorStop(0, '#00d2ff'); crystalGrd.addColorStop(1, '#3a7bd5');
        ctx.fillStyle = crystalGrd;
        ctx.beginPath(); ctx.moveTo(0, -r); ctx.lineTo(r, 0); ctx.lineTo(0, r); ctx.lineTo(-r, 0); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI*2); ctx.fill();
        ctx.restore();
        
        // 4. "class" brilhante no topo
        ctx.fillStyle = '#fff'; ctx.font = 'bold 10px "Courier New"';
        ctx.shadowBlur = 10; ctx.shadowColor = '#3498db';
        ctx.fillText("class", 22, 12 + pulse/2);
        ctx.shadowBlur = 0;
    }
    else if (id === 'malwarech') {
        // --- MALWARECH ANIMADO SUPREMO (REFATORADO E ÉPICO) ---
        const centerX = 40; const centerY = 45;
        
        // 1. Fogo do Abismo (Fundo)
        const abyssGrd = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 40);
        abyssGrd.addColorStop(0, 'rgba(192, 57, 43, 0.4)');
        abyssGrd.addColorStop(1, 'transparent');
        ctx.fillStyle = abyssGrd;
        ctx.fillRect(0, 0, 80, 80);

        // 2. Asas Demoníacas de Código Corrompido
        const wingScale = 1 + Math.sin(now / 300) * 0.15;
        ctx.fillStyle = '#111'; ctx.strokeStyle = '#c0392b'; ctx.lineWidth = 1;
        const drawDemonWing = (side: number) => {
            ctx.beginPath(); ctx.moveTo(centerX, centerY);
            ctx.quadraticCurveTo(centerX + 20*side, centerY - 40*wingScale, centerX + 40*side, centerY - 35*wingScale);
            ctx.lineTo(centerX + 35*side, centerY - 10);
            ctx.lineTo(centerX + 15*side, centerY + 15);
            ctx.fill(); ctx.stroke();
        };
        drawDemonWing(-1); drawDemonWing(1);

        // 3. Tronco Muscular Sombrio
        const bodyPulse = 1 + Math.sin(now / 150) * 0.05;
        ctx.save(); ctx.translate(centerX, centerY); ctx.scale(bodyPulse, bodyPulse);
        
        const bodyGrd = ctx.createLinearGradient(-15, -10, 15, 20);
        bodyGrd.addColorStop(0, '#96281b'); bodyGrd.addColorStop(1, '#000');
        ctx.fillStyle = bodyGrd;
        ctx.beginPath(); ctx.moveTo(-20, -10); ctx.lineTo(20, -10); ctx.lineTo(10, 25); ctx.lineTo(-10, 25); ctx.fill();
        ctx.strokeStyle = '#ff4757'; ctx.lineWidth = 2; ctx.stroke();

        // 4. Chifres de Parênteses Invertidos
        const hornAngle = Math.sin(now / 400) * 0.1;
        ctx.strokeStyle = '#000'; ctx.lineWidth = 5; ctx.lineCap = 'round';
        ctx.save(); ctx.translate(-12, -20); ctx.rotate(hornAngle);
        ctx.beginPath(); ctx.arc(0, 0, 15, Math.PI, Math.PI * 1.5); ctx.stroke(); ctx.restore();
        ctx.save(); ctx.translate(12, -20); ctx.rotate(-hornAngle);
        ctx.beginPath(); ctx.arc(0, 0, 15, Math.PI * 1.5, 0); ctx.stroke(); ctx.restore();

        // 5. Cabeça de Armadura e Olhos Chama
        ctx.fillStyle = '#222';
        ctx.beginPath(); ctx.moveTo(-12, -25); ctx.lineTo(12, -25); ctx.lineTo(8, -5); ctx.lineTo(-8, -5); ctx.fill();
        
        // Olhos
        ctx.fillStyle = '#ffdbac'; ctx.shadowBlur = 10; ctx.shadowColor = '#ff4757';
        ctx.beginPath(); ctx.moveTo(-10, -15); ctx.lineTo(-2, -12); ctx.lineTo(-10, -10); ctx.fill();
        ctx.beginPath(); ctx.moveTo(10, -15); ctx.lineTo(2, -12); ctx.lineTo(10, -10); ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();

        // 6. Matriz Vermelha (Partículas caindo estilo Matrix)
        ctx.fillStyle = '#c0392b'; ctx.font = 'bold 8px Arial';
        for(let i=0; i<5; i++) {
            const px = centerX - 30 + Math.random()*60;
            const py = ((now/10) + i*20) % 80;
            ctx.fillText(Math.random() > 0.5 ? "1" : "0", px, py);
        }
    }
    // --- BUGMONS COMUNS ULTRA DETALHADOS ---
    
    // REINO 1: FLORESTA DAS VARIÁVEIS (Temática: Erros Básicos)
    else if (id === 'syntax_wasp') {
        const grd = ctx.createLinearGradient(30, 30, 50, 60);
        grd.addColorStop(0, '#ffd43b'); grd.addColorStop(1, '#f39c12');
        ctx.fillStyle = grd;
        // Corpo segmentado
        ctx.beginPath(); ctx.ellipse(40, 45 + pulse, 12, 18, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#000'; ctx.lineWidth = 1; ctx.stroke();
        // Listras pretas brilhantes
        ctx.fillStyle = '#222';
        ctx.fillRect(30, 40 + pulse, 20, 3); ctx.fillRect(28, 48 + pulse, 24, 3);
        // Asas duplas translúcidas com brilho
        ctx.fillStyle = 'rgba(200, 230, 255, 0.4)';
        ctx.beginPath(); ctx.ellipse(30, 38 + pulse, 15, 6, -Math.PI/4, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(50, 38 + pulse, 15, 6, Math.PI/4, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.stroke();
        // Olhos compostos vermelhos
        ctx.fillStyle = '#ff4757'; ctx.beginPath(); ctx.arc(36, 35 + pulse, 3, 0, Math.PI*2); ctx.arc(44, 35 + pulse, 3, 0, Math.PI*2); ctx.fill();
        // Ferrão de Aspas de Cristal
        ctx.fillStyle = '#3776ab'; ctx.font = 'bold 16px "Courier New"'; ctx.fillText('"', 37, 72 + pulse);
    } 
    else if (id === 'type_goblin') {
        // Rosto e corpo verde com sombra
        ctx.fillStyle = '#27ae60';
        ctx.beginPath(); ctx.moveTo(25, 65 + pulse); ctx.quadraticCurveTo(40, 25 + pulse, 55, 65 + pulse); ctx.fill();
        ctx.fillStyle = '#2ecc71'; // Luz
        ctx.beginPath(); ctx.moveTo(30, 60 + pulse); ctx.quadraticCurveTo(40, 35 + pulse, 50, 60 + pulse); ctx.fill();
        // Orelhas grandes e pontudas
        ctx.fillStyle = '#27ae60';
        ctx.beginPath(); ctx.moveTo(32, 45 + pulse); ctx.lineTo(15, 35 + pulse); ctx.lineTo(33, 52 + pulse); ctx.fill();
        ctx.beginPath(); ctx.moveTo(48, 45 + pulse); ctx.lineTo(65, 35 + pulse); ctx.lineTo(47, 52 + pulse); ctx.fill();
        // Gorro de programador rasgado
        ctx.fillStyle = '#34495e';
        ctx.beginPath(); ctx.moveTo(30, 40 + pulse); ctx.lineTo(40, 20 + pulse); ctx.lineTo(50, 40 + pulse); ctx.fill();
        // Bloco de "Tipo" (String corrompida)
        const boxGrd = ctx.createLinearGradient(30, 50, 50, 65);
        boxGrd.addColorStop(0, '#fff'); boxGrd.addColorStop(1, '#bdc3c7');
        ctx.fillStyle = boxGrd; ctx.fillRect(30, 50 + pulse, 20, 12);
        ctx.strokeStyle = '#3498db'; ctx.lineWidth = 1; ctx.strokeRect(30, 50 + pulse, 20, 12);
        ctx.fillStyle = '#3498db'; ctx.font = 'bold 8px Arial'; ctx.fillText('"10"', 32, 60 + pulse);
    }
    else if (id === 'name_bat') {
        // Corpo peludo (Sombra circular)
        const batGrd = ctx.createRadialGradient(40, 40+pulse, 2, 40, 40+pulse, 12);
        batGrd.addColorStop(0, '#2c3e50'); batGrd.addColorStop(1, '#000');
        ctx.fillStyle = batGrd;
        ctx.beginPath(); ctx.arc(40, 40 + pulse, 12, 0, Math.PI*2); ctx.fill();
        // Asas góticas rasgadas com veias
        ctx.fillStyle = '#1a1a1a';
        const drawWing = (side: number) => {
            ctx.beginPath(); ctx.moveTo(40 + 8*side, 40 + pulse);
            ctx.bezierCurveTo(40 + 25*side, 20 + pulse, 40 + 35*side, 45 + pulse, 40 + 10*side, 55 + pulse);
            ctx.lineTo(40 + 20*side, 48 + pulse); ctx.lineTo(40 + 8*side, 40 + pulse); ctx.fill();
        };
        drawWing(-1); drawWing(1);
        // Olhos vermelhos brilhantes
        ctx.fillStyle = '#ff4757'; ctx.beginPath(); ctx.arc(36, 40 + pulse, 2, 0, Math.PI*2); ctx.arc(44, 40 + pulse, 2, 0, Math.PI*2); ctx.fill();
        // Aura de NameError (Interrogação flutuante)
        ctx.fillStyle = 'rgba(255, 71, 87, 0.6)';
        ctx.font = 'bold 14px "Press Start 2P"';
        ctx.fillText('?', 35, 25 + pulse + Math.sin(now/100)*3);
    }
    else if (id === 'print_ghost') {
        // Corpo etéreo com gradiente alpha
        const ghostGrd = ctx.createLinearGradient(40, 20, 40, 75);
        ghostGrd.addColorStop(0, 'rgba(236, 240, 241, 0.9)');
        ghostGrd.addColorStop(1, 'rgba(236, 240, 241, 0)');
        ctx.fillStyle = ghostGrd;
        ctx.beginPath(); ctx.arc(40, 40 + pulse, 20, Math.PI, 0);
        ctx.lineTo(60, 70 + pulse);
        for(let i=0; i<4; i++) ctx.quadraticCurveTo(55 - i*10, 80 + pulse, 45 - i*10, 70 + pulse);
        ctx.lineTo(20, 40 + pulse); ctx.fill();
        // Olhos tristes de comando inexistente
        ctx.fillStyle = '#34495e';
        ctx.beginPath(); ctx.arc(33, 42 + pulse, 4, 0, Math.PI*2); ctx.arc(47, 42 + pulse, 4, 0, Math.PI*2); ctx.fill();
        // Partículas de "priint" se desfazendo
        ctx.fillStyle = '#3498db'; ctx.font = 'italic 7px "Courier New"';
        ctx.fillText('p', 20 + pulse, 30); ctx.fillText('r', 55 - pulse, 35); ctx.fillText('i', 30, 25 + pulse);
    }

    // REINO 2: CAVERNA DAS DECISÕES (Temática: Lógica)
    else if (id === 'if_slime') {
        const slimeGrd = ctx.createRadialGradient(40, 50+pulse, 5, 40, 50+pulse, 25);
        slimeGrd.addColorStop(0, 'rgba(52, 152, 219, 0.8)');
        slimeGrd.addColorStop(1, 'rgba(41, 128, 185, 0.4)');
        ctx.fillStyle = slimeGrd;
        ctx.beginPath(); ctx.moveTo(15, 65 + pulse);
        ctx.bezierCurveTo(20, 15 + pulse, 60, 15 + pulse, 65, 65 + pulse); ctx.fill();
        // Bolhas internas (Nódulos lógicos)
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.beginPath(); ctx.arc(30, 45 + pulse, 4, 0, Math.PI*2); ctx.arc(50, 55 + pulse, 3, 0, Math.PI*2); ctx.fill();
        // Olhos de "IF" brilhantes
        ctx.fillStyle = '#fff'; ctx.font = 'bold 14px "Press Start 2P"';
        ctx.shadowBlur = 10; ctx.shadowColor = '#fff';
        ctx.fillText(':', 37, 50 + pulse);
        ctx.shadowBlur = 0;
    }
    else if (id === 'bool_bat') {
        // Corpo dividido (True Blue / False Red)
        ctx.beginPath(); ctx.arc(40, 40 + pulse, 12, 0, Math.PI*2);
        const clipGrd = ctx.createLinearGradient(30, 40, 50, 40);
        clipGrd.addColorStop(0.5, '#3498db'); clipGrd.addColorStop(0.5, '#e74c3c');
        ctx.fillStyle = clipGrd; ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
        // Asas de raio binário
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 3;
        const drawBoltWing = (side: number) => {
            ctx.beginPath(); ctx.moveTo(40 + 10*side, 40 + pulse);
            ctx.lineTo(40 + 25*side, 30 + pulse); ctx.lineTo(40 + 20*side, 40 + pulse);
            ctx.lineTo(40 + 35*side, 45 + pulse); ctx.stroke();
        };
        drawBoltWing(-1); drawBoltWing(1);
        // Letra Binária Central
        ctx.fillStyle = '#fff'; ctx.font = 'bold 10px Arial'; ctx.fillText('B', 36, 44 + pulse);
    }
    else if (id === 'else_troll') {
        // Textura de rocha com gradiente
        const rockGrd = ctx.createLinearGradient(20, 20, 60, 70);
        rockGrd.addColorStop(0, '#95a5a6'); rockGrd.addColorStop(1, '#2c3e50');
        ctx.fillStyle = rockGrd;
        // Cabeça quadrada e ombros largos
        ctx.fillRect(20, 30 + pulse, 40, 40);
        ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(20, 60 + pulse, 40, 10);
        // Musgo (Erros acumulados)
        ctx.fillStyle = '#27ae60'; ctx.fillRect(22, 32 + pulse, 10, 5); ctx.fillRect(45, 35 + pulse, 8, 4);
        // Sinais de Atribuição Errados (= no lugar de ==)
        ctx.fillStyle = '#ff4757'; ctx.font = 'bold 18px Arial';
        ctx.fillText('=', 32, 55 + pulse);
        // Olhos de fenda amarela
        ctx.fillStyle = '#f1c40f'; ctx.fillRect(30, 40 + pulse, 6, 2); ctx.fillRect(44, 40 + pulse, 6, 2);
    }
    else if (id === 'logic_snake') {
        // Corpo de serpente com gradiente arco-íris de lógica
        const snkGrd = ctx.createLinearGradient(20, 40, 60, 40);
        snkGrd.addColorStop(0, '#2ecc71'); snkGrd.addColorStop(1, '#27ae60');
        ctx.strokeStyle = snkGrd; ctx.lineWidth = 8; ctx.lineCap = 'round';
        ctx.beginPath();
        for(let i=0; i<12; i++) {
            const sx = 15 + i*4.5;
            const sy = 45 + Math.sin(now/150 + i*0.8) * 12;
            if(i === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
        }
        ctx.stroke();
        // Cabeça de diamante
        const hx = 15 + 11*4.5; const hy = 45 + Math.sin(now/150 + 11*0.8) * 12;
        ctx.fillStyle = '#27ae60'; ctx.beginPath();
        ctx.moveTo(hx, hy - 8); ctx.lineTo(hx + 12, hy); ctx.lineTo(hx, hy + 8); ctx.lineTo(hx - 4, hy); ctx.fill();
        // Língua bífida de "and / or"
        ctx.strokeStyle = '#ff4757'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(hx + 10, hy); ctx.lineTo(hx + 18, hy - 4); ctx.moveTo(hx + 10, hy); ctx.lineTo(hx + 18, hy + 4); ctx.stroke();
    }

    // REINO 3: TORRE DAS REPETIÇÕES (Temática: Loops)
    else if (id === 'for_spider') {
        // Corpo mecânico
        const gearGrd = ctx.createRadialGradient(40, 40+pulse, 2, 40, 40+pulse, 15);
        gearGrd.addColorStop(0, '#34495e'); gearGrd.addColorStop(1, '#1a1a1a');
        ctx.fillStyle = gearGrd;
        ctx.beginPath(); ctx.arc(40, 40 + pulse, 14, 0, Math.PI*2); ctx.fill();
        // 8 Patas Hidráulicas de Loop
        ctx.strokeStyle = '#7f8c8d'; ctx.lineWidth = 3;
        for(let i=0; i<8; i++) {
            const angle = i * (Math.PI/4) + (now/1000);
            const dist = 30 + Math.sin(now/200 + i)*5;
            ctx.beginPath(); ctx.moveTo(40, 40 + pulse);
            const midX = 40 + Math.cos(angle)*15; const midY = 40 + pulse + Math.sin(angle)*15;
            const endX = 40 + Math.cos(angle)*dist; const endY = 40 + pulse + Math.sin(angle)*dist + 10;
            ctx.lineTo(midX, midY); ctx.lineTo(endX, endY); ctx.stroke();
        }
        // Centro pulsante "in"
        ctx.fillStyle = '#3498db'; ctx.font = 'bold 8px Arial'; ctx.fillText('in', 36, 44 + pulse);
    }
    else if (id === 'while_worm') {
        // Segmentos metálicos (Engrenagens em linha)
        for(let i=0; i<6; i++) {
            const wx = 15 + i*10; const wy = 45 + Math.sin(now/100 + i)*8;
            ctx.save(); ctx.translate(wx, wy); ctx.rotate(now/200);
            ctx.fillStyle = i%2===0 ? '#d35400' : '#e67e22';
            ctx.fillRect(-5, -5, 10, 10);
            ctx.fillStyle = '#222'; ctx.beginPath(); ctx.arc(0, 0, 2, 0, Math.PI*2); ctx.fill();
            ctx.restore();
        }
        // Cabeça com visor de scanner
        const hx = 15 + 5*10; const hy = 45 + Math.sin(now/100 + 5)*8;
        ctx.fillStyle = '#2c3e50'; ctx.fillRect(hx-4, hy-6, 12, 12);
        ctx.fillStyle = '#ff4757'; ctx.fillRect(hx+2, hy-2, 6, 2);
    }
    else if (id === 'range_rat') {
        // Corpo aerodinâmico cinza
        const ratGrd = ctx.createLinearGradient(20, 50, 60, 50);
        ratGrd.addColorStop(0, '#7f8c8d'); ratGrd.addColorStop(1, '#bdc3c7');
        ctx.fillStyle = ratGrd;
        ctx.beginPath(); ctx.ellipse(40, 52 + pulse, 18, 10, 0, 0, Math.PI*2); ctx.fill();
        // Orelhas de radar e bigodes metálicos
        ctx.fillStyle = '#95a5a6';
        ctx.beginPath(); ctx.arc(30, 42 + pulse, 6, 0, Math.PI*2); ctx.arc(50, 42 + pulse, 6, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = '#222'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(55, 52 + pulse); ctx.lineTo(65, 48 + pulse); ctx.moveTo(55, 52 + pulse); ctx.lineTo(65, 56 + pulse); ctx.stroke();
        // Números de iteração flutuando atrás (0, 1, 2)
        ctx.fillStyle = 'rgba(52, 152, 219, 0.5)'; ctx.font = '6px "Press Start 2P"';
        ctx.fillText('0 1 2', 25, 40 + pulse);
    }
    else if (id === 'break_beetle') {
        // Casca de obsidiana blindada
        const btlGrd = ctx.createRadialGradient(40, 45+pulse, 5, 40, 45+pulse, 25);
        btlGrd.addColorStop(0, '#34495e'); btlGrd.addColorStop(1, '#000');
        ctx.fillStyle = btlGrd;
        ctx.beginPath(); ctx.ellipse(40, 45 + pulse, 22, 28, 0, 0, Math.PI*2); ctx.fill();
        // Chifre de "Break" (Formato de raio)
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(40, 25 + pulse); ctx.lineTo(45, 10 + pulse); ctx.lineTo(35, 10 + pulse); ctx.lineTo(40, -5 + pulse); ctx.stroke();
        // Pernas reforçadas com juntas brilhantes
        ctx.strokeStyle = '#2c3e50'; ctx.lineWidth = 5;
        const drawPowerLeg = (side: number, y: number) => {
            ctx.beginPath(); ctx.moveTo(40 + 15*side, y + pulse);
            ctx.lineTo(40 + 35*side, y - 5 + pulse); ctx.stroke();
            ctx.fillStyle = '#3498db'; ctx.beginPath(); ctx.arc(40 + 15*side, y + pulse, 3, 0, Math.PI*2); ctx.fill();
        };
        drawPowerLeg(-1, 40); drawPowerLeg(1, 40); drawPowerLeg(-1, 55); drawPowerLeg(1, 55);
    }

    // REINO 4: OÁSIS DAS FUNÇÕES (Temática: Definições e Escopo)
    else if (id === 'def_dragon') {
        // Wyvern de fogo alaranjado
        const drgGrd = ctx.createLinearGradient(40, 20, 40, 70);
        drgGrd.addColorStop(0, '#e67e22'); drgGrd.addColorStop(1, '#d35400');
        ctx.fillStyle = drgGrd;
        ctx.beginPath(); ctx.moveTo(40, 15 + pulse); 
        ctx.lineTo(65, 65 + pulse); ctx.lineTo(40, 55 + pulse); ctx.lineTo(15, 65 + pulse); ctx.closePath(); ctx.fill();
        // Asas membranosas detalhadas
        ctx.fillStyle = 'rgba(192, 57, 43, 0.6)';
        const drawDragonWing = (side: number) => {
            ctx.beginPath(); ctx.moveTo(40 + 5*side, 35 + pulse);
            ctx.quadraticCurveTo(40 + 40*side, 10 + pulse, 40 + 10*side, 50 + pulse); ctx.fill();
        };
        drawDragonWing(-1); drawDragonWing(1);
        // Fogo de "def" sainao da boca
        ctx.fillStyle = '#f1c40f'; ctx.font = 'bold 9px Arial'; ctx.fillText('def()', 32, 25 + pulse);
    }
    else if (id === 'return_raven') {
        // Plumagem azul escura/roxa
        const rvnGrd = ctx.createRadialGradient(40, 40+pulse, 2, 40, 40+pulse, 15);
        rvnGrd.addColorStop(0, '#4b148c'); rvnGrd.addColorStop(1, '#2c3e50');
        ctx.fillStyle = rvnGrd;
        ctx.beginPath(); ctx.arc(40, 40 + pulse, 14, 0, Math.PI*2); ctx.fill();
        // Bico de ouro segurando o 'return'
        ctx.fillStyle = '#f1c40f';
        ctx.beginPath(); ctx.moveTo(52, 38 + pulse); ctx.lineTo(65, 42 + pulse); ctx.lineTo(52, 46 + pulse); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.fillRect(55, 42 + pulse, 12, 6);
        ctx.fillStyle = '#000'; ctx.font = '6px Arial'; ctx.fillText('ret', 56, 47 + pulse);
        // Penas das asas em leque
        ctx.fillStyle = '#2c3e50';
        for(let i=0; i<3; i++) {
            ctx.save(); ctx.translate(30, 40 + pulse); ctx.rotate(-i*0.4 + pulse/10);
            ctx.fillRect(-15, -2, 15, 4); ctx.restore();
        }
    }
    else if (id === 'param_pig') {
        // Javali robusto com armadura de parênteses
        const pigGrd = ctx.createLinearGradient(20, 30, 60, 70);
        pigGrd.addColorStop(0, '#8d6e63'); pigGrd.addColorStop(1, '#5d4037');
        ctx.fillStyle = pigGrd;
        ctx.beginPath(); ctx.ellipse(40, 50 + pulse, 25, 20, 0, 0, Math.PI*2); ctx.fill();
        // Presas de marfim (Parênteses curvos)
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.arc(25, 45+pulse, 10, Math.PI*0.5, Math.PI*1.2); ctx.stroke();
        ctx.beginPath(); ctx.arc(55, 45+pulse, 10, Math.PI*1.8, Math.PI*0.5); ctx.stroke();
        // Focinho com "arg"
        ctx.fillStyle = '#a1887f'; ctx.beginPath(); ctx.ellipse(40, 52 + pulse, 10, 7, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#222'; ctx.font = 'bold 7px Arial'; ctx.fillText('args', 33, 55 + pulse);
    }
    else if (id === 'scope_scorp') {
        // Couraça roxa metálica
        const scpGrd = ctx.createLinearGradient(30, 50, 50, 70);
        scpGrd.addColorStop(0, '#6a1b9a'); scpGrd.addColorStop(1, '#4a148c');
        ctx.fillStyle = scpGrd;
        ctx.fillRect(25, 55 + pulse, 30, 15);
        // Cauda segmentada de Indentação (4 níveis)
        ctx.strokeStyle = '#6a1b9a'; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(40, 55 + pulse);
        ctx.lineTo(40, 40 + pulse); ctx.lineTo(50, 40 + pulse); ctx.lineTo(50, 25 + pulse); ctx.lineTo(65, 25 + pulse); ctx.stroke();
        // Ferrão brilhante de IndentationError
        ctx.fillStyle = '#ffd43b'; ctx.shadowBlur = 10; ctx.shadowColor = '#ffd43b';
        ctx.beginPath(); ctx.moveTo(65, 20 + pulse); ctx.lineTo(75, 25 + pulse); ctx.lineTo(65, 30 + pulse); ctx.fill();
        ctx.shadowBlur = 0;
    }

    // REINO 5: CIDADELA DA OOP (Temática: Abstração e Classes)
    else if (id === 'class_cat') {
        // Silhueta elegante azul Python
        const catGrd = ctx.createLinearGradient(30, 30, 50, 60);
        catGrd.addColorStop(0, '#3776ab'); catGrd.addColorStop(1, '#1e293b');
        ctx.fillStyle = catGrd;
        ctx.beginPath(); ctx.arc(40, 45 + pulse, 15, 0, Math.PI*2); ctx.fill();
        // Orelhas de blueprint (Vazadas)
        ctx.strokeStyle = '#ffd43b'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(30, 35+pulse); ctx.lineTo(30, 20+pulse); ctx.lineTo(38, 35+pulse); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(50, 35+pulse); ctx.lineTo(50, 20+pulse); ctx.lineTo(42, 35+pulse); ctx.stroke();
        // Olhos de código "class"
        ctx.fillStyle = '#fff'; ctx.font = 'bold 8px Arial'; ctx.fillText('{}', 35, 48 + pulse);
        // Cauda longa e elegante
        ctx.strokeStyle = catGrd; ctx.lineWidth = 4; ctx.beginPath();
        ctx.moveTo(30, 55+pulse); ctx.quadraticCurveTo(10, 55+pulse, 15, 35+pulse); ctx.stroke();
    }
    else if (id === 'init_owl') {
        // Plumagem de madeira/engrenagem
        ctx.fillStyle = '#5d4037';
        ctx.beginPath(); ctx.arc(40, 45 + pulse, 20, 0, Math.PI*2); ctx.fill();
        // Olhos de Lente de Câmera (Construtores __init__)
        const drawLens = (x: number) => {
            ctx.fillStyle = '#222'; ctx.beginPath(); ctx.arc(x, 42+pulse, 8, 0, Math.PI*2); ctx.fill();
            ctx.strokeStyle = '#ffd43b'; ctx.lineWidth = 1; ctx.stroke();
            ctx.fillStyle = '#00d2ff'; ctx.beginPath(); ctx.arc(x+2, 40+pulse, 2, 0, Math.PI*2); ctx.fill();
        };
        drawLens(30); drawLens(50);
        // Sobrancelhas de código "__"
        ctx.fillStyle = '#ffd43b'; ctx.fillRect(22, 30+pulse, 10, 2); ctx.fillRect(48, 30+pulse, 10, 2);
        // Bico de diamante
        ctx.fillStyle = '#f39c12'; ctx.beginPath(); ctx.moveTo(40, 48+pulse); ctx.lineTo(44, 55+pulse); ctx.lineTo(36, 55+pulse); ctx.fill();
    }
    else if (id === 'self_squid') {
        // Cabeça de domo translúcida ciano
        const sqdGrd = ctx.createRadialGradient(40, 35+pulse, 5, 40, 35+pulse, 20);
        sqdGrd.addColorStop(0, 'rgba(0, 210, 255, 0.8)'); sqdGrd.addColorStop(1, 'rgba(0, 210, 255, 0.2)');
        ctx.fillStyle = sqdGrd;
        ctx.beginPath(); ctx.arc(40, 35 + pulse, 18, Math.PI, 0); ctx.fill();
        // Núcleo "self" brilhante
        ctx.fillStyle = '#fff'; ctx.shadowBlur = 10; ctx.shadowColor = '#fff';
        ctx.font = 'bold 10px Arial'; ctx.fillText('self', 30, 38 + pulse); ctx.shadowBlur = 0;
        // Tentáculos de fibra óptica (Atributos)
        ctx.strokeStyle = 'rgba(0, 210, 255, 0.6)'; ctx.lineWidth = 2;
        for(let i=0; i<6; i++) {
            const tx = 28 + i*5;
            ctx.beginPath(); ctx.moveTo(tx, 35+pulse);
            ctx.bezierCurveTo(tx-10, 60+pulse, tx+10, 65+pulse, tx, 75+pulse + Math.sin(now/200+i)*5); ctx.stroke();
        }
    }
    else if (id === 'method_monkey') {
        // Macaco de pelagem escura com máscara de código
        ctx.fillStyle = '#3e2723';
        ctx.beginPath(); ctx.arc(40, 40 + pulse, 16, 0, Math.PI*2); ctx.fill();
        // Orelhas grandes e redondas
        ctx.beginPath(); ctx.arc(24, 35 + pulse, 7, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(56, 35 + pulse, 7, 0, Math.PI*2); ctx.fill();
        // Braços elásticos (Chamadas de métodos)
        ctx.strokeStyle = '#3e2723'; ctx.lineWidth = 5;
        ctx.beginPath(); ctx.moveTo(25, 45+pulse); ctx.quadraticCurveTo(10, 45+pulse, 5, 65+pulse); ctx.stroke();
        // Braço R
        ctx.beginPath(); ctx.moveTo(55, 45+pulse); ctx.quadraticCurveTo(70, 45+pulse, 75, 65+pulse); ctx.stroke();
        // O "Ponto" (.) dourado de conexão
        ctx.fillStyle = '#ffd43b'; ctx.beginPath(); ctx.arc(40, 52+pulse, 5, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.stroke();
    }
    else {
      // Fallback para IDs desconhecidos: Cubo de Erro Detalhado
      const errGrd = ctx.createLinearGradient(30, 30, 50, 50);
      errGrd.addColorStop(0, '#ff4757'); errGrd.addColorStop(1, '#96281b');
      ctx.fillStyle = errGrd; ctx.fillRect(30, 30 + pulse, 20, 20);
      ctx.strokeStyle = '#fff'; ctx.strokeRect(30, 30 + pulse, 20, 20);
      ctx.fillStyle = '#fff'; ctx.font = '10px Arial'; ctx.fillText('!', 38, 45 + pulse);
    }

    // APLICAÇÃO DA SILHUETA PARA A BUGDEX (shadow = true)
    if (isShadow) {
        ctx.globalCompositeOperation = 'source-atop';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)'; // Preto quase opaco
        ctx.fillRect(0, 0, 80, 80);
        ctx.globalCompositeOperation = 'source-over'; // Reseta para o padrão
    }
    
        requestRef = requestAnimationFrame(render);
    };

    requestRef = requestAnimationFrame(render);
    return () => cancelAnimationFrame(requestRef);
  }, [id, shadow]);

  return <canvas ref={canvasRef} width={80} height={80} />;
};
