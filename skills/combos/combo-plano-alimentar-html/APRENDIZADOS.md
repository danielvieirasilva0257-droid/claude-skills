# Aprendizados: combo-plano-alimentar-html

Adendos datados. O mais novo fica embaixo.

## 30/10/2026: o Daniel não gostou da serifa

- A Cormorant Garamond (pedida no prompt original) foi recusada: "não está interessante". Ele quer **sans serif, bold e composição tipográfica** forte.
- Trocado para **Archivo** (uma família só, peso 400–900, largura 100–125%). Display em 800–900 expandido, com tracking negativo; títulos 700–800; corpo 16 px. Base: `research_notes/Tipografia 2026-10/skills-de-tipografia.md` (skills `typeset` e `web-typography`).
- **Para próximos planos:** comece com sans bold. Serifa só se o Daniel pedir de novo.
- Cuidados com fonte larga e pesada:
  - tabela fica mais larga: `th` com tracking +0,04em, padding 10 px, coluna "Alimento" com `min-width` de 150 px e "Fonte" com 92 px; medir `scrollWidth - clientWidth` de cada `.tbl-wrap` (tem que dar 0 no desktop);
  - números de cartão pequeno: largura normal (100%) e 22 px, só o kcal fica expandido;
  - impressão: tamanhos em `pt` só no `@media print` (título 64pt, número da refeição 64pt, macros 24pt), senão a linha do tempo e os cartões vão para a página seguinte.

## 30/10/2026: versão app (checklist diário)

- O Daniel pediu: emojis, tema **preto, vermelho, roxo e lilás com fundo em gradiente**, botões com animação de "pop", **opções com o nome do prato** (não "opção 1, 2, 3") e **checklist por alimento**, com os totais do dia (kcal, P, C, G) ao vivo no topo, em gráfico.
- Arquivo: `assets/app-plano-alimentar.html` (HTML único, JS puro, sem biblioteca). Publicado: https://claude.ai/artifact/V3cMiwpprb9UeoJQsdXAgA
- **Como as contas funcionam:**
  - cada alimento marcado soma; desmarcado não soma;
  - refeição inteira marcada (sem troca) mostra o **total oficial** do plano (evita a diferença de 0,1 do arredondamento);
  - troca brócolis ↔ couve-flor: total vira a soma dos itens;
  - "plano do dia" = soma das opções escolhidas; a proteína mostra a marca do mínimo (76,8 g).
- **Onde salva:** `localStorage` na hora (rápido, só no aparelho) + documento privado `data/users/<id>/<AAAA-MM-DD>` no banco do artifact (capacidades `db` e `user`), que vale em qualquer aparelho logado. Nem o dono lê `data/users/<id>/` pelo `ArtifactData`, então a conferência é pela própria página.
- **Animações (button-animation):** toque com escala 0,94 e volta com mola `cubic-bezier(.34,1.56,.64,1)`; check desenhado (stroke-dashoffset) com "pop"; janela de detalhes sobe da borda de baixo (regra 4 do editor: entra de fora do quadro); aviso (toast) também entra pela borda; `prefers-reduced-motion` desliga tudo.
- **Pegadinhas:**
  - barra fixa no topo cobre o item focado/rolado: `html { scroll-padding-top: 110px }`;
  - `background-attachment: fixed` falha no iOS: gradiente numa camada `position: fixed` com `z-index: -1`;
  - no celular a barra fixa quebrava em 2 linhas: `nowrap` e emojis escondidos abaixo de 640 px;
  - o script `scripts/montar-artifact.py` agora embute também fotos que estão em strings do JavaScript (e não repete a mesma foto).
- **Café e lanche têm uma opção só** (é o que o plano tem). Opções novas precisam de valores da TACO/rótulo pela skill `nutricionista-esportivo` e aprovação do Daniel.

## 30/10/2026: app "Minha Dieta" (várias dietas, biblioteca, semana e mês)

- Arquivo: `assets/minha-dieta.html` (HTML único, JS puro). Publicado: https://claude.ai/artifact/EHS5mnhRhE2aB4zDjhHVHg
- **5 abas** (barra fixa embaixo): Hoje (checklist do dia + refeições extras), Progresso (dia, semana e mês), Plano (dieta de cada dia da semana e calendário do mês), Dietas (criar, duplicar, editar, excluir, padrão) e Biblioteca (alimentos com emoji, porção, kcal e macros).
- **Modelo de dados:** biblioteca `{id, e, n, por, k, p, c, g, f}`; dieta → refeições → opções → itens `{lib, q}` (q em passos de 0,5); a dieta de um dia = troca do dia > plano da semana > dieta padrão. O registro do dia guarda os totais calculados (`tot`) e a meta (`tgt`), para os gráficos não mudarem se a biblioteca mudar depois.
- **Valores agora são a soma dos itens** (café = 626 kcal, não 625). Diferença de arredondamento; está nas observações.
- **Cutting pré-carregado** é um **modelo** montado com os mesmos alimentos (1.363 kcal, P 139 g ≈ 2,9 g/kg). Precisa de validação da nutricionista.
- **Emoji:** campo de texto que aceita o emoji do teclado (fica só o último grafema, `Intl.Segmenter`) + grade de ~85 emojis de comida.
- **Gráficos (skill dataviz):** uma série por vez (kcal, P, C ou G), meta tracejada, dica ao passar ou tocar; paleta validada no fundo escuro: P `#967CEB`, C `#6236D0`, G `#D9488F` (o roxo fica abaixo de 3:1 de contraste, por isso tem rótulos e números visíveis). No celular o `viewBox` muda para 380 de largura, senão os números dos eixos ficam minúsculos.
- **Banco:** `data/users/<id>/config` (configuração inteira em JSON) e `data/users/<id>/log-AAAA-MM` (dias do mês). Carrega o mês atual e o anterior. `localStorage` como cópia local.
- **APK (próximo passo, aprovado só depois do "sim"):** o container tem Java 21 e Gradle 8.14, e `dl.google.com` responde; dá para baixar as command-line tools do Android e montar um app WebView com o HTML dentro (sem o banco da conta, que só existe no claude.ai: no APK salva no aparelho).

## 30/10/2026: APK "Minha Dieta" para Android

- Gerado **sem Gradle e sem Android Studio**: `scripts/apk/build.sh <página.html> <pasta>` usa `aapt2` + `javac --release 11` + `d8` + `zipalign` + `apksigner` (build-tools 34 e platform android-34 baixados de `dl.google.com/android/repository/`: `platform-34-ext7_r03.zip` e `build-tools_r34-linux.zip`, ~60 MB cada, descompactados em `/root/android/`). Leva uns 30 s.
- O app é uma `WebView` que abre `file:///android_asset/index.html`: **funciona sem internet** e **sem permissão nenhuma** (nem INTERNET). As fontes Archivo (latin e latin-ext, woff2) vão dentro do APK (`prepare_assets.py` troca o link do Google Fonts por `@font-face` local). Os dados ficam no `localStorage` da WebView (só no celular; o banco da conta só existe no claude.ai).
- **Botão voltar do Android:** a página expõe `window.__mdBack()` (fecha a janela aberta → sai do editor de dieta → volta para a aba Hoje → senão o app fecha).
- **Ícone:** gerado por código (gradiente vermelho → roxo, "M" em Archivo 900 instanciada com `fontTools.varLib.instancer`), em 5 densidades.
- **Pegadinha corrigida:** o aviso (toast) escondido com `translate` ainda aparecia atrás da barra de abas; agora some com `opacity: 0` e `visibility: hidden`.
- **Chave de assinatura:** criada em `/root/.config/rotina/minha-dieta.jks` (senha no `.pass` ao lado), **fora do repositório**. O container é temporário: para uma atualização instalar por cima sem apagar os dados, precisa da **mesma chave**. Sem ela, é preciso desinstalar (e os dados do celular somem). Não testado em celular de verdade (sem emulador no container: não há `/dev/kvm`).
