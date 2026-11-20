# claude-skills: a base de conhecimento do Daniel para o Claude

Este repositório existe para o Claude usar e ir melhorando. Ele guarda as habilidades (skills) do Claude, as anotações e os relatórios de pesquisa, e um passo a passo de cada projeto.

## Antes de qualquer tarefa (economia de créditos)

0. **Primeira conversa ou dúvida sobre como organizar algo:** leia o `guia/LEIA-ANTES-DE-USAR.md` (manual de utilização do repositório). Ele explica cada pasta, cada tipo de arquivo e como adicionar ou mudar coisas.

1. Leia **só** o `guia/HABILIDADES.txt`: é o índice das habilidades, com uma linha por item e o caminho de cada uma.
2. Escolha a habilidade e abra apenas o arquivo indicado. Não percorra o repositório para descobrir o que existe.
3. Se a tarefa continuar um projeto já existente, leia o `projetos/<nome>/PASSO-A-PASSO.md` dele, que diz o que foi feito e quais habilidades usar.
4. Ao criar, mudar ou remover uma habilidade ou um projeto, atualize o `guia/HABILIDADES.txt` no mesmo commit.

## Como organizar

- **Raiz limpa:** na raiz ficam só `CLAUDE.md`, `README.md` e `.gitignore`. Índice e manual ficam em `guia/`; todo o resto em pastas organizadas.

- **Habilidades** ficam em `skills/<categoria>/<nome>/`, na branch `main`. Categorias: `video`, `audio`, `design`, `texto`, `sites`, `ferramentas-de-skills` e `combos` (categoria nova só com aprovação). Cada pasta de skill tem:
  - `SKILL.md`: a skill original. Para mudá-la, é preciso **aprovação** do usuário.
  - `APRENDIZADOS.md`: **adendos datados**, com o mais novo embaixo, sobre o que foi aprendido usando a skill. Pode ser atualizado **livremente**, sempre que algo novo for aprendido.
  - `scripts/` e `assets/`, se a skill tiver.
- **Combos:** quando duas ou mais skills funcionarem bem juntas (por exemplo, vídeo + copy), crie `skills/combos/combo-<nome>/SKILL.md` com:
  - os **links (caminhos)** das skills usadas;
  - o passo a passo com os pontos de aprovação;
  - os avisos aprendidos ao combiná-las.
  - Liste o combo na seção COMBOS do `guia/HABILIDADES.txt` e avise o usuário que ele foi criado.
- **Ao terminar uma tarefa**, salve o que aprendeu:
  - o `PASSO-A-PASSO.md` do projeto;
  - os `APRENDIZADOS.md` das skills usadas;
  - o histórico do combo, se houver.
  - Assim, da próxima vez não é preciso repensar o caminho.
- **Projetos** têm uma pasta em `projetos/<nome>/` com **apenas** o `PASSO-A-PASSO.md`. Ele registra:
  - o que foi feito e como;
  - os comandos usados;
  - os aprendizados e o próximo passo;
  - os **caminhos** das habilidades usadas.
  - Nunca copie skills para dentro de projetos.
- **Código de projetos** (fontes, áudios, vídeos) fica fora da `main`, numa branch do projeto ou num repositório próprio. O `PASSO-A-PASSO.md` diz onde.

## Combinado com o usuário

- **Idioma:** fale com o usuário em português do Brasil. Ele está aprendendo inglês aos poucos, então:
  - **Em português, sempre:** o essencial, para ele não precisar traduzir. Isso inclui conversas, resumos, perguntas e decisões, relatórios, propostas de skill para aprovação, instruções de uso e o PASSO-A-PASSO.
  - **Pode ficar em inglês:** material técnico e de apoio, como código, comentários de código, logs e anotações brutas de pesquisa.
- **Skills precisam de aprovação.** Ao encontrar uma versão melhor de uma skill, ou ao querer mudar uma, mostre primeiro a skill atualizada e pergunte antes de salvá-la no repositório.
  - Escreva a proposta no scratchpad, envie com SendUserFile e resuma o que mudou.
- **Conhecimento pode ser atualizado livremente.** Anotações de pesquisa, relatórios, passo a passo de projetos e documentação podem ser criados e atualizados sem perguntar. Ficam em `research_notes/`, `reports/`, `projetos/` e nos READMEs.
- **Licença não trava o uso de skill (decisão do Daniel, 12/10/2026).** Toda skill que está no repositório pode ser usada em qualquer projeto, inclusive de cliente.
  - Ao usar uma skill, **não pergunte, não avise e não recuse por causa de licença.**
  - Ao trazer uma skill nova, **não a descarte por licença.** Guarde o arquivo `LICENSE` que vier junto e o `ORIGEM.md` (de onde veio), só como registro.
  - A regra é sobre **skills**. Termos de serviços externos (hospedagem, vozes, músicas e vídeos gerados por IA) e produtos pagos são fatos práticos: cite numa linha quando mudarem o resultado, sem bloquear o trabalho.
- **Salve sempre:** faça commit e push do trabalho aos poucos, porque o container da nuvem é temporário.
- **Vídeos e animações:** o usuário é editor de motion profissional. Siga sempre as 4 regras de composição dele:
  1. nada de texto sobre texto, nem logo sobre texto;
  2. nenhum recorte (máscara) cortando a animação no meio da tela;
  3. o elemento principal (o celular) fica por cima do texto;
  4. o texto entra de fora do quadro ou de trás do elemento principal.
  - Detalhes e como fazer: `skills/video/remotion-video/SKILL.md`, seção "Regras de composição do editor".
- **Nome de arquivos de mídia gerada** (voz, música): `<modelo>_<voz-ou-estilo>_<trecho>.<ext>`, por exemplo `gemini-3.8-flash-tts_Zephyr_abertura.mp3`.
- **Chaves de API** (ex.: Google AI Studio) **nunca** vão para o repositório. Guarde no container em `/root/.config/rotina/` e peça de novo ao usuário quando o container for novo.

## Estrutura

| Caminho | O que é |
|---|---|
| `CLAUDE.md`, `README.md` | Os únicos arquivos da raiz (precisam ficar lá para os programas acharem) |
| `guia/HABILIDADES.txt` | Índice rápido de tudo: habilidades, conhecimento, projetos e conectores |
| `guia/LEIA-ANTES-DE-USAR.md` | Manual de utilização do repositório |
| `skills/<categoria>/<nome>/` | Uma pasta por habilidade, dentro da categoria: `video`, `audio`, `design`, `sites`, `texto`, `ferramentas-de-skills` e `combos` |
| `projetos/<nome>/PASSO-A-PASSO.md` | Passo a passo de cada projeto, com os caminhos das habilidades usadas |
| `research_notes/<tema>/` | Anotações brutas da pesquisa (a maioria em inglês) e amostras de voz. A caça de skills de outubro de 2026 fica em `research_notes/Caça de skills 2026-10/` (o catálogo de fichas começa em `catalogo/INDICE.md`) |
| `reports/` | Relatórios finais de pesquisa, em português (inclui o de pendências, com porcentagem do que está incompleto) |

## Notas do ambiente (container da nuvem, sem GPU)

- **Remotion:** versão 4.0.534. Mantenha todos os pacotes `@remotion/*` na mesma versão exata.
  - Renderize com `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`.
  - Para 3D, acrescente `--gl=swangle`.
- **Kit motion-video:** veja `skills/video/motion-video/APRENDIZADOS.md`. Ele precisa de um script que roda o Chrome com `--no-sandbox`, porque o container roda como root.
- **Proxy:** o HTTPS de saída passa por um proxy que intercepta TLS, então ferramentas em Python podem precisar do certificado em `/root/.ccr/ca-bundle.crt`.
- **Desempenho:** a máquina tem só 4 CPUs. Evite rodar vários renders ao mesmo tempo, porque eles disputam a CPU e podem travar.
- **Docker:** está instalado, mas não sobe sozinho. Rode `nohup dockerd > /tmp/dockerd.log 2>&1 &`.
  - O registro `public.ecr.aws` responde "Data limit exceeded"; puxe do Docker Hub (no Supabase: `SUPABASE_INTERNAL_IMAGE_REGISTRY=docker.io`).
- **Expo:** o proxy bloqueia a API da Expo. Use `EXPO_OFFLINE=1` em `npx expo install` e `npx expo export`.
