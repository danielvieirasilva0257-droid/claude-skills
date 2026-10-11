# Aprendizados: motion-oficial

Adendos datados. O mais novo fica embaixo. O `SKILL.md` já incorpora os aprendizados até 11/10/2026.

## 09/10/2026: entrada na base

- **Para que serve:** guia de boas práticas para animar com o Motion 14 (antigo Framer Motion).
- **Com as nossas skills:** `button-animation` traz receitas prontas e testadas de botão com Tailwind; esta traz as regras e a consulta à documentação.
- **Servidor de documentação** (grátis): `https://mcp.motion.dev`, registrado pelo instalador oficial como servidor HTTP `motion`. Comando: `claude mcp add --transport http motion https://mcp.motion.dev` (ainda não registrado de forma permanente neste repositório).
- **Testado em 09/10/2026** (JSON-RPC direto): responde deste container, não pede sessão e expõe **só `search-motion-docs`**. O `generate-css-easing` não apareceu.
- **Sem o servidor:** `https://motion.dev/llms.txt` indexa toda a documentação.
- **Partes pagas (Motion+):** código-fonte de exemplos e Motion UI, auditoria MotionScore, editor visual. Diga com clareza e não reconstrua de memória.
- **Instalação em outro projeto:** `npx motion-ai`.

## 11/10/2026: skill reescrita ("Frankenstein")

- Com autorização do Daniel, a skill deixou de ser cópia intacta do oficial. Agora é um corpo único em português: oficial do Motion + Emil Kowalski + Matthew Blode + Kyle Zantos + ibelick + Raphael Salaja + Motion Lexicon + Material 3 + Vercel. Fontes e licenças em `ORIGEM.md`.
- **Conflitos resolvidos:**
  - molas com `visualDuration` (oficial), não `duration`;
  - `transform` por padrão; `x/y/scale` em transforms compostos, MotionValues e arrasto;
  - reduced motion = menos e mais suave, nunca reset global;
  - blur: alvo 8 px, teto 20 px;
  - feedback ≤ 200 ms, UI ≤ 300 ms, marketing/vídeo 500–1000 ms;
  - lento → mexa na duração primeiro; robótico → na curva primeiro;
  - `clip-path` só quando a borda do recorte é borda real (regra 2 do editor).
- **Ainda não testado na prática:** as receitas novas não passaram por checagem de tipos com `motion@14`; a prop `propagate` do `AnimatePresence` e a sintaxe de `stagger` em variants devem ser conferidas no codex antes do primeiro uso.
