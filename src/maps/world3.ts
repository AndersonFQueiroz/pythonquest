import type { MapData } from './types';

export const world3Map: MapData = {
  id: "world3",
  name: "Torre das Repetições",
  width: 20,
  height: 20,
  tiles: [
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 16, 0, 0, 0, 5, 17, 17, 17, 5, 0, 0, 0, 16, 5, 0, 0, 0, 16, 5],
    [5, 0, 4, 4, 0, 5, 17, 8, 17, 5, 0, 4, 4, 0, 5, 0, 4, 4, 0, 5],
    [5, 0, 4, 4, 0, 5, 17, 17, 17, 5, 0, 4, 4, 0, 5, 0, 4, 4, 0, 5],
    [5, 0, 0, 0, 0, 5, 5, 2, 5, 5, 0, 0, 0, 0, 5, 0, 0, 0, 0, 5],
    [5, 5, 2, 5, 5, 5, 0, 2, 0, 5, 5, 5, 2, 5, 5, 5, 5, 2, 5, 5],
    [5, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 5],
    [6, 2, 2, 2, 2, 2, 2, 2, 2, 13, 2, 2, 2, 2, 2, 2, 2, 2, 13, 5],
    [5, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 5],
    [5, 5, 2, 5, 5, 5, 17, 2, 17, 5, 5, 5, 2, 5, 5, 5, 5, 2, 5, 5],
    [5, 16, 0, 0, 17, 17, 17, 2, 17, 17, 17, 0, 0, 0, 16, 5, 0, 0, 0, 5],
    [5, 0, 4, 4, 17, 1, 1, 1, 1, 1, 17, 4, 4, 0, 5, 0, 4, 4, 0, 5],
    [5, 0, 4, 4, 17, 1, 1, 1, 1, 1, 17, 4, 4, 0, 5, 0, 4, 4, 0, 5],
    [5, 0, 0, 0, 17, 1, 1, 1, 1, 1, 17, 0, 0, 0, 5, 0, 0, 0, 0, 5],
    [5, 5, 5, 5, 5, 5, 5, 2, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 16, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 5],
    [5, 0, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 5],
    [5, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
    [5, 5, 5, 5, 5, 5, 5, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  ],
  playerStart: { x: 1, y: 7 },
  npcs: [
    {
      id: "iterador", name: "Iterador-X", tileX: 10, tileY: 15,
      dialog: [
        "Bip... Bop... Iteração 4.821.903... Bip... Bop...",
        "MALWARECH deletou meu 'break'. Estou preso neste loop desde antes de você nascer.",
        "Cada vez que completo um ciclo, eu me lembro: 'desta vez vou sair'. Mas o loop reinicia.",
        "Você precisa entender: 'while True:' sem 'break' é uma sentença perpétua.",
        "O STACK-OVERLORD se alimenta destes loops. Quanto mais iterações, mais forte ele fica.",
        "Bip... Bop... Iteração 4.821.904... Bip... Bop..."
      ]
    },
    {
        id: "guard5", name: "WHIL_US", tileX: 6, tileY: 18,
        dialog: ["Detectamos um vazamento de memória infinito!", "O sistema travou este portal por segurança."]
    },
    {
        id: "guard6", name: "LOOP_AR", tileX: 8, tileY: 18,
        dialog: ["O loop só será quebrado quando você capturar os 4 Bugs da torre.", "Use o comando 'break' mental e limpe a área!"]
    }
  ],
  chests: [
    {
      tileX: 7, tileY: 2,
      description: "Este cofre industrial usa um loop 'for' para gerar a senha, mas a palavra 'in' sumiu!",
      puzzle: "for i ?? range(3):\n  print(i)",
      expected: "0\n1\n2",
      reward: 200
    }
  ],
  signs: [
    // Placa 1 reposicionada: corredor central, visível logo ao entrar (x=9, y=7)
    { tileX: 9, tileY: 7, messages: [
      "BEM-VINDO À TORRE DAS REPETIÇÕES!",
      "Imagine que você precisa dizer 'Olá' 100 vezes. Você escreveria 100 linhas? Com loops, não!",
      "LOOP é uma ordem para o Python repetir algo. Tipo um disco travado, mas você controla quando para.",
      "O FOR é usado quando você sabe QUANTAS vezes quer repetir. Ex: 'para cada inimigo na lista, atacar'.",
      "for i in range(3): significa: repita 3 vezes. O i guarda o número da vez atual: 0, 1, 2.",
      "O WHILE é usado quando você NÃO sabe quantas vezes vai repetir. Ex: 'enquanto tiver vida, lutar'.",
      "while vida > 0: significa: fique repetindo enquanto a vida for maior que zero."
    ] },
    // Placa 2 reposicionada: antes da zona de batalha (x=7, y=14)
    { tileX: 7, tileY: 14, messages: [
      "[ AULA: CONTROLANDO CICLOS ]",
      "Loops podem ser perigosos se não tiverem fim!",
      "1. COMANDO 'break': Ele quebra o loop imediatamente e sai dele.",
      "Ex: while True: print('Oi'); break # Roda só uma vez!",
      " ",
      "2. ACUMULADORES:",
      "Você pode somar valores dentro de um loop para ter um total final.",
      "Ex: soma = 0; for i in [1, 2]: soma += i # soma agora é 3!",
      " ",
      "O STACK-OVERLORD tentará te prender em loops eternos. Use o break!"
    ] }
  ],
  exits: [
    { tileX: 0, tileY: 7, targetMap: "world2", targetX: 9, targetY: 10 },
    { tileX: 7, tileY: 18, targetMap: "world4", targetX: 1, targetY: 7 }
  ],
  merchantPos: { x: 10, y: 4 },
  lockConfig: {
      requiredBugs: ['for_spider', 'while_worm', 'range_rat', 'break_beetle'],
      gatePos: { x: 7, y: 18 },
      guardDialog: ["O sistema está em loop infinito!", "Capture os 4 Bugmons desta torre para enviar um sinal de BREAK e abrir a porta."],
      unlockDialog: ["Sinal de BREAK recebido! O sistema parou de repetir o erro.", "O caminho para o Oásis está liberado. Boa sorte nas dunas!"]
  }
};
