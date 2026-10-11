# Checklists

Use na ordem do fluxo. Atribuições: a revisão de código resume em português as **Web Interface Guidelines** da Vercel (MIT, © 2025 Vercel Labs, github.com/vercel-labs/web-interface-guidelines); o portão de qualidade adapta o "Quality Gate" da skill oficial do Refero (MIT, © 2026 Refero, github.com/referodesign/refero_skill); a revisão em 3 camadas e o piso de qualidade são ideias da impeccable (Apache-2.0) e de guias públicos, escritas por nós.

## 1. Briefing (antes de desenhar)

- [ ] O que é, para quem, em qual plataforma e qual a tarefa principal.
- [ ] O que **precisa ficar**: conteúdo, prova, ação, navegação.
- [ ] Marca existente (cores, fonte, logo) ou liberdade total.
- [ ] Modo de visita, frase de cena (claro ou escuro), arquétipo, escola de raio e personalidade de movimento, cada um justificado pelo briefing.
- [ ] Mídia real disponível (fotos, renders, screenshots) ou plano de placeholder.

## 2. Antes do código

- [ ] Trava da referência escrita (principal, preservar, emprestar, papéis, mídia, rejeitar, tokens). ✋ aprovada.
- [ ] `DESIGN.md` com papel em todo valor e decision ledger. ✋ aprovado.
- [ ] Plano revisado contra o briefing e contra `anti-padroes-ia.md`: o que parecia padrão foi trocado, com o motivo.
- [ ] `npx -y @google/design.md lint DESIGN.md` sem erro.

## 3. Revisão em 3 camadas (com prints em 375px e 1440px)

1. **Hierarquia:** a mensagem, o estado e a ação principais estão óbvios em 3 segundos?
2. **Consistência:** escala de tipo, papéis de cor, ritmo de espaço, raios e peso dos componentes seguem o `DESIGN.md`? Sem valor solto (`[#…]`, `p-[13px]`)?
3. **Estados e telas reais:** hover, foco, ativo, selecionado, desabilitado, carregando, vazio, erro, texto curto, médio e muito longo, celular com texto de tamanho real.

Compare com a referência travada em vez de pedir "melhore". Uma rodada de correção em lote, uma conferência, e pare.

## 4. Revisão de código de UI (resumo das Web Interface Guidelines, Vercel)

**Acessibilidade**
- [ ] `aria-label` em botão só com ícone; label em todo input; `alt` em toda imagem (vazio se decorativa).
- [ ] `<button>` para ação, `<a>` para navegação; títulos h1 a h6 em ordem; link "pular para o conteúdo".
- [ ] `aria-live` em aviso e validação.

**Foco**
- [ ] `:focus-visible` visível; nunca `outline: none` sem substituto; `:focus-within` em controle composto.
- [ ] Header fixo não cobre o elemento focado (`scroll-margin-top`).

**Formulários**
- [ ] `type`, `inputmode` e `autocomplete` certos; nunca bloquear colar.
- [ ] Erro ao lado do campo e foco no primeiro erro; botão de enviar ativo até a requisição começar; aviso de mudanças não salvas.

**Animação**
- [ ] `prefers-reduced-motion` respeitado; só `transform` e `opacity`; nunca `transition: all`.
- [ ] Animações interrompíveis; `transform-origin` correto; autoplay de mais de 5s com pausa.

**Tipografia e conteúdo**
- [ ] "…" em vez de "...", aspas curvas, `tabular-nums` em números, `text-wrap: balance` em títulos, espaço não separável em "10&nbsp;MB".
- [ ] `min-w-0` em filho de flex; truncar ou `line-clamp` com texto longo; estados vazios desenhados.
- [ ] Datas e números com `Intl.*` (formato brasileiro).

**Imagem e desempenho**
- [ ] `<img>` com `width` e `height` (evita pulo de layout); `loading="lazy"` abaixo da dobra; prioridade na imagem do hero.
- [ ] Listas com mais de 50 itens virtualizadas; fonte crítica com preload e `font-display: swap`; vídeo `muted loop playsinline` em vez de GIF.

**Estado, toque e tema**
- [ ] Filtros e abas refletidos na URL; ação destrutiva com confirmação ou desfazer.
- [ ] `touch-action: manipulation`; `overscroll-behavior: contain` em modal; `env(safe-area-inset-*)`.
- [ ] `color-scheme: dark` no tema escuro; `<meta name="theme-color">`.
- [ ] Superfícies do navegador com a paleta: seleção, cursor de digitação, barra de rolagem, anel de foco.

Formato do relatório de código: `arquivo:linha: problema → correção`.

## 5. Regras de composição do editor (em tela)

- [ ] Nenhum texto sobre texto nem logo sobre texto, inclusive durante transições e sob a nav de vidro.
- [ ] Nenhuma máscara ou recorte com a linha de corte no meio da tela (só bordas reais: card, mídia, janela, tela do mockup).
- [ ] Ordem no hero: fundo → texto → produto; o produto só cobre texto já lido.
- [ ] Todo texto animado entra da borda ou de trás do elemento principal; nada "brota" parado no meio da tela.
- [ ] Animação conferida em câmera lenta (DevTools → Animations, 10%).

## 6. Pré-entrega

- [ ] Prints em 375px e 1440px, claro e escuro (se houver), com movimento reduzido testado.
- [ ] Contraste: corpo ≥ 4,5:1, componentes e texto grande ≥ 3:1. Alvos ≥ 44px.
- [ ] Detector de `anti-padroes-ia.md` passado.
- [ ] Toda decisão grande está no decision ledger. Sem fonte, saiu.
- [ ] `lint` e `typecheck` do projeto passando.
- [ ] Relatório "Antes | Depois | Por quê" e aprendizados no `APRENDIZADOS.md`.

## 7. Portão de qualidade (adaptado da skill oficial do Refero)

Se alguma resposta for "não", volte e ajuste antes de entregar.

- Usei uma referência travada para o gosto visual, sem copiar uma só?
- Escolhi uma direção principal em vez de tirar a média das referências?
- Os traços marcantes da principal sobreviveram?
- Cada token e componente manteve o papel de origem (cor de CTA só no CTA etc.)?
- A mídia manteve seu papel (asset real, primitivo em código ou placeholder honesto)?
- Consigo dizer quais referências influenciaram e por quê?
- Toda escolha grande se liga a uma referência, a um pedido do Daniel ou a uma regra desta skill?
- O resultado evita os padrões genéricos de IA e cabe no produto, no público e nas restrições?
