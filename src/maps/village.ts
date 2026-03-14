import type { MapData } from './types';

export const villageMap: MapData = {
  id: "village",
  name: "Vila Inicial",
  width: 20,
  height: 15,
  tiles: [
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 11, 11, 11, 0, 0, 0, 0, 0, 11, 11, 11, 0, 0, 0, 0, 0, 0, 0, 5],
    [5, 10, 10, 10, 0, 13, 0, 0, 13, 10, 29, 10, 0, 0, 0, 0, 0, 0, 0, 5],
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
        "Recebi ordens para te entregar o TERMINAL MÁGICO e seu CADERNO DE ANOTAÇÕES.",
        "Use o Terminal para depurar Bugs e o Caderno para consultar o que aprendeu!",
        "ITEM_GET:TERMINAL_MÁGICO",
        "ITEM_GET:CADERNO_DE_ANOTAÇÕES"
      ]
    },
    {
      id: "pytetor", name: "Protetor da Vila\nPyTetor", tileX: 18, tileY: 5,
      dialog: ["Alto lá, Aprendiz!", "Ninguém sai da Vila sem as ferramentas de depuração da Mentora PEP-8.", "Volte e fale com ela se quiser sobreviver lá fora!"],
      isBoss: false
    },
    {
      id: "zumbi1", name: "Claudio\nO\nHabitante", tileX: 13, tileY: 2,
      dialog: [
        "SyntaxError... invalid syntax...",
        "Eu me lembro de quando o céu era verde e o código tinha sentido...",
        "MALWARECH apagou meu 'break'. Agora eu ando em círculos. Sempre em círculos.",
        "01001000 01000101 01001100 01010000",
        "...sistema... offline..."
      ]
    },
    {
      id: "historiador", name: "Historiador\nBIT", tileX: 15, tileY: 7,
      dialog: [
        "Ah, um rosto novo! Deixa eu te contar sobre Pythoria...",
        "Antes da Corrupção, cada reino era governado pelo seu próprio Mandamento do Zen.",
        "O Reino 1 seguia 'Explícito é melhor que implícito'. Cada variável tinha nome e propósito.",
        "Dizem que MALWARECH nasceu de um único 'except: pass' esquecido há 300 anos...",
        "Um erro ignorado. Pequeno demais para notar. Grande o suficiente para destruir tudo.",
        "Agora os cinco reinos estão corrompidos. Mas enquanto houver um debugger de pé... há esperança."
      ]
    }
  ],
  chests: [
    {
      tileX: 14, tileY: 4,
      description: "Este cofre está com o parêntese de fechamento corrompido.",
      puzzle: "print(5 + 5",
      expected: "10",
      reward: 20
    },
    {
      tileX: 3, tileY: 11,
      description: "O sistema deste cofre esqueceu que textos precisam de aspas.",
      puzzle: "print(Hack)",
      expected: "Hack",
      reward: 50
    }
  ],
  signs: [
    { tileX: 5, tileY: 2, messages: ["AVISO: Não alimente os Bugs com variáveis não declaradas."] },
    { tileX: 7, tileY: 8, messages: ["DICA: Use aspas para textos, e nada para números!"] },
    { tileX: 8, tileY: 2, messages: ["CASA DO APRENDIZ", "Um lugar para descansar da aventura e imortalizar seu progresso na cama."] }
  ],
  exits: [
    { tileX: 18, tileY: 6, targetMap: "world1", targetX: 1, targetY: 6 },
    { tileX: 19, tileY: 6, targetMap: "world1", targetX: 1, targetY: 6 },
    { tileX: 10, tileY: 2, targetMap: "player_house", targetX: 4, targetY: 8 }
  ],
  merchantPos: { x: 14, y: 11 },
  lockConfig: {
      requiredBugs: [],
      gatePos: { x: 18, y: 6 },
      guardDialog: ["Você ainda não tem o Terminal e o Caderno!", "Fale com a Mentora PEP-8 antes de atravessar a ponte."],
      unlockDialog: ["Vejo que você já tem o kit básico de sobrevivência.", "Um detalhe sobre a lore: Este portal foi construído com 'try/except', por isso ele é tão resistente.", "Boa sorte no Reino das Variáveis!"]
  }
};
