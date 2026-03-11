export interface MapData {
  id: string;
  name: string;
  width: number;
  height: number;
  tiles: number[][];
  playerStart: { x: number; y: number };
  npcs: { id: string, name: string, tileX: number, tileY: number, dialog: string[] }[];
  chests: { tileX: number, tileY: number, description: string, puzzle: string, expected: string, reward: number }[]; // Adicionado description
  signs: { tileX: number, tileY: number, messages: string[] }[];
  exits: { tileX: number, tileY: number, targetMap: string, targetX: number, targetY: number }[];
}

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
    [6, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5], 
    [5, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 5],
    [5, 2, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 2, 5],
    [5, 2, 0, 4, 4, 4, 0, 0, 8, 0, 0, 0, 0, 4, 4, 4, 0, 0, 2, 5],
    [5, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 5],
    [5, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 5],
    [5, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 5],
    [5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 9, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  ],
  playerStart: { x: 2, y: 6 },
  npcs: [],
  chests: [
    { 
      tileX: 8, tileY: 9, 
      description: "Este cofre antigo está com o sistema de saída corrompido (falta fechar o parêntese).",
      puzzle: "print(1 + 1", 
      expected: "2", 
      reward: 20 
    }
  ],
  signs: [],
  exits: [
    { tileX: 0, tileY: 6, targetMap: "village", targetX: 17, targetY: 6 },
    { tileX: 18, tileY: 13, targetMap: "world2", targetX: 1, targetY: 1 }
  ]
};
