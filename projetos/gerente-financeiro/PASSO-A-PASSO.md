# Projeto Finanças (antes "Gerente Financeiro") (passo a passo)

App financeiro pessoal do Daniel: renda variável, envelopes, negócio NFC, cartão Inter (manual), meta do PC e reserva. Local e offline (PWA), dados só no aparelho.

## Onde está cada coisa

- **Código e versão publicada:** repositório próprio **antoniofeli3478-rgb/Finan-as** (branch `main`; código na raiz, build em `docs/`, que o GitHub Pages publica).
- **Endereço:** https://antoniofeli3478-rgb.github.io/Finan-as/ (o Daniel preferiu não renomear o repositório).
- **Endereço antigo** `/claude-skills/financeiro/`: virou só um redirecionamento (`docs/financeiro/` nesta branch), com um service worker que apaga o app antigo do navegador e leva para o novo.
- **Manual completo** (rodar, build, backup, restauração, ligação com as placas, decisões técnicas): `README.md` do repositório Finan-as.

## Como foi feito (27/10/2026)

1. **Núcleo primeiro** (`financeiro/src/core/`): tudo em centavos inteiros; saldos nunca guardados, sempre recalculados dos lançamentos (`ledger.ts`); uma função calcula a situação para todas as telas (`situacao.ts`). 43 testes das 18 regras de integridade.
2. **Banco local** (`src/data/`): Dexie com versão de esquema, gravações em transação, recorrências sem duplicar (`geradoAte`), backup JSON validado com Zod e opcionalmente cifrado (AES-GCM + PBKDF2), modo demonstração num banco separado. 15 testes com `fake-indexeddb`.
3. **Telas**: Visão geral, Movimentações, Envelopes, Contas e faturas, Negócio NFC, Metas, Relatórios, Consultor, Configurações e assistente de 8 passos. Registro rápido com 11 tipos.
4. **Teste no navegador** (Playwright, celular 390 px e computador): assistente, recebimento + distribuição, despesa, cartão 3x, venda pendente, todas as telas, recarregar a página (persistência), modo demonstração. Sem erros no console.

## Comandos

```bash
cd Finan-as   # clone do repositório antoniofeli3478-rgb/Finan-as
npm install
npm test          # 58 testes
npm run build     # gera docs/ (publicado pelo Pages)
npm run preview   # http://localhost:4173
```

## Aprendizados

- **Nome com acento no GitHub:** "finanças" vira `finan-as`. Pedir o nome sem acento ou conferir com a lista de repositórios.
- **Repositório novo não aparece para o Claude** até ser liberado no app do Claude no GitHub, e o Pages grátis exige repositório público.
- **Dois apps no mesmo site dividem o armazenamento do navegador:** mesmo endereço base = mesmo localStorage e IndexedDB. Por isso "Limpar dados do site" no Chrome apaga os DOIS apps. (A leitura do NFC pelo Finanças existiu e foi retirada em 27/10, ver abaixo.)

- **CSS fora de camada vence o Tailwind 4.** Uma regra base solta (`button { color: inherit }`) apagou a cor do texto dos botões dourados. Regras base vão dentro de `@layer base`.
- **`<label>` em volta de vários botões:** tocar no rótulo aperta o primeiro botão. Campos com grupos de botões usam `<Campo grupo>` (vira `div role="group"`).
- **Dexie devolve na ordem da chave**, não na ordem da tela: ordenar contas e envelopes por `ordem` ao carregar (o assistente chegou a gravar o saldo na conta errada).
- **Dois PWAs na mesma pasta do Pages:** o service worker do app NFC (escopo `/claude-skills/`) cobria também `/financeiro/`. Ele agora ignora essa pasta (`docs/sw.js`, cache v5).
- `Omit<União, ...>` do TypeScript não distribui: usar o tipo `NovoMov<T>` de `core/types.ts`.
- Playwright global no container: usar `require("playwright")` em `.cjs`.

## Habilidades usadas

| Para quê | Habilidade | Caminho |
|---|---|---|
| Plano visual, anti-"cara de IA" | frontend-design | `skills/design/frontend-design/SKILL.md` |
| Referência de interface premium | ui-ux-pro-max | `skills/design/ui-ux-pro-max/SKILL.md` |

## 27/10/2026 (2): dois apps separados e ligados

- Pedido do Daniel: **dois apps separados**. O **Plaquinhas NFC** volta a ser o app das placas, com a mesma tela e os mesmos dados (`docs/index.html` é idêntico ao da versão 1.3; só o cache offline do `docs/sw.js` mudou para v6, para limpar uma página salva por engano). O **Finanças** (novo nome) ganhou a aba **Meus negócios**, com o card do Plaquinhas NFC e o botão para abrir o app das placas.
- **Ligação:** mesmo endereço (`antoniofeli3478-rgb.github.io`) = o Finanças lê o localStorage `placas-nfc:v1` do app das placas. Só leitura. Conversor em `financeiro/src/integracoes/nfc.ts`; 5 testes novos (63 no total). O módulo de vendas/produtos/compras de dentro do Finanças saiu: isso agora é do app das placas.
- **Mudança de endereço (feita):** a integração do GitHub não cria repositórios, então o Daniel criou. Ao digitar "finanças", o GitHub trocou o "ç" por "-" (`Finan-as`) e criou privado; foi preciso deixar público (Pages grátis só em repositório público) e liberar o repositório no app do Claude (github.com/apps/claude/installations/select_target). Os dados do Finanças continuam: o endereço base é o mesmo, então o banco do navegador é o mesmo.
- Por que separar de endereço: o escopo do app das placas é `/claude-skills/`, que engloba `/claude-skills/financeiro/`. No Android, um app instalado dentro do escopo do outro se mistura.

## 27/10/2026 (3): Finanças independente, negócios lançados à mão

- Pedido do Daniel: deixar o NFC como está e **tirar toda a ligação** do Finanças com ele. O Finanças virou um app de finanças só, e os negócios são lançados à mão.
- O que mudou no Finanças (repositório `Finan-as`, commit 6efecdd):
  - saiu `src/integracoes/nfc.ts` e os testes dele;
  - **Venda do negócio** é uma receita com `negocioId`: entra na conta e no caixa (envelope) do negócio, sem distribuição. "A receber" funciona igual às outras receitas;
  - **Meus negócios**: lista, "Novo negócio" (cria um envelope tipo `negocio`), e em cada um: Resumo (vendido × recebido × gastos × lucro, gráfico, lançamentos), Simulação, Retirada pessoal e Ajustes (nome, capital de giro mínimo, arquivar);
  - retirada e gasto escolhem o negócio; o consultor ("posso fazer um gasto no negócio?") e os relatórios usam lucro = vendas − gastos;
  - assistente com 7 passos (o passo "Seu negócio" dá nome ao negócio; padrão "Plaquinhas NFC").
- Testes: 64 passando (6 novos sobre vendas manuais). Smoke test no Playwright: venda de R$ 160 + gasto de R$ 35 → caixa R$ 125, lucro R$ 125.
- Quem já tinha dados: o envelope antigo se chama "Negócio e estoque"; dá para renomear em Meus negócios → Ajustes.

## Próximo passo

- Daniel instalar no celular e rodar o assistente com os números reais.
- Possíveis versões futuras: notificações com o app fechado (exigiria servidor de push), importação de extrato OFX/CSV do Inter, sincronizar entre celular e computador.
