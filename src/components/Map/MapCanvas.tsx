import React, { useRef, useEffect } from 'react';
import { MapData } from '../../maps/world1';
import { useMapEngine } from '../../hooks/useMapEngine';
import DPad from '../UI/DPad';

interface MapCanvasProps {
  map: MapData;
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

const MapCanvas: React.FC<MapCanvasProps> = ({ map }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { playerPos, move } = useMapEngine(map);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Cálculo da Câmera (Offset)
    const cameraX = Math.max(0, Math.min(
      playerPos.x * TILE_SIZE - VIEWPORT_W / 2 + TILE_SIZE / 2,
      map.width * TILE_SIZE - VIEWPORT_W
    ));
    const cameraY = Math.max(0, Math.min(
      playerPos.y * TILE_SIZE - VIEWPORT_H / 2 + TILE_SIZE / 2,
      map.height * TILE_SIZE - VIEWPORT_H
    ));

    // Render Loop
    const render = () => {
      ctx.clearRect(0, 0, VIEWPORT_W, VIEWPORT_H);

      // Desenhar Tiles
      for (let y = 0; y < map.height; y++) {
        for (let x = 0; x < map.width; x++) {
          const tile = map.tiles[y][x];
          ctx.fillStyle = TILE_COLORS[tile] || '#000';
          ctx.fillRect(
            x * TILE_SIZE - cameraX,
            y * TILE_SIZE - cameraY,
            TILE_SIZE,
            TILE_SIZE
          );
          
          // Desenhar grade leve para debug
          ctx.strokeStyle = 'rgba(0,0,0,0.1)';
          ctx.strokeRect(
            x * TILE_SIZE - cameraX,
            y * TILE_SIZE - cameraY,
            TILE_SIZE,
            TILE_SIZE
          );
        }
      }

      // Desenhar Player (Círculo ou Quadrado por enquanto)
      ctx.fillStyle = 'red';
      ctx.fillRect(
        playerPos.x * TILE_SIZE - cameraX + 4,
        playerPos.y * TILE_SIZE - cameraY + 4,
        TILE_SIZE - 8,
        TILE_SIZE - 8
      );

      requestAnimationFrame(render);
    };

    const animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, [playerPos, map]);

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
