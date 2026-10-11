# Gestos: arrastar, soltar, impulso

Fontes: Emil Kowalski `animate/RECIPES.md` e `apple-design` (MIT), Matthew Blode `ui-animation` (MIT). Traduzido e adaptado.

Regra de ouro (Emil/Apple): a interface parece viva quando o movimento **começa do valor atual na tela**, **herda a velocidade do dedo**, **projeta o impulso para frente** e **pode ser agarrado e revertido a qualquer instante**.

## Durante o arrasto
- O elemento fica **colado ao ponteiro, sem easing**. Easing só depois de soltar.
- Responda no `pointerdown`. Deixe ~10 px de folga antes de decidir a direção (horizontal ou vertical).
- Respeite o ponto onde o usuário pegou o elemento (não "pule" o centro para o dedo).
- **Pointer capture** (`setPointerCapture`) ao começar, para o arrasto continuar fora do elemento.
- **Proteção multi-toque:** `if (arrastando) return` em novos pontos de toque; trocar de dedo no meio faz o elemento pular.
- Transform direto no elemento: `el.style.transform = \`translateY(${d}px)\``. Nunca por variável CSS no pai.
- `touch-action` certo no container (ex.: `pan-y` num carrossel horizontal).
- Movimento 2D: duas molas independentes, X e Y.

## Soltar: dispensar por velocidade, não só por distância

```js
const tempo = Date.now() - inicioDoArrasto.current
const velocidade = Math.abs(distancia) / tempo   // px por ms
if (Math.abs(distancia) >= LIMITE || velocidade > 0.11) dispensar()
```

## Projeção de impulso (Apple)

Para escolher o ponto de parada (snap) pelo arremesso:

```js
function projetar(velocidadeInicial /* px/s */, taxaDesaceleracao = 0.998) {
  return (velocidadeInicial / 1000) * taxaDesaceleracao / (1 - taxaDesaceleracao)
}
// destino = posicaoAtual + projetar(v); escolha o snap mais perto do destino
```

Depois passe a velocidade para a mola: o Motion aceita px/s direto na opção `velocity`.

```js
animate(valorY, snapEscolhido, { type: "spring", velocity: vY, visualDuration: 0.3, bounce: 0.2 })
```

Aqui o bounce é permitido: o gesto trouxe impulso.

## Elástico na borda (rubber-band)

Arrastar além do limite move cada vez menos. Atrito, nunca parede.

```js
function elastico(excesso, dimensao, constante = 0.55) {
  return (excesso * dimensao * constante) / (dimensao + constante * Math.abs(excesso))
}
```

## Interrupção
- Sempre anime a partir do valor **atual** (apresentado), nunca do valor "lógico" final.
- Mola para assentar, para que um arrasto interrompido mantenha a velocidade.
- O usuário pode agarrar de novo no meio do caminho: não bloqueie entrada durante a animação de retorno.

## Arrastar com Motion

```jsx
<motion.div
  drag="y"
  dragConstraints={{ top: 0, bottom: 0 }}
  dragElastic={0.2}
  onDragEnd={(e, info) => {
    if (info.offset.y > 120 || info.velocity.y > 500) fechar()
  }}
/>
```
`info.velocity` vem em px/s. Aqui `x`/`y` (não a string `transform`) são o caminho certo: o arrasto do Motion trabalha com eles. Para a física fina (snap projetado, rubber-band próprio), use `useMotionValue` + `animate` como acima. Confirme as opções atuais de `drag` no codex.
