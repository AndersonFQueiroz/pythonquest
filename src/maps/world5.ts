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
    [6, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 5], // ENTRADA
    [5, 23, 23, 24, 23, 23, 23, 5, 5, 5, 5, 5, 0, 5, 5, 5, 5, 23, 23, 23, 23, 24, 23, 23, 5],
    [5, 23, 23, 24, 23, 25, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 25, 23, 23, 24, 23, 23, 5],
    [5, 23, 23, 24, 23, 23, 23, 23, 23, 23, 23, 13, 13, 23, 23, 23, 23, 23, 23, 23, 23, 24, 23, 23, 5], // PLACAS LADO A LADO
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
    [5, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 2, 2, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 5],
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
        id: "guard9", name: "INSTÂNCIUS", tileX: 11, tileY: 22,
        dialog: ["O Castelo está em manutenção arquitetônica!", "Capture os 4 Bugs de Classe para validar a estrutura final."]
    },
    {
        id: "guard10", name: "HERANCIUS", tileX: 13, tileY: 22,
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
    { tileX: 11, tileY: 10, messages: [
    "BEM-VINDO À CIDADELA DA OOP!",
    "Você chegou até aqui sabendo criar variáveis, tomar decisões, repetir tarefas e criar funções. Agora vai juntar tudo isso em um único lugar.",
    "Imagine um personagem de RPG. Ele tem nome, vida e força. E ele pode atacar, curar e correr. Isso é um objeto — dados e ações juntos.",
    "A CLASSE é o molde. Você define o molde uma vez e cria quantos objetos quiser a partir dele. Heroi é a classe. Anderson é o objeto.",
    "O __init__ roda automaticamente quando o objeto nasce. É onde você define o que todo objeto dessa classe começa tendo.",
    "O self é o objeto falando de si mesmo. Quando você escreve self.vida está dizendo: a vida DESTE objeto específico, não de todos.",
    "HERANÇA permite que uma classe filha herde tudo da classe mãe e ainda adicione seus próprios poderes. Mago herda de Heroi.",
    "Este jogo que você está jogando foi construído com classes e objetos. Agora você sabe como ele foi feito.",
    "Cuidado com o META-CLASS - o Mestre supremo desta cidadela. Use tudo que aprendeu nele. Boa sorte, Arquiteto."
] },
    { tileX: 12, tileY: 10, messages: [
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
      unlockDialog: ["Esse estrondo... não foi o META-CLASS.",
    "META-CLASS era apenas o guardião da porta.",
    "O que você acabou de despertar está muito acima disso.",
    "INSTÂNCIUS... você sente isso?"]
  }
};
