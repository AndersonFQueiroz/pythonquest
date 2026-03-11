import { useState, useEffect, useCallback } from 'react';
import type { MapData } from '../maps/world1';
import { sounds } from '../lib/sounds';

export type Direction = 'up' | 'down' | 'left' | 'right';

export function useMapEngine(map: MapData, onEncounter?: () => void, onPortal?: (targetMap: string, x: number, y: number) => void) {
  const [playerPos, setPlayerPos] = useState(map.playerStart);
  const [direction, setDirection] = useState<Direction>('down');
  const [isMoving, setIsMoving] = useState(false);

  // Atualiza a posição inicial sempre que o mapa mudar
  useEffect(() => {
    setPlayerPos(map.playerStart);
  }, [map]);

  const canMoveTo = useCallback((x: number, y: number) => {
    if (x < 0 || x >= map.width || y < 0 || y >= map.height) return false;
    
    // Colisão com tiles bloqueados
    const tile = map.tiles[y][x];
    if ([3, 4, 5].includes(tile)) return false;

    // Colisão com NPCs
    const npcAtPos = map.npcs.find(npc => npc.tileX === x && npc.tileY === y);
    if (npcAtPos) return false;

    return true;
  }, [map]);

  const move = useCallback((dir: Direction) => {
    if (isMoving) return;

    setDirection(dir);
    let newX = playerPos.x;
    let newY = playerPos.y;

    if (dir === 'up') newY -= 1;
    if (dir === 'down') newY += 1;
    if (dir === 'left') newX -= 1;
    if (dir === 'right') newX += 1;

    if (canMoveTo(newX, newY)) {
      setIsMoving(true);
      setPlayerPos({ x: newX, y: newY });
      sounds.playStep();
      
      const targetTile = map.tiles[newY][newX];
      
      // Portal de Saída (ID 6)
      if (targetTile === 6 || map.exits.some(e => e.tileX === newX && e.tileY === newY)) {
        const exit = map.exits.find(e => e.tileX === newX && e.tileY === newY);
        if (exit && onPortal) {
           setTimeout(() => onPortal(exit.targetMap, exit.targetX, exit.targetY), 200);
        }
      } 
      // Grama Alta (Encontros Aleatórios)
      else if (targetTile === 1 && onEncounter) {
        if (Math.random() < 0.2) {
          setTimeout(() => onEncounter(), 200);
        }
      }
      
      setTimeout(() => setIsMoving(false), 150);
    }
  }, [playerPos, isMoving, canMoveTo, map, onEncounter, onPortal]);

  const interact = useCallback(() => {
    let checkX = playerPos.x;
    let checkY = playerPos.y;

    if (direction === 'up') checkY -= 1;
    if (direction === 'down') checkY += 1;
    if (direction === 'left') checkX -= 1;
    if (direction === 'right') checkX += 1;

    const npc = map.npcs.find(n => n.tileX === checkX && n.tileY === checkY);
    return npc || null;
  }, [playerPos, direction, map.npcs]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (['w', 'arrowup'].includes(key)) move('up');
      if (['s', 'arrowdown'].includes(key)) move('down');
      if (['a', 'arrowleft'].includes(key)) move('left');
      if (['d', 'arrowright'].includes(key)) move('right');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  return { playerPos, direction, isMoving, move, interact };
}
