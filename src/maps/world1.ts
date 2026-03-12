import type { MapData } from './types';

export const world1Map: MapData = {
  id: "world1",
  name: "Floresta das Variáveis",
  width: 20,
  height: 15,
  tiles: [
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 5],
    [5, 3, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 3, 5],
    [5, 3, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 3, 5],
    [5, 3, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 0, 3, 5],
    [5, 3, 0, 2, 3, 15, 0, 0, 0, 0, 0, 0, 0, 15, 3, 3, 2, 0, 3, 5],
    [2, 2, 2, 2, 3, 0, 7, 7, 7, 0, 13, 0, 0, 0, 3, 3, 2, 2, 6, 5], // ENTRADA E SAÍDA
    [5, 3, 0, 2, 3, 0, 7, 7, 7, 0, 0, 0, 0, 0, 3, 3, 2, 0, 3, 5],
    [5, 3, 0, 2, 3, 0, 0, 0, 0, 0, 4, 4, 4, 0, 3, 3, 2, 0, 3, 5],
    [5, 3, 0, 2, 3, 3, 3, 3, 3, 3, 4, 8, 4, 0, 3, 3, 2, 0, 3, 5], // Cofre escondido
    [5, 3, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 3, 5],
    [5, 3, 15, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 15, 3, 5], // Campos de batalha
    [5, 3, 3, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 3, 3, 5],
    [5, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  ],
  playerStart: { x: 1, y: 6 },
  npcs: [
    {
      id: "aloca", name: "Alquimista Aloca", tileX: 6, tileY: 5,
      dialog: [
        "Olá, viajante! Na minha bancada, nada existe sem um nome.",
        "Se você quer guardar um segredo, coloque-o num pote e dê um nome a ele.",
        "Mas cuidado: se o pote se chama 'idade', não tente colocar um texto dentro dele sem aspas, ou o frasco explode!",
        "Lembre-se: Variáveis são caixas com nomes."
      ]
    },
    {
        id: "guard1", name: "VAR_ION", tileX: 17, tileY: 5,
        dialog: ["O acesso à Caverna está bloqueado por instabilidades na Sintaxe!", "Capture todos os 4 Bugmons desta floresta para restaurar a ponte."]
    },
    {
        id: "guard2", name: "ATRIB_US", tileX: 17, tileY: 7,
        dialog: ["Ninguém passa sem autorização da Mentora PEP-8.", "Corrija os erros de variáveis para prosseguir."]
    }
  ],
  chests: [
    { 
      tileX: 11, tileY: 9, 
      description: "Este cofre ensina sobre os 'Dois Pontos' (:). No Python, toda estrutura de controle (if, for, def) precisa terminar com : para o computador saber que o bloco começou!",
      puzzle: "# Alguém criou 'chave', mas tentou usar 'Chave'.\nchave = 123\nprint(Chave)", 
      expected: "123", 
      reward: 30 
    }
  ],
  signs: [
    { tileX: 10, tileY: 6, messages: [
    "BEM-VINDO À FLORESTA DAS VARIÁVEIS!",
    "Imagine uma caixa com um nome escrito nela. Você guarda algo dentro e depois busca pelo nome. Isso é uma variável.",
    "Para criar uma variável é simples: escreva o nome, coloque = e coloque o valor. Ex: vida = 100",
    "Texto precisa de aspas. Ex: nome = 'Anderson'. Sem aspas o Python pensa que é outra variável.",
    "Números não usam aspas. Ex: idade = 20. Com aspas viraria texto e você não poderia fazer contas.",
    "Para mostrar o valor de uma variável na tela use print(). Ex: print(nome) mostra Anderson.",
    "Você pode trocar o valor quando quiser. vida = 100, depois vida = 50. A caixa guarda o mais recente.",
    "ATENÇÃO: Python diferencia maiúsculas de minúsculas. Vida, vida e VIDA são três variáveis diferentes.",
    "Nomes de variáveis não podem ter espaços nem começar com números. Use underline: minha_vida = 100.",
    "Esta floresta está cheia de variáveis corrompidas. Corrija o código e restaure a ordem. Boa sorte!"
] }
  ],
  exits: [
    { tileX: 0, tileY: 6, targetMap: "village", targetX: 17, targetY: 6 },
    { tileX: 18, tileY: 6, targetMap: "world2", targetX: 1, targetY: 7 }
  ],
  merchantPos: { x: 15, y: 2 },
  lockConfig: {
      requiredBugs: ['syntax_wasp', 'type_goblin', 'name_bat', 'print_ghost'],
      gatePos: { x: 18, y: 6 },
      guardDialog: ["Ainda detectamos erros de sintaxe nesta área!", "A ponte para a Caverna das Decisões só abrirá quando todos os 4 Bugmons forem capturados."],
      unlockDialog: ["Incrível! A lógica da floresta foi restaurada.", "O caminho para a Caverna está livre agora. Siga com cuidado, Aprendiz!"]
  }
};
