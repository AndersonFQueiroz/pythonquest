# PYTHONQUEST — DOCUMENTAÇÃO TÉCNICA DETALHADA (Versão 1.6)

Este documento detalha o funcionamento interno e as escolhas de engenharia do jogo **PythonQuest**.

---

## 10. Ambientação e Decoração Procedural
Para reforçar a narrativa de um mundo corrompido, implementamos um sistema de decoração dinâmica no Canvas.

### Novas Funcionalidades Visuais:
- **Casas em Ruínas (Tiles 10 e 11):** Desenhadas com polígonos e linhas que simulam rachaduras e telhados quebrados.
- **Zonas de Corrupção (Tile 12):** Implementado um motor de animação de "Glitch Frame". Esses tiles piscam entre preto e verde escuro e geram partículas vermelhas (faíscas) para indicar perigo iminente.
- **Feedback Visual de História:** O ambiente agora reflete os diálogos da Mentora PEP-8, criando uma conexão direta entre o que o jogador lê e o que ele vê no mapa.

---
**Documentação atualizada pelo Gemini CLI em 10/03/2026.**
