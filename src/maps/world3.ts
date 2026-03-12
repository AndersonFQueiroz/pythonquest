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
    [6, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 13, 5], // ENTRADA
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
    [5, 5, 5, 5, 5, 5, 5, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5], // SAÍDA REINO 4 (x=7, y=18)
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  ],
  playerStart: { x: 1, y: 7 },
  npcs: [
    {
      id: "iterador", name: "Iterador-X", tileX: 10, tileY: 15,
      dialog: [
        "Bip... Bop... Repetindo... Repetindo...",
        "Cuidado, Aprendiz! Um loop 'while True:' sem o comando 'break' é uma prisão eterna para a CPU.",
        "Eu esqueci meu 'break' em algum lugar da torre... não cometa o mesmo erro!",
        "REPETINDO... REPETINDO..."
      ]
    },
    {
        id: "guard5", name: "Dreno de Loop L", tileX: 6, tileY: 18,
        dialog: ["Detectamos um vazamento de memória infinito!", "O sistema travou este portal por segurança."]
    },
    {
        id: "guard6", name: "Dreno de Loop R", tileX: 8, tileY: 18,
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
    { tileX: 18, tileY: 7, messages: [
    "BEM-VINDO À TORRE DAS REPETIÇÕES!",
    "Imagine que você precisa dizer 'Olá' 100 vezes. Você escreveria 100 linhas? Com loops, não!",
    "LOOP é uma ordem para o Python repetir algo. Tipo um disco travado, mas você controla quando para.",
    "O FOR é usado quando você sabe QUANTAS vezes quer repetir. Ex: 'para cada inimigo na lista, atacar'.",
    "for i in range(3): significa: repita 3 vezes. O i guarda o número da vez atual: 0, 1, 2.",
    "O WHILE é usado quando você NÃO sabe quantas vezes vai repetir. Ex: 'enquanto tiver vida, lutar'.",
    "while vida > 0: significa: fique repetindo enquanto a vida for maior que zero.",
    "ATENÇÃO: todo código dentro do loop precisa de 4 espaços no começo da linha. Isso se chama indentação.",
    "Sem a indentação o Python não sabe o que faz parte do loop. É como esquecer de fechar uma porta.",
    "Agora suba a torre, encontre os Bugs e use seus novos poderes para derrotá-los. Boa sorte!"
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
