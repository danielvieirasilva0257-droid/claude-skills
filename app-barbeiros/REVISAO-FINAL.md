# Revisão final (Fase 8, 20/11/2026)

Revisão de animação, acessibilidade e interface do app inteiro, com as skills da Fase 8:
`../skills/design/review-animations`, `../skills/sites/web-quality/accessibility`,
`../skills/design/web-design-guidelines`, `../skills/sites/webapp-testing` e `../skills/sites/playwright-cli`.

## 1. Animação (review-animations)

Tudo o que se mexe no app foi conferido contra os 10 padrões da skill. Não ficou nenhum problema aberto.

| Antes | Depois | Por quê |
| --- | --- | --- |
| Face translúcida do `DuoButton` de erro e de sucesso (`surface` 6%) | Face opaca (`surfaceSolid`, `surfaceStrongSolid`) | O lábio vermelho ou verde aparecia através da face e escondia o texto do botão "Cancelar na loja" |
| Troca de aba sem animação (`BarraAbas`) | Mantido | Ação de 100+ vezes por dia: sem animação é o certo |
| `Chip` 60 ms + 140 ms, escala 0,96 | Mantido | Dezenas de vezes por dia: curto, `easeOut`, só `transform` |
| `DuoButton`: afunda no lábio e volta com mola (`springBack`) | Mantido | Retorno interrompível; aperto deliberado mais lento que a resposta |
| `HoldToConfirm`: enche em 2 s linear, solta em 200 ms | Mantido | Assimétrico de propósito: segurar é deliberado, soltar responde na hora |
| `BottomSheet`: entra com mola calma, sai em 200 ms `easeOut` | Mantido | Saída mais rápida que a entrada; véu só em opacidade |
| `StatusButton`: tremida de 4 px, 5 × 40 ms, só no erro | Mantido | Raro, 200 ms no total, desligado com "reduzir movimento" |
| `MetaRing`: mola de 900 ms | Mantido, com justificativa | Tela aberta poucas vezes por semana; o anel enchendo explica o progresso. Com "reduzir movimento" vai direto ao valor |
| `ConquistaButton` (ondas de 520 ms e dinheiro) | Mantido | Só em momentos raros (fechar o caixa, metas); aprovado por frames na Fase 1; com "reduzir movimento" vira só troca de cor de 150 ms. O mascote saiu depois desta revisão (20/11/2026): a celebração mostra o ícone da conquista, parado |
| Aurora do fundo | Mantido | Parada: não há laço decorativo rodando |

Veredito: **aprovado**. Nada anima em ação de alta frequência, nenhuma curva `ease-in` em interface, só `transform` e `opacity`, e "reduzir movimento" é respeitado em todos os componentes (`useMovimentoReduzido`).

## 2. Acessibilidade (axe-core, WCAG 2.2 A e AA)

`npm run a11y` roda o axe em 16 telas (barbeiro e dono). Primeira rodada: 8 regras com problema em 7 telas. Corrigido:

- **Chips sem estado:** `role="checkbox"` sem `aria-checked` no navegador (o `accessibilityState` não chegava). Agora `aria-checked` e `aria-disabled` (`src/components/Chip.tsx`).
- **Rótulo em elemento sem papel:** as células dos gráficos (mapa de calor, cascata, barras) são tocáveis e tinham `aria-label` sem papel. Agora são botões (`accessibilityRole="button"`).
- **Rolagem sem teclado:** a área de rolagem das telas e o carrossel do resumo da semana não recebiam foco. Agora `tabIndex={0}` no navegador (`TelaBase`, `insights`).

Segunda rodada: **16 de 16 telas sem problema.** Continuam valendo as regras do `DESIGN.md`: toque mínimo de 44 × 44, contraste conferido, nada só por cor (sempre ✓, ▲▼, ⚠ ou rótulo).

## 3. Diretrizes de interface (web-design-guidelines)

Conferido o que vale para um app React Native (a lista é escrita para sites):

- ✓ Botões só com ícone têm rótulo (`BotaoIcone`, abas sem texto na `BarraAbas`).
- ✓ Login com `autoComplete` e tipo de teclado certos; código de convite sem corretor nem preenchimento automático.
- ✓ Estados de carregamento com reticências ("Salvando…", "Entrando…"); números com algarismos de largura fixa (`numero`).
- ✓ Datas e dinheiro sempre com `Intl` (`src/lib/format.ts`).
- ✓ Ações destrutivas pedem confirmação (`HoldToConfirm`: apagar, remover da equipe, encerrar, sair da barbearia).
- ✓ Erros dizem o próximo passo (ex.: "Código inválido ou vencido: peça outro ao dono").
- ✓ Zoom liberado (sem `user-scalable=no`); `color-scheme: dark` e `theme-color` iguais ao fundo.
- Fica para depois: virtualizar listas com mais de 50 itens (clientes e extrato usam `map`; hoje um barbeiro tem dezenas, não centenas).

## 4. Testes

| Tipo | Comando | Resultado |
| --- | --- | --- |
| Banco (pgTAP) | `npm run test:db` | 91 testes, 6 arquivos |
| Funções (Deno) | `npm run test:funcoes` | 15 testes |
| Unitários (Jest) | `npm test` | 16 testes (formatadores e planos) |
| E2E no navegador (Playwright) | `npm run e2e` | 8 fluxos: primeiro uso, lançar e fechar o caixa, plano Pago e IA, Grátis bloqueado, Premium e Plus, barbearias, assinaturas, bater a meta |
| Acessibilidade (axe) | `npm run a11y` | 16 telas sem problema |
| Celular (Maestro) | `maestro test .maestro/` | 4 fluxos escritos; rodam num build de desenvolvimento (o container não tem emulador) |
| Android | `EXPO_OFFLINE=1 npx expo export --platform android` | compila (inclui a loja) |
