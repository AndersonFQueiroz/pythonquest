import type { MapData } from './types';

export const playerHouseMap: MapData = {
  id: "player_house",
  name: "Casa do Aprendiz",
  width: 10,
  height: 10,
  tiles: [
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 28, 9, 27, 9, 9, 9, 26, 9, 5],
    [5, 9, 9, 9, 9, 9, 9, 9, 9, 5],
    [5, 9, 9, 9, 9, 9, 9, 9, 9, 5],
    [5, 9, 9, 9, 9, 9, 9, 9, 9, 5],
    [5, 9, 9, 9, 9, 9, 9, 9, 9, 5],
    [5, 9, 9, 9, 9, 9, 9, 9, 9, 5],
    [5, 9, 9, 9, 9, 9, 9, 9, 9, 5],
    [5, 9, 9, 9, 9, 9, 9, 9, 9, 5],
    [5, 5, 5, 5, 9, 5, 5, 5, 5, 5],
  ],
  playerStart: { x: 4, y: 8 },
  npcs: [],
  signs: [
    { tileX: 7, tileY: 1, messages: ["bed_save"] },
    { tileX: 3, tileY: 1, messages: ["Seu PC de estudos. O VSCode está aberto no projeto PythonQuest."] },
    { tileX: 1, tileY: 1, messages: ["Uma prateleira cheia de livros: 'Python Fluente', 'Código Limpo' e 'O Guia do Mochileiro das Galáxias'."] }
  ],
  exits: [
    { tileX: 4, tileY: 9, targetMap: 'village', targetX: 10, targetY: 3 }
  ],
  merchantPos: { x: -1, y: -1 }
};