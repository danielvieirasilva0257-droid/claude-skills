# Receitas prontas

Comece daqui e adapte; não reconstrua do zero. Tokens de curva definidos no `SKILL.md` (`--ease-out`, `--ease-in-out`, `--ease-drawer`).
Fontes: Emil Kowalski `animate/RECIPES.md` (MIT), traduzido e adaptado; receita de entrada e troca de ícone do cookbook de Kyle Zantos (MIT, receita atribuída a Jakub Krehel); versões em Motion escritas aqui. Para receitas prontas de botão com Tailwind, veja também a skill `button-animation`.

## Clique (qualquer coisa pressionável)

```css
.button { transition: transform 160ms var(--ease-out); }
.button:active { transform: scale(0.97); }
```
`scale()` leva junto o texto e os ícones: é isso que faz parecer um toque físico. Fique entre 0,95 e 0,98. `:active` é toque real no celular, não precisa de trava de hover. Some `touch-action: manipulation`.

Em Motion (melhor quando tocam rápido várias vezes): `<motion.button whileTap={{ scale: 0.97 }} transition={{ type: "spring", visualDuration: 0.15, bounce: 0 }} />`.

## Dropdown, popover, menu, select

```css
.popover {
  transform-origin: var(--transform-origin); /* o Base UI fornece */
  transition: opacity 200ms var(--ease-out), transform 200ms var(--ease-out);
}
.popover[data-starting-style],
.popover[data-ending-style] { opacity: 0; transform: scale(0.95); }
```
A origem é o ponto central: o painel tem de parecer sair do que foi clicado (regra 4 do editor).

## Tooltip

```css
.tooltip {
  transform-origin: var(--transform-origin);
  transition: transform 125ms var(--ease-out), opacity 125ms var(--ease-out);
}
.tooltip[data-starting-style],
.tooltip[data-ending-style] { opacity: 0; transform: scale(0.97); }
/* Depois que um tooltip abriu, os vizinhos abrem na hora */
.tooltip[data-instant] { transition-duration: 0ms; }
```
O atraso inicial evita abrir sem querer. Depois disso, pular atraso e animação deixa a barra inteira mais rápida.

## Modal

```css
.modal {
  transform-origin: center; /* exceção: não está preso a um gatilho */
  transition: opacity 250ms var(--ease-out), transform 250ms var(--ease-out);
}
.modal[data-starting-style],
.modal[data-ending-style] { opacity: 0; transform: scale(0.96); }
.backdrop { transition: opacity 250ms var(--ease-out); }
```
O fundo anima junto, com a mesma curva e duração (regra dos pares). Sem `@starting-style`, use um atributo `data-mounted` ligado num `useEffect`.

## Gaveta (sheet)

```css
.drawer { transform: translateY(0); transition: transform 500ms var(--ease-drawer); }
.drawer[data-closed] { transform: translateY(100%); }
```
É assim que o Vaul esconde a gaveta antes de animar. A curva tem um começo muito íngreme: por isso 500 ms não parecem lentos. Com arrasto, vira problema de gesto (`gestos.md`).

## Toast

```css
.toast {
  opacity: 1; transform: translateY(0);
  transition: opacity 400ms ease, transform 400ms ease;
  @starting-style { opacity: 0; transform: translateY(100%); }
}
```
`ease` e um pouco mais lento que a UI comum: é a personalidade do componente (Sonner). Transição, nunca keyframes (toasts chegam em sequência). Sai por onde entrou. Se o resultado tem origem na tela (copiar, salvar), **confirme no próprio botão** ("Copiado" → volta) em vez de um toast no canto.

## Acordeão

```css
.content { overflow: hidden; transition: height 200ms var(--ease-out), opacity 200ms var(--ease-out); }
```
Curto: é uma das poucas animações que custam layout a cada quadro. Meça a altura (ou use o padrão de duas divs de `api-motion.md`). O recorte do `overflow` fica na borda real do painel.

## Entrada em grupo (stagger)

Para uma lista vista de vez em quando, nunca para a lista que se rola o dia todo. Um momento com stagger por tela.

```css
.item { opacity: 0; transform: translateY(8px); animation: entrar 300ms var(--ease-out) both; }
.item:nth-child(2) { animation-delay: 50ms; }
.item:nth-child(3) { animation-delay: 100ms; }
@keyframes entrar { to { opacity: 1; transform: translateY(0); } }
```
`both` (ou `backwards`) evita piscar antes do atraso. O stagger nunca bloqueia a interação.

## Entrada com blur (para o elemento de destaque, não para tudo)

```jsx
<motion.div
  initial={{ opacity: 0, transform: "translateY(8px)", filter: "blur(4px)" }}
  animate={{ opacity: 1, transform: "translateY(0px)", filter: "blur(0px)" }}
  exit={{ opacity: 0, transform: "translateY(-4px)", filter: "blur(4px)" }}
  transition={{ type: "spring", visualDuration: 0.4, bounce: 0 }}
/>
```
A saída é mais sutil que a entrada. Blur em 3+ componentes da mesma tela vira "cara de IA". Deixe espaço em volta: o blur não pode ser cortado pelo pai.

## Troca de ícone ou rótulo no mesmo lugar (copiar → check)

```jsx
<AnimatePresence mode="wait" initial={false}>
  <motion.span
    key={copiado ? "check" : "copiar"}
    initial={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
    exit={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
    transition={{ duration: 0.1, ease: [0.23, 1, 0.32, 1] }}
  />
</AnimatePresence>
```
`mode="wait"`: o velho sai antes do novo aparecer, então nunca há texto sobre texto (regra 1). Por isso a duração é a metade do normal.

## Segurar para confirmar (ação destrutiva)

```css
.overlay { clip-path: inset(0 100% 0 0); transition: clip-path 200ms var(--ease-out); } /* soltar: rápido */
.button:active .overlay { clip-path: inset(0 0 0 0); transition: clip-path 2s linear; } /* segurar: lento */
.button:active { transform: scale(0.97); }
```
`linear` porque o preenchimento é progresso. O recorte fica dentro do botão: a borda é real.

## Indicador de aba com cor

Duplique a lista de abas, pinte a cópia com o estado ativo e recorte-a para mostrar só a aba ativa:
```css
.tabs-ativas { clip-path: inset(0 60% 0 20%); transition: clip-path 250ms var(--ease-in-out); }
```
Texto e fundo mudam juntos, porque é um elemento só sendo revelado. Alternativa em Motion: um fundo com `layoutId="aba"` atrás da aba ativa.

## Scroll reveal (só marketing)

```jsx
const ref = useRef(null)
const visto = useInView(ref, { once: true, margin: "-100px" })
<motion.section ref={ref} initial={{ opacity: 0, transform: "translateY(24px)" }}
  animate={visto ? { opacity: 1, transform: "translateY(0px)" } : undefined}
  transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }} />
```
Uma vez só (`once`). Nunca em UI usada todo dia, acima da dobra ou em todas as seções. A versão do Emil com `clip-path: inset(0 0 100% 0)` cria uma linha de corte no meio do elemento: em tela de vídeo, é proibido (regra 2); prefira esta, que entra pela borda.

## Crossfade que não assenta

```css
.conteudo { transition: filter 200ms ease, opacity 200ms ease; }
.conteudo.trocando { filter: blur(2px); opacity: 0.7; }
```
O blur funde os dois estados num só. Último recurso, abaixo de 8 px.

## Sem biblioteca (WAAPI)

```js
element.animate(
  [{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }],
  { duration: 250, fill: "forwards", easing: "cubic-bezier(0.23, 1, 0.32, 1)" }
)
```
Desempenho de CSS, interrompível, sem custo de pacote.

## Troca de tema (claro/escuro)

Desligue transições durante a troca, senão tudo anima ao mesmo tempo: `[data-trocando-tema] * { transition: none !important }`, force um reflow e tire o atributo no quadro seguinte (ou `disableTransitionOnChange` do `next-themes`). *(Blode, MIT)*
