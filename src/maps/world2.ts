import type { MapData } from './types';

export const world2Map: MapData = {
  id: "world2",
  name: "Caverna das Decisões",
  width: 20,
  height: 15,
  tiles: [
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5],
    [5, 4, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5],
    [5, 4, 0, 5, 5, 5, 5, 5, 0, 4, 0, 5, 5, 5, 5, 5, 5, 0, 4, 5],
    [5, 4, 0, 5, 0, 0, 0, 5, 0, 4, 0, 5, 0, 0, 0, 0, 5, 0, 4, 5],
    [5, 4, 0, 5, 0, 8, 0, 5, 0, 0, 0, 5, 0, 1, 1, 0, 5, 0, 4, 5],
    [5, 4, 0, 5, 0, 0, 0, 5, 5, 0, 5, 5, 0, 1, 1, 0, 5, 0, 4, 5],
    [6, 2, 2, 2, 2, 13, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 4, 5], // Placa (13) bem na entrada
    [5, 4, 0, 5, 0, 0, 0, 5, 5, 0, 5, 5, 0, 1, 1, 0, 5, 0, 4, 5],
    [5, 4, 0, 5, 0, 0, 0, 5, 0, 0, 0, 5, 0, 1, 1, 0, 5, 0, 4, 5],
    [5, 4, 0, 5, 5, 5, 5, 5, 0, 4, 0, 5, 5, 5, 5, 5, 5, 0, 4, 5],
    [5, 4, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5],
    [5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  ],
  playerStart: { x: 1, y: 7 },
  npcs: [],
  chests: [
    { 
      tileX: 5, tileY: 5, 
      description: "Este cofre ensina sobre os 'Dois Pontos' (:). No Python, toda estrutura de controle (if, for, def) precisa terminar com : para o computador saber que o bloco começou!",
      puzzle: "# Falta os dois pontos no final da linha do IF!\nsenha = 777\nif senha == 777\n  print('Aberto')", 
      expected: "Aberto", 
      reward: 100 
    }
  ],
  signs: [
    { tileX: 5, tileY: 7, messages: [
        "[ AULA 2: DECISÕES (IF / ELSE) ]",
        "O 'if' permite que o código tome caminhos diferentes.",
        "SINTAXE OBRIGATÓRIA:",
        "1. Termine a condição com ':' (dois pontos).",
        "2. Indentação: No código o bloco não pode estar na mesma coluna que o `if` — em Python exige que tudo dentro do `if` esteja recuado 4 espaços pra frente.",
        "Ex: if True:\n  print('Ok')",
        "DICA: Use '==' para perguntar se algo é igual.",
        "DICA: Use '!=' para perguntar se algo é diferente."
    ] }
  ],
  exits: [
    { tileX: 0, tileY: 7, targetMap: "world1", targetX: 17, targetY: 6 }
  ],
  merchantPos: { x: 3, y: 3 }
};
