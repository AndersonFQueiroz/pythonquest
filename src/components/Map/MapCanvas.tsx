import React, { useRef, useEffect } from 'react';
import type { MapData } from '../../maps/world1';
import { useMapEngine } from '../../hooks/useMapEngine';
import { useGameStore } from '../../hooks/useGameStore';
import DPad from '../UI/DPad';

interface MapCanvasProps {
  map: MapData;
  onEncounter: () => void;
  onInteract: (npc: any) => void;
  onPortal: (targetMap: string, x: number, y: number) => void;
  isDialogActive: boolean;
}

const TILE_SIZE = 32;
const VIEWPORT_W = 480;
const VIEWPORT_H = 352;

const TILE_COLORS: Record<number, string> = {
  0: '#9bbc0f', // Grama
  1: '#8bac0f', // Grama Alta
  2: '#e0f0c0', // Caminho
  3: '#306230', // Árvore
  4: '#0f380f', // Água
  5: '#0f380f', // Parede
  6: '#0f380f', // Portal (Desenho diferente depois)
  7: '#306230', // NPC
  8: '#8bac0f', // Cofre
  9: '#0f380f', // Boss
};

const MapCanvas: React.FC<MapCanvasProps> = ({ map, onEncounter, onInteract, onPortal, isDialogActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Desativa os encontros aleatórios e portais se o diálogo estiver aberto
  const safeOnEncounter = isDialogActive ? undefined : onEncounter;
  const safeOnPortal = isDialogActive ? undefined : onPortal;
  
  const { playerPos, move, isMoving, interact } = useMapEngine(map, safeOnEncounter, safeOnPortal);
  
  const playerName = useGameStore(state => state.name);
  const playerColor = useGameStore(state => state.color);

  const handleInteract = () => {
    if (isDialogActive) return; // Não interage se já está falando
    const npc = interact();
    if (npc) onInteract(npc);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'e' || e.key === 'Enter') {
        handleInteract();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [interact, isDialogActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cameraX = Math.max(0, Math.min(
      playerPos.x * TILE_SIZE - VIEWPORT_W / 2 + TILE_SIZE / 2,
      map.width * TILE_SIZE - VIEWPORT_W
    ));
    const cameraY = Math.max(0, Math.min(
      playerPos.y * TILE_SIZE - VIEWPORT_H / 2 + TILE_SIZE / 2,
      map.height * TILE_SIZE - VIEWPORT_H
    ));

    const render = () => {
      ctx.clearRect(0, 0, VIEWPORT_W, VIEWPORT_H);

      // Desenhar Tiles
      for (let y = 0; y < map.height; y++) {
        for (let x = 0; x < map.width; x++) {
          const tile = map.tiles[y][x];
          
          if (tile === 6) {
            // Desenhar Portal (Trilha com borda diferente)
            ctx.fillStyle = '#306230';
            ctx.fillRect(x * TILE_SIZE - cameraX, y * TILE_SIZE - cameraY, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = '#0f380f';
            ctx.fillRect(x * TILE_SIZE - cameraX + 4, y * TILE_SIZE - cameraY + 4, TILE_SIZE - 8, TILE_SIZE - 8);
          } else {
            ctx.fillStyle = TILE_COLORS[tile] || '#000';
            ctx.fillRect(x * TILE_SIZE - cameraX, y * TILE_SIZE - cameraY, TILE_SIZE, TILE_SIZE);
          }
        }
      }

      // Desenhar NPCs
      map.npcs.forEach(npc => {
        if (!npc) return;
        const nx = npc.tileX * TILE_SIZE - cameraX;
        const ny = npc.tileY * TILE_SIZE - cameraY;
        
        ctx.fillStyle = '#9b59b6';
        ctx.fillRect(nx + 8, ny + 16, 16, 12);
        ctx.fillStyle = '#ffdbac';
        ctx.fillRect(nx + 10, ny + 4, 12, 12);
        ctx.fillStyle = '#8e44ad';
        ctx.fillRect(nx + 10, ny + 4, 12, 4);
        
        if (npc.name) {
          ctx.fillStyle = 'var(--gb-darkest)';
          ctx.font = '6px "Press Start 2P"';
          ctx.textAlign = 'center';
          ctx.fillText(npc.name, nx + 16, ny - 4);
        }
      });

      // Desenhar Player
      const px = playerPos.x * TILE_SIZE - cameraX;
      const py = playerPos.y * TILE_SIZE - cameraY;
      const walkCycle = isMoving ? Math.sin(Date.now() / 50) * 4 : 0;

      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(px + 8, py + 28, 16, 4);
      ctx.fillStyle = 'var(--gb-darkest)';
      ctx.fillRect(px + 8, py + 24 + (isMoving ? walkCycle : 0), 6, 6);
      ctx.fillRect(px + 18, py + 24 + (isMoving ? -walkCycle : 0), 6, 6);
      ctx.fillStyle = playerColor;
      ctx.fillRect(px + 4, py + 16 + (isMoving ? -walkCycle : 0), 4, 8);
      ctx.fillRect(px + 8, py + 16, 16, 12);
      ctx.fillRect(px + 24, py + 16 + (isMoving ? walkCycle : 0), 4, 8);
      ctx.fillStyle = '#ffdbac';
      ctx.fillRect(px + 10, py + 4, 12, 12);
      ctx.fillStyle = 'var(--gb-darkest)';
      ctx.fillRect(px + 10, py + 4, 12, 4);
      ctx.fillStyle = 'black';
      ctx.fillRect(px + 13, py + 8, 2, 2);
      ctx.fillRect(px + 17, py + 8, 2, 2);
      
      if (playerName) {
        ctx.fillStyle = 'var(--gb-darkest)';
        ctx.font = '8px "Press Start 2P"';
        ctx.textAlign = 'center';
        ctx.fillText(playerName, px + 16, py - 6);
      }

      requestAnimationFrame(render);
    };

    const animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, [playerPos, map, playerColor, playerName, isMoving]);

  return (
    <div style={{ position: 'relative', width: VIEWPORT_W, height: VIEWPORT_H }}>
      {/* HUD DE CONTROLES NO TOPO */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(15, 56, 15, 0.8)', // Fundo escuro transparente
        color: 'var(--gb-white)',
        fontSize: '8px',
        padding: '5px',
        textAlign: 'center',
        zIndex: 50,
        borderBottom: '2px solid var(--gb-darkest)'
      }}>
        [ COMANDOS: WASD/SETAS = Andar | E/ENTER = Interagir ]
      </div>

      <canvas
        ref={canvasRef}
        width={VIEWPORT_W}
        height={VIEWPORT_H}
        style={{ display: 'block' }}
      />
      <DPad onMove={move} onInteract={handleInteract} />
    </div>
  );
};

export default MapCanvas;
