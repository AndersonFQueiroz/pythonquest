# 🐍 PythonQuest: O Desafio de Pythoria

![Versão](https://img.shields.io/badge/versão-1.2.0-blue)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

### 🌐 [Jogar Agora → pythonquest.vercel.app](https://pythonquest.vercel.app/)

**PythonQuest** é um RPG educacional imersivo e gamificado, desenvolvido para ensinar a sintaxe e a lógica da linguagem Python. Através de uma jornada inspirada nos clássicos de 8-bit, os jogadores exploram o mundo corrompido de **Pythoria** e devem usar seus conhecimentos de Python para restaurar a ordem — depurando Bugmons, enfrentando Bosses e finalmente confrontando o vírus supremo **MALWARECH**.

---

## 🎮 Funcionalidades Implementadas

- **Execução de Código em Tempo Real:** Integração com **Pyodide (WebAssembly)** — Python real rodando diretamente no navegador, com feedback instantâneo e educativo.
- **Sistema de Batalha Didático:** Enfrente 20 Bugmons e 6 Bosses únicos, cada um inspirado em erros reais de Python (TypeError, NameError, SyntaxError, IndentationError e mais). A vitória depende de corrigir o código corrompido.
- **Mundo Completo com 8 Mapas:** Vila Inicial, 5 Reinos temáticos (Variáveis, Decisões, Loops, Funções, OOP), Casa do Aprendiz e o Núcleo Abissal — cada um com design e atmosfera únicos que refletem o tema de programação do reino.
- **Narrativa com Cutscenes:** 7 cutscenes animadas com texto dinâmico, sprites animados em Canvas e trilha sonora 8-bit própria — incluindo a história de origem de MALWARECH contada em 5 fragmentos de memória.
- **Progressão RPG Completa:** XP, Gold, níveis, HP máximo crescente, BugDex (enciclopédia de inimigos), Caderno de Anotações com aulas dos mapas e inventário de consumíveis.
- **Sistema de Cofres Corrompidos:** Baús espalhados pelos reinos que exigem correção de código Python para serem abertos.
- **Mercador Glitch:** NPC itinerante que se move entre reinos a cada 3 batalhas, vendendo upgrades permanentes e consumíveis.
- **Autenticação e Save na Nuvem:** Login com e-mail via **Supabase Auth**. Progresso salvo automaticamente a cada 2 minutos e manualmente na cama da Casa do Aprendiz.
- **Interface Responsiva e PWA:** Totalmente jogável no computador (WASD + teclado) e no celular (D-Pad virtual). Instalável como aplicativo via PWA.
- **Trilha Sonora 8-bit Procedural:** Música ambiente única para cada um dos 8 mapas e trilhas de batalha (comum, boss e boss final) — tudo sintetizado pela Web Audio API, sem arquivos externos.

---

## 🗺️ Os 8 Mapas de Pythoria

| Mapa | Tema de Python | Destaque Visual |
| :--- | :--- | :--- |
| **Vila Inicial** | Introdução | Praça central, casas, jardins |
| **Floresta das Variáveis** | Variáveis e Tipos | Lagos, árvores densas, cogumelos |
| **Caverna das Decisões** | IF/ELSE/Lógica | Lava, cristais, câmaras True/False |
| **Torre das Repetições** | FOR/WHILE/BREAK | Engrenagens, tanques, tubulações |
| **Oásis das Funções** | DEF/RETURN/Escopo | Lago central, dunas, palmeiras |
| **Cidadela da OOP** | Classes e Objetos | Mármore, borda dourada, jardins nobres |
| **Casa do Aprendiz** | — | Cama (save), PC de estudos, prateleira |
| **Núcleo Abissal** | Tudo | Lava, trono de MALWARECH, opressivo |

---

## 🛠️ Stack Tecnológica

- **Frontend:** [React 19](https://reactjs.org/) + [TypeScript 5.9](https://www.typescriptlang.org/)
- **Gerenciamento de Estado:** [Zustand 5](https://github.com/pmndrs/zustand)
- **Compilação & Build:** [Vite 8](https://vitejs.dev/)
- **Motor Python (WASM):** [Pyodide 0.25](https://pyodide.org/)
- **Backend & Auth:** [Supabase](https://supabase.com/) (autenticação + banco de saves)
- **Renderização:** Canvas API (sprites animados, engine de mapa, câmera)
- **Áudio:** Web Audio API (síntese 8-bit procedural — sem arquivos de som externos)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Estilização:** CSS3 puro com variáveis dinâmicas e design pixelado

---

## 🚀 Como Iniciar o Projeto

### Pré-requisitos
- Node.js >= 20.19.0
- Conta no [Supabase](https://supabase.com/) (para save na nuvem — opcional para jogar offline)

### 1. Clone o repositório
```bash
git clone https://github.com/AndersonFQueiroz/pythonquest.git
cd pythonquest
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Copie o arquivo de exemplo e preencha com suas chaves do Supabase:
```bash
cp .env.example .env
```

Edite o `.env`:
```env
VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_aqui
```

> **Nota:** O jogo funciona sem o Supabase configurado — nesse caso, o save fica apenas local (sem sincronização na nuvem) e o login é desabilitado.

### 4. Execute em ambiente de desenvolvimento
```bash
npm run dev
```

### 5. Acesse no navegador
```
http://localhost:5173
```

---

## 🗄️ Configuração do Supabase

Para habilitar o save na nuvem, crie a seguinte tabela no seu projeto Supabase:

```sql
create table saves (
  user_id uuid primary key references auth.users(id),
  state jsonb not null,
  updated_at timestamptz default now()
);

alter table saves enable row level security;

create policy "Users can manage their own save"
  on saves for all
  using (auth.uid() = user_id);
```

---

## 📦 Dependências Principais

```json
{
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "zustand": "^5.0.11",
    "@supabase/supabase-js": "^2.99.0",
    "lucide-react": "^0.577.0"
  },
  "devDependencies": {
    "vite": "^8.0.0-beta.13",
    "typescript": "~5.9.3",
    "@vitejs/plugin-react": "^5.1.1"
  }
}
```

> **Pyodide** é carregado via CDN no `index.html` (`cdn.jsdelivr.net/pyodide/v0.25.0`) e não precisa ser instalado via npm.

---

## 🗺️ Roadmap de Desenvolvimento

- [x] **Fase 1:** Setup Estrutural e Visual (Paleta de cores e Fontes).
- [x] **Fase 2:** Engine de Mapa, Câmera e Movimentação Suave.
- [x] **Fase 3:** Integração Pyodide e Sistema de Batalha por Fases.
- [x] **Fase 4:** NPCs, Diálogos Evoluídos e Narrativa Inicial.
- [x] **Fase 5:** Sistema de Inventário, Consumíveis e Loja (Mercador Glitch).
- [x] **Fase 6:** Persistência de Dados em Nuvem (Supabase Auth + Save automático).
- [x] **Fase 7:** Todos os 5 Reinos + Boss Final + Cutscenes completas.
- [x] **Fase 8:** BugDex, Caderno de Anotações, Casa do Aprendiz, redesign completo dos mapas.
- [ ] **Fase 9:** Sistema de conquistas e rankings entre jogadores.
- [ ] **Fase 10:** Modo Professor — painel de acompanhamento de turmas.

---

## 🎓 Conteúdo Educacional Coberto

| Reino | Conceitos Ensinados |
| :--- | :--- |
| **R1 - Variáveis** | Tipos de dados, atribuição, nomenclatura, `str()`, `print()` |
| **R2 - Decisões** | `if`, `else`, `elif`, `==`, `!=`, `and`, `or`, `not` |
| **R3 - Repetições** | `for`, `while`, `range()`, `break`, acumuladores |
| **R4 - Funções** | `def`, `return`, parâmetros, escopo, recursão |
| **R5 - OOP** | `class`, `__init__`, `self`, métodos, instanciação |
| **Boss Final** | Dicionários, módulo `%`, lógica aninhada, tudo integrado |

---

## 📄 Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.

---

Desenvolvido com 🐍 e ☕ por **Anderson Queiroz** & **Equipe DemenTech**.
