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
    [5, 0, 21, 0, 20, 0, 0, 0, 0, 22, 22, 8, 22, 22, 22, 22, 0, 0, 0, 20, 0, 0, 21, 0, 5],
    [5, 0, 0, 0, 0, 0, 0, 0, 22, 22, 22, 22, 22, 22, 22, 22, 22, 0, 0, 0, 0, 0, 0, 0, 5],
    [5, 0, 0, 0, 0, 0, 0, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 0, 0, 0, 0, 0, 0, 5],
    [6, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 13, 5],
    [5, 0, 0, 0, 0, 0, 0, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 0, 0, 0, 0, 0, 0, 5],
    [5, 0, 21, 0, 0, 0, 0, 0, 22, 22, 22, 22, 22, 22, 22, 22, 22, 0, 0, 0, 0, 0, 21, 0, 5],
    [5, 0, 21, 21, 21, 0, 0, 0, 0, 22, 22, 22, 22, 22, 22, 0, 0, 0, 0, 0, 21, 21, 21, 0, 5],
    [5, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 22, 22, 22, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 5],
    [5, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 5],
    [5, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 5],
    [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
    [5, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 0, 2, 0, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 5],
    [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
    [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 11, 6, 13, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
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
    },
    {
        id: "guard7", name: "PARAM_US", tileX: 11, tileY: 18,
        dialog: ["A tempestade de areia bloqueou a saída para o Reino de OOP!", "O Gênio Def disse que só as funções certas podem limpar o ar."]
    },
    {
        id: "guard8", name: "RETURNO", tileX: 13, tileY: 18,
        dialog: ["Existem 4 Bugs de escopo e retorno à solta.", "Limpe o oásis para podermos prosseguir para o Reino Final."]
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
    // Placa 1: Boas-vindas geral na entrada (x=23, y=7)
    { tileX: 23, tileY: 7, messages: [
      "BEM-VINDO AO TEMPLO DAS FUNÇÕES!",
      "Você já percebeu que fica repetindo o mesmo código em lugares diferentes? Função resolve isso.",
      "Uma função é um bloco de código com nome. Você escreve uma vez e usa quantas vezes quiser.",
      "Para criar uma função use def seguido do nome e parênteses. Depois : e 4 espaços na linha de baixo.",
      "IMPORTANTE: a função só roda quando você a chama pelo nome. Escrever def apenas cria, não executa.",
      "Os Bugs deste templo se escondem dentro de funções quebradas. Encontre o erro e invoque o poder. Boa sorte!"
    ] },
    // Placa 2: Aula avançada na saída (x=13, y=18) — conteúdo para vencer os bosses
    { tileX: 13, tileY: 18, messages: [
      "[ AULA: MAGIA AVANÇADA DE FUNÇÕES ]",
      "1. PARÂMETROS MÚLTIPLOS:",
      "Uma função pode receber quantos ingredientes quiser!",
      "Ex: def poder(forca, magia): print(forca + magia)",
      "Passe os valores em ordem: poder(10, 20) → imprime 30",
      " ",
      "2. O PODER DO ESCOPO:",
      "Variáveis criadas DENTRO da função não existem fora!",
      "Para usar o resultado fora, use RETURN + print().",
      "Ex: print(dobro(5)) → imprime 10",
      " ",
      "3. RECURSÃO (Boss Final do Oásis):",
      "Uma função pode chamar a SI MESMA.",
      "Ex: def fat(n): return 1 if n<=1 else n * fat(n-1)"
    ] }
  ],
  exits: [
    { tileX: 0, tileY: 7, targetMap: "world3", targetX: 7, targetY: 18 },
    { tileX: 12, tileY: 18, targetMap: "world5", targetX: 1, targetY: 7 }
  ],
  merchantPos: { x: 5, y: 2 },
  lockConfig: {
      requiredBugs: ['def_dragon', 'return_raven', 'param_pig', 'scope_scorp'],
      gatePos: { x: 12, y: 18 },
      guardDialog: ["As funções de purificação ainda não foram ativadas!", "Derrote os 4 Dragões e Escorpiões do deserto para liberar o caminho."],
      unlockDialog: ["O escopo foi limpo! O Gênio Def abriu os portões da classe.", "O Reino da Programação Orientada a Objetos te espera!"]
  }
};
