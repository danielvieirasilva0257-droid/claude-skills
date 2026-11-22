# Aprendizados: button-animation

Adendos datados. O mais novo fica embaixo. A skill original continua no `SKILL.md`.

## 09/10/2026: Motion 14 (ex-Framer Motion)

- **Versão:** a versão estável atual é a **`motion@14.0.0`**. O import correto é **`motion/react`**, e o `framer-motion` não deve ser usado nem ficar instalado junto. Pesquisa completa: `research_notes/Framer Motion 2026/notas.md`.
- **Teste:** os assets desta skill (`compose.tsx` e `compose-demo.tsx`) passam no TypeScript estrito com Motion 14 e React 18, só trocando o import.
- **Bug no `assets/compose.tsx`:** o `{"\n"}` da linha ~369 virou uma quebra de linha real, herdada do `skills/design/button-animation/original/GRADIENT-BUTTON.txt` original, e o arquivo não compila. A correção é `{"\n"}`. Ela entra na atualização da skill, se o usuário aprovar.
- **Skill oficial:** existe a `/motion` (MIT), instalada com `npx motion-ai`, mais o MCP grátis `https://mcp.motion.dev`. Ela é útil como consulta de boas práticas e da documentação atualizada.

## 09/10/2026: skill oficial do Motion adicionada

- A skill oficial do Motion está em `skills/design/motion-oficial/`. Para animar com Motion, leia primeiro o `best-practices/` dela e depois as receitas desta skill.

## 09/10/2026: atualização aplicada (aprovada pelo usuário)

- O `SKILL.md` foi atualizado para o Motion 14 (instalação, imports, molas com `visualDuration` e `bounce`, boas práticas oficiais e recursos novos).
- O `assets/compose.tsx` agora importa de `motion/react`, e o erro da quebra de linha foi corrigido: `{"\n"}` voltou a ser um texto válido.
- Os dois componentes (`compose.tsx` e `compose-demo.tsx`) foram testados no TypeScript estrito com `motion@14.0.0` e React 18, e passam sem erros.

## 09/10/2026: receitas usadas em vídeo (Rotina v2, Remotion)

- **Anel de gradiente girando (receita 2):** um `conic-gradient` girando atrás do botão "BAIXE AGORA", com `rotate = quadro × 6°`. Acelera no golpe final.
- **Toque (receita 1):** escala 1 → 0,94 → 1 com uma mola no quadro da palavra "agora", mais uma ondulação (círculo crescendo e sumindo).
- **Botão deslizante "Fixa | Pontual":** a mola do destaque deslizante, convertida para o Remotion como `spring({stiffness: 650, damping: 40, mass: 0.5})`. Desliza em ~8 quadros, sem passar do ponto.

## 11/10/2026: skill reescrita (caça de skills, aprovada pelo Daniel)

- O `SKILL.md` foi reescrito com as pesquisas da caça de skills (Emil Kowalski, Jakub Krehel, Vercel, Magic UI, Motion Primitives, Animata e Material 3). Fontes e licenças em `ORIGEM.md` e `LICENCAS-TERCEIROS.txt`.
- Corrigidos: `transition-all` na receita principal e o botão desligado encolhendo no toque. Padrão novo: toque sem quique (bounce 0); quique só em app divertido.
- Novos componentes testados (`tsc --strict`, motion 14): `assets/status-button.tsx` e `assets/hold-to-confirm.tsx`.
- Pesquisas e transcrição completas: `research_notes/Caça de skills 2026-10/button-animation/`.

## 12/10/2026: valores usados nas telas do Rotina v3

- Toque 1 → 0,96 → 1 com ondulação no ponto; check desenhado; "Salvar séries → Salvando… → ✓ Séries salvas" em sequência (12 quadros no "Salvando…"); seletor "Fixa | Pontual" com mola 650/40/0,5; botão "LINK NA BIO" que afunda (receita 12) no lugar do anel girando.
- Tudo preso a palavras da voz (`voz.json`). Código: `src/v3/Tela.tsx` na branch `rotina-video`.

## 20/11/2026: App Barbeiros (React Native com Reanimated 4)

- Receitas usadas no app inteiro: botão 3D com lábio (`DuoButton`), status-button ("Salvar → Salvando… → ✓ Salvo", tremida de 4 px no erro), hold-to-confirm (2 s linear, solta em 200 ms) e o botão de conquista "pulo com dinheiro" (só em fechar o caixa e metas). Convertidas de CSS para `withTiming`/`withSpring` com `Easing.bezier`, sem perder os valores.
- **No escuro, a face do botão precisa ser opaca:** com face translúcida (branco 6%) sobre o lábio vermelho, o vermelho aparecia através e o texto sumia ("Cancelar na loja"). Use uma cor opaca equivalente (`#141415` sobre fundo `#050506`).
- "Reduzir movimento": botão afunda sem mola e a conquista vira só troca de cor de 150 ms.
