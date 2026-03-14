import type { MapData } from './types';

export const finalBossMap: MapData = {
  id: "final_boss",
  name: "O Núcleo Abissal",
  width: 25,
  height: 25,
  tiles: [
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 5],
    [5, 19, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 19, 5],
    [5, 19, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 19, 5],
    [5, 19, 5, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 5, 19, 5],
    [5, 19, 5, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 5, 19, 5],
    [5, 19, 5, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 5, 19, 5],
    [5, 19, 5, 0, 4, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 4, 0, 5, 19, 5],
    [5, 19, 5, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 4, 0, 5, 19, 5],
    [5, 19, 5, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 4, 0, 5, 19, 5],
    [5, 19, 5, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 4, 0, 5, 19, 5], // SALA DO TRONO (x=12, y=10)
    [5, 19, 5, 0, 4, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 4, 0, 5, 19, 5],
    [5, 19, 5, 0, 4, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 4, 0, 5, 19, 5],
    [5, 19, 5, 0, 4, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 4, 0, 5, 19, 5],
    [5, 19, 5, 0, 4, 4, 4, 4, 4, 4, 4, 2, 2, 4, 4, 4, 4, 4, 4, 4, 4, 0, 5, 19, 5],
    [5, 19, 5, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 19, 5],
    [5, 19, 5, 0, 0, 0, 0, 0, 0, 13, 0, 2, 2, 0, 13, 0, 0, 0, 0, 0, 0, 0, 5, 19, 5], // PLACAS x=9 e x=14
    [5, 19, 5, 5, 5, 5, 5, 5, 5, 5, 5, 2, 2, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 19, 5],
    [5, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 2, 2, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 5],
    [5, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 2, 2, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 2, 2, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
    [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5], // ENTRADA (x=11, y=22)
    [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  ],
  playerStart: { x: 11, y: 21 },
  npcs: [
    {
      id: "malwarech", name: "MALWARECH", tileX: 12, tileY: 10,
      dialog: [
        "ENTÃO VOCÊ É O 'DEBUGGER' QUE ESTÁ CAUSANDO PROBLEMAS...",
        "VOCÊ LIMPOU MEUS REINOS, APRENDEU MINHAS REGRAS... MAS AQUI, EU SOU A ÚNICA LEI!",
        "EU SOU O ERRO QUE NENHUMA DOCUMENTAÇÃO PODE EXPLICAR.",
        "PREPARE-SE, APRENDIZ. SEU SISTEMA SERÁ DELETADO AGORA!"
      ],
      isBoss: true
    }
  ],
  signs: [
    { tileX: 9, tileY: 16, messages: [
        "[ AULA FINAL: ESTRUTURAS AVANÇADAS ]",
        "1. DICIONÁRIOS {}: São como gavetas com etiquetas. Em vez de números, você usa chaves para acessar valores.",
        "Ex: config = {'status': 'Ativo'}",
        "Mude o valor com: config['status'] = 'Desativado'",
        " ",
        "2. OPERADOR MÓDULO %: Ele retorna o RESTO de uma divisão.",
        "Dica: if n % 2 == 0: significa 'se n for par'."
    ] },
    { tileX: 14, tileY: 16, messages: [
        "[ AULA FINAL: O CÓDIGO INFINITO ]",
        "1. RECURSÃO: É quando uma função chama a SI MESMA para resolver uma tarefa.",
        "Ex: def fatorial(n): return n * fatorial(n-1)",
        "Isso cria uma cascata de chamadas que Malwarech usa para travar sistemas.",
        " ",
        "Você agora detém todo o conhecimento de Pythoria. Enfrente o erro supremo!"
    ] }
  ],
  exits: [
    { tileX: 11, tileY: 22, targetMap: "world5", targetX: 12, targetY: 21 },
    { tileX: 12, tileY: 22, targetMap: "world5", targetX: 12, targetY: 21 }
  ],
  merchantPos: { x: 2, y: 3 }
};
