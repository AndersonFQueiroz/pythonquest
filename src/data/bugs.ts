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

export const WORLD1_ENEMIES: BugEnemy[] = [
  {
    id: 'syntax_wasp',
    name: 'Vespa de Sintaxe',
    level: 1,
    hp: 60,
    xpReward: 40,
    goldReward: 10,
    stages: [
      {
        description: 'Esta vespa está zumbindo erros! Ela esqueceu de fechar as aspas no final do texto. Corrija o comando print abaixo.',
        problem: 'print("Ola Mundo)',
        solution: 'print("Ola Mundo")',
        expectedOutput: 'Ola Mundo',
        hint: 'Todo texto iniciado com " deve terminar com " !'
      }
    ]
  },
  {
    id: 'type_goblin',
    name: 'Goblin de Tipo',
    level: 1,
    hp: 100,
    xpReward: 60,
    goldReward: 20,
    stages: [
      {
        description: 'O Goblin misturou tipos! No Python, você não pode somar um Número com uma String (texto entre aspas). Remova as aspas do número 20.',
        problem: 'print(10 + "20")',
        solution: 'print(10 + 20)',
        expectedOutput: '30',
        hint: 'Remova as aspas do "20" para que o Python trate como um número real.'
      }
    ]
  },
  {
    id: 'name_bat',
    name: 'Morcego de Nome',
    level: 1,
    hp: 80,
    xpReward: 50,
    goldReward: 15,
    stages: [
      {
        description: 'O Morcego está tentando usar uma variável que ainda não existe! Você precisa CRIAR a variável "mana" com o valor 100 ANTES de imprimir.',
        problem: 'print(mana)',
        solution: 'mana = 100\nprint(mana)',
        expectedOutput: '100',
        hint: 'Digite: mana = 100 (na primeira linha) e print(mana) (na segunda).'
      }
    ]
  },
  {
    id: 'print_ghost',
    name: 'Fantasma de Print',
    level: 1,
    hp: 70,
    xpReward: 45,
    goldReward: 12,
    stages: [
      {
        description: 'O Fantasma escreveu o comando print de forma errada (priint). Corrija o nome da função para o código funcionar.',
        problem: 'priint("Buu!")',
        solution: 'print("Buu!")',
        expectedOutput: 'Buu!',
        hint: 'O nome correto da função é: print'
      }
    ]
  }
];
