import React, { useRef, useEffect } from 'react';
import type { MapData } from '../../maps/world1';
import { useMapEngine } from '../../hooks/useMapEngine';
import { useGameStore } from '../../hooks/useGameStore';
import DPad from '../UI/DPad';

interface MapCanvasProps {
  map: MapData;
  onEncounter?: () => void;
}

const TILE_SIZE = 32;
const VIEWPORT_W = 480;
const VIEWPORT_H = 352;

const TILE_COLORS: Record<number, string> = {
  0: '#9bbc0f', // Grama
  1: '#8bac0f', // Grama Alta
  2: '#e0f0c0', // Caminho
  3: '#306230', // Árvore (Bloqueado)
  4: '#0f380f', // Água (Bloqueado)
  5: '#0f380f', // Parede (Bloqueado)
  7: '#306230', // NPC
  8: '#8bac0f', // Cofre
  9: '#0f380f', // Boss
};

const MapCanvas: React.FC<MapCanvasProps> = ({ map, onEncounter }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { playerPos, move, isMoving } = useMapEngine(map, onEncounter);
  
  // Pegando os estados separadamente para evitar re-renders infinitos
  const playerName = useGameStore(state => state.name);
  const playerColor = useGameStore(state => state.color);

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
          ctx.fillStyle = TILE_COLORS[tile] || '#000';
          ctx.fillRect(x * TILE_SIZE - cameraX, y * TILE_SIZE - cameraY, TILE_SIZE, TILE_SIZE);
        }
      }

      // DESENHAR PERSONAGEM ANIMADO
      const px = playerPos.x * TILE_SIZE - cameraX;
      const py = playerPos.y * TILE_SIZE - cameraY;
      const walkCycle = isMoving ? Math.sin(Date.now() / 50) * 4 : 0;

      // Sombra
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(px + 8, py + 28, 16, 4);

      // Pernas
      ctx.fillStyle = 'var(--gb-darkest)';
      ctx.fillRect(px + 8, py + 24 + (isMoving ? walkCycle : 0), 6, 6);
      ctx.fillRect(px + 18, py + 24 + (isMoving ? -walkCycle : 0), 6, 6);

      // Braço Esq
      ctx.fillStyle = playerColor;
      ctx.fillRect(px + 4, py + 16 + (isMoving ? -walkCycle : 0), 4, 8);

      // Corpo
      ctx.fillStyle = playerColor;
      ctx.fillRect(px + 8, py + 16, 16, 12);

      // Braço Dir
      ctx.fillStyle = playerColor;
      ctx.fillRect(px + 24, py + 16 + (isMoving ? walkCycle : 0), 4, 8);

      // Cabeça
      ctx.fillStyle = '#ffdbac';
      ctx.fillRect(px + 10, py + 4, 12, 12);

      // Cabelo
      ctx.fillStyle = 'var(--gb-darkest)';
      ctx.fillRect(px + 10, py + 4, 12, 4);

      // Olhos
      ctx.fillStyle = 'black';
      ctx.fillRect(px + 13, py + 8, 2, 2);
      ctx.fillRect(px + 17, py + 8, 2, 2);

      // NOME DO JOGADOR
      ctx.fillStyle = 'var(--gb-darkest)';
      ctx.font = '8px "Press Start 2P"';
      ctx.textAlign = 'center';
      ctx.fillText(playerName, px + 16, py - 6);

      requestAnimationFrame(render);
    };

    const animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, [playerPos, map, playerColor, playerName, isMoving]);

  return (
    <div style={{ position: 'relative', width: VIEWPORT_W, height: VIEWPORT_H }}>
      <canvas
        ref={canvasRef}
        width={VIEWPORT_W}
        height={VIEWPORT_H}
        style={{ display: 'block' }}
      />
      <DPad onMove={move} onInteract={() => console.log('Interact')} />
    </div>
  );
};

export default MapCanvas;
