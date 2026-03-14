# 🐍 PythonQuest: O Desafio de Pythoria

![Versão](https://img.shields.io/badge/versão-1.0.0-blue)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

**PythonQuest** é um RPG educacional imersivo e gamificado, desenvolvido para ensinar a sintaxe e a lógica da linguagem Python. Através de uma jornada inspirada nos clássicos de 8-bit, os jogadores exploram um mundo corrompido por erros de código e devem usar seus conhecimentos para restaurar a ordem em Pythoria.

---

## 🎮 Funcionalidades Principais

- **Execução de Código em Tempo Real:** Graças à integração com **Pyodide (WebAssembly)**, o jogo executa scripts Python reais diretamente no navegador, fornecendo feedback instantâneo e educativo.
- **Sistema de Batalha Didático:** Enfrente inimigos inspirados em erros reais de programação (TypeError, NameError, SyntaxError). A vitória depende da sua capacidade de depurar e corrigir o código corrompido.
- **Progressão RPG Clássica:** Ganhe experiência (XP) e ouro (Gold), suba de nível para aumentar sua vida máxima e registre suas descobertas na **BugDex**.
- **Mundo Dinâmico:** Explore múltiplos mapas (Vila Inicial e Floresta das Variáveis) com sistemas de colisão, NPCs mentores, placas de sinalização e cofres trancados por desafios lógicos.
- **Interface Responsiva & PWA:** Totalmente jogável no computador (Teclado) e no celular (D-Pad virtual), com suporte para instalação como aplicativo (PWA).

---

## 🛠️ Stack Tecnológica

- **Frontend:** [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Gerenciamento de Estado:** [Zustand](https://github.com/pmndrs/zustand) (leve e performático)
- **Compilação & Build:** [Vite](https://vitejs.dev/)
- **Motor Python:** [Pyodide](https://pyodide.org/)
- **Efeitos Sonoros:** Web Audio API (Sintetização 8-bit procedural)
- **Estilização:** CSS3 Moderno com variáveis dinâmicas e design pixelado

---

## 🚀 Como Iniciar o Projeto

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/AndersonFQueiroz/pythonquest.git
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Execute em ambiente de desenvolvimento:**
    ```bash
    npm run dev
    ```
4.  **Abra no navegador:**
    Acesse `http://localhost:5173`

---

## 🗺️ Roadmap de Desenvolvimento

- [x] **Fase 1:** Setup Estrutural e Visual (Paleta de cores e Fontes).
- [x] **Fase 2:** Engine de Mapa, Câmera e Movimentação Suave.
- [x] **Fase 3:** Integração Pyodide e Sistema de Batalha por Fases.
- [x] **Fase 4:** NPCs, Diálogos Evoluídos e Narrativa Inicial.
- [ ] **Fase 5:** Sistema de Inventário, Consumíveis e Loja de Itens.
- [ ] **Fase 6:** Persistência de Dados em Nuvem (Supabase Auth).
- [ ] **Fase 7:** Novos Reinos: Cavernas das Listas e Deserto dos Condicionais.

---

## 📄 Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.

---
Desenvolvido com 🐍 e ☕ por **Anderson Queiroz** & **Equipe DemenTech**.
