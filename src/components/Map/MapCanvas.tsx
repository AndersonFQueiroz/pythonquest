import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { MapData } from '../../maps/world1';
import { useMapEngine } from '../../hooks/useMapEngine';
import { useGameStore } from '../../hooks/useGameStore';
import DPad from '../UI/DPad';
import { WORLD1_ENEMIES } from '../../data/bugs';

interface MapCanvasProps {
  map: MapData;
  spawnPos: { x: number, y: number } | null;
  onEncounter: () => void;
  onInteract: (npc: any) => void;
  onPortal: (targetMap: string, x: number, y: number) => void;
  isDialogActive: boolean;
}

const TILE_SIZE = 32;
const VIEWPORT_W = 480;
const VIEWPORT_H = 352;

const TILE_COLORS: Record<number, string> = {
  0: '#9bbc0f', 1: '#8bac0f', 2: '#e0f0c0', 3: '#306230', 4: '#0f380f', 5: '#0f380f', 6: '#7f8c8d', 10: '#8bac0f', 11: '#306230', 12: '#000000', 13: '#e0f0c0', 14: '#8bac0f'
};

const MapCanvas: React.FC<MapCanvasProps> = ({ map, spawnPos, onEncounter, onInteract, onPortal, isDialogActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasTriggeredInitialDialog, setHasTriggeredInitialDialog] = useState(false);
  const [showBugDex, setShowBugDex] = useState(false);
  
  const { playerPos, direction, isMoving, move, setManualDir, interact, teleport } = useMapEngine(
    map, 
    isDialogActive ? undefined : onEncounter, 
    isDialogActive ? undefined : onPortal, 
    isDialogActive
  );
  
  const { name: playerName, color: playerColor, openedChests, correctedBugs } = useGameStore();

  useEffect(() => {
    if (map.id === 'village' && !hasTriggeredInitialDialog && !isDialogActive) {
      const pep8 = map.npcs.find(n => n.id === 'pep8');
      if (pep8) {
        const dist = Math.abs(playerPos.x - pep8.tileX) + Math.abs(playerPos.y - pep8.tileY);
        if (dist === 1) { setHasTriggeredInitialDialog(true); onInteract({ type: 'npc', data: pep8 }); }
      }
    }
  }, [playerPos, map, hasTriggeredInitialDialog, isDialogActive, onInteract]);

  useEffect(() => { if (spawnPos) teleport(spawnPos.x, spawnPos.y); }, [spawnPos, teleport]);

  const handleInteract = () => {
    if (isDialogActive) return;
    const interaction = interact();
    if (interaction) onInteract(interaction);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isDialogActive) return;
      if (e.key.toLowerCase() === 'e' || e.key === 'Enter') handleInteract();
      if (e.key.toLowerCase() === 'b') setShowBugDex(prev => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInteract, isDialogActive]);

  // Loop de renderização de alta performance
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const now = Date.now();
    const animFrame = Math.floor(now / 100); // 10 fps para animações de tiles

    const cameraX = Math.max(0, Math.min(playerPos.x * TILE_SIZE - VIEWPORT_W / 2 + TILE_SIZE / 2, map.width * TILE_SIZE - VIEWPORT_W));
    const cameraY = Math.max(0, Math.min(playerPos.y * TILE_SIZE - VIEWPORT_H / 2 + TILE_SIZE / 2, map.height * TILE_SIZE - VIEWPORT_H));

    ctx.clearRect(0, 0, VIEWPORT_W, VIEWPORT_H);

    const drawLabel = (text: string, x: number, y: number) => {
      ctx.font = '6px "Press Start 2P"';
      const metrics = ctx.measureText(text);
      const w = metrics.width + 8;
      ctx.fillStyle = 'rgba(15, 56, 15, 0.9)';
      ctx.fillRect(x - w/2, y - 10, w, 12);
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(text, x, y - 2);
    };

    // 1. Camada de Chão
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        const tile = map.tiles[y][x];
        const tx = x * TILE_SIZE - cameraX;
        const ty = y * TILE_SIZE - cameraY;
        if (![5, 10, 11].includes(tile)) {
          ctx.fillStyle = TILE_COLORS[0];
          if (tile === 2 || tile === 6 || tile === 12) ctx.fillStyle = TILE_COLORS[2];
          ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
        }
      }
    }

    // 2. Camada de Objetos
    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        const tile = map.tiles[y][x];
        const tx = x * TILE_SIZE - cameraX;
        const ty = y * TILE_SIZE - cameraY;

        if (tile === 1) {
          ctx.fillStyle = TILE_COLORS[1];
          ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = '#306230';
          for(let i=0; i<3; i++) {
              const ox = i * 8 + 4;
              ctx.beginPath();
              ctx.moveTo(tx + ox, ty + 20);
              ctx.lineTo(tx + ox + 4, ty + 12);
              ctx.lineTo(tx + ox + 8, ty + 20);
              ctx.fill();
          }
        } else if (tile === 6) { 
          ctx.fillStyle = '#7f8c8d'; ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
          ctx.strokeStyle = '#2c3e50'; ctx.lineWidth = 2; ctx.strokeRect(tx + 2, ty + 2, TILE_SIZE - 4, TILE_SIZE - 4);
        } else if (tile === 12) {
          ctx.fillStyle = Math.random() > 0.5 ? '#000' : '#111';
          ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
          ctx.fillStyle = '#ff0000'; ctx.font = '4px "Press Start 2P"'; ctx.textAlign = 'center';
          ctx.fillText("GLITCH", tx + TILE_SIZE/2, ty + TILE_SIZE/2);
        } else if (tile === 3) {
          const sway = Math.sin(now / 1000) * 2;
          ctx.fillStyle = TILE_COLORS[3]; ctx.fillRect(tx + sway, ty, TILE_SIZE, TILE_SIZE);
        } else if (tile === 13) { 
          ctx.fillStyle = '#0f380f'; ctx.fillRect(tx + 14, ty + 16, 4, 16); 
          ctx.fillStyle = '#e0f0c0'; ctx.fillRect(tx + 4, ty + 6, 24, 14); 
          ctx.strokeStyle = '#0f380f'; ctx.lineWidth = 2; ctx.strokeRect(tx + 4, ty + 6, 24, 14);
          ctx.fillStyle = '#0f380f'; ctx.fillRect(tx + 8, ty + 10, 16, 2); ctx.fillRect(tx + 10, ty + 14, 12, 2);
        } else if (tile === 14) { 
           ctx.fillStyle = '#0f380f'; ctx.fillRect(tx + 14, ty + 16, 4, 16);
           ctx.fillStyle = '#e0f0c0'; ctx.beginPath(); ctx.arc(tx + 16, ty + 16, 10, 0, Math.PI * 2); ctx.fill();
        } else if (tile === 8) { 
          const isOpen = openedChests.includes(`${map.id}_${x}_${y}`);
          ctx.fillStyle = isOpen ? '#306230' : 'var(--gb-darkest)'; ctx.fillRect(tx + 4, ty + 12, 24, 16);
          if (isOpen) {
             ctx.fillStyle = '#0f380f'; ctx.fillRect(tx + 4, ty + 6, 24, 6);
          } else {
             ctx.fillStyle = '#f1c40f'; ctx.fillRect(tx + 4, ty + 14, 24, 4);
             if (animFrame % 10 < 5) { ctx.fillStyle = '#fff'; ctx.fillRect(tx + 14, ty + 16, 4, 4); }
          }
        } else if ([5, 10, 11].includes(tile)) { 
           ctx.fillStyle = TILE_COLORS[tile] || '#000';
           ctx.fillRect(tx, ty, TILE_SIZE, TILE_SIZE);
           if (tile === 10) {
               ctx.strokeStyle = '#0f380f'; ctx.beginPath(); ctx.moveTo(tx + 5, ty + 5); ctx.lineTo(tx + 15, ty + 25); ctx.stroke();
           }
        }
      }
    }

    // 3. Matrix (Usando timestamp real para velocidade constante)
    ctx.fillStyle = 'rgba(55, 118, 171, 0.2)'; ctx.font = '8px monospace';
    for(let i=0; i<15; i++) {
      const bx = (i * 32) % VIEWPORT_W;
      const by = ((now / 30) + (i * 40)) % VIEWPORT_H;
      ctx.fillText(Math.random() > 0.5 ? "0" : "1", bx, by);
    }

    // 4. NPCs
    map.npcs.forEach(npc => {
      const nx = npc.tileX * TILE_SIZE - cameraX;
      const ny = npc.tileY * TILE_SIZE - cameraY;
      ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(nx + 8, ny + 28, 16, 4);
      ctx.fillStyle = 'var(--gb-darkest)'; ctx.fillRect(nx + 6, ny + 2, 20, 28);
      ctx.fillStyle = npc.id.includes('zumbi') ? '#555' : '#9b59b6';
      ctx.fillRect(nx + 8, ny + 16, 16, 12);
      ctx.fillStyle = '#ffdbac'; ctx.fillRect(nx + 10, ny + 4, 12, 12);
      ctx.fillStyle = 'black'; ctx.fillRect(nx + 12, ny + 8, 2, 2); ctx.fillRect(nx + 16, ny + 8, 2, 2);
      if (npc.name) drawLabel(npc.name, nx + 16, ny - 4);
    });

    // 5. Player
    const px = playerPos.x * TILE_SIZE - cameraX;
    const py = playerPos.y * TILE_SIZE - cameraY;
    const walkCycle = isMoving ? Math.sin(now / 100) * 4 : 0;
    
    ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(px + 8, py + 28, 16, 4);
    ctx.fillStyle = 'var(--gb-darkest)';
    ctx.fillRect(px + 8, py + 24 + (isMoving ? walkCycle : 0), 6, 6);
    ctx.fillRect(px + 18, py + 24 + (isMoving ? -walkCycle : 0), 6, 6);
    ctx.fillStyle = playerColor;
    ctx.fillRect(px + 4, py + 16 + (isMoving ? -walkCycle : 0), 4, 8);
    ctx.fillRect(px + 8, py + 16, 16, 12); 
    ctx.fillRect(px + 24, py + 16 + (isMoving ? walkCycle : 0), 4, 8); 
    ctx.fillStyle = '#ffdbac'; ctx.fillRect(px + 10, py + 4, 12, 12);
    ctx.fillStyle = 'black'; ctx.fillRect(px + 13, py + 8, 2, 2); ctx.fillRect(px + 17, py + 8, 2, 2); 
    if (playerName) drawLabel(playerName, px + 16, py - 6);
  }, [playerPos, map, isMoving, playerColor, openedChests, playerName, onInteract, hasTriggeredInitialDialog, isDialogActive]);

  useEffect(() => {
    let requestRef: number;
    const animate = () => {
      render();
      requestRef = requestAnimationFrame(animate);
    };
    requestRef = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef);
  }, [render]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <canvas ref={canvasRef} width={VIEWPORT_W} height={VIEWPORT_H} style={{ display: 'block', backgroundColor: '#000' }} />
      <div style={{ flex: 1, position: 'relative', backgroundColor: '#fff', borderTop: '4px solid #3776ab' }}>
        <button onClick={() => setShowBugDex(true)} style={{ position: 'absolute', right: '10px', top: '10px', padding: '5px', fontSize: '6px', fontFamily: '"Press Start 2P"', backgroundColor: '#141e30', color: '#fff', border: 'none', cursor: 'pointer', zIndex: 50 }}>BUGDEX (B)</button>
        <DPad onMoveStart={(dir) => !isDialogActive && move(dir)} onMoveEnd={() => move(null)} onInteract={handleInteract} />
      </div>

      {showBugDex && (
        <div style={{ position: 'absolute', inset: '20px', backgroundColor: 'rgba(20, 30, 48, 0.95)', border: '4px solid #3776ab', zIndex: 100, padding: '15px', color: '#fff', fontFamily: '"Press Start 2P"', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '8px', marginBottom: '15px', textAlign: 'center', color: '#ffd43b' }}>[ BUGDEX - REINO 1 ]</h3>
            <div style={{ fontSize: '6px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, overflowY: 'auto' }}>
                {WORLD1_ENEMIES.map(enemy => (
                    <div key={enemy.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #3776ab', paddingBottom: '4px' }}>
                        <span>{correctedBugs.includes(enemy.id) ? enemy.name : '???'}</span>
                        <span style={{ color: correctedBugs.includes(enemy.id) ? '#2ecc71' : '#ff4757' }}>{correctedBugs.includes(enemy.id) ? '[ OK ]' : '[ !! ]'}</span>
                    </div>
                ))}
            </div>
            <div style={{ marginTop: '10px', textAlign: 'center', fontSize: '8px', color: '#ffd43b' }}>
                PROGRESSO: {correctedBugs.length}/{WORLD1_ENEMIES.length}
            </div>
            <button onClick={() => setShowBugDex(false)} style={{ position: 'absolute', top: '5px', right: '10px', background: 'none', border: 'none', color: '#ff4757', fontSize: '10px', cursor: 'pointer' }}>X</button>
        </div>
      )}
    </div>
  );
};

export default MapCanvas;
