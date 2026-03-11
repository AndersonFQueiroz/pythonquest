import type { MapData } from './types';

export const world2Map: MapData = {
  id: "world2",
  name: "Cavernas das Listas",
  width: 20,
  height: 15,
  tiles: [
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5],
    [5, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 5],
    [5, 2, 0, 3, 3, 0, 0, 1, 1, 1, 0, 0, 0, 3, 3, 0, 0, 0, 2, 5],
    [5, 2, 0, 3, 3, 0, 0, 1, 1, 1, 0, 0, 0, 3, 3, 0, 0, 0, 2, 5],
    [5, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 5],
    [6, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5], // Saída para Reino 1
    [5, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 5],
    [5, 2, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 2, 5],
    [5, 2, 0, 4, 4, 4, 0, 0, 8, 0, 0, 0, 0, 4, 4, 4, 0, 0, 2, 5],
    [5, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 5],
    [5, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 5], // Teias de Aranha (Batalhas)
    [5, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 5],
    [5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 6, 5], // Futuro Portal Reino 3
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  ],
  playerStart: { x: 2, y: 6 },
  npcs: [
    { 
      id: "pep8_cave", 
      name: "Mentora PEP-8", 
      tileX: 4, 
      tileY: 6, 
      dialog: [
        "Cuidado, Aprendiz! O ar aqui é denso e cheio de coleções de dados.",
        "Nestas cavernas, os Bugs se organizam em LISTAS.",
        "Uma lista é criada com colchetes: itens = ['A', 'B', 'C'].",
        "Para pegar o primeiro item, use o índice zero: itens[0].",
        "Depure os habitantes destas cavernas para prosseguir!"
      ] 
    }
  ],
  chests: [
    { 
      tileX: 8, tileY: 9, 
      description: "Este cofre exige que você acesse o segundo item de uma lista secreta.",
      puzzle: "segredos = [10, 50, 100]\nprint(segredos[1])", 
      expected: "50", 
      reward: 100 
    }
  ],
  signs: [
    { tileX: 5, tileY: 2, messages: ["DICA: O primeiro item de uma lista é sempre o índice 0!"] }
  ],
  exits: [
    { tileX: 0, tileY: 6, targetMap: "world1", targetX: 17, targetY: 13 }
  ],
  merchantPos: { x: 10, y: 10 }
};
