---
name: combo-plano-alimentar-html
description: Combo para transformar um plano alimentar em uma página HTML única, com cara de material de nutricionista esportivo de alto padrão, responsiva e pronta para imprimir em A4/PDF. Junta a skill nutricionista-esportivo (dados e conferência) com as skills de design do repositório (frontend-design, ui-ux-pro-max, web-design-guidelines) e a webapp-testing (prints e PDF). Use para "plano alimentar em HTML", "dieta bonita para imprimir", "documento de nutricionista".
---

# Combo: plano alimentar em HTML (nutrição + design editorial)

Este combo não repete as skills: diz a ordem, os pontos de aprovação e o que já foi aprendido. Abra cada skill só quando chegar ao passo dela.

## Skills ligadas (na ordem de uso)

| Passo | Skill | Caminho |
|---|---|---|
| 1–2. Dados e conferência | nutricionista-esportivo | `skills/nutricao/nutricionista-esportivo/SKILL.md` (+ `APRENDIZADOS.md`) |
| 3. Plano visual | frontend-design | `skills/design/frontend-design/SKILL.md` |
| 3. Anti-"cara de IA" e checklist | ui-ux-pro-max | `skills/design/ui-ux-pro-max/references/anti-padroes-ia.md` e `references/checklist.md` |
| 5. Revisão do código | web-design-guidelines | `skills/design/web-design-guidelines/regras-fixadas/command.md` |
| 6. Prints e PDF | webapp-testing | `skills/sites/webapp-testing/SKILL.md` (aqui basta o Playwright já instalado no container) |
| Modelo pronto | página de exemplo | `skills/combos/combo-plano-alimentar-html/assets/exemplo-plano-hipertrofia-feminina.html` |

## Passo a passo

1. **Dados (nutricionista-esportivo).** Se o prompt trouxer os números travados, copie sem mudar. Se não, monte pelo método da skill. ✋ **Aprovação:** só quando montar do zero, mostre a tabela de dados antes de desenhar.
2. **Conferência por script.** Some cada tabela com Python (nunca de cabeça) e confira kcal ≈ 4P + 4C + 9G. Arredondamento de 0,1: mantenha o total e escreva a observação. Erro maior: pare e pergunte.
3. **Plano visual curto.** Se o briefing já fixa paleta e fontes, **o briefing manda** (regra da `frontend-design`), mesmo que seja um dos "visuais típicos de IA" (creme + serifa). O que sobrar livre, decida contra o `anti-padroes-ia.md`.
   - Comece do modelo em `assets/`: ele já tem cabeçalho, faixa de identificação, bloco da meta de proteína, linha do tempo, refeições (foto, bloco de macros, tabela), opções, resumo escuro, observações, referências, CSS de celular e de impressão.
4. **Fotos.** Uma por refeição principal, fiel ao prato (veja "Avisos"). Legenda "Imagem ilustrativa" com crédito e fundo bege se a imagem falhar.
5. **Código e revisão.** Um arquivo `.html`, CSS embutido, sem JS além do `onerror` das fotos. Rode a revisão das `regras-fixadas` (tabular-nums, `alt`, `width/height` nas imagens, títulos em ordem).
6. **Prints e PDF.** Playwright: 1280 px e 375 px (página inteira; `scrollWidth` deve ser igual à largura) e `page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true })` com `emulateMedia({ media: 'print' })`. Olhe as páginas do PDF em miniatura (`pdftoppm -r 35`). ✋ **Aprovação:** envie o HTML e o PDF ao Daniel.
7. **Salvar.** HTML final no projeto (ou como novo modelo em `assets/` se servir de base), `projetos/<nome>/PASSO-A-PASSO.md` e `APRENDIZADOS.md` das skills usadas.

## Avisos aprendidos (30/10/2026)

- **Links de download do Unsplash** (`unsplash.com/photos/<id>/download`) dão 401 para robôs e podem falhar dentro de páginas. Abra a página da foto com WebFetch, pegue o endereço `images.unsplash.com/photo-<número>` e use `?auto=format&fit=crop&w=1400&q=75`. Pexels direto (`images.pexels.com/...`) funciona.
- **Confira a foto antes de usar:** faça uma folha de miniaturas com PIL. Duas sugeridas no prompt tinham abacate e batata frita, que não estão no plano; foram trocadas por fotos fiéis (ovos mexidos com pão; frango com arroz e feijão).
- **Cartões em grade:** use `repeat(3, minmax(0, 1fr))`, senão o número grande em serifa empurra o terceiro cartão para fora. Nos cartões pequenos, kcal numa linha inteira e P/C/G em 3 colunas embaixo.
- **Impressão:** `break-before: page` em cada refeição, `break-inside: avoid` em linhas de tabela, blocos de macros e figuras; foto com altura fixa (~52 mm). Grade de cartões em impressão: troque para `display: flex`, senão o Chrome joga a linha inteira para a página seguinte. Resumo escuro vira fundo claro no `@media print`.
- **Celular:** a coluna "Alimento" precisa de `min-width` (~180 px), senão vira uma palavra por linha; a tabela rola dentro do bloco (`overflow-x: auto`), nunca a página.
- **Formato brasileiro** escrito à mão nos números (vírgula decimal, ponto de milhar); não dependa de `Intl` num documento estático.

## Publicar para visualizar (artifact do claude.ai)

- O artifact **bloqueia imagens de outros sites** (só fontes do Google passam). Rode `python3 skills/combos/combo-plano-alimentar-html/scripts/montar-artifact.py <página.html> <saída.html>`: ele baixa as fotos, reduz para 1200 px (JPEG 72), embute como `data:` e tira `<!DOCTYPE>`, `<html>`, `<head>` e `<body>` (o artifact põe os dele). A página de ~570 KB fica bem abaixo do limite de 16 MB.
- Publique com a ferramenta Artifact (ícone `recipe`). O link é privado; para mostrar a outra pessoa, o Daniel compartilha pelo menu "Share" da página.
- Botão "Imprimir/Salvar PDF" não funciona dentro do artifact: o PDF sai do arquivo HTML aberto no navegador (Ctrl+P) ou do Playwright.
- Publicado em 30/10/2026: https://claude.ai/artifact/M4PFo65bKwjoeZ1if4yskf
