---
name: combo-app-premium
description: "Combo para fazer um app mobile premium do zero (Expo + React Native + Supabase), com visual de marca, banco que calcula e IA que só interpreta: DESIGN.md e tokens (ui-ux-pro-max, estilos-premium, frontend-design), textos (combo-copy-humanizada), animação com aprovação por frames (motion-oficial, button-animation, animation-vocabulary), código RN (vercel-react-best-practices), gráficos (dataviz do Claude), IA pela API da Anthropic (claude-api do Claude), testes com prints e acessibilidade (webapp-testing, playwright-cli, web-quality/accessibility) e revisão final (review-animations, web-design-guidelines), com os pontos de aprovação do Daniel. Use quando o pedido for 'faz um app', 'app para barbeiros/salões/profissionais', 'app com assinatura', 'app com IA', 'continuar o app'."
---

# Combo: app mobile premium do zero

Este combo **não repete** o conteúdo das skills: diz qual usar em cada passo e o que já se aprendeu ao juntá-las no App Barbeiros (novembro de 2026). Abra cada skill só quando chegar ao passo dela, e o `APRENDIZADOS.md` dela logo depois.

Projeto que deu origem: `projetos/app-barbeiros/PASSO-A-PASSO.md` (código na branch `app-barbeiros`).

## Skills ligadas

| Passo | Papel | Skill | Caminho |
|---|---|---|---|
| 1 | Fluxo de design, tokens e `DESIGN.md` | ui-ux-pro-max | `skills/design/ui-ux-pro-max/SKILL.md` |
| 1 | Referência de marca premium (uma só) | estilos-premium | `skills/design/estilos-premium/SKILL.md` |
| 1 | Plano de cores, fontes e layout contra o briefing (opcional) | frontend-design | `skills/design/frontend-design/SKILL.md` |
| 2 | Textos das telas e dos avisos | combo-copy-humanizada | `skills/combos/combo-copy-humanizada/SKILL.md` |
| 3 | Como e quando animar | motion-oficial | `skills/design/motion-oficial/SKILL.md` |
| 3 | Botões (3D com lábio, status, segurar para confirmar, conquista) | button-animation | `skills/design/button-animation/SKILL.md` |
| 3 | Nomes certos dos movimentos para pedir e revisar | animation-vocabulary | `skills/design/animation-vocabulary/SKILL.md` |
| 4 | Código React rápido (re-render, bundle) aplicado ao RN | vercel-react-best-practices | `skills/sites/vercel-react-best-practices/SKILL.md` |
| 5 | Gráficos e relatórios (cores validadas, legenda, tabela) | dataviz | skill do Claude (sem pasta aqui) |
| 6 | IA do app pela API da Anthropic | claude-api | skill do Claude (sem pasta aqui) |
| 7 | Ver o app no navegador: prints, cliques, E2E | webapp-testing, playwright-cli | `skills/sites/webapp-testing/SKILL.md`, `skills/sites/playwright-cli/SKILL.md` |
| 7 | Acessibilidade (axe, WCAG 2.2 AA) | web-quality/accessibility | `skills/sites/web-quality/accessibility/SKILL.md` |
| 8 | Revisão final do movimento (tabela + veredito) | review-animations | `skills/design/review-animations/SKILL.md` |
| 8 | Revisão final da interface (arquivo:linha) | web-design-guidelines | `skills/design/web-design-guidelines/SKILL.md` |

## Passo a passo (✋ = aprovação do Daniel)

0. **Briefing e especificação:** plano de negócio, público, planos e preços, telas por plano. Escreva `ESPECIFICACAO.md` (fases com critérios de pronto e as skills de cada fase) e o `CLAUDE.md` do app com as regras que nunca mudam. Código numa branch do projeto, nunca na `main`.
1. **Visual:** `ui-ux-pro-max` (6 etapas) → `estilos-premium` (uma referência) → `DESIGN.md` com tokens, contraste conferido e tabela de componentes. Tokens num arquivo só (`src/theme/tokens.ts`); componente nunca recebe hex direto.
   - ✋ **Aprovação do `DESIGN.md`.** Se o Daniel mandar prints de referência, trave o estilo por eles (o que copiar e o que não copiar) antes de mexer em tela.
2. **Textos:** `combo-copy-humanizada` para telas vazias, avisos, bloqueios de plano e mensagens prontas. Nada de culpa, contagem falsa ou letra miúda.
3. **Animação:** `motion-oficial` + `button-animation` + `animation-vocabulary`. O que se usa dezenas de vezes por dia é rápido e sem quique; encanto só em metas e conquistas.
   - ✋ **Aprovação por frames** do botão especial (folha de quadros antes do código).
4. **Projeto e banco:** Expo (SDK atual, Router, Reanimated, TypeScript estrito) + Supabase local pelo Docker. **O banco calcula, a IA interpreta:** todo número sai de view ou função SQL; a tela só formata. RLS em tudo e testes pgTAP desde o começo, com seed de datas relativas a hoje.
5. **Telas por plano:** uma fase por plano (Grátis, Pago, Premium…), cada uma com migration, telas, testes do banco e um fluxo E2E. Telas de plano acima abrem com cadeado e prévia borrada dos dados do próprio usuário. Gráficos com a `dataviz`.
6. **IA:** `claude-api` (SDK oficial, saída estruturada validada de novo, streaming no chat). Nunca mande telefone, nome real ou pagamento: troque por "Cliente N" e volte o nome só na tela. Modo simulado (`LLM_PROVIDER=mock`) para testar sem custo.
7. **Testes com prints:** E2E no navegador (Playwright) que recria o banco antes de cada fluxo; axe nas telas principais; build Android para conferir que compila.
   - ✋ **Aprovação das telas** pelos prints de cada fase.
8. **Revisão final:** `review-animations` (tabela + veredito) e `web-design-guidelines`; registre em `REVISAO-FINAL.md`.
   - ✋ **Aprovação final.**
9. **Lançamento (fora do código):** contas e chaves (loja, RevenueCat, Meta, Google, IA), revisão jurídica de termos e privacidade, nome e logo. Depois: `combo-site-premium` e `combo-video-explicativo`.

## Avisos aprendidos ao combinar (App Barbeiros, 18 a 20/11/2026)

- **Vidro líquido no RN:** `expo-glass-effect` (`GlassView`) só no iOS 26; nos outros, `View` translúcida + `expo-blur` (não no Android) + brilho com `expo-linear-gradient`. Tudo num componente `Vidro`, para trocar num lugar só.
- **Face de botão sobre lábio colorido precisa ser opaca.** Com face translúcida (branco 6%), o lábio vermelho aparecia através e escondia o texto. Tenha tokens opacos gêmeos (`surfaceSolid`).
- **Barra de abas flutuante:** passe `tabBar` próprio e reserve espaço no fim das telas de abas (`paddingBottom`), senão o último cartão fica embaixo da barra.
- **Plano sempre do banco:** uma função só (`plano_efetivo`) decide o plano, inclusive o que vem de equipe e a tolerância de renovação da loja. O app só lê; a loja avisa por webhook.
- **Quem vê dados de outra pessoa (dono da equipe)** lê só por funções que conferem o papel; as tabelas de cada um não ganham política nova.
- **Assinatura:** biblioteca da loja só no arquivo `.native.ts`; no navegador, uma versão que explica onde assinar. Preço de renovação logo acima do botão, data do fim do teste grátis, "Restaurar compras" e links de termos e privacidade.
- **E2E:** recrie o banco antes de cada fluxo (um fluxo não pode depender do outro); celebrações podem vir em sequência no mesmo painel; em telas empilhadas, procure o texto dentro do `testID` da tela, não na página inteira.
- **axe no React Native Web:** `accessibilityState.checked` não vira `aria-checked` (use `aria-checked`); `Pressable` com rótulo precisa de papel (`button`); área de rolagem precisa de `tabIndex={0}` no navegador.
- **Container da nuvem:** Docker sobe à mão; imagens do Supabase pelo Docker Hub; Expo com `EXPO_OFFLINE=1`; versões de pacote com pelo menos 2 semanas.

## Histórico

- 20/11/2026: criado ao terminar as Fases 0 a 8 do App Barbeiros (aprovação do combo dentro do "eu aprovo tudo" do Daniel em 19/11/2026).
