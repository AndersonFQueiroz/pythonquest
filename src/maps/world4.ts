import type { MapData } from './types';

export const world4Map: MapData = {
  id: "world4",
  name: "Oásis das Funções",
  width: 25,
  height: 20,
  tiles: [
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
    [5, 0, 21, 21, 21, 0, 0, 20, 0, 0, 0, 22, 22, 22, 0, 0, 0, 20, 0, 0, 21, 21, 21, 0, 5],
    [5, 0, 21, 0, 0, 0, 0, 0, 0, 0, 22, 22, 22, 22, 22, 0, 0, 0, 0, 0, 0, 0, 21, 0, 5],
    [5, 0, 21, 0, 20, 0, 0, 0, 0, 22, 22, 8, 22, 22, 22, 22, 0, 0, 0, 20, 0, 0, 21, 0, 5], // Cofre no meio da água
    [5, 0, 0, 0, 0, 0, 0, 0, 22, 22, 22, 22, 22, 22, 22, 22, 22, 0, 0, 0, 0, 0, 0, 0, 5],
    [5, 0, 0, 0, 0, 0, 0, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 0, 0, 0, 0, 0, 0, 5],
    [6, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 13, 5], // ENTRADA
    [5, 0, 0, 0, 0, 0, 0, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 0, 0, 0, 0, 0, 0, 5],
    [5, 0, 21, 0, 0, 0, 0, 0, 22, 22, 22, 22, 22, 22, 22, 22, 22, 0, 0, 0, 0, 0, 21, 0, 5],
    [5, 0, 21, 21, 21, 0, 0, 0, 0, 22, 22, 22, 22, 22, 22, 0, 0, 0, 0, 0, 21, 21, 21, 0, 5],
    [5, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 22, 22, 22, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 5],
    [5, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 5], // ÁREAS DE BATALHA
    [5, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 5],
    [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
    [5, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 5],
    [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
    [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5], // SAÍDA PARA REINO 5
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  ],
  playerStart: { x: 1, y: 7 },
  npcs: [
    {
      id: "genio", name: "Gênio Def", tileX: 12, tileY: 6,
      dialog: [
        "Saudações, mestre do código! Eu sou o Gênio Def.",
        "Neste deserto, a energia é escassa. Não podemos desperdiçar lógica!",
        "Uma FUNÇÃO (def) é como um desejo guardado: você escreve uma vez e usa quantas vezes quiser.",
        "Use 'def nome():' para criar e o nome para chamar.",
        "E não esqueça o 'return'! É assim que a função te entrega o resultado do desejo.",
        "Vá em frente, crie suas próprias magias!"
      ]
    }
  ],
  chests: [
    { 
      tileX: 11, tileY: 4, 
      description: "Este baú sagrado exige que você invoque a magia da soma através de uma função!",
      puzzle: "def somar(a, b):\n  return a + b\n\nprint(somar(10, 15))", 
      expected: "25", 
      reward: 300 
    }
  ],
  signs: [
    { tileX: 23, tileY: 7, messages: [
    "BEM-VINDO AO OÁSIS DAS FUNÇÕES!",
    "Cansado de escrever a mesma coisa várias vezes? As FUNÇÕES são a solução.",
    "Imagine uma fábrica: você entra com matéria-prima (parâmetros) e sai com um produto (return).",
    "SINTAXE: def meu_desejo(item):\n  return 'Você ganhou ' + item",
    "Para ativar a fábrica, basta chamá-la: meu_desejo('Ouro').",
    "Funções mantêm seu código limpo e organizado, como um oásis no deserto.",
    "DICA: O Python só executa a função quando você a 'chama' pelo nome!",
    "Atravesse as dunas e mostre que você domina a arte de encapsular lógica. Boa sorte!"
] }
  ],
  exits: [
    { tileX: 0, tileY: 7, targetMap: "world3", targetX: 7, targetY: 18 }
  ],
  merchantPos: { x: 5, y: 2 }
};
