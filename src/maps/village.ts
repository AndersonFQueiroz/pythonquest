import type { MapData } from './world1';

export const villageMap: MapData = {
  id: "village",
  name: "Vila Inicial",
  width: 20,
  height: 15,
  tiles: [
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 11, 11, 11, 0, 0, 0, 0, 0, 11, 11, 11, 0, 0, 0, 0, 0, 0, 0, 5], 
    [5, 10, 10, 10, 0, 13, 0, 0, 0, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 5], 
    [5, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5],
    [5, 0, 12, 12, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 2, 5], 
    [5, 0, 12, 12, 0, 2, 0, 12, 12, 0, 14, 0, 0, 0, 0, 0, 0, 0, 2, 5], 
    [5, 2, 2, 2, 2, 2, 0, 12, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6],
    [5, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 5],
    [5, 2, 0, 11, 11, 11, 0, 13, 0, 0, 11, 11, 11, 0, 0, 0, 0, 2, 5],
    [5, 2, 0, 10, 10, 10, 0, 0, 0, 0, 10, 10, 10, 0, 0, 0, 0, 2, 5],
    [5, 2, 0, 0, 0, 0, 0, 12, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 5],
    [5, 2, 0, 8, 0, 0, 0, 12, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 5],
    [5, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 5],
    [5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  ],
  playerStart: { x: 2, y: 6 },
  npcs: [
    { 
      id: "pep8", name: "Mentora PEP-8", tileX: 4, tileY: 5, 
      dialog: [
        "Aprendiz! A Vila está colapsando.",
        "As pessoas aqui perderam a fala e os cofres estão trancados por algoritmos.",
        " ITEM_GET:TERMINAL_MÁGICO",
        "Tente ler as placas ou abrir um cofre para treinar antes da floresta."
      ] 
    },
    {
      id: "zumbi1", name: "Habitante #01", tileX: 10, tileY: 2,
      dialog: ["SyntaxError: invalid syntax...", "01001000 01000101 01001100 01001100 01010000", "...sistema... offline..."]
    }
  ],
  chests: [
    { 
      tileX: 14, tileY: 4, 
      description: "Este cofre está com o parêntese de fechamento corrompido.",
      puzzle: "print(5 + 5", // ERRO REAL
      expected: "10", 
      reward: 20 
    },
    { 
      tileX: 3, tileY: 11, 
      description: "O sistema deste cofre esqueceu que textos precisam de aspas.",
      puzzle: "print(Hack)", // ERRO REAL
      expected: "Hack", 
      reward: 50 
    }
  ],
  signs: [
    { tileX: 5, tileY: 2, messages: ["AVISO: Não alimente os Bugs com variáveis não declaradas."] },
    { tileX: 7, tileY: 8, messages: ["DICA: Use aspas para textos, e nada para números!"] }
  ],
  exits: [
    { tileX: 18, tileY: 6, targetMap: "world1", targetX: 1, targetY: 6 },
    { tileX: 19, tileY: 6, targetMap: "world1", targetX: 1, targetY: 6 }
  ]
};
