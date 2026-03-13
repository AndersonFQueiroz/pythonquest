import type { MapData } from './types';

export const world2Map: MapData = {
  id: "world2",
  name: "Caverna das Decisões",
  width: 20,
  height: 20,
  tiles: [
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5],
    [5, 4, 18, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 18, 4, 5],
    [5, 4, 0, 19, 19, 19, 0, 0, 0, 4, 0, 0, 19, 19, 19, 0, 0, 0, 4, 5],
    [5, 4, 0, 19, 19, 19, 0, 5, 0, 4, 0, 5, 19, 19, 19, 0, 0, 0, 4, 5],
    [5, 4, 0, 0, 0, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 4, 5],
    [5, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 5, 5, 5, 5, 4, 4, 4, 4, 5],
    [6, 2, 2, 2, 2, 2, 2, 2, 2, 13, 2, 2, 2, 2, 2, 2, 2, 2, 18, 5], // ENTRADA (Placa x=9)
    [5, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 5, 5, 5, 5, 4, 4, 4, 4, 5],
    [5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5],
    [5, 4, 0, 18, 0, 5, 5, 5, 5, 2, 5, 5, 5, 5, 0, 18, 0, 0, 4, 5],
    [5, 4, 0, 0, 0, 5, 1, 1, 1, 2, 1, 1, 1, 5, 0, 0, 0, 0, 4, 5],
    [5, 4, 5, 5, 0, 5, 1, 8, 1, 2, 1, 1, 1, 5, 0, 5, 5, 4, 4, 5], 
    [5, 4, 18, 0, 0, 5, 1, 1, 1, 2, 1, 1, 1, 5, 0, 0, 18, 0, 4, 5],
    [5, 4, 0, 0, 0, 5, 5, 5, 5, 2, 5, 5, 5, 5, 0, 0, 0, 0, 4, 5],
    [5, 4, 0, 19, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 19, 0, 0, 4, 5],
    [5, 4, 0, 19, 19, 0, 0, 0, 0, 2, 13, 0, 0, 0, 19, 19, 0, 0, 4, 5], // Segunda Placa (x=10, y=16)
    [5, 4, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 4, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5], // SAÍDA
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  ],
  playerStart: { x: 1, y: 7 },
  npcs: [
    {
      id: "boole", name: "Juiz Boole", tileX: 10, tileY: 5,
      dialog: [
        "Pare! Para prosseguir, você deve entender a Lei do 'SE'. O mundo é um grande teste lógico.",
        "SE você tiver a chave, a porta abre. SENÃO (Else), ela permanece fechada.",
        "Não existe meio caminho nas minhas cavernas. Ou o teste passa, ou você fica no escuro!",
        "Lembre-se: 'True' ou 'False', não existe 'Talvez'."
      ]
    },
    {
        id: "guard3", name: "IF_ARIUS", tileX: 8, tileY: 18,
        dialog: ["O Juiz Boole ordenou o fechamento deste portal!", "Existem muitas decisões pendentes (Bugs) nesta caverna."]
    },
    {
        id: "guard4", name: "EL_SUS", tileX: 10, tileY: 18,
        dialog: ["Limpe os erros de lógica das Cavernas para liberar a passagem.", "Não permitiremos 'Talvez' no Reino das Repetições!"]
    }
  ],
  chests: [
    { 
      tileX: 7, tileY: 12, 
      description: "Este cofre ensina sobre os 'Dois Pontos' (:). No Python, toda estrutura de controle (if, for, def) precisa terminar com : para o computador saber que o bloco começou!",
      puzzle: "# Falta os dois pontos no final da linha do IF!\nsenha = 777\nif senha == 777\n  print('Aberto')", 
      expected: "Aberto", 
      reward: 100 
    }
  ],
  signs: [
   { tileX: 9, tileY: 7, messages: [
    "BEM-VINDO ÀS CAVERNAS DAS DECISÕES!",
    "Na vida real você toma decisões o tempo todo. Se estiver chovendo, pega o guarda-chuva. Senão, não pega.",
    "Em Python funciona igual. O IF é uma pergunta. Se a resposta for verdadeira, o código dentro dele roda.",
    "O ELSE é o plano B. Se a condição do IF for falsa, o Python executa o que está dentro do ELSE.",
    "Para perguntar se algo é IGUAL use ==. Um = apenas guarda um valor. Dois == fazem a pergunta.",
    "Para perguntar se algo é DIFERENTE use !=. Para maior use >. Para menor use <.",
    "REGRA DE OURO: sempre termine a linha do IF com : e coloque 4 espaços no início da linha de baixo."
] },
    { tileX: 10, tileY: 16, messages: [
    "[ AULA: LÓGICA COMPOSTA ]",
    "Você pode combinar perguntas para tomar decisões complexas!",
    "1. OPERADOR 'and': Retorna True apenas se AMBAS as condições forem verdadeiras.",
    "Ex: if tem_chave and tem_ouro: # Precisa dos dois!",
    " ",
    "2. OPERADOR 'not': Ele inverte o valor de uma condição. O que é True vira False.",
    "Ex: if not chovendo: # Só entra se NÃO estiver chovendo.",
    " ",
    "Lembre-se: O Juiz Boole ama a precisão. Use parênteses para organizar sua lógica se necessário!"
] }
  ],
  exits: [
    { tileX: 0, tileY: 7, targetMap: "world1", targetX: 17, targetY: 6 },
    { tileX: 9, tileY: 18, targetMap: "world3", targetX: 1, targetY: 7 }
  ],
  merchantPos: { x: 15, y: 9 },
  lockConfig: {
      requiredBugs: ['if_slime', 'bool_bat', 'else_troll', 'logic_snake'],
      gatePos: { x: 9, y: 18 },
      guardDialog: ["O portal para a Torre está lacrado!", "Capture os 4 Bugmons de lógica para provar que você sabe tomar decisões!"],
      unlockDialog: ["A condição foi satisfeita! O IF retornou True.", "A passagem para a Torre das Repetições está aberta. Avante!"]
  }
};
