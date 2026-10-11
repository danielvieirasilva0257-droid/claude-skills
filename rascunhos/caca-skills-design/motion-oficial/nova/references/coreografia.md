# Coreografia: várias peças, um momento

Fontes:
- Motion Lexicon (Ryan-yang125), `references/composition.md` e `review-rubric.md`. Texto sob **CC BY 4.0** (https://creativecommons.org/licenses/by/4.0/). Traduzido, resumido e adaptado aqui; mudanças: tradução, cortes e exemplos nossos.
- Ideia da "motion thesis" de Paul Bakaus (`impeccable`, Apache-2.0), reescrita com nossas palavras.
- Pesos por tipo de projeto: Kyle Zantos (`design-motion-principles`, MIT).
- Ponte para vídeo: ideias das skills oficiais do Remotion (sem licença aberta; só ideias, reescritas) e regras do Daniel (`remotion-video`).

## 1. Antes de animar uma tela inteira: a tese

Em 4 linhas, escreva:
1. **Momento focal:** qual é a única coisa que o olho deve seguir.
2. **Continuidade:** o que liga o estado de antes ao de depois (um objeto que persiste, uma borda fixa).
3. **Feedback:** como o usuário sabe que deu certo.
4. **Orçamento:** quantos movimentos cabem (normalmente 3 a 5 beats).

Uma sequência focal bem ensaiada vale mais que reveals repetidos em cada seção. "Fade e sobe", "hover levanta", parallax e scroll reveal genéricos **não são** uma tese.

## 2. Atores e beats (Lexicon)

- **Um ator principal** e **no máximo dois de apoio** por beat. Papéis: gatilho, herói, status, registro, ambiente.
- **3 a 5 beats perceptíveis** num momento normal.
- **Atraso só quando revela dependência, sequência ou um processo real.** Atraso decorativo parece hesitação.
- O apoio entra **depois** que o principal assenta.
- Stagger só num grupo limitado com origem ou ordem em comum.

**Gramática de beat** (serve para UI e para roteiro de vídeo):

| at | ator | propósito | primitiva | de → para | ms | curva |
|---|---|---|---|---|---|---|
| 0 | botão Salvar | confirmar | press | normal → pressionado | 120 | press |
| 80 | rótulo | confirmar | troca de texto | "Salvar" → "Salvo ✓" | 180 | ease-out |
| 260 | linha da lista | registrar | destaque no lugar | normal → realçada | 220 | ease-out |
| depois | ação "Desfazer" | recuperar | entrada da borda | fora → visível | 200 | enter |

Durações de referência do Lexicon: chegada de contexto novo 200–280 ms; saída 110–180 ms; stagger 30–70 ms.

## 3. Padrões prontos (Lexicon)

- **Confirmar e seguir** (salvar, publicar, copiar, enviar): o controle entra em "pendente" sem sair do lugar → um status local confirma → o registro relacionado atualiza no lugar → a próxima ação aparece quando a conclusão já é perceptível.
- **Selecionar e inspecionar** (escolher cartão, trocar de espaço): a seleção ganha foco e ênfase na hora → o objeto selecionado persiste enquanto o detalhe entra a partir do gatilho → as outras opções se acomodam como inativas.
- **Mudar no lugar** (filtro, acordeão, carrinho, validação): mantenha a âncora e as dimensões → anime o conteúdo local → stagger compacto se entrar um grupo → segure o resultado.
- **Recuperar com controle** (desfazer, tentar de novo, erro): mostre o novo estado com a causa → a ação de recuperação aparece na mesma área → desfazer pode interromper o resultado → anuncie o status em texto acessível.

**Corrida assíncrona:** se respostas podem chegar fora de ordem, cada intenção do usuário ganha um número de versão. Só a resposta com a versão atual pode mudar estado, animação ou status. Resposta velha é descartada e a animação dela é cancelada.

## 4. Peso por tipo de projeto (Kyle Zantos)

| Projeto | Peso | Na prática |
|---|---|---|
| Painel, SaaS, banco, ferramenta de trabalho | contenção (Emil) | ≤ 250 ms, sem bounce, pouca animação |
| App de consumo, produto polido | polimento (Jakub Krehel) | molas sem bounce, blur sutil, transições caprichadas |
| Marketing, landing, app infantil, **vídeo promo** | brincadeira (Jhey Tompkins) | 500–1000 ms, expo-out, momentos de encanto, bounce com motivo |

Não ignore o que o projeto já faz: se ele usa molas de 500 ms, não invente 150 ms.

## 5. Tela de app em vídeo promocional (Remotion)

Motion, CSS transitions e classes `animate-*` **não renderizam certo** dentro do Remotion (o render é quadro a quadro). Tudo é função do quadro:

```tsx
const frame = useCurrentFrame()
const { fps } = useVideoConfig()
const entrada = spring({ frame, fps, config: { stiffness: 300, damping: 26 } })   // nosso "Entra"
const x = interpolate(entrada, [0, 1], [-1200, 0])                                   // de fora do quadro
const opacidade = interpolate(frame, [0, 8], [0, 1], {
  easing: Easing.bezier(0.23, 1, 0.32, 1), extrapolateRight: "clamp",
})
```

- ms → quadros: `Math.round(ms / 1000 * fps)`. 250 ms a 30 fps ≈ 8 quadros.
- As tabelas de mola (`molas-e-curvas.md`) valem: o `spring()` do Remotion usa `{ stiffness, damping, mass }`.
- **As 4 regras do editor mandam aqui mais do que em qualquer lugar:** sem texto sobre texto, sem recorte no meio, celular por cima do texto, texto entrando da borda ou de trás do celular.
- **Tempo de leitura:** cada texto fica parado pelo menos 8–10 quadros entre o pouso e a saída.
- **Som:** o swish começa 1 quadro antes da entrada; o impacto cai no quadro de pouso.
- Revisão: rascunho em meia resolução e folhas de quadros a cada 6 quadros, procurando as 4 falhas. Código pronto (`Entra`, `Atras`, `PalavraDividida`): branch `rotina-video`, `rotina-video/src/v2/parts.tsx`.

## 6. Recriar um movimento de um vídeo de referência (método)

(Método do Blode, `ui-animation`, MIT. Os scripts dele **não** vieram: não foram revisados.)
1. Corte só a transição. Abertura e fechamento em clipes separados: quase nunca são espelhos.
2. Extraia quadros no fps da fonte (confira com `ffprobe`), nunca acima dele. Monte uma folha de contato.
3. Anote o que se mexe (posição, escala, opacidade, blur, raio, sombra) e qual propriedade lidera e qual atrasa.
4. Movimento simples: leia o tempo na folha. Movimento com mola: meça a posição quadro a quadro e ajuste uma mola (overshoot de ~120% e assentamento lento = pouca razão de amortecimento).
5. Escreva o código e grave de novo; compare as duas folhas lado a lado em câmera lenta.
