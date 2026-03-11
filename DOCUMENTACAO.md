# PYTHONQUEST — DOCUMENTAÇÃO TÉCNICA DETALHADA (Versão 1.5)

Este documento detalha o funcionamento interno e as escolhas de engenharia do jogo **PythonQuest**.

---

## 9. Sistema de NPCs e Diálogos (Storytelling)
Implementado um motor de diálogos para guiar o jogador e fornecer contexto narrativo.

### Características Técnicas:
- **Estrutura Baseada em Dados:** NPCs são definidos diretamente na matriz do mapa com propriedades de `tileX`, `tileY` e um array de strings `dialog`.
- **Componente DialogBox:**
    - **Efeito Typewriter:** Texto renderizado caractere por caractere (30ms de intervalo) para simular consoles clássicos.
    - **Páginas de Diálogo:** Suporte a múltiplas mensagens sequenciais.
    - **Interatividade:** O diálogo pode ser acelerado ou avançado através de cliques ou toques na caixa.
- **Lógica de Interação:**
    - O Hook `useMapEngine` calcula a posição à frente do jogador baseado na sua `direction`.
    - Se houver um NPC nessa coordenada, a função `interact()` retorna os dados do personagem para o estado global.
- **Prevenção de Conflitos:** Batalhas aleatórias são desabilitadas automaticamente enquanto um diálogo está ativo para evitar interrupções na narrativa.

---
**Documentação atualizada pelo Gemini CLI em 10/03/2026.**
