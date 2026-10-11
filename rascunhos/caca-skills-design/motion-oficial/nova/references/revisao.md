# Revisão, auditoria e depuração

Revisão **grátis**. O MotionScore (Motion+) é opcional, no fim.
Fontes: Emil Kowalski `review-animations` (MIT); Kyle Zantos `anti-checklist.md` (MIT); ibelick `fixing-motion-performance` (MIT); Matthew Blode `debugging-symptoms.md` e `review-format.md` (MIT); rubrica do Motion Lexicon (CC BY 4.0); skill oficial do Motion (MIT) para a parte paga. Tudo traduzido e adaptado.

## 1. Postura

- **Decidido:** dê o veredito. Nunca "isso talvez seja lento".
- **Específico:** propriedade, arquivo e linha.
- **Com número:** "faz layout em ~50 elementos por quadro", não "pode ser caro".
- **Sem falso positivo:** animação em `transform` já boa não é achado. Área limpa: diga em uma linha e pare.
- Não migre nem reescreva a biblioteca de animação sem pedido. Corrija dentro do sistema que já existe.
- **A primeira correção possível é apagar a animação.**

## 2. Ordem da revisão

1. **Regras do editor** (as 4 do `SKILL.md`): texto sobre texto, recorte no meio, principal por baixo do texto, texto brotando do nada.
2. **Portão:** cada animação passa no teste de frequência e propósito?
3. **"Nunca entregar"** (tabela do `SKILL.md`).
4. **Cara de IA** (seção 3).
5. **Desempenho** (seção 4).
6. **Acessibilidade:** reduced motion (com `MotionConfig` se for Motion), hover com ponteiro fino, foco não espera animação.
7. **Interrupção:** dispare duas vezes rápido; aperte Esc no meio; desfaça. Tudo assenta num estado coerente?

## 3. Anti-checklist: "movimento feito por IA" (Kyle Zantos)

Isoladas, várias destas são aceitáveis. O problema é a **repetição**. Sinalize quando:

| Padrão | Sinalize quando |
|---|---|
| Pulso/brilho/respiração em loop em indicador ou CTA (`animate-pulse`, `infinite`) | qualquer ocorrência |
| Bounce em ação utilitária (dropdown, toggle, menu, modal) | qualquer ocorrência |
| Blur em toda entrada | ≥ 3 componentes na mesma tela |
| `hover:scale-105` em tudo | ≥ 3 componentes |
| Stagger em toda lista | ≥ 2 listas na mesma tela |
| O mesmo fade-in em tudo | ≥ 4 componentes |
| Animação ao montar em `h1`, `p`, `nav` sem gatilho do usuário | qualquer ocorrência |
| Uma duração só para tudo | sempre |

## 4. Auditoria de desempenho grátis (ibelick + Blode)

**Etapas de renderização:** composição = `transform`, `opacity` (barato); pintura = cor, borda, gradiente, máscara, sombra, filtro; layout = tamanho, posição, fluxo (caro).

**Nunca** (crítico):
- intercalar leitura e escrita de layout no mesmo quadro (`getBoundingClientRect` e depois `style.left` em loop);
- animar layout continuamente em superfícies grandes;
- animar a partir de `scrollTop`/`scrollY`/eventos de scroll;
- loop de `requestAnimationFrame` sem condição de parada;
- misturar sistemas de animação que medem ou mexem no layout.

**Medição:** meça uma vez, anime com `transform` (FLIP). Leituras todas antes das escritas.

**Scroll:** Scroll/View Timelines (`animation-timeline: view()`) quando houver; `IntersectionObserver` para visibilidade; pause o que está fora da tela. Animação ligada à rolagem: `linear` e sem duração.

**Pintura:** só em elementos pequenos e isolados. Não anime variáveis CSS usadas em transform/opacity/posição, nem variáveis herdadas (recalcula todos os filhos).

**Trocas baratas:** `box-shadow` → `filter: drop-shadow()` ou um pseudo-elemento com a sombra animando só a opacidade; `border-radius` animado → `clip-path: inset(0 round 50px)`.

**Camadas:** `will-change` temporário, cirúrgico, em poucos elementos.

**Blur:** alvo ≤ 8 px, teto 20 px; só em efeitos curtos e únicos; nunca contínuo nem em superfícies grandes.

**View Transitions:** só para navegação, não em UI muito interativa.

**Trava "só às vezes":** é tarefa longa no mesmo tick. Grave um trace de Performance e procure tarefas > 50 ms. Corrija o agendamento, não a animação.

Busca rápida no código: `transition: all`, `transition.*(width|height|top|left|margin)`, `scale(0)`, `ease-in`, `framer-motion`, `animate-pulse`, `infinite`, `onChange(`, `will-change` permanente.

## 5. Depuração por sintoma (Blode)

**Ciclo:** reproduza onde parece errado (celular, 60 Hz) → **câmera lenta** (painel Animations do DevTools a 10–25%, ou gravar e passar quadro a quadro) → classifique pela tabela → mude **uma** variável → confira em velocidade normal e de novo no dia seguinte.
Se parece **lento**, mexa primeiro na duração; se parece **robótico**, primeiro na curva.

| Sintoma | Causas, da mais provável para a menos |
|---|---|
| **Lento** | `ease-in`; curva nativa fraca; mais de ~300 ms em UI; animação em ação de alta frequência (apague); `delay` na cadeia |
| **Robótico, sem vida** | `linear` em movimento que não é constante; curva fraca; duração fixa onde devia ser mola; stagger uniforme demais (varie por importância) |
| **Barato** | entrada de `scale(0)` ou só fade; origem errada; crossfade mostrando dois estados (blur 2 px); sub-animações em relógios diferentes; saída diferente da entrada; personalidade errada para o produto |
| **Travando** | propriedade que não é transform/opacity; thread principal ocupada; `setState` a cada quadro; variável CSS herdada; blur > 20 px; só então `will-change` |
| **Pula, estala** | keyframes reiniciando (use transição/mola); `AnimatePresence` sem `key` ou dentro do condicional; `height: auto` em CSS (meça); salto de 1 px (`will-change: transform`); estado inicial chegando depois da primeira pintura (defina em CSS ou `@starting-style`) |
| **Dispara à toa, pisca** | o hover tira o elemento de baixo do cursor (mova o transform para um filho); hover no celular (trava de ponteiro fino); todos os tooltips da fileira animando (`data-instant`); reveal repetindo ao rolar (`once`) |

## 6. Formato do resultado

Tabela por achado:

| Antes | Depois | Por quê |
|---|---|---|
| `transition: all 300ms` | `transition: transform 200ms var(--ease-out), opacity 200ms var(--ease-out)` | `all` anima propriedades sem querer; 300 ms é lento para dropdown |

Depois, o veredito em camadas: **Crítico** (quebra regra do editor, acessibilidade ou desempenho) · **Importante** (sensação errada) · **Acabamento**. Termine com **Bloquear** ou **Aprovar**.

Rubrica do Lexicon para conferir no fim: clareza de estado, ator principal, continuidade espacial, tempo, hierarquia, estabilidade de layout, interrupção, desempenho, acessibilidade.

## 7. MotionScore (opcional, pago: Motion+)

Nota de S (só compositor) a F (layout forçado a cada quadro). A metodologia é conteúdo Motion+, servida pelo servidor MCP **Motion+**:

```
resources/read → motion://skills/performance-audit
```

- Leia inteira antes e siga exatamente. **Não invente uma nota MotionScore de memória.**
- Sem login: peça para entrar no servidor Motion+ nas configurações de MCP do editor. Sem assinatura: diga que é Motion+, cite https://motion.dev/plus uma vez e entregue a revisão grátis acima.
- Auditoria em execução de uma URL: `npx motionscore <url> --agent`. Estática e em execução se complementam.
