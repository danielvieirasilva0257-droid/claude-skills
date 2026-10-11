# API do Motion: regras por plataforma e armadilhas

Seções 1 a 6: tradução e reorganização de `best-practices/` da skill oficial (`motion-ai` 14.1.0, Matt Perry, MIT). Seção 7: armadilhas de Raphael Salaja (`userinterface-wiki`, MIT) e Matthew Blode (`ui-animation`, MIT). Confirme sintaxe nova na documentação (`codex-mcp.md`) antes de usar.

## 1. Regras de todas as plataformas

### Velocidade dentro de funções que rodam a cada quadro
Em callbacks de rAF, `useTransform`, movimento do ponteiro, `onUpdate`, `frame.render` etc.:
- não crie objetos; prefira mutar quando for seguro;
- prefira `for` a `forEach`/`map`, a menos que a função possa ser criada uma vez fora;
- evite `Object.entries` e `Object.values`.

### `transform` versus transforms independentes

```js
animate(element, { transform: "scale(2)" })  // preferido: roda via WAAPI
animate(element, { scale: 2 })
```
```jsx
<motion.div animate={{ transform: "scale(2)" }} />
<motion.div animate={{ scale: 2 }} />
```

Prefira `transform`. Use `x`, `y`, `scale` etc. quando:
- os transforms têm configurações de transição diferentes;
- algum transform vem como MotionValue (passar `transform` como MotionValue também desliga o WAAPI, então aí não há ganho);
- os transforms são definidos pelo `style`;
- há transforms que competem ou se compõem:

```js
animate(element, { x: 100 })
hover(() => {
  animate(element, { scale: 1.2 })
  return () => animate(element, { scale: 1 })
})
```
```jsx
<motion.div animate={{ x: 100 }} whileHover={{ scale: 1.2 }} />
```

Motivo prático (Emil, MIT): os atalhos `x/y/scale` rodam em `requestAnimationFrame` e perdem quadros quando o movimento coincide com navegação, carregamento ou hidratação. CSS e WAAPI continuam lisos.

### `will-change`
Com CSS `transition` ou com os transforms independentes do Motion, ponha `will-change` nas propriedades animadas para promover o elemento a uma camada própria. Com moderação, e tire ao terminar. Com CSS `animation` ou Motion via `transform`, não precisa: o navegador promove sozinho. Prefira `willChange` a `transform: translateZ(0)`.

### MotionValues
- **Nunca** `motionValue.onChange(fn)`. Sempre `motionValue.on("change", fn)`.

## 2. React (`motion/react`)

O Framer Motion agora se chama Motion for React; todo conhecimento de Framer Motion vale.

**Imports**
- **Nunca** importe de `framer-motion`. Troque os imports antigos e desinstale o pacote.
- Componentes de cliente (`"use client"`): `motion/react`.
- Server components: `import * as motion from "motion/react-client"`.
- A função `animate`: de `motion/react` em arquivos React; de `motion` nos outros.

**MotionValues**
- **Nunca** leia um MotionValue no render. Só em efeitos e callbacks.
  - Certo: `useTransform(() => value.get())`
  - Errado: `propName={value.get()}`

**Padrões**
- Encadeie `useTransform`, `useSpring`, `useMotionValue` e `useVelocity` em vez de lógica imperativa complexa.
- Para animar MotionValues: use `animate()` no valor de origem. Não use a prop `transition` quando os valores vêm de MotionValues pelo `style`. Valores derivados (`useTransform`, `useSpring`) seguem a origem sozinhos.

**`useTransform`**
1. `useTransform(valor, faixaEntrada, faixaSaída, opções)`: preferida.
2. `useTransform(() => outroValor.get() * 2)`: forma de função.
- **Obsoleta (nunca use):** `useTransform(valor, (v) => novo)`.

**Radix**
- Anime com `asChild` + um filho `motion` (`motion.div`, `motion.li`).
- Para saída ou layout, traga o estado do Radix para `useState` (`open`/`onOpenChange`, `value`/`onValueChange`).
- Renderize o componente Radix condicionalmente como filho de `AnimatePresence`.
- O componente que aceita `forceMount` é o que vai dentro do `AnimatePresence`, com `forceMount` ligado.
- `forceMount` só em componentes Radix, nunca em elementos do DOM.
- Origem do popover: `--radix-popover-content-transform-origin` (e equivalentes por componente).

## 3. Base UI

Passe um componente `motion` pela prop `render`:

```jsx
<Menu.Popup render={<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} />}>
```

Não use a forma de função/spread de props: dá erro de tipo.

**Saída, caso comum:** `AnimatePresence` + `exit` como sempre.

**Componentes que controlam a própria montagem** (`ContextMenu`, `Popover`):
1. Traga o estado para `useState` e passe `open`/`onOpenChange` ao `Root`.
2. Ponha `keepMounted` no `Portal` e envolva com `AnimatePresence`.
3. Ponha a saída no `motion` da prop `render`.

```jsx
function App() {
  const [open, setOpen] = useState(false)
  return (
    <ContextMenu.Root open={open} onOpenChange={setOpen}>
      <ContextMenu.Trigger>Open menu</ContextMenu.Trigger>
      <AnimatePresence>
        {open && (
          <ContextMenu.Portal keepMounted>
            <ContextMenu.Positioner>
              <ContextMenu.Popup
                render={
                  <motion.div
                    style={{ transformOrigin: "var(--transform-origin)" }}
                    initial={{ opacity: 0, transform: "scale(0.95)" }}
                    animate={{ opacity: 1, transform: "scale(1)" }}
                    exit={{ opacity: 0, transform: "scale(0.95)" }}
                    transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
                  />
                }
              >
                {/* filhos */}
              </ContextMenu.Popup>
            </ContextMenu.Positioner>
          </ContextMenu.Portal>
        )}
      </AnimatePresence>
    </ContextMenu.Root>
  )
}
```

O `Portal` fica montado enquanto o Base UI detecta animações via `element.getAnimations()`. O Motion roda `opacity`, `transform`, `filter` e `clipPath` por aceleração de hardware: use pelo menos um deles na saída.
(Ajuste nosso ao exemplo oficial: escala 0,95 em vez de 0,9, origem no gatilho e duração/curva das tabelas.)

## 4. Vue (`motion-v`)

- Importe só de `motion-v`: `import { motion, useMotionValue } from 'motion-v'`.
- Não leia MotionValue direto no template; use `watch` ou callbacks.
- `ref`/`reactive` para estado; `:style` para estilos dinâmicos.
- Encadeie `useTransform`, `useSpring`, `useMotionValue`, `useVelocity` em vez de condicionais complexas.
- Mesmas regras de MotionValue do React (animar a origem; sem `transition` quando o valor vem pelo `:style`).
- `useTransform`: as mesmas duas formas do React.
- Saída e layout: `v-if`/`v-show` com `AnimatePresence`.

## 5. JS puro / HTML / TypeScript (`motion`)

- Importe de `motion`, nunca de `framer-motion`.
- `animate` tem três formas:
  1. `animate(motionValue, alvo, opções)`
  2. `animate(origem, alvo, opções)` com `onUpdate` nas opções
  3. `animate(elementoOuObjeto, valores, opções)`
- Para parar um MotionValue, use `value.stop()`; não guarde a animação numa variável. Uma animação nova no mesmo valor cancela a anterior.
- Easing em camelCase: `easeOut`, `easeInOut`, `circOut`. Ou array: `[0.23, 1, 0.32, 1]`.

## 6. Sequências e stagger no Motion

Para várias peças em ordem, use uma sequência com posição relativa em vez de somar `delay` (ideia vinda da timeline do GSAP):

```js
import { animate, stagger } from "motion"

animate([
  [".card", { opacity: [0, 1], transform: ["translateY(8px)", "none"] }, { duration: 0.25 }],
  [".card li", { opacity: [0, 1] }, { delay: stagger(0.04), at: "-0.1" }],
])
```

Em React com variants, o pai controla o ritmo dos filhos (`delayChildren`, `staggerChildren` ou `delayChildren: stagger(…)`, conforme a versão). **Confirme a sintaxe exata no codex** antes de escrever.

## 7. Armadilhas (Salaja e Blode, MIT)

**Saída e presença (`AnimatePresence`)**
- **Saída que não toca:** falta `key`, ou o `AnimatePresence` está dentro do condicional. Confira isso primeiro.
  ```jsx
  // errado
  {open && <AnimatePresence><motion.div exit={{ opacity: 0 }} /></AnimatePresence>}
  // certo
  <AnimatePresence>{open && <motion.div key="painel" exit={{ opacity: 0 }} />}</AnimatePresence>
  ```
- `key={item.id}`, nunca `key={index}`, em listas dentro de `AnimatePresence`.
- **`AnimatePresence` aninhado:** use `propagate` nos dois níveis, senão os filhos somem de uma vez quando o pai sai (confira se a sua versão tem a prop).
- **`mode="wait"` quase dobra o tempo** (sai, depois entra). Corte a duração pela metade (0,3 → 0,15).
- **`mode="popLayout"`** ao remover ou reordenar itens de lista, para os vizinhos se reacomodarem durante a saída.
- `useIsPresent()` vai no **filho**, não no pai. Enquanto sai, desligue a interação: `disabled={!isPresent}`.
- `usePresence()` + `safeToRemove`: chame só depois da limpeza (`cleanup().then(safeToRemove)`).

**Layout**
- `layout`/`layoutId` animam por escala, e isso distorce cantos: `style={{ borderRadius: 12 }}` inline em px, nunca className nem `rem`.
- Com `layoutId` não se controla a trajetória do morph; se precisar, anime o **pai**.
- Animar e medir o **mesmo** elemento cria um ciclo. Use duas divs: a de fora anima `height`, a de dentro é medida.
  ```jsx
  function Container({ children }) {
    const [ref, bounds] = useMeasure()
    return (
      <motion.div style={{ overflow: "hidden" }} animate={{ height: bounds.height > 0 ? bounds.height : "auto" }}>
        <div ref={ref}>{children}</div>
      </motion.div>
    )
  }
  ```
  O `overflow: hidden` aqui recorta na borda real do container (regra 2 do editor respeitada).
- Não anime ao mesmo tempo o container e um stagger dos filhos: escolha uma entrada por container.

**Desempenho**
- `useScroll` + `useTransform` roda na thread principal; sob carga, prefira `animation-timeline: view()`/`scroll()` em CSS quando der.
- Trava "só às vezes" (ao abrir, ao navegar, quando chega dado) é tarefa longa no mesmo tick: comece o movimento, deixe um quadro passar, depois faça o trabalho, ou adie para `onAnimationComplete`/`transitionend`.
- Reduced motion só em CSS não afeta o Motion. Use `<MotionConfig reducedMotion="user">` ou `useReducedMotion()`.
- Arrasto: transform direto no elemento arrastado; nunca por variável CSS no container.
