# Minhas Finanças: passo a passo

## Onde está

- Código: repositório `antoniofeli3478-rgb/Minhasfinancas`, branch `main`, pasta `docs/` (`index.html`, `manifest.webmanifest`, `sw.js`, `icons/`).
- No ar: https://antoniofeli3478-rgb.github.io/Minhasfinancas/ (GitHub Pages: main / docs).
- Dados: localStorage, chave `minhas-financas:v1`. Ficam só no aparelho.

## O que foi feito (27/10/2026)

- O Daniel pediu um app de finanças **do zero**, porque o Finanças (repositório `Finan-as`) dava erro na instalação no Android ("app já instalado" / "não foi possível abrir").
- Foi feito igual ao app das plaquinhas, que instalou sem problema: **um arquivo HTML só**, JavaScript puro, sem build. Tem outro nome, outro `id` de manifesto (`minhas-financas-app`) e outro endereço.
- Telas:
  - **Início:** livre para gastar = contas − guardado em metas − caixa dos negócios − contas pessoais a pagar; pendências com "Recebi"/"Paguei"; resumo do mês; gastos por categoria.
  - **Botão +:** gastei, recebi, venda do negócio, gasto do negócio, guardar em meta, retirada do negócio, transferência, conta a pagar.
  - **Negócio:** caixa, vendido, gastos, lucro, a receber e gráfico de 6 meses. Os lançamentos são feitos à mão, sem ligação com o app NFC.
  - **Metas e Ajustes:** contas, negócios, backup em JSON (compartilhar ou baixar), restaurar e apagar tudo.
- Teste no Playwright: saldo de R$ 970, venda de R$ 160, venda a receber de R$ 80, gasto do negócio de R$ 35, lanche de R$ 25,50, R$ 200 guardados, retirada de R$ 100 e conta a pagar de R$ 160. O livre deu R$ 684,50, como esperado, sem erros no console.

## Aprendizados

- O GitHub troca "ç" e espaço no nome do repositório; peça nomes sem acento.
- A integração não cria repositório. O Daniel cria e depois libera o acesso em github.com/apps/claude/installations/select_target. Sem esse passo, o push dá 403.
- O erro de instalação no Android provavelmente vinha de abrir o link dentro de outro app (Custom Tab). Instale sempre pelo app do Chrome.
- Não usar "Limpar dados do site": todos os apps em antoniofeli3478-rgb.github.io dividem o mesmo armazenamento.

## Próximo passo

- O Daniel instalar pelo Chrome e colocar os saldos reais.
