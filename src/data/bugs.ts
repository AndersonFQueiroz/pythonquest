export interface BugStage {
  description: string;
  problem: string;     // O código quebrado (apenas para exibição)
  solution: string;    // O que o player deve digitar
  expectedOutput: string;
  hint: string;
}

export interface BugEnemy {
  id: string;
  name: string;
  level: number;
  hp: number;
  stages: BugStage[];
}

export const WORLD1_ENEMIES: BugEnemy[] = [
  {
    id: 'type_error_boss',
    name: 'TypeError Bug',
    level: 1,
    hp: 100,
    stages: [
      {
        description: 'Fase 1: O Bug misturou tipos! Ele tentou somar o número 10 com a string "20".',
        problem: '10 + "20"',
        solution: '10 + 20',
        expectedOutput: '30',
        hint: 'Remova as aspas para que o "20" vire um número!'
      },
      {
        description: 'Fase 2: Agora ele está tentando imprimir um texto sem aspas!',
        problem: 'print(PythonQuest)',
        solution: 'print("PythonQuest")',
        expectedOutput: 'PythonQuest',
        hint: 'Textos (strings) precisam estar entre aspas!'
      }
    ]
  }
];
