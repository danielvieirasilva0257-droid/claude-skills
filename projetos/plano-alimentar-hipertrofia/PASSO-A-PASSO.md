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
