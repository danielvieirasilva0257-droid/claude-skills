# Projeto Rotina App: o app no celular, com dados na nuvem da Cloudflare (passo a passo)

Este arquivo guarda só o que foi feito, como foi feito e onde estão as coisas. Ele não tem o código.

## O que é

O app Rotina (hábitos, treinos, gráficos e financeiro), que nasceu como um HTML de um arquivo só (artifact do Claude), publicado na Cloudflare para abrir no navegador do celular. Os dados ficam salvos num banco de dados da Cloudflare (D1), então qualquer celular que entrar com a senha vê as mesmas informações.

## Onde está cada coisa

- **Código:** pasta `rotina-cloudflare/` (ainda não está no GitHub: o Claude pediu ao Daniel para criar a branch `rotina-app`; quando ela existir, atualize esta linha). Enquanto isso, a cópia está no scratchpad da sessão de 18/10/2026 e foi enviada ao Daniel em .zip.
  - `public/index.html`: o app. É o HTML original com duas mudanças: (1) a camada de sincronização trocada (antes salvava na conta do Claude com `window.claude`; agora salva em `/api/estado`), com uma tela de senha; (2) ícone, `manifest.webmanifest` e metas para "Adicionar à tela inicial" abrir como app, em tela cheia.
  - `src/index.js`: o Worker. Entrega os arquivos e responde `GET/PUT /api/estado`, que só funciona com a senha (segredo `SENHA` do Worker).
  - `wrangler.jsonc`: configuração (nome `rotina`, pasta `public`, banco D1 `rotina`).
  - `publicar.sh`: cria o banco (se ainda não existir), publica e define a senha.
- **O app original:** artifact "Rotina" em https://claude.ai/artifact/FsKaH7SRjcPc4wRLXSJcFE

## Como funciona a nuvem

- O estado inteiro do app vira um JSON numa linha da tabela `estado` (com um número de `versao`).
- Ao mudar algo, o app espera 1,5 s e envia. Também envia ao sair do app.
- Ao voltar para o app (ou quando a internet volta), ele confere se outro celular mudou algo e abre a versão mais nova.
- Se dois celulares salvarem ao mesmo tempo, vale o que chegou primeiro na nuvem (o servidor recusa a versão velha com o código 409 e o app abre a nova, com um aviso).
- Sem internet, o app continua salvando no aparelho (localStorage) e envia quando a conexão voltar.
- Cópia de segurança: a tabela `historico` guarda uma cópia por dia, por 60 dias.
- Backup e CSV do app viram download normal do navegador (o app já tinha esse caminho fora do Claude).

## Comandos usados

```bash
# teste local (banco simulado, senha de teste no arquivo .dev.vars, que não vai para o git)
printf 'SENHA=teste123\n' > .dev.vars
npx -y wrangler@4.151.1 dev --port 8788 --local

# publicar (precisa do token e do ID da conta da Cloudflare do Daniel)
export CLOUDFLARE_API_TOKEN=...  CLOUDFLARE_ACCOUNT_ID=...  SENHA='senha do app'
./publicar.sh
```

Token da Cloudflare (criar em dash.cloudflare.com > Meu perfil > Tokens de API > Criar token > Personalizado), com as permissões:
- Conta · Workers Scripts · Editar
- Conta · D1 · Editar
- Conta · Configurações da conta · Ler
- Usuário · Detalhes do usuário · Ler

O token **nunca** vai para o repositório; fica em `/root/.config/rotina/` no container, como as outras chaves.

## Testes feitos (18/10/2026)

- API: sem senha dá 401; salvar, conflito (409) e ler funcionaram.
- Navegador (Playwright, tela de celular 390x844): o "celular A" marcou "Beber 3L de água"; o "celular B", aberto do zero, já mostrou "1/7 nesta semana". Senha errada mostra "Senha errada. Tente de novo." Sem erros no console.

## Aprendizados

- Publicar arrastando a pasta no painel da Cloudflare não aceita a parte de servidor (Functions/Worker). Como o app precisa salvar na nuvem, a publicação é pelo `wrangler` (linha de comando), com token.
- O HTML exportado do artifact já tinha um "encaixe" de sincronização (`window.__appSync` e `window.__appStore`). Basta trocar esse bloco `<script>`; o resto do app fica intocado.
- Usamos D1 em vez de KV porque o plano grátis do KV permite só 1.000 gravações por dia; o D1 grátis permite 100.000.
- `pkill -f "wrangler.*dev"` mata o próprio shell do Claude (o padrão aparece no comando). Use `pkill -f workerd` ou guarde o PID.

## Próximo passo

1. Daniel cria a conta/token da Cloudflare e escolhe a senha do app.
2. Claude roda `./publicar.sh` e manda o endereço `https://rotina.<subdominio>.workers.dev`.
3. No celular: abrir o endereço, digitar a senha, e "Adicionar à tela inicial".
4. Os dados que já estão no app do Claude: exportar o backup lá e importar no app novo (Ajustes > Backup).

## Habilidades usadas

| Para quê | Habilidade | Caminho |
|---|---|---|
| Por que Cloudflare (grátis e permitido para uso comercial) | notas de hospedagem | `research_notes/Caça de skills 2026-10/hospedagem/pesquisa.md` |
| Prints no tamanho de celular e teste com dois aparelhos (feito com Playwright direto; a skill cobre o mesmo) | webapp-testing | `skills/sites/webapp-testing/SKILL.md` |
