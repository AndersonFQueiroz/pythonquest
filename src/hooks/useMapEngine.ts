import { useState, useEffect, useCallback } from 'react';
import { MapData } from '../maps/world1';

export type Direction = 'up' | 'down' | 'left' | 'right';

export function useMapEngine(map: MapData) {
  const [playerPos, setPlayerPos] = useState(map.playerStart);
  const [direction, setDirection] = useState<Direction>('down');
  const [isMoving, setIsMoving] = useState(false);

  const canMoveTo = useCallback((x: number, y: number) => {
    // Limites do mapa
    if (x < 0 || x >= map.width || y < 0 || y >= map.height) return false;
    
    // Colisão com tiles bloqueados (3: árvore, 4: água, 5: parede)
    const tile = map.tiles[y][x];
    if ([3, 4, 5].includes(tile)) return false;

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
      
      // Simula o tempo de caminhada de 1 tile (debounce)
      setTimeout(() => setIsMoving(false), 150);
    }
  }, [playerPos, isMoving, canMoveTo]);

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

  return { playerPos, direction, isMoving, move };
}
