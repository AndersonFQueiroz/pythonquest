import { useState, useEffect, useCallback, useRef } from 'react';
import { sounds } from '../lib/sounds';
import { useGameStore } from './useGameStore';

export type Direction = 'up' | 'down' | 'left' | 'right';

export function useMapEngine(
  map: any, 
  onEncounter?: () => void, 
  onPortal?: (targetMap: string, x: number, y: number) => void,
  isDisabled: boolean = false,
  onAutoInteract?: (interaction: any) => void
) {
  const { playerPos, setPlayerPos, merchantLocation, correctedBugs, debugIgnoreBlocks, hasTriggeredUnlock, setTriggeredUnlock } = useGameStore();
  const [direction, setDirection] = useState<Direction>('down');
  const [isMoving, setIsMoving] = useState(false);
  
  const activeDirRef = useRef<Direction | null>(null);
  const keysPressed = useRef<Set<string>>(new Set());
  const isMovingRef = useRef(false);
  const lastMoveTime = useRef(0); 
  const MOVE_DELAY = 160; 

  const teleport = useCallback((x: number, y: number) => {
    setPlayerPos({ x, y });
  }, [setPlayerPos]);

  const canMoveTo = useCallback((x: number, y: number) => {
    if (x < 0 || x >= map.width || y < 0 || y >= map.height) return false;
    const tile = map.tiles[y][x];
    if ([3, 4, 5, 8, 10, 11, 13, 14, 21].includes(tile)) return false;
    
    if (merchantLocation === map.id && map.merchantPos.x === x && map.merchantPos.y === y) return false;

    // Adiciona bloqueio físico aos guardas destravados se não falarmos com eles ainda
    if (map.lockConfig && x === map.lockConfig.gatePos.x && y === map.lockConfig.gatePos.y) {
        const clearedCount = map.lockConfig.requiredBugs.filter((id: string) => correctedBugs.includes(id)).length;
        if (clearedCount >= 4 || debugIgnoreBlocks) {
             if (!hasTriggeredUnlock[map.id]) {
                 return false;
             }
        }
    }

    return !map.npcs.some((npc: any) => npc.tileX === x && npc.tileY === y);
  }, [map, merchantLocation, correctedBugs, debugIgnoreBlocks, hasTriggeredUnlock]);

  const executeStep = useCallback((dir: Direction | null) => {
    if (!dir || isDisabled || isMovingRef.current) return;

    const now = Date.now();
    if (now - lastMoveTime.current < MOVE_DELAY) return;

    setDirection(dir);
    
    let nx = playerPos.x, ny = playerPos.y;
    if (dir === 'up') ny--;
    else if (dir === 'down') ny++;
    else if (dir === 'left') nx--;
    else if (dir === 'right') nx++;

    // LÓGICA DE BLOQUEIO POR MISSÃO E FORÇAR DIÁLOGO DE SUCESSO
    if (map.lockConfig && nx === map.lockConfig.gatePos.x && ny === map.lockConfig.gatePos.y) {
        const clearedCount = map.lockConfig.requiredBugs.filter((id: string) => correctedBugs.includes(id)).length;
        
        // Bloqueado (Ainda não capturou todos)
        if (clearedCount < 4 && !debugIgnoreBlocks) {
            activeDirRef.current = null;
            keysPressed.current.clear();
            onAutoInteract?.({ 
                type: 'npc', 
                data: { name: 'BLOQUEADO', dialog: map.lockConfig.guardDialog } 
            });
            return;
        }

        // Liberado, mas precisa forçar o diálogo de vitória primeiro
        if ((clearedCount >= 4 || debugIgnoreBlocks) && !hasTriggeredUnlock[map.id]) {
            activeDirRef.current = null;
            keysPressed.current.clear();
            setTriggeredUnlock(map.id);
            onAutoInteract?.({ 
                type: 'npc', 
                data: { name: 'GUARDIÃO', dialog: map.lockConfig.unlockDialog } 
            });
            return;
        }
    }

    if (canMoveTo(nx, ny)) {
      lastMoveTime.current = now;
      isMovingRef.current = true;
      setIsMoving(true);
      setPlayerPos({ x: nx, y: ny });
      sounds.playStep();

      const exit = map.exits.find((e: any) => e.tileX === nx && e.tileY === ny);
      if (exit && onPortal) {
          activeDirRef.current = null;
          keysPressed.current.clear();
          setTimeout(() => onPortal(exit.targetMap, exit.targetX, exit.targetY), 50);
      } else if (map.tiles[ny][nx] === 1 && onEncounter) {
        if (Math.random() < 0.15) {
          activeDirRef.current = null;
          keysPressed.current.clear();
          setTimeout(() => onEncounter(), 50);
        }
      }

      setTimeout(() => {
        isMovingRef.current = false;
        setIsMoving(false);
      }, MOVE_DELAY - 10);
    }
  }, [canMoveTo, map, onEncounter, onPortal, isDisabled, setPlayerPos, playerPos, correctedBugs, onAutoInteract, debugIgnoreBlocks]);

  useEffect(() => {
    let frameId: number;
    const tick = () => {
      if (!isDisabled && !isMovingRef.current) {
        let dir: Direction | null = null;
        if (keysPressed.current.has('w') || keysPressed.current.has('arrowup')) dir = 'up';
        else if (keysPressed.current.has('s') || keysPressed.current.has('arrowdown')) dir = 'down';
        else if (keysPressed.current.has('a') || keysPressed.current.has('arrowleft')) dir = 'left';
        else if (keysPressed.current.has('d') || keysPressed.current.has('arrowright')) dir = 'right';
        if (dir) executeStep(dir);
      }
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [executeStep, isDisabled]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (isDisabled) return;
      if (document.activeElement?.tagName === 'TEXTAREA' || document.activeElement?.tagName === 'INPUT') return;
      keysPressed.current.add(e.key.toLowerCase());
    };
    const up = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [isDisabled]);

  const interact = useCallback(() => {
    const checkCoords = [
        { x: playerPos.x, y: playerPos.y - 1 },
        { x: playerPos.x, y: playerPos.y + 1 },
        { x: playerPos.x - 1, y: playerPos.y },
        { x: playerPos.x + 1, y: playerPos.y }
    ];

    if (merchantLocation === map.id) {
        const isNear = checkCoords.some(c => c.x === map.merchantPos.x && c.y === map.merchantPos.y);
        if (isNear) return { type: 'merchant' };
    }

    for (const coord of checkCoords) {
        const npc = map.npcs.find((n: any) => n.tileX === coord.x && n.tileY === coord.y);
        if (npc) {
            // Se for um guarda desbloqueado, usa diálogo de desbloqueio
            if (npc.id.startsWith('guard') && map.lockConfig) {
                const cleared = debugIgnoreBlocks || map.lockConfig.requiredBugs.every((id: string) => correctedBugs.includes(id));
                if (cleared) return { type: 'npc', data: { name: npc.name, dialog: map.lockConfig.unlockDialog } };
            }
            return { type: 'npc', data: npc };
        }
        const sign = map.signs?.find((s: any) => s.tileX === coord.x && s.tileY === coord.y);
        if (sign) return { type: 'sign', data: { name: 'PLACA', dialog: sign.messages } };
        const chest = map.chests?.find((c: any) => c.tileX === coord.x && c.tileY === coord.y);
        if (chest) return { type: 'chest', data: chest };
    }
    return null;
  }, [playerPos, map, merchantLocation, correctedBugs, debugIgnoreBlocks]);

  return { playerPos, direction, isMoving, move: executeStep, setManualDir: (d: Direction | null) => activeDirRef.current = d, interact, teleport };
}
