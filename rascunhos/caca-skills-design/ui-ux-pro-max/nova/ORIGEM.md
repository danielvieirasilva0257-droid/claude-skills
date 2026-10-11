# Origem da `ui-ux-pro-max` (versão nossa, 11/10/2026)

A skill antiga era só um ponteiro para o projeto externo `nextlevelbuilder/ui-ux-pro-max-skill`. A partir de 11/10/2026 ela é uma **skill nossa**, escrita em português, que junta ideias de várias fontes ("Frankenstein", autorizado pelo Daniel). **Nenhum arquivo de terceiros foi copiado inteiro.** O que veio de cada fonte foi resumido, traduzido ou reescrito com nossas palavras, com atribuição.

O repositório `claude-skills` é **público**. Por isso: texto literal só de fontes MIT, Apache-2.0 ou CC-BY, com atribuição; das demais, só ideias e números, com a fonte citada.

## Fontes usadas

| Fonte | Versão e data | Licença | O que veio | Onde está na skill |
|---|---|---|---|---|
| Skill antiga `ui-ux-pro-max` (nossa) | `main`, 11/10/2026 | nossa | Básicos (um estilo, 3 a 5 cores, WCAG AA, 2 fontes, foco visível) e as instruções do catálogo externo | `SKILL.md` (Fontes de referência), `original/ux-ui-disign-link` |
| [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | commit `67803ea`, 11/10/2026 | MIT, © 2024 Next Level Builder | Ideias: os três controles (variação, movimento, densidade), tokens em 3 camadas, MASTER + páginas, prioridades de UX, checklist de entrega (375px, 44pt, sem emoji). Nada dos CSVs nem dos scripts | `SKILL.md` (etapas 1, 3, 4), `checklist.md` |
| [referodesign/refero_skill](https://github.com/referodesign/refero_skill) (skill `refero-design`) | v1.0.2, commit `a9b54a3`, 05/09/2026 | MIT, © 2026 Refero | Formato do brief, reference lock, regra de não tirar a média, papel dos tokens, decision ledger, papel da mídia, portão de qualidade e o `anti-ai-slop.md` (9 sinais, testes e detector), **traduzidos e adaptados**. A descrição "padrão/manda nas outras" foi descartada | `SKILL.md` (etapas 1 a 3), `anti-padroes-ia.md`, `checklist.md` (seção 7) |
| [google-labs-code/design.md](https://github.com/google-labs-code/design.md) + CLI `@google/design.md` | commit `9bf8eae`, 27/07/2026; CLI 0.4.0 testado em 11/10/2026 | Apache-2.0 | Formato do DESIGN.md (front matter YAML + seções na ordem da spec), comandos `lint` e `export`. Só o formato; o texto do modelo é nosso | `modelo-DESIGN.md`, `SKILL.md` (etapa 4) |
| [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) | commit `13be5c0`, 05/10/2026 | MIT, © 2026 VoltAgent | Fatos pontuais de 16 marcas (hex, tamanhos, pesos, raios) e o comando para baixar uma marca para dentro do projeto. Nenhum DESIGN.md copiado | `estilos-premium.md` (receita Apple e fichas), `minimalismo.md` |
| [vercel-labs/web-interface-guidelines](https://github.com/vercel-labs/web-interface-guidelines) (`command.md`), usado pela skill `web-design-guidelines` | commit `434b7f9`, 05/10/2026 | MIT, © 2025 Vercel Labs | Checklist de revisão de código de UI, **resumido em português** | `checklist.md` (seção 4) |
| [anthropics/skills](https://github.com/anthropics/skills) (`frontend-design`) | commit `dbd4588`, 09/10/2026 | Apache-2.0 | Ideias: planejar tokens, revisar o plano contra o briefing, "gaste a ousadia num lugar só", tirar um acessório, os 5 visuais típicos de IA, um momento orquestrado, regras de texto de interface. Nenhum trecho literal | `SKILL.md`, `anti-padroes-ia.md` |
| [leonxlnx/taste-skill](https://github.com/leonxlnx/taste-skill) (`design-taste-frontend`, `high-end-visual-design`, `minimalist-ui`) | commit `717446e`, 09/10/2026 | MIT, © 2026 Leonxlnx | Presets dos controles, regras de hero, nav, bento e eyebrow, trava de forma, paletas banidas, clichês de texto, variações de agência e o bisel duplo (reescrito). As proibições de Inter, Lucide e pílula **não** foram adotadas (conflitam com Apple e Samsung) | `SKILL.md`, `estilos-premium.md`, `minimalismo.md`, `anti-padroes-ia.md` |
| [emilkowalski/skills](https://github.com/emilkowalski/skills) (`apple-design`, `emil-design-eng`, `pick-ui-library`) | commit `e8a175d`, 02/10/2026 | MIT, © 2026 Emil Kowalski | Molas da Apple (amortecimento e resposta), projeção de impulso, elástico, material de vidro, preferências de acessibilidade, durações e curvas, "frequência decide se anima", lista de bibliotecas, formato Antes/Depois/Por quê | `estilos-premium.md`, `SKILL.md` (movimento, etapa 5) |
| [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | commit `c63b8dd`, 11/10/2026 | Apache-2.0 (com NOTICE) | Ideias: modos de visita, frase de cena para claro/escuro, estratégias de cor, piso de qualidade, superfícies do navegador, lista de fontes "de IA", revisão em rodadas limitadas. Nenhum trecho literal, nenhum binário | `SKILL.md`, `checklist.md`, `anti-padroes-ia.md` |
| Material 3 (tokens do [material-web](https://github.com/material-components/material-web), `v0_192`) | 2026 | Apache-2.0 | Números: escala de raios, durações, curvas `(.2,0,0,1)` e `(.4,0,.2,1)`, camadas de estado de 8 a 12%, alvo de 48dp | `SKILL.md` (forma, movimento, acessibilidade) |
| Apple Human Interface Guidelines | conferido em 11/10/2026 | © Apple (só ideias e números) | 44×44pt, 17pt/11pt, contraste 4,5:1 e 3:1, "1 ou 2 botões proeminentes", evitar pesos finos em texto pequeno, evitar movimento em interação frequente | `SKILL.md`, `estilos-premium.md` |
| Samsung One UI (developer.samsung.com/one-ui) e medidas de samsung.com via oh-my-design.kr | 2026 | © Samsung; oh-my-design sem licença (só números) | Princípios (leitura em cima, ação embaixo) e medidas da web (CTA preto, 20px, 40px, foco pontilhado) | `estilos-premium.md` (receita "tipo Samsung") |
| Practical Typography (Butterick) e Refactoring UI (Wathan e Schoger) | n/a | comerciais (só ideias) | Medida de linha, entrelinha, escala de espaço não linear, mais espaço entre grupos que dentro | `SKILL.md`, `minimalismo.md` |

## O que ficou de fora (e por quê)

- **Refero Styles (`styles.refero.design`):** os termos de uso proíbem republicar os DESIGN.md como repositório ou dataset, e o robots.txt bloqueia robôs de IA. Os relatórios internos de estudo (27 estilos premium e 20 minimalistas, no scratchpad) **não entram**: nenhum texto, nenhum link de estilo e nenhum número atribuído ao Refero. As regras gerais desta skill foram reescritas e conferidas com fontes licenciadas (awesome-design-md, HIG, Material). Do Refero entra **só a skill oficial MIT** (método) e a menção ao MCP pago como opção.
- **Cópia das skills de terceiros** (nem a `refero-design`): a descrição dela se declara "padrão" e o `npx skills` acharia mais uma skill no repositório. Fica a instrução de instalação no `SKILL.md`.
- **CSVs e scripts Python do nextlevelbuilder** (~2,5 MB, genéricos) e o binário da impeccable.
- **DESIGN.md do awesome-design-md:** só fatos pontuais e o comando para baixar no projeto.
- **awesome-design-skills (bergside):** a "premium" usa azul padrão do Tailwind com violeta; serviu de anti-exemplo.
- **uizze.sh (`ui-taste`, `ios-design`):** fonte fora do GitHub, não verificável.

## Avisos de licença MIT

Partes desta skill são adaptações de obras sob licença MIT:

- Copyright (c) 2026 Refero (refero_skill)
- Copyright (c) 2025 Vercel Labs (web-interface-guidelines)
- Copyright (c) 2026 Leonxlnx (taste-skill)
- Copyright (c) 2026 Emil Kowalski (skills)
- Copyright (c) 2026 VoltAgent (awesome-design-md)
- Copyright (c) 2024 Next Level Builder (ui-ux-pro-max-skill)

> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Das fontes Apache-2.0 (Anthropic, impeccable, Google design.md, Material) usamos só ideias, números e o formato, sem trechos literais.

## Como atualizar

Compare o commit de cada fonte com o atual (numa pasta temporária, fora do repositório):

```bash
git ls-remote https://github.com/referodesign/refero_skill HEAD
git ls-remote https://github.com/VoltAgent/awesome-design-md HEAD
git ls-remote https://github.com/vercel-labs/web-interface-guidelines HEAD
git ls-remote https://github.com/google-labs-code/design.md HEAD
npm view @google/design.md version
```

Se mudou algo importante, leia a diferença, reescreva com nossas palavras e registre no `APRENDIZADOS.md`.
