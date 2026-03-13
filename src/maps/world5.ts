import type { MapData } from './types';

export const world5Map: MapData = {
  id: "world5",
  name: "Cidadela da OOP",
  width: 25,
  height: 25,
  tiles: [
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 25, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 25, 5],
    [5, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 5],
    [5, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 23, 23, 5],
    [5, 23, 23, 24, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 23, 23, 5],
    [5, 23, 23, 24, 23, 25, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 25, 23, 23, 24, 23, 23, 5],
    [5, 23, 23, 24, 23, 23, 23, 5, 5, 5, 5, 5, 0, 5, 5, 5, 5, 23, 23, 23, 23, 24, 23, 23, 5],
    [6, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 13, 5], // ENTRADA (Placa x=23)
    [5, 23, 23, 24, 23, 23, 23, 5, 5, 5, 5, 5, 0, 5, 5, 5, 5, 23, 23, 23, 23, 24, 23, 23, 5],
    [5, 23, 23, 24, 23, 25, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 25, 23, 23, 24, 23, 23, 5],
    [5, 23, 23, 24, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 23, 23, 5],
    [5, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 23, 23, 5],
    [5, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 5],
    [5, 23, 23, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 23, 23, 5], 
    [5, 23, 23, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 23, 23, 5],
    [5, 5, 2, 5, 5, 5, 5, 5, 5, 5, 23, 2, 2, 2, 23, 5, 5, 5, 5, 5, 5, 5, 2, 5, 5],
    [5, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 5],
    [5, 0, 2, 8, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 8, 2, 0, 5], 
    [5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5],
    [5, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5],
    [5, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 2, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 5],
    [5, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 2, 13, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 5], // Placa x=12, y=21
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 11, 6, 11, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5], 
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  ],
  playerStart: { x: 1, y: 7 },
  npcs: [
    {
      id: "arquiteto", name: "Arquiteto Instância", tileX: 12, tileY: 16,
      dialog: [
        "Bem-vindo ao ápice da abstração, Aprendiz!",
        "Uma CLASSE (class) é o projeto arquitetônico que une todas as peças.",
        "Imagine uma forma de bolo: a forma é a CLASSE. O bolo que sai dela é o OBJETO.",
        "O método '__init__' é onde damos vida ao objeto, definindo suas características iniciais.",
        "E o 'self'? Ele é a identidade do próprio objeto, permitindo que ele conheça seus próprios dados.",
        "Construa sua própria realidade agora!"
      ]
    },
    {
        id: "guard9", name: "Sentinela de Estrutura L", tileX: 11, tileY: 22,
        dialog: ["O Castelo está em manutenção arquitetônica!", "Capture os 4 Bugs de Classe para validar a estrutura final."]
    },
    {
        id: "guard10", name: "Sentinela de Estrutura R", tileX: 13, tileY: 22,
        dialog: ["Somente objetos bem definidos podem passar por este portal.", "Mostre que você entende de POO!"]
    }
  ],
  chests: [
    { 
      tileX: 3, tileY: 17, 
      description: "Este cofre de cristal exige que você instancie um objeto da classe 'Chave'!",
      puzzle: "class Chave:\n  def __init__(self, cod):\n    self.cod = cod\n\nc = Chave(123)\nprint(c.cod)", 
      expected: "123", 
      reward: 500 
    },
    { 
      tileX: 21, tileY: 17, 
      description: "Desafio de Método: Chame o método 'abrir' do objeto 'porta'!",
      puzzle: "class P:\n  def abrir(self):\n    print('Ok')\np = P()\n??", 
      expected: "Ok", 
      reward: 500 
    }
  ],
  signs: [
    { tileX: 23, tileY: 7, messages: [
    "BEM-VINDO À CIDADELA DA OOP!",
    "Você chegou ao conhecimento mais poderoso de Python. Daqui em diante você não usa ferramentas, você as cria.",
    "A CLASSE é a planta baixa do objeto. Você define a planta uma vez e constrói quantos objetos quiser a partir dela.",
    "O __init__ é executado automaticamente quando o objeto nasce. É onde você define os atributos iniciais.",
    "O self é o objeto falando de si mesmo. self.vida é a vida daquele objeto específico.",
    "Derrote o META-CLASS e torne-se um Arquiteto de Python. Pythoria depende de você!"
] },
    { tileX: 12, tileY: 21, messages: [
    "[ AULA: CONSTRUINDO OBJETOS ]",
    "1. INSTANCIAÇÃO:",
    "Para criar um objeto, chame o nome da classe como se fosse uma função.",
    "Ex: meu_carro = Carro()",
    " ",
    "2. MÉTODOS:",
    "Para dar uma ordem ao objeto, use o ponto (.).",
    "Ex: meu_carro.ligar()",
    " ",
    "A META-CLASS exige domínio total sobre o nascimento e as ações dos objetos!"
] }
  ],
  exits: [
    { tileX: 0, tileY: 7, targetMap: "world4", targetX: 12, targetY: 18 },
    { tileX: 12, tileY: 22, targetMap: "final_boss", targetX: 11, targetY: 21 }
  ],
  merchantPos: { x: 5, y: 2 },
  lockConfig: {
      requiredBugs: ['class_cat', 'init_owl', 'self_squid', 'method_monkey'],
      gatePos: { x: 12, y: 22 },
      guardDialog: ["A estrutura do castelo ainda está instável!", "Capture os 4 Bugmons finais para estabilizar a arquitetura de classes."],
      unlockDialog: ["SISTEMA ESTABILIZADO! Você agora é um Arquiteto de Software.", "O PythonQuest foi restaurado. Parabéns, Mestre do Código!"]
  }
};
