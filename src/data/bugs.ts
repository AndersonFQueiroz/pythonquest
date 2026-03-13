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
  deathPhrase?: string;
}

export const WORLD1_ENEMIES: BugEnemy[] = [
  {
    id: 'syntax_wasp', name: 'Vespa de Sintaxe', level: 1, hp: 60, xpReward: 40, goldReward: 10,
    stages: [{ description: 'Esta vespa removeu as aspas de fechamento da string! Adicione a aspa que falta para consertar o código.', problem: 'msg = "Ola Python\nprint(msg)', solution: 'msg = "Ola Python"\nprint(msg)', expectedOutput: 'Ola Python', hint: 'Adicione uma aspa (") depois da palavra Python.' }]
  },
  {
    id: 'type_goblin', name: 'Goblin de Tipo', level: 1, hp: 80, xpReward: 50, goldReward: 15,
    stages: [{ description: 'Este goblin transformou o número 20 em texto! Remova as aspas para que a soma (10 + 20) funcione.', problem: 'num = "20"\nprint(10 + num)', solution: 'num = 20\nprint(10 + num)', expectedOutput: '30', hint: 'Remova as aspas ao redor do 20.' }]
  },
  {
    id: 'name_bat', name: 'Morcego de Nome', level: 1, hp: 70, xpReward: 45, goldReward: 12,
    stages: [{ description: 'O morcego chamou a variável "x", mas ela ainda não foi definida! Defina x = 10 antes de usá-la.', problem: 'print(x)', solution: 'x = 10\nprint(x)', expectedOutput: '10', hint: 'Escreva x = 10 na primeira linha.' }]
  },
  {
    id: 'print_ghost', name: 'Fantasma de Print', level: 1, hp: 65, xpReward: 42, goldReward: 11,
    stages: [{ description: 'O fantasma errou a escrita do comando print! Corrija "priint" para "print".', problem: 'priint("Ola")', solution: 'print("Ola")', expectedOutput: 'Ola', hint: 'Escreva print com apenas um "i".' }]
  }
];

export const WORLD2_ENEMIES: BugEnemy[] = [
  {
    id: 'if_slime', name: 'If-Slime', level: 2, hp: 120, xpReward: 80, goldReward: 30,
    stages: [{ description: 'O comando "if" (se) precisa de dois pontos (:) no final da condição. Adicione-os para o slime sumir!', problem: 'if True\n  print("Sim")', solution: 'if True:\n  print("Sim")', expectedOutput: 'Sim', hint: 'Adicione : depois da palavra True.' }]
  },
  {
    id: 'bool_bat', name: 'Morcego Booleano', level: 2, hp: 110, xpReward: 75, goldReward: 25,
    stages: [{ description: 'Em Python, True e False devem começar com letra MAIÚSCULA! Corrija o "false" para "False".', problem: 'x = false\nprint(x)', solution: 'x = False\nprint(x)', expectedOutput: 'False', hint: 'Mude false para False.' }]
  },
  {
    id: 'else_troll', name: 'Troll do Else', level: 2, hp: 150, xpReward: 100, goldReward: 40,
    stages: [{ description: 'Para COMPARAR dois valores, usamos "==". Um único "=" serve para GUARDAR valores. Use "==" na condição.', problem: 'if 10 = 10:\n  print("Igual")', solution: 'if 10 == 10:\n  print("Igual")', expectedOutput: 'Igual', hint: 'Use dois sinais de igual (==).' }]
  },
  {
    id: 'logic_snake', name: 'Serpente Lógica', level: 2, hp: 130, xpReward: 90, goldReward: 35,
    stages: [{ description: 'Operadores lógicos conectam condições. Use "and" para verificar se ambas as condições são verdadeiras.', problem: 'if True ?? True:\n  print("Sim")', solution: 'if True and True:\n  print("Sim")', expectedOutput: 'Sim', hint: 'Substitua ?? pela palavra and.' }]
  }
];

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

export const BOSSES_ENEMIES: BugEnemy[] = [
  {
    id: 'glitch_byte',
    name: 'GLITCH-BYTE',
    level: 10,
    hp: 300,
    xpReward: 1000,
    goldReward: 500,
    stages: [
      {
        description: "[PROVA FINAL R1 - FASE 1] O Glitch-Byte inseriu um caractere ilegal! Corrija o nome da variável para que o Python aceite o valor.",
        problem: "pontos vida = 100\nprint(pontos vida)",
        solution: "pontos_vida = 100\nprint(pontos_vida)",
        expectedOutput: "100",
        hint: "Nomes de variáveis não podem ter espaços. Use sublinhado ( _ ) para separar palavras."
      },
      {
        description: "[PROVA FINAL R1 - FASE 2] Erro de Tipagem Sutil! Tente imprimir a mensagem de nível combinando texto e número corretamente.",
        problem: "nivel = 1\nprint('Voce esta no nivel: ' + nivel)",
        solution: "nivel = 1\nprint('Voce esta no nivel: ' + str(nivel))",
        expectedOutput: "Voce esta no nivel: 1",
        hint: "Você não pode somar Texto (str) com Número (int). Use a função str() para converter o número antes de somar."
      },
      {
        description: "[PROVA FINAL R1 - FASE 3] O Desafio da Persistência! O código abaixo soma XP, mas o valor não 'gruda' na variável. Corrija-o.",
        problem: "xp = 100\nxp + 50\nprint(xp)",
        solution: "xp = 100\nxp = xp + 50\nprint(xp)",
        expectedOutput: "150",
        hint: "Para atualizar uma variável, você deve atribuir o novo valor a ela: xp = xp + 50 ou xp += 50."
      }
    ],
    deathPhrase: "Se a implementação é difícil de explicar, é uma má ideia. Você provou ser explícito, Aprendiz..."
  },
  {
    id: 'logic_void',
    name: 'LOGIC-VOID',
    level: 15,
    hp: 450,
    xpReward: 1500,
    goldReward: 700,
    stages: [
      {
        description: "[PROVA FINAL R2 - FASE 1] O Vazio Lógico inverteu sua percepção! Use 'not' para tornar a condição verdadeira.",
        problem: "if ?? False:\n  print('Ok')",
        solution: "if not False:\n  print('Ok')",
        expectedOutput: "Ok",
        hint: "not False é igual a True."
      },
      {
        description: "[PROVA FINAL R2 - FASE 2] Decisão Aninhada! Verifique se a idade é maior que 18 E se tem convite.",
        problem: "idade = 20\ntem_convite = True\nif idade > 18 ?? tem_convite:\n  print('Entrou')",
        solution: "idade = 20\ntem_convite = True\nif idade > 18 and tem_convite:\n  print('Entrou')",
        expectedOutput: "Entrou",
        hint: "Use o operador 'and'."
      },
      {
        description: "[PROVA FINAL R2 - FASE 3] O Desafio do Else! Complete a estrutura para que o resultado seja 'Erro'.",
        problem: "x = 5\nif x > 10:\n  print('Ok')\n??\n  print('Erro')",
        solution: "x = 5\nif x > 10:\n  print('Ok')\nelse:\n  print('Erro')",
        expectedOutput: "Erro",
        hint: "Use 'else:' para o caminho contrário."
      }
    ],
    deathPhrase: "Na face da ambiguidade, você recusou a tentação de adivinhar. A lógica volta a ser clara..."
  },
  {
    id: 'stack_overlord',
    name: 'STACK-OVERLORD',
    level: 20,
    hp: 600,
    xpReward: 2000,
    goldReward: 1000,
    stages: [
      {
        description: "[PROVA FINAL R3 - FASE 1] Loop com Range! Repita o grito de guerra 3 vezes.",
        problem: "for i in range(?):\n  print('PY')",
        solution: "for i in range(3):\n  print('PY')",
        expectedOutput: "PY\nPY\nPY",
        hint: "Troque ? por 3."
      },
      {
        description: "[PROVA FINAL R3 - FASE 2] O Acumulador! Use o loop para somar os números de 1 a 3.",
        problem: "soma = 0\nfor i in [1, 2, 3]:\n  ??\nprint(soma)",
        solution: "soma = 0\nfor i in [1, 2, 3]:\n  soma += i\nprint(soma)",
        expectedOutput: "6",
        hint: "Use soma += i"
      },
      {
        description: "[PROVA FINAL R3 - FASE 3] Quebra de Infinitude! Use 'break' para parar o Overlord.",
        problem: "while True:\n  print('Parou')\n  ??",
        solution: "while True:\n  print('Parou')\n  break",
        expectedOutput: "Parou",
        hint: "Escreva break."
      }
    ],
    deathPhrase: "Plano é melhor que aninhado. O loop infinito foi finalmente quebrado..."
  },
  {
    id: 'protocol_def',
    name: 'PROTOCOL-DEF',
    level: 25,
    hp: 800,
    xpReward: 3000,
    goldReward: 1500,
    stages: [
      {
        description: "[PROVA FINAL R4 - FASE 1] Definição Mágica! Crie uma função que receba 'x' e retorne o dobro.",
        problem: "def dobro(x):\n  ??\nprint(dobro(5))",
        solution: "def dobro(x):\n  return x * 2\nprint(dobro(5))",
        expectedOutput: "10",
        hint: "Use return x * 2"
      },
      {
        description: "[PROVA FINAL R4 - FASE 2] Múltiplos Parâmetros! Some a força e a magia.",
        problem: "def poder(f, m):\n  print(f + m)\npoder(10, ??)",
        solution: "def poder(f, m):\n  print(f + m)\npoder(10, 20)",
        expectedOutput: "30",
        hint: "Passe o número 20 como segundo argumento."
      },
      {
        description: "[PROVA FINAL R4 - FASE 3] Escopo Local! Tente imprimir a variável 'segredo' que está dentro da função.",
        problem: "def f():\n  segredo = 'SHH'\n  return segredo\n??",
        solution: "def f():\n  segredo = 'SHH'\n  return segredo\nprint(f())",
        expectedOutput: "SHH",
        hint: "Você não pode acessar 'segredo' de fora, mas pode imprimir o resultado da função."
      }
    ],
    deathPhrase: "Erros nunca devem passar silenciosamente. Suas funções agora têm propósito..."
  },
  {
    id: 'meta_class',
    name: 'META-CLASS',
    level: 30,
    hp: 1000,
    xpReward: 5000,
    goldReward: 2500,
    stages: [
      {
        description: "[PROVA FINAL R5 - FASE 1] Instanciação Pura! Crie um objeto da classe 'Boss'.",
        problem: "class Boss:\n  pass\nb = ??",
        solution: "class Boss:\n  pass\nb = Boss()",
        expectedOutput: "",
        hint: "Use Boss()"
      },
      {
        description: "[PROVA FINAL R5 - FASE 2] Atributos Iniciais! Defina a vida do boss no __init__.",
        problem: "class B:\n  def __init__(self, v):\n    ??\nb = B(100)\nprint(b.v)",
        solution: "class B:\n  def __init__(self, v):\n    self.v = v\nb = B(100)\nprint(b.v)",
        expectedOutput: "100",
        hint: "Use self.v = v"
      },
      {
        description: "[PROVA FINAL R5 - FASE 3] O Golpe Final! Use o método 'derrotar' da própria classe.",
        problem: "class B:\n  def derrotar(self):\n    print('Fim')\nb = B()\n??",
        solution: "class B:\n  def derrotar(self):\n    print('Fim')\nb = B()\nb.derrotar()",
        expectedOutput: "Fim",
        hint: "Chame b.derrotar()"
      }
    ],
    deathPhrase: "Namespaces são uma grande ideia. O objeto foi depurado, mas a classe permanece..."
  },
  {
    id: 'malwarech',
    name: 'MALWARECH',
    level: 50,
    hp: 2000,
    xpReward: 10000,
    goldReward: 5000,
    stages: [
      {
        description: "[CONFRONTO FINAL - ESTÁGIO 1: VARIÁVEIS] Malwarech tenta deletar seu nome! Prove que você existe.",
        problem: "player_name = 'Mestre'\nprint(??)",
        solution: "player_name = 'Mestre'\nprint(player_name)",
        expectedOutput: "Mestre",
        hint: "Imprima a variável player_name."
      },
      {
        description: "[CONFRONTO FINAL - ESTÁGIO 2: LÓGICA] Ele criou um labirinto de mentiras! Saia dele.",
        problem: "if not (5 > 10) and True:\n  print('Livre')\nelse:\n  print('Preso')",
        solution: "if not (5 > 10) and True:\n  print('Livre')\nelse:\n  print('Preso')",
        expectedOutput: "Livre",
        hint: "O código já está quase certo, apenas execute para validar a lógica."
      },
      {
        description: "[CONFRONTO FINAL - ESTÁGIO 3: LOOPS] O tempo está acabando! Complete o ciclo de restauração.",
        problem: "for i in range(3):\n  ??",
        solution: "for i in range(3):\n  print('OK')",
        expectedOutput: "OK\nOK\nOK",
        hint: "Use print('OK') dentro do loop."
      },
      {
        description: "[CONFRONTO FINAL - ESTÁGIO 4: FUNÇÕES] O núcleo está exposto! Chame a função de deleção.",
        problem: "def deletar_virus():\n  return 'Virus Deletado'\n??",
        solution: "def deletar_virus():\n  return 'Virus Deletado'\nprint(deletar_virus())",
        expectedOutput: "Virus Deletado",
        hint: "Imprima o resultado de deletar_virus()."
      },
      {
        description: "[CONFRONTO FINAL - ESTÁGIO 5: ZEN DO PYTHON] RECONSTRUA O UNIVERSO! Instancie o Novo Mundo.",
        problem: "class Mundo:\n  def __init__(self):\n    self.status = 'Restaurado'\nm = Mundo()\nprint(m.status)",
        solution: "class Mundo:\n  def __init__(self):\n    self.status = 'Restaurado'\nm = Mundo()\nprint(m.status)",
        expectedOutput: "Restaurado",
        hint: "Corrija ou complete o código para imprimir 'Restaurado'."
      }
    ],
    deathPhrase: "SISTEMA RESTAURADO. O Zen do Python agora reina absoluto..."
  }
];
