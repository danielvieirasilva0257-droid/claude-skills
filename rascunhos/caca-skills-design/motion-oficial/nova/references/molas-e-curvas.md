# Molas e curvas: os números

Regra de uso: **os tokens do projeto vêm primeiro.** Estes números são para quando o projeto não tem os seus. Não invente valores "de cabeça": pegue daqui, de https://easing.dev ou https://easings.co.

## 1. Curvas cubic-bezier

| Nome | Valor | Uso | Fonte |
|---|---|---|---|
| ease-out forte | `0.23, 1, 0.32, 1` | entrada e saída de UI (padrão) | Emil, MIT |
| enter | `0.22, 1, 0.36, 1` | entradas, hover com transform | Blode, MIT |
| move | `0.25, 1, 0.5, 1` | slides, painéis | Blode, MIT |
| ease-in-out forte | `0.77, 0, 0.175, 1` | mover na tela | Emil, MIT |
| on-screen | `0.645, 0.045, 0.355, 1` | vai e volta sem sair da tela | Blode, MIT |
| drawer (iOS) | `0.32, 0.72, 0, 1` | gaveta, sheet (até 500 ms) | Emil/Ionic, MIT |
| expo out | `0.19, 1, 0.22, 1` | revelação dramática, card hover, texto | Blode, MIT |
| expo out (vídeo) | `0.16, 1, 0.3, 1` | chegada focal em marketing/vídeo (500–800 ms) | já usada na `remotion-video`; também no impeccable |
| press | `0.25, 0.46, 0.45, 0.94` | resposta de clique | Blode, MIT |
| M3 standard | `0.2, 0, 0, 1` | alternativa Material | Material 3, Apache-2.0 |
| M3 emphasized-decelerate | `0.05, 0.7, 0.1, 1` | entrada enfática | Material 3, Apache-2.0 |
| M3 emphasized-accelerate | `0.3, 0, 0.8, 0.15` | saída enfática (só saída!) | Material 3, Apache-2.0 |

Curvas nomeadas do CSS, como referência (skill oficial, MIT): `ease` = `0.25, 0.1, 0.25, 1`; `easeIn` = `0.42, 0, 1, 1`; `easeOut` = `0, 0, 0.58, 1`; `easeInOut` = `0.42, 0, 0.58, 1`. São fracas para UI caprichada.

No Motion: `ease: [0.23, 1, 0.32, 1]`. No Remotion: `Easing.bezier(0.23, 1, 0.32, 1)`.

## 2. Molas no Motion

Duas formas de escrever:

```js
{ type: "spring", visualDuration: 0.3, bounce: 0.2 } // perceptual: fácil de pensar (preferida)
{ type: "spring", stiffness: 500, damping: 40, mass: 1 } // física: mais controle
```

- `visualDuration` é quanto o movimento **parece** durar; a mola ainda assenta um pouco depois. O Emil escreve `duration` no lugar; prefira `visualDuration`, que é o da documentação oficial.
- `bounce: 0` = amortecimento crítico (não passa do ponto). Faixa útil: 0,1–0,3.
- Mola que parece "estranha" quase sempre se resolve **aumentando o damping**.

### Presets (Blode, MIT)

| Preset | stiffness | damping | Uso |
|---|---|---|---|
| Snappy (padrão) | 500 | 40 | UI em geral, sem bounce |
| Stiff | 700 | 50 | movimentos pequenos e precisos |
| Gentle | 200 | 30 | transição de página, elementos grandes |
| Bouncy | 300 | 20 | lúdico, notificações |

### Mola assimétrica (abrir ≠ fechar) (Blode, MIT, medido quadro a quadro)

| Direção | stiffness | damping | razão de amortecimento |
|---|---|---|---|
| Abrir | 155 | 11 | ~0,44 (passa do ponto) |
| Fechar | 620 | 36 | ~0,75 (assenta) |

Se o elemento merece bounce, o bounce é da abertura; o fechamento sai rápido e amortecido. Nunca use a mesma curva invertida para fechar.

### Molas no padrão Apple (via Emil `apple-design`, MIT)

| Interação | damping ratio | response (s) | No Motion (aprox.) |
|---|---|---|---|
| Mover, reposicionar | 1,0 | 0,4 | `visualDuration: 0.4, bounce: 0` |
| Rotação | 0,8 | 0,4 | `visualDuration: 0.4, bounce: 0.2` |
| Gaveta / sheet | 0,8 | 0,3 | `visualDuration: 0.3, bounce: 0.2` |

Mapeamento aproximado: `bounce ≈ 1 − damping ratio`, `visualDuration ≈ response`. Comece em 1,0 (sem bounce); só ponha bounce quando o gesto trouxe impulso.

### Molas do Material 3 (Apache-2.0; convertidas aqui)

O M3 dá razão de amortecimento e stiffness com massa 1. Conversão para o `damping` do Motion: `damping = razão × 2 × √stiffness`.

| Token | stiffness | razão | Motion `{ stiffness, damping }` |
|---|---|---|---|
| fast-spatial | 1400 | 0,9 | 1400 / 67 |
| default-spatial | 700 | 0,9 | 700 / 48 |
| slow-spatial | 300 | 0,9 | 300 / 31 |
| fast-effects | 3800 | 1,0 | 3800 / 123 |
| default-effects | 1600 | 1,0 | 1600 / 80 |
| slow-effects | 800 | 1,0 | 800 / 57 |

Lição: molas **espaciais** (posição, escala) podem passar um pouquinho do ponto; molas de **efeito** (opacidade, cor) nunca.

### Molas que já usamos

- `button-animation`: 620/36 e 650/40 (popover e botões).
- `remotion-video` (vídeo, em quadros a 30 fps): `Entra` 300/26 (pousa em 7 quadros), `Atras` 170/20 (9 quadros), `PalavraDividida` 320/38 (sem passar do ponto).

## 3. Molas e quiques em CSS (`linear()`)

Molas não existem nativamente no CSS. O Motion aproxima amostrando a curva numa função `linear()`. (Seção baseada em `css-spring/` da skill oficial, MIT.)

### Com o servidor MCP

```
generate-css-easing({ kind, duration, bounce })
```
- **kind:** `"spring"` (padrão, assentamento de mola) ou `"bounce"` (bola caindo no chão).
- **duration (s):** a duração **perceptual**. Padrão 0,4 para mola e 1 para bounce.
- **bounce (0 a 1):** quanto a mola passa do ponto. Padrão 0,2. Com `kind: "bounce"`, este parâmetro é ignorado; só a duração muda a sensação.

Cuidado com a palavra: `"bounce"` como **kind** é a bola quicando; `bounce` como **parâmetro** é a elasticidade da mola.

O resultado é a metade `<duração> <curva>` de uma transição: `transition: transform <resultado>;`. Para mola, a duração devolvida é **maior** que a pedida (inclui o assentamento). Sincronize os irmãos pela duração **pedida**:

```css
/* generate-css-easing({ kind: "spring", duration: 0.2, bounce: 0.3 }) */
transition:
  opacity 0.2s linear,
  transform 0.35s linear(0, 0.28, 0.78, 1.04, ...);
```

Teste de 09/10/2026: o servidor `https://mcp.motion.dev` só expôs `search-motion-docs`; o `generate-css-easing` não apareceu. Sem ele, gere os pontos com `spring()` do próprio Motion (amostrando a curva em JS) ou use as curvas da seção 1.

### Escolher valores
- Rápido: ~0,2 s. Normal: 0,3–0,4 s. Pesado: ~1 s.
- Quique: 1 s parece gravidade normal; mais curto, mais pesado; mais longo, mais leve.
- Combine com o produto: bolsa de valores não passa do ponto.

### Cuidados (ideias de Josh Comeau, reescritas)
- Uns 50 pontos convencem; uns 11 ficam robóticos.
- Ponha a mola em `@media (prefers-reduced-motion: no-preference)`.
- Fallback para navegador antigo: `@supports (animation-timing-function: linear(0, 1))` trocando uma variável CSS.
- `linear()` **não carrega velocidade** numa interrupção. Dentro do Motion, use a mola de verdade (`{ type: "spring", visualDuration: 0.4, bounce: 0.2 }`), não a curva amostrada.

## 4. Visualizar a curva

Números descrevem mal uma sensação. Quando o usuário está ajustando a **sensação**, mostre a curva:
- ponha a `cubic-bezier()` ou `linear()` no arquivo e abra no navegador; o editor de bezier do DevTools (Chrome, Firefox) ajusta ao vivo; depois copie o valor para o código, porque a edição no DevTools some ao navegar;
- o editor visual do Motion (`open-transition-editor`) é Motion+ e precisa de um app que renderize MCP Apps (Cursor 2.6+). Quando o usuário aplicar, **escreva exatamente os valores devolvidos**, sem arredondar.
