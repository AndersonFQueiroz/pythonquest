export interface BugStage {
  description: string;
  problem: string;
  solution: string;
  expectedOutput: string;
  hint: string;
}

export interface BugEnemy {
  id: string;
  name: string;
  level: number;
  hp: number;
  xpReward: number;
  goldReward: number;
  stages: BugStage[];
}

// REINO 1: FLORESTA DAS VARIÁVEIS (Básico, Print, Tipos)
export const WORLD1_ENEMIES: BugEnemy[] = [
  {
    id: 'syntax_wasp', name: 'Vespa de Sintaxe', level: 1, hp: 60, xpReward: 40, goldReward: 10,
    stages: [{ 
        description: 'O Python precisa que textos (Strings) estejam protegidos por aspas. Esta Vespa quebrou as aspas finais! Conserte-as.', 
        problem: 'print("Ola Mundo)', 
        solution: 'print("Ola Mundo")', 
        expectedOutput: 'Ola Mundo', 
        hint: 'Adicione uma " no final do texto dentro dos parenteses.' 
    }]
  },
  {
    id: 'type_goblin', name: 'Goblin de Tipo', level: 1, hp: 80, xpReward: 50, goldReward: 15,
    stages: [{ 
        description: 'Você não pode somar um Número com um Texto. O Goblin transformou o 20 em texto usando aspas! Remova as aspas para somar de verdade.', 
        problem: 'print(10 + "20")', 
        solution: 'print(10 + 20)', 
        expectedOutput: '30', 
        hint: 'Remova as aspas em volta do 20 para ele virar um numero inteiro.' 
    }]
  },
  {
    id: 'name_bat', name: 'Morcego de Nome', level: 1, hp: 70, xpReward: 45, goldReward: 12,
    stages: [{ 
        description: 'Variáveis guardam valores. Este Morcego tentou imprimir "x", mas a variável "x" ainda não existe! Crie x = 5 antes do print.', 
        problem: 'print(x)', 
        solution: 'x = 5\nprint(x)', 
        expectedOutput: '5', 
        hint: 'Digite x = 5 na primeira linha e mantenha o print(x) na segunda.' 
    }]
  },
  {
    id: 'print_ghost', name: 'Fantasma de Print', level: 1, hp: 65, xpReward: 42, goldReward: 11,
    stages: [{ 
        description: 'O comando para exibir coisas na tela se chama print(). O Fantasma errou a escrita para "priint". Corrija o nome do comando.', 
        problem: 'priint(100)', 
        solution: 'print(100)', 
        expectedOutput: '100', 
        hint: 'Escreva print com apenas um "i".' 
    }]
  }
];

// REINO 2: CAVERNAS DAS DECISÕES (If, Else, Booleans, Comparações)
export const WORLD2_ENEMIES: BugEnemy[] = [
  {
    id: 'if_slime', name: 'If-Slime', level: 2, hp: 120, xpReward: 80, goldReward: 30,
    stages: [{ 
        description: 'O Slime esqueceu de fechar a condição do "if" com dois pontos (:). Sem isso, o Python não sabe onde a pergunta termina!', 
        problem: 'if True\n  print("Passar")', 
        solution: 'if True:\n  print("Passar")', 
        expectedOutput: 'Passar', 
        hint: 'Coloque um : logo após a palavra True.' 
    }]
  },
  {
    id: 'bool_bat', name: 'Morcego Booleano', level: 2, hp: 110, xpReward: 75, goldReward: 25,
    stages: [{ 
        description: 'Booleanos (Verdadeiro/Falso) no Python são especiais e SEMPRE começam com letra Maiúscula. Corrija o "false" minúsculo.', 
        problem: 'ativo = false\nprint(ativo)', 
        solution: 'ativo = False\nprint(ativo)', 
        expectedOutput: 'False', 
        hint: 'Troque false por False.' 
    }]
  },
  {
    id: 'else_troll', name: 'Troll do Else', level: 2, hp: 150, xpReward: 100, goldReward: 40,
    stages: [{ 
        description: 'No Python, "=" serve para GUARDAR valor. Para COMPARAR se algo é IGUAL, usamos "==". Corrija o sinal no if!', 
        problem: 'pontos = 10\nif pontos = 10:\n  print("Ganhou")', 
        solution: 'pontos = 10\nif pontos == 10:\n  print("Ganhou")', 
        expectedOutput: 'Ganhou', 
        hint: 'Troque o = por == dentro da linha do if.' 
    }]
  },
  {
    id: 'logic_snake', name: 'Serpente Lógica', level: 2, hp: 130, xpReward: 90, goldReward: 35,
    stages: [{ 
        description: 'Para verificar se DUAS coisas são verdadeiras ao mesmo tempo, usamos a palavra "and". Substitua os pontos de interrogação.', 
        problem: 'if True ?? True:\n  print("Sim")', 
        solution: 'if True and True:\n  print("Sim")', 
        expectedOutput: 'Sim', 
        hint: 'Substitua ?? pela palavra and.' 
    }]
  }
];

// ... (Restantes dos inimigos seguem padrão similar de ensino detalhado)
export const WORLD3_ENEMIES: BugEnemy[] = [
  {
    id: 'for_spider', name: 'Aranha do For', level: 3, hp: 200, xpReward: 150, goldReward: 60,
    stages: [{ description: 'O loop "for" serve para repetir ações para cada item de uma lista. Use a palavra "in" para percorrer os itens.', problem: 'items = [1, 2]\nfor i ?? items:\n  print(i)', solution: 'items = [1, 2]\nfor i in items:\n  print(i)', expectedOutput: '1\n2', hint: 'Use a palavra "in" no lugar de ??.' }]
  },
  {
    id: 'while_worm', name: 'Verme do While', level: 3, hp: 180, xpReward: 140, goldReward: 55,
    stages: [{ description: 'O loop "while" repete enquanto uma condição for verdadeira. Ele também precisa de dois pontos (:) no final da linha!', problem: 'x = 0\nwhile x < 2\n  print(x)\n  x += 1', solution: 'x = 0\nwhile x < 2:\n  print(x)\n  x += 1', expectedOutput: '0\n1', hint: 'Adicione : após o 2.' }]
  },
  {
    id: 'range_rat', name: 'Rato do Range', level: 3, hp: 170, xpReward: 130, goldReward: 50,
    stages: [{ description: 'A função range(n) gera uma sequência de números de 0 até n-1. Use range(3) para repetir a mensagem 3 vezes.', problem: 'for i in range(?):\n  print("Ok")', solution: 'for i in range(3):\n  print("Ok")', expectedOutput: 'Ok\nOk\nOk', hint: 'Troque ? por 3.' }]
  },
  {
    id: 'break_beetle', name: 'Besouro do Break', level: 3, hp: 220, xpReward: 180, goldReward: 70,
    stages: [{ description: 'Às vezes precisamos parar um loop antes da hora. A palavra "break" serve para quebrar o ciclo imediatamente.', problem: 'while True:\n  print("Parar")\n  ??', solution: 'while True:\n  print("Parar")\n  break', expectedOutput: 'Parar', hint: 'Escreva a palavra break.' }]
  }
];

export const WORLD4_ENEMIES: BugEnemy[] = [
  {
    id: 'def_dragon', name: 'Dragão da Definição', level: 4, hp: 350, xpReward: 300, goldReward: 120,
    stages: [{ description: 'Funções são blocos de código reutilizáveis. Começamos a criar uma usando a palavra "def".', problem: '?? ola():\n  return "Oi"\nprint(ola())', solution: 'def ola():\n  return "Oi"\nprint(ola())', expectedOutput: 'Oi', hint: 'Troque ?? por def.' }]
  },
  {
    id: 'return_raven', name: 'Corvo do Retorno', level: 4, hp: 300, xpReward: 250, goldReward: 100,
    stages: [{ description: 'Para uma função enviar um valor de volta para quem a chamou, usamos a palavra "return".', problem: 'def pegar():\n  ?? 10\nprint(pegar())', solution: 'def pegar():\n  return 10\nprint(pegar())', expectedOutput: '10', hint: 'Troque ?? por return.' }]
  },
  {
    id: 'param_pig', name: 'Javali de Parâmetro', level: 4, hp: 320, xpReward: 280, goldReward: 110,
    stages: [{ description: 'Parâmetros são informações que enviamos PARA dentro da função. Envie o texto "Dev" entre os parenteses ao chamar a função.', problem: 'def d(nome):\n  print(nome)\nd(??)', solution: 'def d(nome):\n  print(nome)\nd("Dev")', expectedOutput: 'Dev', hint: 'Escreva "Dev" (com aspas!) no lugar de ??.' }]
  },
  {
    id: 'scope_scorp', name: 'Escorpião de Escopo', level: 4, hp: 310, xpReward: 260, goldReward: 105,
    stages: [{ description: 'Indentação é essencial em funções! O comando print deve estar "dentro" (recuado) da função def.', problem: 'def erro():\nprint("X")\nerro()', solution: 'def erro():\n  print("X")\nerro()', expectedOutput: 'X', hint: 'Dê dois espaços antes do print.' }]
  }
];

export const WORLD5_ENEMIES: BugEnemy[] = [
  {
    id: 'class_cat', name: 'Gato de Classe', level: 5, hp: 500, xpReward: 500, goldReward: 200,
    stages: [{ description: 'Classes são moldes para criar objetos. Use a palavra "class" para definir o molde do seu Herói.', problem: '?? Heroi:\n  pass', solution: 'class Heroi:\n  pass', expectedOutput: '', hint: 'Troque ?? por class.' }]
  },
  {
    id: 'init_owl', name: 'Coruja do Init', level: 5, hp: 450, xpReward: 450, goldReward: 180,
    stages: [{ description: 'O construtor __init__ prepara o objeto quando ele nasce. Ele usa DOIS sublinhados de cada lado. Corrija o nome!', problem: 'class C:\n  def _init_(self):\n    print("Ok")\nobj = C()', solution: 'class C:\n  def __init__(self):\n    print("Ok")\nobj = C()', expectedOutput: 'Ok', hint: 'Use dois sublinhados: __init__' }]
  },
  {
    id: 'self_squid', name: 'Lula do Self', level: 5, hp: 480, xpReward: 480, goldReward: 190,
    stages: [{ description: 'No Python, toda função de uma classe deve receber "self" como primeiro parâmetro para se referir ao próprio objeto.', problem: 'class J:\n  def acao(??):\n    print("Oi")\nobj = J()\nobj.acao()', solution: 'class J:\n  def acao(self):\n    print("Oi")\nobj = J()\nobj.acao()', expectedOutput: 'Oi', hint: 'Substitua ?? por self.' }]
  },
  {
    id: 'method_monkey', name: 'Macaco de Método', level: 5, hp: 550, xpReward: 600, goldReward: 250,
    stages: [{ description: 'Métodos são funções de um objeto. Para chamar um método, use o PONTO (objeto.metodo()).', problem: 'class P:\n  def pular(self):\n    print("Pulei")\nplayer = P()\n??', solution: 'class P:\n  def pular(self):\n    print("Pulei")\nplayer = P()\nplayer.pular()', expectedOutput: 'Pulei', hint: 'Escreva player.pular() no lugar de ??.' }]
  }
];
