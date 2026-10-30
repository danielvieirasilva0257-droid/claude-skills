# Projeto: plano alimentar de hipertrofia feminina em HTML (passo a passo)

## Onde está cada coisa

- **Página pronta (HTML único):** `skills/combos/combo-plano-alimentar-html/assets/exemplo-plano-hipertrofia-feminina.html` (branch `claude/design-html-nutrition-skills-dptlx1`). Ela também serve de modelo para os próximos planos.
- **Prompt de origem:** enviado pelo Daniel em 30/10/2026 (`prompt-plano-alimentar.md`): mulher, 48 kg, 1,45–1,50 m, ganho de massa, 5 refeições, números travados.

## Habilidades usadas

| Para quê | Habilidade | Caminho |
|---|---|---|
| Passo a passo completo | combo-plano-alimentar-html | `skills/combos/combo-plano-alimentar-html/SKILL.md` |
| Conferência nutricional | nutricionista-esportivo | `skills/nutricao/nutricionista-esportivo/SKILL.md` |
| Plano visual | frontend-design | `skills/design/frontend-design/SKILL.md` |
| Anti-"cara de IA" e checklist | ui-ux-pro-max | `skills/design/ui-ux-pro-max/references/` |
| Revisão de código de interface | web-design-guidelines | `skills/design/web-design-guidelines/` |

## O que foi feito

1. Lidos o prompt e as skills de design. Paleta e fontes vieram do prompt (sálvia, bege, dourado; Cormorant Garamond + Inter).
2. Fotos: as 3 do Unsplash do prompt davam 401 pelo link de download; os endereços diretos foram pegos na página de cada foto. Café da manhã e almoço A trocados por fotos mais fiéis (ovos mexidos com pão, de Imad 786; frango com arroz e feijão, de joe boshra). Pós-treino (Eiliv Aceron) e almoço B (Orkun Orcan) mantidos.
3. Página escrita com todos os números do prompt, sem mudança.
4. Somas conferidas por script: diferenças de 0,1 g ou 1 kcal em 3 tabelas (arredondamento); totais mantidos e observação acrescentada.
5. Prints em 1280 px e 375 px e PDF A4 (9 páginas, uma refeição por página) com Playwright. Corrigidos: cartões de cobertura saindo da grade, coluna "Alimento" estreita no celular, cartões indo para outra página na impressão.

## Comandos

```bash
# prints + PDF (script no scratchpad; ver o combo, passo 6)
node shot.js <arquivo.html> <pasta-de-saida>
pdftoppm -r 35 -png plano.pdf pg   # miniaturas das páginas
```

## Próximo passo

- O Daniel aprovar a **categoria nova `skills/nutricao/`** e a skill `nutricionista-esportivo` (depois disso, listar a categoria no `CLAUDE.md` e no `guia/LEIA-ANTES-DE-USAR.md`, seção 3.3).
- Quando as marcas de whey, pão de forma, ricota e pasta de amendoim forem definidas, trocar os valores com asterisco.

## 30/10/2026: segunda rodada (UI/UX e publicação)

- Revisão pela `ui-ux-pro-max`: texto em 16 px, tracking do título, menos rótulos em caixa alta, foco visível, margens seguras no celular.
- **Página para ver:** https://claude.ai/artifact/M4PFo65bKwjoeZ1if4yskf (privada; compartilhar pelo menu Share).
- Versão do artifact gerada com `skills/combos/combo-plano-alimentar-html/scripts/montar-artifact.py` (fotos embutidas, porque o artifact bloqueia imagens externas).

## 30/10/2026: terceira rodada (tipografia sans bold)

- O Daniel recusou a serifa. Pesquisadas no catálogo as skills `impeccable/typeset` e `web-typography` (lidas inteiras; não instaladas, aguardam aprovação). Notas: `research_notes/Tipografia 2026-10/skills-de-tipografia.md`.
- Toda a tipografia virou **Archivo** (sans, bold, larga). Ajustes de tabela, cartões e impressão no `APRENDIZADOS.md` do combo.
- Artifact atualizado (versão 2), mesmo link. PDF continua com 9 páginas.

## 30/10/2026: quarta rodada (app com checklist)

- Novo arquivo: `skills/combos/combo-plano-alimentar-html/assets/app-plano-alimentar.html`. Tema escuro com gradiente vermelho/roxo/lilás, emojis, opções com nome de prato, checklist por alimento, totais e gráfico ao vivo, janelas pop-up, "Zerar o dia".
- **App publicado:** https://claude.ai/artifact/V3cMiwpprb9UeoJQsdXAgA (salva o dia na conta, privado).
- O documento A4 continua em `exemplo-plano-hipertrofia-feminina.html` (artifact M4PFo65bKwjoeZ1if4yskf).
- Testado com Playwright: café inteiro = 625 kcal; sem farinha láctea = 505 kcal e P 24,0 g; almoço B + couve-flor = 457 kcal; recarregar mantém o que foi marcado.
- Próximo passo: o Daniel dizer se quer opções novas para café e lanche (valores a montar pela skill de nutrição).

## 30/10/2026: quinta rodada (app Minha Dieta)

- Arquivo: `skills/combos/combo-plano-alimentar-html/assets/minha-dieta.html`. **Publicado:** https://claude.ai/artifact/EHS5mnhRhE2aB4zDjhHVHg
- Pedido do Daniel: refeições extras, biblioteca de alimentos com emoji (adicionar, editar, tirar), várias dietas (bulking, cutting), checklist diário, planejamento semanal e mensal, gráficos diário, semanal e mensal.
- Testado com Playwright (390 px e 1280 px): café 626 → sem farinha 505 → extra "🥖 Pão de queijo" 625; biblioteca 21 → 23 itens; alimento adicionado no cutting com 1,5×; sábado em cutting; gráficos e calendário; recarregar mantém tudo; sem erros no console.
- **Próximo passo:** o Daniel aprovar o app; depois gerar o APK "Minha Dieta" para Android (a mensagem dele terminou em "E um...": perguntar o resto).

## 30/10/2026: sexta rodada (APK para a Ana)

- APK `MinhaDieta.apk` (versão 1.0, código 1, pacote `com.minhadieta.app`, Android 7 ou mais novo, 233 KB) enviado no chat. Não fica no repositório; para gerar de novo:
  ```bash
  # baixar uma vez: platform-34-ext7_r03.zip e build-tools_r34-linux.zip em /root/android/{platform,bt}
  skills/combos/combo-plano-alimentar-html/scripts/apk/build.sh skills/combos/combo-plano-alimentar-html/assets/minha-dieta.html /tmp/saida
  VERSION_CODE=2 VERSION_NAME=1.1 ...   # numa atualização
  ```
- Testes: `aapt2 dump badging` (nome "Minha Dieta", alvo SDK 34, mínimo 24), `dexdump` (MainActivity), página embutida aberta **sem internet** no Chromium (fonte carregou, botão voltar ok, sem erros). Sem teste em aparelho real.
- Chave de assinatura só no container (`/root/.config/rotina/minha-dieta.jks`). Perguntado ao Daniel se quer guardar a chave para as próximas versões.

## 30/10/2026: sétima rodada (Minha Dieta v2: pratos e receitas)

- Mesmo arquivo `assets/minha-dieta.html` e mesmo link (versão 3 do artifact). APK `MinhaDieta-1.1.apk` (código 2) enviado no chat, mesma assinatura da 1.0.
- Testado (390 e 1280 px): Bulking fixa na abertura e sem escolha na tela Hoje; receita "🥞 Panqueca de banana" (ovo 1,5×, banana, azeite = 197 kcal) criada dentro do café e adicionada só no dia; arroz "todos os dias" criou "Bulking 2" (padrão passou para ela); tirar prato no mesmo dia manteve "Bulking 2"; "☀️ Lanche da manhã" criado para todos os dias; Cutting editado (Ceia + prato, movida) e salvo como "Cutting 2"; 11 receitas; voltar do Android; recarregar mantém tudo; migração do formato antigo ok; sem erros.
