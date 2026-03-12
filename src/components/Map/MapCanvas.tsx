import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { MapData } from '../../maps/types';
import { useMapEngine } from '../../hooks/useMapEngine';
import { useGameStore } from '../../hooks/useGameStore';
import DPad from '../UI/DPad';
import { WORLD1_ENEMIES, WORLD2_ENEMIES, WORLD3_ENEMIES, WORLD4_ENEMIES, WORLD5_ENEMIES } from '../../data/bugs';
import { BugSprite } from '../Battle/BugSprite';

interface MapCanvasProps {
  map: MapData;
  spawnPos: { x: number, y: number } | null;
  onEncounter: () => void;
  onInteract: (npc: any) => void;
  onPortal: (targetMap: string, x: number, y: number) => void;
  onOpenNotebook: () => void;
  isDialogActive: boolean;
}

const TILE_SIZE = 32;
const VIEWPORT_W = 480;
const VIEWPORT_H = 352;

const TILE_COLORS: Record<number, string> = {
  0: '#9bbc0f', 1: '#8bac0f', 2: '#e0f0c0', 3: '#306230', 4: '#0f380f', 5: '#0f380f', 6: '#7f8c8d', 7: '#3498db', 8: '#f1c40f', 10: '#bdc3c7', 11: '#c0392b', 12: '#000000', 13: '#e0f0c0', 14: '#8bac0f', 15: '#e74c3c', 16: '#d35400', 17: '#00d2ff', 18: '#9b59b6', 19: '#e67e22'
};

const MapCanvas: React.FC<MapCanvasProps> = ({ map, spawnPos, onEncounter, onInteract, onPortal, onOpenNotebook, isDialogActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasTriggeredInitialDialog, setHasTriggeredInitialDialog] = useState(false);
  const [showBugDex, setShowBugDex] = useState(false);
  
  const { playerPos, isMoving, setManualDir, interact, teleport } = useMapEngine(
    map, 
    isDialogActive ? undefined : onEncounter, 
    isDialogActive ? undefined : onPortal, 
    isDialogActive
  );
  
  const { name: playerName, color: playerColor, hasTerminal, hasNotebook, openedChests, correctedBugs, merchantLocation } = useGameStore();

  const isMerchantHere = merchantLocation === map.id;

  useEffect(() => {
    if (map.id === 'village' && !hasTerminal && !hasTriggeredInitialDialog && !isDialogActive) {
      const pep8 = map.npcs.find(n => n.id === 'pep8');
      if (pep8) {
        const dist = Math.abs(playerPos.x - pep8.tileX) + Math.abs(playerPos.y - pep8.tileY);
        if (dist === 1) { 
            setHasTriggeredInitialDialog(true); 
            onInteract({ type: 'npc', data: pep8 }); 
        }
      }
    }
  }, [playerPos, map, hasTriggeredInitialDialog, isDialogActive, onInteract, hasTerminal]);

  useEffect(() => { if (spawnPos) teleport(spawnPos.x, spawnPos.y); }, [spawnPos, teleport]);

  const handleInteractBtn = useCallback(() => {
    if (isDialogActive) return;
    const interaction = interact();
    if (interaction) onInteract(interaction);
  }, [isDialogActive, interact, onInteract]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isDialogActive) return;
      
      const target = e.target as HTMLElement;
      if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') return;

      if (e.key.toLowerCase() === 'e' || e.key === 'Enter') handleInteractBtn();
      if (e.key.toLowerCase() === 'b') setShowBugDex(prev => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInteractBtn, isDialogActive]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !map || !map.tiles) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const now = Date.now();
    const cameraX = Math.floor(Math.max(0, Math.min(playerPos.x * TILE_SIZE - VIEWPORT_W / 2 + TILE_SIZE / 2, map.width * TILE_SIZE - VIEWPORT_W)));
    const cameraY = Math.floor(Math.max(0, Math.min(playerPos.y * TILE_SIZE - VIEWPORT_H / 2 + TILE_SIZE / 2, map.height * TILE_SIZE - VIEWPORT_H)));

    ctx.clearRect(0, 0, VIEWPORT_W, VIEWPORT_H);

    const drawLabel = (text: string, x: number, y: number, color: string = 'rgba(15, 56, 15, 0.9)') => {
      ctx.font = '6px "Press Start 2P"';
      const metrics = ctx.measureText(text);
      const w = metrics.width + 8;
      ctx.fillStyle = color;
      ctx.fillRect(x - w/2, y - 10, w, 12);
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(text, x, y - 2);
    };

    const isCave = map.id === 'world2';
    const isTower = map.id === 'world3';
    let floorColor = TILE_COLORS[0];
    let pathColor = TILE_COLORS[2];
    if (isCave) { floorColor = '#1e293b'; pathColor = '#334155'; }
    else if (isTower) { floorColor = '#0f172a'; pathColor = '#1e293b'; }

    ctx.fillStyle = floorColor;
    ctx.fillRect(0, 0, VIEWPORT_W, VIEWPORT_H);

    map.tiles.forEach((row, y) => {
      if (!row) return;
      row.forEach((tile, x) => {
        const tx = x * TILE_SIZE - cameraX;
        const ty = y * TILE_SIZE - cameraY;
        if (tx < -TILE_SIZE || tx > VIEWPORT_W || ty < -TILE_SIZE || ty > VIEWPORT_H) return;

        if (tile === 2 || tile === 12) {
          ctx.fillStyle = pathColor; ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
        }

        if (tile === 1) {
          ctx.fillStyle = isCave ? 'rgba(46, 204, 113, 0.2)' : TILE_COLORS[1]; ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = isCave ? '#2ecc71' : '#306230';
          for(let i=0; i<3; i++) {
            const ox = i * 8 + 4;
            ctx.beginPath(); ctx.moveTo(tx + ox, ty + 20); ctx.lineTo(tx + ox + 4, ty + 12); ctx.lineTo(tx + ox + 8, ty + 20); ctx.fill();
          }
        }

        if (tile === 6) { // PONTES
          ctx.fillStyle = '#7f8c8d'; ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
          ctx.strokeStyle = '#2c3e50'; ctx.lineWidth = 2; ctx.strokeRect(tx + 2, ty + 2, TILE_SIZE - 4, TILE_SIZE - 4);
          ctx.fillStyle = '#95a5a6'; ctx.fillRect(tx + 4, ty + 6, 10, 6); ctx.fillRect(tx + 18, ty + 12, 10, 6); ctx.fillRect(tx + 6, ty + 22, 12, 4);
          ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(tx, ty + TILE_SIZE - 4, TILE_SIZE, 4);
        }

        if (tile === 7) { // ÁGUA
          ctx.fillStyle = '#3498db'; ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = 'rgba(255,255,255,0.3)';
          const wave = Math.sin(now / 500) * 4;
          ctx.fillRect(tx + 4 + wave, ty + 8, 8, 2);
          ctx.fillRect(tx + 16 - wave, ty + 20, 8, 2);
        }

        if (tile === 15) { // FLORES
          const colors = ['#e74c3c', '#f1c40f', '#9b59b6'];
          ctx.fillStyle = colors[(x + y) % colors.length];
          ctx.beginPath(); ctx.arc(tx + 16, ty + 16, 4, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(tx + 16, ty + 16, 1.5, 0, Math.PI * 2); ctx.fill();
        }

        if (tile === 16) { // ENGRENAGENS (ANIMADAS)
          ctx.save();
          ctx.translate(tx + 16, ty + 16);
          ctx.rotate((now / 1000) * ( (x+y)%2 === 0 ? 1 : -1 ));
          ctx.fillStyle = '#7f8c8d';
          for(let i=0; i<8; i++) {
              ctx.rotate(Math.PI/4);
              ctx.fillRect(-12, -12, 24, 24);
          }
          ctx.fillStyle = '#95a5a6';
          ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI*2); ctx.fill();
          ctx.fillStyle = floorColor;
          ctx.beginPath(); ctx.arc(0, 0, 3, 0, Math.PI*2); ctx.fill();
          ctx.restore();
        }

        if (tile === 17) { // CIRCUITOS NEON
          ctx.fillStyle = floorColor; ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
          ctx.strokeStyle = '#00d2ff'; ctx.lineWidth = 2;
          ctx.globalAlpha = 0.3 + Math.sin(now / 300) * 0.2;
          ctx.beginPath();
          ctx.moveTo(tx, ty + 16); ctx.lineTo(tx + 32, ty + 16);
          if ((x+y)%2 === 0) { ctx.moveTo(tx + 16, ty); ctx.lineTo(tx + 16, ty + 32); }
          ctx.stroke();
          ctx.globalAlpha = 1.0;
          ctx.fillStyle = '#00d2ff'; ctx.fillRect(tx + 14, ty + 14, 4, 4);
        }

        if (tile === 18) { // CRISTAIS (CAVERNA)
          ctx.fillStyle = floorColor; ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = '#9b59b6';
          const glow = 0.5 + Math.sin(now / 400) * 0.5;
          ctx.globalAlpha = glow;
          ctx.beginPath();
          ctx.moveTo(tx + 16, ty + 4);
          ctx.lineTo(tx + 24, ty + 24);
          ctx.lineTo(tx + 8, ty + 24);
          ctx.fill();
          ctx.globalAlpha = 1.0;
          ctx.strokeStyle = '#fff'; ctx.lineWidth = 1;
          ctx.stroke();
        }

        if (tile === 19) { // MAGMA / LAVA (ANIMADO)
          ctx.fillStyle = '#e67e22'; ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = '#d35400';
          const flow = Math.sin(now / 600) * 6;
          ctx.fillRect(tx + 4 + flow, ty + 4, 12, 4);
          ctx.fillRect(tx + 16 - flow, ty + 20, 12, 4);
        }

        if (tile === 10) { // PAREDES CASA
          ctx.fillStyle = '#bdc3c7'; ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
          ctx.strokeStyle = '#95a5a6'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(tx, ty+10); ctx.lineTo(tx+TILE_SIZE, ty+10); ctx.moveTo(tx, ty+20); ctx.lineTo(tx+TILE_SIZE, ty+20); ctx.stroke();
          if (x % 2 === 0) { ctx.fillStyle = '#2c3e50'; ctx.fillRect(tx + 10, ty + 4, 12, 10); ctx.strokeStyle = '#fff'; ctx.strokeRect(tx + 10, ty + 4, 12, 10); }
        }

        if (tile === 11) { // TELHADO CASA
          ctx.fillStyle = '#c0392b'; ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
          ctx.strokeStyle = '#96281b'; ctx.beginPath();
          for(let i=0; i<TILE_SIZE; i+=8) { ctx.moveTo(tx + i, ty); ctx.lineTo(tx + i, ty + TILE_SIZE); }
          for(let j=0; j<TILE_SIZE; j+=8) { ctx.moveTo(tx, ty + j); ctx.lineTo(tx + TILE_SIZE, ty + j); }
          ctx.stroke();
          ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.fillRect(tx, ty, TILE_SIZE, 4);
        }

        if (tile === 3) {
          const sway = Math.sin(now / 1000) * 2;
          ctx.fillStyle = isCave ? '#475569' : '#306230'; ctx.fillRect(tx + sway, ty, TILE_SIZE, TILE_SIZE);
        }

        if (tile === 4 || tile === 5) {
          ctx.fillStyle = isCave || isTower ? '#334155' : '#0f380f'; ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
        }

        if (tile === 13) {
          ctx.fillStyle = '#4b2c20'; ctx.fillRect(tx + 14, ty + 16, 4, 16); 
          ctx.fillStyle = '#fdf6e3'; ctx.fillRect(tx + 4, ty + 6, 24, 14); 
          ctx.strokeStyle = '#4b2c20'; ctx.lineWidth = 2; ctx.strokeRect(tx + 4, ty + 6, 24, 14);
        }

        if (tile === 8) {
          const isOpen = openedChests.includes(`${map.id}_${x}_${y}`);
          ctx.fillStyle = isOpen ? '#306230' : '#141e30'; ctx.fillRect(tx + 4, ty + 12, 24, 16);
          if (!isOpen) { ctx.fillStyle = '#f1c40f'; ctx.fillRect(tx + 4, ty + 14, 24, 4); if (Math.floor(now/200) % 10 < 5) { ctx.fillStyle = '#fff'; ctx.fillRect(tx + 14, ty + 16, 4, 4); } }
        }
      });
    });

    if (isMerchantHere) {
        const mx = Math.floor(map.merchantPos.x * TILE_SIZE - cameraX);
        const my = Math.floor(map.merchantPos.y * TILE_SIZE - cameraY);
        ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(mx + 8, my + 28, 16, 4);
        ctx.fillStyle = '#e67e22'; ctx.fillRect(mx + 6, my + 12, 20, 16); 
        ctx.fillStyle = '#d35400'; ctx.fillRect(mx + 4, my + 14, 4, 12); ctx.fillRect(mx + 24, my + 14, 4, 12);
        ctx.fillStyle = '#ff8c00'; ctx.fillRect(mx + 8, my + 2, 16, 12);
        ctx.fillStyle = '#0f172a'; ctx.fillRect(mx + 10, my + 5, 12, 7);
        ctx.fillStyle = '#00d2ff';
        const eyeGlow = 0.4 + Math.sin(now / 200) * 0.4;
        ctx.globalAlpha = eyeGlow;
        ctx.fillRect(mx + 12, my + 7, 2, 2); ctx.fillRect(mx + 18, my + 7, 2, 2);
        ctx.globalAlpha = 1.0;
        drawLabel("MERCADOR", mx + 16, my - 6, '#ff8c00');
    }

    map.npcs.forEach(npc => {
      const nx = Math.floor(npc.tileX * TILE_SIZE - cameraX);
      const ny = Math.floor(npc.tileY * TILE_SIZE - cameraY);
      if (nx < -TILE_SIZE || nx > VIEWPORT_W || ny < -TILE_SIZE || ny > VIEWPORT_H) return;
      
      // Sombra base para todos
      ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(nx + 8, ny + 28, 16, 4);

      if (npc.id === 'pep8') {
          // MENTORA PEP-8
          ctx.fillStyle = '#2e7d32'; ctx.fillRect(nx + 6, ny + 14, 20, 14); 
          ctx.fillStyle = '#ffdbac'; ctx.fillRect(nx + 10, ny + 4, 12, 12);
          ctx.fillStyle = '#e0e0e0'; ctx.fillRect(nx + 10, ny + 2, 12, 6);
          ctx.fillRect(nx + 8, ny + 4, 4, 10); ctx.fillRect(nx + 20, ny + 4, 4, 10);
          ctx.fillStyle = '#000'; ctx.fillRect(nx + 12, ny + 9, 2, 2); ctx.fillRect(nx + 18, ny + 9, 2, 2);
      } else if (npc.id === 'aloca') {
          // ALQUIMISTA ALOCA (Reino 1)
          ctx.fillStyle = '#8e44ad'; ctx.fillRect(nx + 8, ny + 14, 16, 14); // Túnica roxa
          ctx.fillStyle = '#ffdbac'; ctx.fillRect(nx + 10, ny + 4, 12, 12); // Rosto
          ctx.fillStyle = '#f1c40f'; ctx.fillRect(nx + 10, ny + 4, 12, 3); // Cabelo loiro
          // Potes flutuantes
          const pots = ['#e74c3c', '#3498db', '#f1c40f'];
          pots.forEach((color, i) => {
              const offX = Math.sin(now / 400 + i) * 15;
              const offY = Math.cos(now / 400 + i) * 10 - 10;
              ctx.fillStyle = color; ctx.fillRect(nx + 16 + offX, ny + 16 + offY, 6, 8);
              ctx.fillStyle = 'white'; ctx.font = '4px monospace'; ctx.fillText("VNO"[i], nx + 18 + offX, ny + 22 + offY);
          });
      } else if (npc.id === 'boole') {
          // JUIZ BOOLE (Reino 2)
          ctx.fillStyle = '#34495e'; ctx.fillRect(nx + 4, ny + 2, 24, 28); // Base de pedra
          // Lado True (Azul)
          ctx.fillStyle = '#3498db'; ctx.fillRect(nx + 4, ny + 2, 12, 28);
          ctx.fillStyle = '#fff'; ctx.fillRect(nx + 6, ny + 10, 3, 3); // Olho azul
          // Lado False (Vermelho)
          ctx.fillStyle = '#e74c3c'; ctx.fillRect(nx + 16, ny + 2, 12, 28);
          ctx.fillStyle = '#000'; ctx.fillRect(nx + 23, ny + 10, 3, 3); // Olho vermelho
          ctx.strokeStyle = '#fff'; ctx.lineWidth = 1; ctx.strokeRect(nx + 4, ny + 2, 24, 28);
      } else if (npc.id === 'iterador') {
          // ITERADOR-X (Reino 3)
          const shakeX = Math.sin(now / 50) * 2;
          ctx.fillStyle = '#7f8c8d'; ctx.fillRect(nx + 8 + shakeX, ny + 14, 16, 14); // Corpo
          ctx.fillStyle = '#2c3e50'; ctx.fillRect(nx + 6 + shakeX, ny + 4, 20, 14); // Cabeça Monitor
          ctx.strokeStyle = '#00d2ff'; ctx.lineWidth = 2; ctx.strokeRect(nx + 6 + shakeX, ny + 4, 20, 14);
          ctx.fillStyle = '#00d2ff'; ctx.font = '10px Arial'; ctx.fillText("∞", nx + 16 + shakeX, ny + 14); // Símbolo Infinito
          // Engrenagem no peito
          ctx.save();
          ctx.translate(nx + 16 + shakeX, ny + 21);
          ctx.rotate(now / 200);
          ctx.fillStyle = '#d35400'; ctx.fillRect(-4, -4, 8, 8);
          ctx.restore();
      } else {
          ctx.fillStyle = '#9b59b6'; ctx.fillRect(nx + 8, ny + 16, 16, 12); 
          ctx.fillStyle = '#ffdbac'; ctx.fillRect(nx + 10, ny + 4, 12, 12);
          ctx.fillStyle = '#000'; ctx.fillRect(nx + 12, ny + 8, 2, 3); ctx.fillRect(nx + 18, ny + 8, 2, 3);
      }
      if (npc.name && npc.id !== 'boole' && npc.id !== 'iterador') drawLabel(npc.name, nx + 16, ny - 4);
      if (npc.id === 'boole') drawLabel("JUIZ BOOLE", nx + 16, ny - 6, '#3498db');
      if (npc.id === 'iterador') drawLabel("ITERADOR-X", nx + 16, ny - 6, '#00d2ff');
    });

    const px = Math.floor(playerPos.x * TILE_SIZE - cameraX);
    const py = Math.floor(playerPos.y * TILE_SIZE - cameraY);
    const walkCycle = isMoving ? Math.sin(now / 100) * 4 : 0;
    
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(px + 8, py + 28, 16, 4);
    ctx.fillStyle = '#1e293b'; ctx.fillRect(px + 6, py + 18 + (isMoving ? walkCycle : 0), 6, 10);
    ctx.fillStyle = '#cbd5e1'; ctx.fillRect(px + 7, py + 14 + (isMoving ? walkCycle : 0), 4, 6);
    ctx.fillStyle = '#ffd43b'; ctx.fillRect(px + 8, py + 15 + (isMoving ? walkCycle : 0), 2, 2);
    ctx.fillStyle = '#0f172a'; ctx.fillRect(px + 8, py + 24 + (isMoving ? walkCycle : 0), 6, 6);
    ctx.fillRect(px + 18, py + 24 + (isMoving ? -walkCycle : 0), 6, 6);
    ctx.fillStyle = playerColor || '#3776ab';
    ctx.fillRect(px + 4, py + 16 + (isMoving ? -walkCycle : 0), 4, 10);
    ctx.fillRect(px + 24, py + 16 + (isMoving ? walkCycle : 0), 4, 10);
    ctx.fillRect(px + 8, py + 16, 16, 12); 
    ctx.fillStyle = '#ffdbac'; ctx.fillRect(px + 10, py + 4, 12, 12);
    ctx.fillStyle = '#4b2c20'; ctx.fillRect(px + 10, py + 4, 12, 4); ctx.fillRect(px + 20, py + 4, 2, 8); 
    ctx.fillStyle = 'black'; ctx.fillRect(px + 12, py + 8, 2, 3); ctx.fillRect(px + 18, py + 8, 2, 3);
    ctx.fillStyle = 'white'; ctx.fillRect(px + 12, py + 8, 1, 1); ctx.fillRect(px + 18, py + 8, 1, 1);

    if (hasTerminal) {
        const tmx = px + 22;
        const tmy = py + 18 + (isMoving ? walkCycle : 0);
        ctx.fillStyle = '#0f172a'; ctx.fillRect(tmx, tmy, 12, 16);
        ctx.strokeStyle = '#00d2ff'; ctx.lineWidth = 2; ctx.strokeRect(tmx, tmy, 12, 16);
        ctx.fillStyle = '#3776ab'; ctx.globalAlpha = 0.6 + Math.sin(now / 200) * 0.4;
        ctx.fillRect(tmx + 2, tmy + 2, 8, 6); ctx.globalAlpha = 1.0;
        ctx.fillStyle = '#ffd43b'; ctx.fillRect(tmx + 5, tmy + 10, 2, 2);
    }
    ctx.restore();

    if (playerName) drawLabel(playerName, px + 16, py - 10);
  }, [playerPos, map, isMoving, playerColor, hasTerminal, openedChests, playerName, handleInteractBtn, isMerchantHere, merchantLocation]);

  useEffect(() => {
    let requestRef: number;
    const animate = () => { render(); requestRef = requestAnimationFrame(animate); };
    requestRef = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef);
  }, [render]);

  const BugDexSection = ({ title, enemies }: { title: string, enemies: any[] }) => (
    <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '7px', color: '#ffd43b', backgroundColor: 'rgba(55, 118, 171, 0.3)', padding: '4px', marginBottom: '10px', borderLeft: '3px solid #ffd43b' }}>{title}</div>
        {enemies.map(enemy => {
            const isCaught = correctedBugs.includes(enemy.id);
            return (
                <div key={enemy.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #3776ab', padding: '6px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ transform: 'scale(0.5)', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <BugSprite id={enemy.id} shadow={!isCaught} />
                        </div>
                        <span style={{ fontSize: '6px' }}>{isCaught ? enemy.name : '???'}</span>
                    </div>
                    <span style={{ fontSize: '6px', color: isCaught ? '#2ecc71' : '#ff4757' }}>{isCaught ? '[ OK ]' : '[ !! ]'}</span>
                </div>
            );
        })}
    </div>
  );

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <canvas ref={canvasRef} width={VIEWPORT_W} height={VIEWPORT_H} style={{ display: 'block', backgroundColor: '#000' }} />
      <div style={{ flex: 1, position: 'relative', backgroundColor: '#fff', borderTop: '4px solid #3776ab' }}>
        <div style={{ position: 'absolute', right: '10px', top: '8px', display: 'flex', gap: '8px', zIndex: 100 }}>
            <button onClick={() => setShowBugDex(true)} style={{ padding: '6px 12px', fontSize: '6px', fontFamily: '"Press Start 2P"', backgroundColor: '#141e30', color: '#fff', border: '2px solid #3776ab', cursor: 'pointer', boxShadow: '0 3px 0 #000', borderRadius: '4px' }}>BUGDEX (B)</button>
            {hasNotebook && (
                <button onClick={onOpenNotebook} style={{ padding: '6px 12px', fontSize: '6px', fontFamily: '"Press Start 2P"', backgroundColor: '#ff8c00', color: '#fff', border: '2px solid #856404', cursor: 'pointer', boxShadow: '0 3px 0 #000', borderRadius: '4px' }}>CADERNO (C)</button>
            )}
        </div>
        <DPad onMoveStart={(dir) => !isDialogActive && setManualDir(dir)} onMoveEnd={() => setManualDir(null)} onInteract={handleInteractBtn} />
      </div>

      {showBugDex && (
        <div style={{ position: 'absolute', inset: '20px', backgroundColor: 'rgba(20, 30, 48, 0.95)', border: '4px solid #3776ab', zIndex: 100, padding: '15px', color: '#fff', fontFamily: '"Press Start 2P"', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '8px', marginBottom: '15px', textAlign: 'center', color: '#ffd43b', borderBottom: '2px solid #3776ab', paddingBottom: '10px' }}>[ ENCICLOPÉDIA BUGDEX ]</h3>
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '5px' }}>
                <BugDexSection title="REINO 1: VARIÁVEIS" enemies={WORLD1_ENEMIES} />
                <BugDexSection title="REINO 2: DECISÕES" enemies={WORLD2_ENEMIES} />
                <BugDexSection title="REINO 3: REPETIÇÕES" enemies={WORLD3_ENEMIES} />
                <BugDexSection title="REINO 4: FUNÇÕES" enemies={WORLD4_ENEMIES} />
                <BugDexSection title="REINO 5: OOP" enemies={WORLD5_ENEMIES} />
            </div>
            <button onClick={() => setShowBugDex(false)} style={{ position: 'absolute', top: '5px', right: '10px', background: 'none', border: 'none', color: '#ff4757', fontSize: '10px', cursor: 'pointer' }}>X</button>
        </div>
      )}
    </div>
  );
};

export default MapCanvas;
