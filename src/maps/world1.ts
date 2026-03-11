import type { MapData } from './types';

export const world1Map: MapData = {
  id: "world1",
  name: "Floresta das Variáveis",
  width: 20,
  height: 15,
  tiles: [
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5],
    [5, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 5],
    [5, 2, 0, 3, 3, 0, 0, 1, 1, 1, 0, 0, 0, 3, 3, 0, 0, 0, 2, 5],
    [5, 2, 0, 3, 3, 0, 0, 1, 1, 1, 0, 0, 0, 3, 3, 0, 0, 0, 2, 5],
    [5, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 5],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5], // Caminho central
    [5, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 5],
    [5, 2, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 2, 5],
    [5, 2, 0, 4, 4, 4, 0, 0, 8, 0, 0, 0, 0, 4, 4, 4, 0, 0, 2, 5],
    [5, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 5],
    [5, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 5],
    [5, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 5],
    [5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 6, 5], // Portal Reino 2 (ID 6)
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  ],
  playerStart: { x: 2, y: 6 },
  npcs: [],
  chests: [
    { 
      tileX: 8, tileY: 9, 
      description: "O sistema deste cofre é case-sensitive! Alguém declarou a variável 'chave', mas tentou acessá-la com 'C' maiúsculo.",
      puzzle: "chave = 42\nprint(Chave)", 
      expected: "42", 
      reward: 30 
    }
  ],
  signs: [],
  exits: [
    { tileX: 0, tileY: 6, targetMap: "village", targetX: 17, targetY: 6 },
    { tileX: 18, tileY: 13, targetMap: "world2", targetX: 1, targetY: 6 }
  ],
  merchantPos: { x: 12, y: 2 }
};
