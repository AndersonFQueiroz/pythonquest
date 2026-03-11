export interface MapData {
  id: string;
  name: string;
  width: number;
  height: number;
  tiles: number[][];
  playerStart: { x: number; y: number };
  npcs: { id: string, name: string, tileX: number, tileY: number, dialog: string[] }[];
  chests: any[];
  exits: any[];
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
    [5, 2, 2, 2, 2, 2, 2, 2, 7, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5],
    [5, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 5],
    [5, 2, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 2, 5],
    [5, 2, 0, 4, 4, 4, 0, 0, 8, 0, 0, 0, 0, 4, 4, 4, 0, 0, 2, 5],
    [5, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 5],
    [5, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 5],
    [5, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 5],
    [5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 9, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  ],
  playerStart: { x: 2, y: 2 },
  npcs: [],
  chests: [
    { tileX: 8, tileY: 9, reward: { xp: 50, gold: 20 }, opened: false }
  ],
  exits: [
    { tileX: 0, tileY: 6, targetMap: "village", targetX: 17, targetY: 6 },
    { tileX: 18, tileY: 13, targetMap: "world2", targetX: 1, targetY: 1 }
  ]
  };
