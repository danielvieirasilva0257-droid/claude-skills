# Projeto Placas NFC: app de estoque e vendas (passo a passo)

App pessoal para controlar as placas NFC (Google, Instagram, WhatsApp, Pix e outras): quantas chegaram, quantas foram vendidas, por quanto e o que sobra no estoque.

## Onde está cada coisa

- **Código do app:** branch `claude/nfc-cards-dashboard-wh964t` deste repositório, pasta `docs/`.
  - `docs/index.html`: o app inteiro (HTML, CSS e JS num arquivo só, sem biblioteca).
  - `docs/manifest.webmanifest` e `docs/sw.js`: o que faz o app ser instalável e abrir sem internet.
  - `docs/icons/`: ícones (gerados por um SVG renderizado no Chromium do container).
- **Endereço do app (no ar desde 25/10/2026):** https://antoniofeli3478-rgb.github.io/claude-skills/
- **Primeira versão (25/10/2026):** painel no Claude (artifact) em https://claude.ai/artifact/8ctRyPGCsBFYM1n7MdfXZG. Ficou para trás porque só abre dentro do claude.ai.

## Como ligar o GitHub Pages (uma vez só)

1. github.com/antoniofeli3478-rgb/claude-skills → **Settings** → **Pages**.
2. Em "Build and deployment", Source: **Deploy from a branch**.
3. Branch: `claude/nfc-cards-dashboard-wh964t`, pasta: **/docs** → **Save**.
4. Esperar 1 ou 2 minutos e abrir o endereço acima.

Se a branch for juntada na `main` um dia, troque a branch do Pages para `main` com a pasta `/docs`.

## Como os dados ficam guardados

- Ficam **só no aparelho**, no `localStorage` do app instalado (chave `placas-nfc:v1`). Nada vai para servidor.
- O endereço é público, mas quem abrir vê um app vazio, com os próprios dados.
- **Cópia de segurança:** em Ajustes, botão "Salvar cópia de segurança" (arquivo `.json`) e "Restaurar uma cópia". Também exporta CSV para planilha.
- PIN de 4 números opcional: tranca a tela contra curiosos. Não criptografa os dados.
- No iPhone, abrir sempre pelo ícone da tela inicial: o Safari e o app instalado têm armazenamentos separados.

## Versão 1.1 (25/10/2026)

- **Lucro certo:** custo médio de cada placa (só das entradas com custo informado) × placas vendidas. Antes descontava tudo o que tinha chegado no período.
- **Venda pelo preço de cada placa:** o total é calculado (quantidade × preço).
- **Pagamento dividido:** dá para marcar Pix, Dinheiro, Cartão e A receber juntos, com o valor de cada um. Se só um campo fica vazio, ele recebe o que falta. Não salva se a soma não fechar com o total.
- Resultados mostram "Como entrou o dinheiro" por forma de pagamento; o histórico mostra o lucro de cada venda; a planilha ganhou colunas por forma de pagamento e de lucro.
- Registros da 1.0 são convertidos sozinhos ao abrir (`migrarMov`), inclusive ao restaurar uma cópia antiga.
- No container, `pkill -f http.server` derruba o próprio shell (saída 144): pare o servidor de teste pelo PID.

## Versão 1.2 (27/10/2026): forma de pagamento que serve para alguma coisa

- **A receber (fiado):** cartão laranja no Início com o total devido e quantos clientes. Abre a lista (mais antigos primeiro, em vermelho depois de 30 dias) com o botão "Recebi": escolhe Pix/Dinheiro/Cartão e o valor (pode ser parcial). A parte "A receber" da venda diminui e entra um pagamento com `recebidoEm`.
- Ao marcar "A receber" sem nome de cliente, o app pede o nome.
- **Filtro por pagamento no Histórico** (Pix, Dinheiro, Cartão, Devendo), com o total daquela forma no cabeçalho de cada mês. Tocar numa linha de "Como entrou o dinheiro" abre o histórico já filtrado.
- **Taxa da maquininha** em Ajustes → Pagamentos (%). Fica gravada em cada venda no cartão (`taxa`), sai do lucro e aparece como "Taxas da maquininha" nos Resultados e numa coluna da planilha.
- Limite conhecido: o dinheiro recebido depois conta no mês da VENDA, não no mês em que entrou.

## Versão 1.3 (27/10/2026): placas deixadas nas lojas (consignado)

- Novo tipo de lançamento **"Na loja"** (`mov: "loja"`): placa, quantidade, preço combinado, nome da loja (obrigatório). As placas saem do estoque e aparecem como "na loja" (Início, cartão da placa, detalhe).
- **Acerto** (cartão azul "Placas deixadas nas lojas" → Acertar): quantas a loja vendeu, quantas voltaram, preço e como pagou (Pix, Dinheiro, Cartão ou "Ainda não pagou" = A receber).
  - O vendido vira uma **venda comum** com `consigId` apontando para o registro da loja; o que voltou fica em `acertos: [{data, devolvidas}]`.
  - O que ainda está na loja é calculado (`restLoja`): quantidade − vendas ligadas − devolvidas. Editar ou apagar a venda ligada atualiza a conta sozinho.
- Histórico ganhou o filtro "Nas lojas"; a planilha mostra "Deixada na loja" com quantas restam.

## 27/10/2026: ligado ao app Finanças

- O Plaquinhas NFC continua um app separado, com a mesma tela da 1.3. O app **Finanças** (repositório `Finan-as`) chegou a ler os dados dele, mas **essa ligação foi retirada no mesmo dia** a pedido do Daniel: hoje os dois apps são independentes e as vendas das placas são lançadas à mão no Finanças.
- `docs/sw.js` (cache v6) ignora a pasta `financeiro/`, que hoje é só um redirecionamento para o Finanças.

## Como atualizar o app

Editar `docs/index.html`, subir a versão em `VERSAO_APP` e o nome do cache em `docs/sw.js` (`placas-nfc-v1` → `v2`), depois commit e push. O app pega a versão nova na próxima vez que abrir com internet.

## Como testar no container

```bash
cd docs && python3 -m http.server 8765 &
# prints de celular (claro e escuro) com Playwright: ver o script usado em 25/10/2026,
# que injeta registros de exemplo no localStorage só no navegador de teste
```

## Habilidades usadas

| Para quê | Habilidade | Caminho |
|---|---|---|
| Plano visual e anti-"cara de IA" | frontend-design | `skills/design/frontend-design/SKILL.md` |
| Regras de tela premium (referência) | ui-ux-pro-max | `skills/design/ui-ux-pro-max/SKILL.md` |

## Aprendizados

- Para um app pessoal no celular, PWA estático no GitHub Pages resolve: ícone na tela inicial, tela cheia, funciona sem internet, de graça.
- Node em ESM não acha o Playwright global; use `require("playwright")` em arquivo `.cjs`.
- Ligar o Pages pelo celular travou: o campo Branch ficou em "None" e a mensagem era "GitHub Pages is currently disabled". Mandar print da tela Settings → Pages resolveu na hora. Com o Pages ligado, cada push na branch publica sozinho em 1 ou 2 minutos.
- Endereço digitado sem `https://` no Chrome vira pesquisa no Google e leva a sites aleatórios. Mandar sempre o link completo.

## Próximo passo

- Instalar no celular (Android: Chrome → ⋮ → Instalar app) e lançar o estoque inicial.
- Ideias se ele pedir: contas "a receber", lista de clientes, sincronizar entre dois aparelhos.
