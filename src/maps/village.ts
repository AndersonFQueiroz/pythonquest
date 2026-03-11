import { MapData } from './world1';

export const villageMap: MapData = {
  id: "village",
  name: "Vila Inicial",
  width: 20,
  height: 15,
  tiles: [
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5],
    [5, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 5],
    [5, 2, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 2, 5],
    [5, 2, 0, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 2, 5],
    [5, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 5],
    [5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 6, 6], // 6 = Portal de Saída
    [5, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 5],
    [5, 2, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 2, 5],
    [5, 2, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 2, 5],
    [5, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 5],
    [5, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 5],
    [5, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 5],
    [5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  ],
  playerStart: { x: 2, y: 6 },
  npcs: [
    { 
      id: "pep8", 
      name: "Mentora PEP-8", 
      tileX: 4, 
      tileY: 5, 
      dialog: [
        "Olá, Aprendiz! Sou a Mentora PEP-8.",
        "Pythoria está em perigo! Bugs de código estão infectando nossa floresta.",
        "A primeira lição é sobre TIPOS (Types).",
        "No Python, você não pode somar um NÚMERO com um TEXTO.",
        "Exemplo errado: 10 + '20'.",
        "O correto é usar apenas números: 10 + 20.",
        "Agora, saia da vila pela direita para entrar na Floresta.",
        "Lembre-se: ande na grama alta para caçar bugs e use seu console para depurá-los!"
      ] 
    }
  ],
  chests: [],
  exits: [
    { tileX: 18, tileY: 6, targetMap: "world1", targetX: 2, targetY: 6 },
    { tileX: 19, tileY: 6, targetMap: "world1", targetX: 2, targetY: 6 }
  ]
};
