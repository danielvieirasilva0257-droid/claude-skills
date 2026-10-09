# claude-skills: a base de conhecimento do Daniel para o Claude

Este repositório existe para o Claude usar e ir melhorando. Ele guarda skills do Claude, anotações e relatórios de pesquisa, e os projetos de vídeo do app "Rotina".

## Antes de qualquer tarefa (economia de créditos)

1. Leia **só** o `HABILIDADES.txt`, o índice de habilidades com uma linha por item e o caminho de cada uma.
2. Escolha a habilidade e abra apenas o arquivo indicado. Não percorra o repositório para descobrir o que existe.
3. Ao criar, mudar ou remover uma habilidade, atualize o `HABILIDADES.txt` no mesmo commit.

## Combinado com o usuário

- **Idioma:** fale com o usuário em português do Brasil. Ele está aprendendo inglês aos poucos, então:
  - **Em português, sempre:** o essencial, para ele não precisar traduzir. Isso inclui conversas, resumos, perguntas e decisões, relatórios, propostas de skill para aprovação e instruções de uso.
  - **Pode ficar em inglês:** material técnico e de apoio, como código, comentários de código, logs e anotações brutas de pesquisa.
- **Skills precisam de aprovação.** Ao encontrar uma versão melhor de uma skill, ou ao querer mudar uma, mostre primeiro a skill atualizada e pergunte antes de salvá-la no repositório. As skills ficam em `skills/` e `.claude/skills/`.
  - Escreva a proposta no scratchpad, envie com SendUserFile e resuma o que mudou.
- **Conhecimento pode ser atualizado livremente.** Anotações de pesquisa, relatórios e documentação podem ser criados e atualizados sem perguntar, para a base ficar cada vez melhor. Ficam em `research_notes/`, `reports/` e nos READMEs.
- **Salve sempre:** faça commit e push do trabalho aos poucos, porque o container da nuvem é temporário.

## Estrutura

| Caminho | O que é |
|---|---|
| `skills/` | Skills escritas neste repositório: `remotion-video`, `button-animation`, `thumbnail-carousel`, `ui-ux-pro-max` |
| `.claude/skills/motion-video/` + `motion-studio/` | Kit motion-video: motor de motion em canvas, sem Remotion. O Claude Code carrega sozinho. |
| `rotina-video/` | Projeto Remotion dos vídeos do app Rotina: `Rotina` (teaser de 10 s) e `RotinaExplainer` (60 s com voz e música) |
| `research_notes/<tema>/` | Anotações brutas da pesquisa (a maioria em inglês), cada uma com uma seção "PENDENTE / NÃO PESQUISADO" |
| `reports/` | Relatórios finais de pesquisa, em português |

## Notas do ambiente (container da nuvem, sem GPU)

- **Remotion:** versão 4.0.534. Mantenha todos os pacotes `@remotion/*` na mesma versão exata.
  - Renderize com `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`.
  - Para 3D, acrescente `--gl=swangle`.
- **motion-studio:**
  - Instale com `PUPPETEER_SKIP_DOWNLOAD=1 npm install` e uma `.venv` com numpy e scipy.
  - Renderize com `PUPPETEER_EXECUTABLE_PATH` apontando para um script que roda `/opt/pw-browsers/chromium-1194/chrome-linux/chrome --no-sandbox "$@"`, porque o container roda como root.
  - Se um render travar, refaça só a faixa que falta: `FROM=a TO=b node tools/render.mjs projects/<nome> full 8777`.
- **Proxy:** o HTTPS de saída passa por um proxy que intercepta TLS, então ferramentas em Python podem precisar do certificado em `/root/.ccr/ca-bundle.crt`.
- **Desempenho:** a máquina tem só 4 CPUs. Evite rodar vários renders ao mesmo tempo, porque eles disputam a CPU e podem travar.
