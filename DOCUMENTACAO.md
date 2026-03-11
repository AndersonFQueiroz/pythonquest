# PYTHONQUEST — DOCUMENTAÇÃO TÉCNICA DETALHADA (Versão 1.4)

Este documento detalha o funcionamento interno e as escolhas de engenharia do jogo **PythonQuest**.

---

## 1. Engenharia de Áudio (SFX Procedural)
... (mantido) ...

---

## 7. Catálogo de Bugs e Pedagogia (Fases de Batalha)
As batalhas foram aprimoradas para um sistema de múltiplos estágios.
- **Inimigos Multi-Estágio:** Cada BUG agora possui uma lista de `stages`. Derrotar um estágio drena uma porcentagem proporcional do HP total do inimigo.
- **Editor de Código Híbrido:** O componente `CodeEditor` foi dividido em uma área de visualização (Read-only) para o erro e uma área de entrada para a solução. Isso impede que o jogador destrua o contexto do desafio.
- **UX de Desenvolvedor:** Implementado suporte a atalhos de teclado no editor:
    - `Enter`: Valida e executa o código imediatamente.
    - `Shift + Enter`: Insere uma nova linha.

---

## 8. Motor Python (Pyodide Integration)
- O motor Pyodide é inicializado de forma assíncrona.
- O jogo detecta automaticamente erros de sintaxe vs. erros de lógica (saída incorreta), fornecendo feedbacks distintos e didáticos para cada caso.

---
**Documentação atualizada pelo Gemini CLI em 10/03/2026.**
