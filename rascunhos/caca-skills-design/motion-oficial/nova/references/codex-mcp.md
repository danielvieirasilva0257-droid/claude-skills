# Documentação oficial, exemplos, Motion UI, Motion+ e migração

Tradução e resumo de `codex/index.md`, da seção "Upgrading", "Tiers" e "If the Motion MCP server is unavailable" do `SKILL.md` e de `transition-preview/` da skill oficial (`motion-ai` 14.1.0, MIT). Mais o teste feito aqui em 09/10/2026.

## 1. Servidores

| Servidor | Conta | Ferramentas |
|---|---|---|
| **motion** (`https://mcp.motion.dev`, HTTP) | nenhuma | `search-motion-docs` (e, segundo a doc, `generate-css-easing`) |
| **Motion+** | conta com assinatura Motion+ | `search-motion-source`, `save-transition`, `open-transition-editor`, recurso `motion://skills/performance-audit` |

- Registrar no Claude Code: `claude mcp add --transport http motion https://mcp.motion.dev`. Em outro projeto, `npx motion-ai` instala a skill e configura os servidores.
- **Testado em 09/10/2026** (JSON-RPC direto): o servidor responde deste container, não pede sessão e expõe **só `search-motion-docs`**. O `generate-css-easing` não apareceu.
- **Sem servidor:** este `SKILL.md` e `references/` funcionam sozinhos. A documentação inteira está indexada em `https://motion.dev/llms.txt`. Para o resto, diga que o servidor não está conectado e indique https://motion.dev/docs/ai-kit.
- **Antes de prometer código-fonte, confira se você tem `search-motion-source`.** Se não tem, diga isso.

## 2. Buscar antes de construir

Chame a busca **antes** de qualquer animação não trivial: arrasto, sliders, reveals, gestos, scroll, layout, `useTransform`, carrossel, ticker, modal. Vale ao menos conferir se já existe exemplo ou peça do Motion UI. Depois construa a partir do resultado, não de memória.

```
search-motion-docs({ platform, searchTerm })
```
- **platform:** exatamente `"js"`, `"react"` ou `"vue"`.
- **searchTerm:** o conceito ou a API (`accordion`, `useSpring`, `scroll`, `drag`, `AnimatePresence`, `stagger`, `pricing`, `hero`). Mínimo 2 letras; a busca tolera erro de digitação.
- **Busque pelo conceito, não pela palavra "animação":** `animate`, `animation`, `animated` são removidas da busca. `scroll`, `drag`, `shared layout` funcionam; `animate a component` não.

**O que volta:**
- até 3 docs (`motion://docs/{platform}/{id}`), para todos;
- até 5 exemplos (`motion://examples/{platform}/{id}`);
- Motion UI, só React (`motion://ui/react/{id}`): cada recurso traz vários arquivos (o componente, as dependências como `ui-theme` e o `motion.theme.ts`);
- as transições salvas do usuário logado, em JSON.

**Leia cada link de recurso relevante** para ter o conteúdo. Nada achado: amplie o termo e busque de novo.

## 3. Código-fonte (Motion+)

```
search-motion-source({ platform, searchTerm })
```
Só no servidor Motion+. Devolve código completo, pronto para colar; no Motion UI, todos os arquivos.

**Quando não há acesso:**
- diga o que existe e mostre a demo pública (`examples.motion.dev/...`, `motion.dev/ui/sections/...`, `motion.dev/ui/components/...`);
- **não reconstrua o código a partir da descrição**: seria pior do que escrever do zero e não seria o que foi mostrado;
- cite https://motion.dev/plus **uma vez** e siga construindo com a documentação e esta skill;
- se a pessoa já é assinante: entrar no servidor Motion+ nas configurações de MCP do editor.

Modelo de resposta:
> Os exemplos Motion+ que combinam são [nomes], com demos em [links]. O código deles exige Motion+ (https://motion.dev/plus). Se você já assina, entre no servidor MCP Motion+ nas configurações do editor.

## 4. Implementar a partir de um resultado

- Adapte cores, fontes e estilo ao projeto (Tailwind num projeto Tailwind etc.).
- Instale os pacotes citados.
- **Nunca importe de `framer-motion`.** Migre os imports existentes.
- Código que importa de **`motion-plus`** precisa dele: não substitua. Instala do registro npm privado com o token Motion+ do usuário (https://motion.dev/docs/react-motion-plus-installation; token em https://motion.dev/dashboard/tokens). **Nunca peça para colar o token no chat** (regra da casa: nunca salvar chaves).
- **Motion UI:** cole e adapte **todos** os arquivos do recurso. Não use o CLI do shadcn. Se `motion.theme.ts` já existe, preserve; só adicione se faltar. Mapeie os tokens semânticos para o design system do projeto. Preserve a estrutura da animação e o comportamento de reduced motion.
- **Transições salvas:** quando fizer sentido, prefira a transição que o usuário salvou. Com bom senso: nada de mola muito elástica num painel de bolsa.
- Depois de colar, passe a checagem "Nunca entregar" do `SKILL.md` e as regras do editor.

## 5. Migrar de versão ("upgrade", "sair do framer-motion")

1. **Leia a versão instalada primeiro** no `package.json` (`motion`, `framer-motion` ou `motion-v`). Os guias vão de uma versão para a próxima; o ponto de partida decide o que se aplica.
2. Busque `upgrade` na plataforma. React: `react/react-upgrade-guide` (tem a seção `## Framer Motion`); JS puro: `js/upgrade-guide`. Vindo do GSAP: `migrate from gsap`.
3. **Leia a página inteira e siga em ordem. Não resuma:** cada seção assume as anteriores; um resumo reordena a migração e quebra.
4. Troque `framer-motion` por `motion/react` e desinstale o `framer-motion`. Os dois nunca juntos.

Notas nossas (out/2026, da `button-animation`): da 12 à 14, as mudanças que quebram afetaram só APIs internas e a dependência opcional `@emotion/is-prop-valid` (removida na 13.0; se usada, configure `<MotionConfig isValidProp={...}>`).

## 6. Editor visual de transições (Motion+)

```
open-transition-editor({ name, property, transition })
```
Abre um editor com prévia ao vivo, curva e controles. Passe a transição **que está no código**, para abrir onde o usuário já está. `name` rotula (ex.: `"Card hover"`); `property` guia a prévia (`"transform"`, `"opacity"`). Quando o usuário aplicar, **escreva exatamente os valores devolvidos**. Só renderiza em app com MCP Apps (Cursor 2.6+); fora disso volta texto. Sem o editor: ponha a curva no arquivo e use o editor de bezier do DevTools (`molas-e-curvas.md`, seção 4). Imagens PNG de curva (`visualise-spring`, `visualise-cubic-bezier`) existem só no Motion AI Kit.
