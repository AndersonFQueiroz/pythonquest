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
    [5, 2, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 5], // Placa (13) adicionada aqui
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 6, 5],
    [5, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 5],
    [5, 2, 0, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 0, 0, 2, 5],
    [5, 2, 0, 4, 4, 4, 0, 0, 8, 0, 0, 0, 0, 4, 4, 4, 0, 0, 2, 5],
    [5, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 5],
    [5, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 5],
    [5, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 5],
    [5, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  ],
  playerStart: { x: 2, y: 6 },
  npcs: [],
  chests: [
    { 
      tileX: 8, tileY: 9, 
      description: "Este cofre ensina sobre Case Sensitivity. Variáveis com nomes diferentes (maiúsculas vs minúsculas) são coisas distintas no Python!",
      puzzle: "# Alguém criou 'chave', mas tentou usar 'Chave'.\nchave = 123\nprint(Chave)", 
      expected: "123", 
      reward: 30 
    }
  ],
  signs: [
    { tileX: 2, tileY: 5, messages: [
        "[ AULA 1: VARIÁVEIS E TIPOS ]",
        "Variáveis são recipientes que guardam informações.",
        "Para criar uma: NOME = VALOR",
        "Ex: vidas = 3 (Inteiro/Número)",
        "Ex: msg = 'Oi' (String/Texto - Use ASPAS!)",
        "REGRAS: Nomes não podem ter espaços nem começar com números.",
        "DICA: O Python diferencia letras maiúsculas de minúsculas!"
    ] },
    { tileX: 17, tileY: 6, messages: ["CAMINHO PARA O REINO 2: CAVERNA DAS DECISÕES"] }
  ],
  exits: [
    { tileX: 0, tileY: 6, targetMap: "village", targetX: 17, targetY: 6 },
    { tileX: 18, tileY: 6, targetMap: "world2", targetX: 1, targetY: 7 }
  ],
  merchantPos: { x: 12, y: 2 }
};
