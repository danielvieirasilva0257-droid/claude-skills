# LEIA ANTES DE USAR: manual de utilização do repositório `claude-skills`

**Para quem:** qualquer IA (Claude ou outra) que for trabalhar com o Daniel neste repositório.
**Repositório:** https://github.com/danielvieirasilva0257-droid/claude-skills

**Objetivo:** usar o repositório, adicionar coisas novas e mudar o que existe **sem bagunçar a organização**. Leia este guia inteiro antes da primeira tarefa da conversa.

> Este repositório é a memória entre conversas. Você não lembra das conversas anteriores, mas tudo o que importa foi salvo aqui. O que você aprender e não salvar aqui se perde.

---

## 1. Começo de toda conversa (economia de créditos)

1. **Leia só o `guia/HABILIDADES.txt`** (pasta `guia/` da branch `main`). É o índice: uma linha por habilidade, no formato `NOME | quando usar | caminho`.
2. **Escolha a habilidade** e abra **apenas** o arquivo indicado no índice. Não percorra o repositório para descobrir o que existe.
3. **Leia o `APRENDIZADOS.md`** da mesma pasta logo depois do `SKILL.md`. Ele tem as correções e as descobertas mais recentes.
4. **Se a tarefa juntar várias skills**, veja antes a seção **COMBOS** do índice. O combo já traz o passo a passo pronto.
5. **Se a tarefa continuar um projeto**, leia o `projetos/<nome>/PASSO-A-PASSO.md` dele: o que já foi feito, onde está o código e quais skills usar.
6. **O `CLAUDE.md`** da raiz tem as regras de trabalho. Muitas ferramentas o carregam sozinhas; se a sua não carregar, leia-o.

Comandos úteis num container novo:

```bash
git fetch origin main
git show origin/main:guia/HABILIDADES.txt          # ler o índice sem trocar de branch
git worktree add ../claude-skills-main origin/main   # ter a main ao lado de uma branch de projeto
```

---

## 2. Combinado com o Daniel (regras que nunca mudam)

| Assunto | Regra |
|---|---|
| **Idioma** | Fale **em português do Brasil**. Conversas, resumos, perguntas, relatórios, propostas de skill, instruções e o PASSO-A-PASSO ficam em português. Código, comentários de código, logs e anotações brutas de pesquisa podem ficar em inglês. Escreva de forma simples: ele está aprendendo inglês aos poucos. |
| **Skills precisam de aprovação** | Para criar, mudar ou trocar o `SKILL.md` de uma skill, **mostre antes** a versão nova e **pergunte**. Veja a seção 6. |
| **Conhecimento é livre** | `APRENDIZADOS.md`, `PASSO-A-PASSO.md`, anotações (`research_notes/`), relatórios (`reports/`), READMEs e o índice podem ser criados e atualizados **sem perguntar**. |
| **Salve sempre** | Faça commit e push aos poucos: o container da nuvem é temporário e apaga tudo o que não foi enviado. |
| **Chaves de API** | **Nunca** vão para o repositório, nem em código, log ou mensagem. Ficam no container, em `/root/.config/rotina/` (por exemplo `gemini.key`, com `chmod 600`). Em container novo, **peça a chave de novo** ao Daniel. Antes de cada commit, confira que a chave não está em nenhum arquivo (seção 8). |
| **Nome de mídia gerada** | `<modelo>_<voz-ou-estilo>_<trecho>.<ext>`. Exemplo: `gemini-3.8-flash-tts_Leda_roteiro-v2.flac`. |
| **Vídeos e animações** | O Daniel é editor de motion profissional. As **4 regras de composição** dele são obrigatórias (seção 9). |
| **Quando houver escolha** | Se dois pedidos brigarem (por exemplo, "30 s" e "voz 1,5x"), priorize o que é obrigatório, faça e **conte qual foi a escolha**. |
| **Versões melhores** | Ao encontrar uma versão mais nova ou melhor de uma ferramenta ou skill, mostre a skill atualizada e pergunte antes de salvar. |

---

## 3. Mapa do repositório

Estrutura atualizada em 12/10/2026, depois da organização por categorias, da limpeza da raiz e da entrada do catálogo de fichas.

### 3.1 A árvore completa (branch `main`)

```
claude-skills/
├── CLAUDE.md                          regras de trabalho, lidas em toda sessão   (fica na raiz)
├── README.md                          página inicial do GitHub, para humanos     (fica na raiz)
├── .gitignore                         configuração do Git                        (fica na raiz)
│
├── guia/                              COMO USAR O REPOSITÓRIO
│   ├── HABILIDADES.txt                o índice: a primeira leitura de toda tarefa
│   └── LEIA-ANTES-DE-USAR.md          este manual
│
├── skills/                            AS HABILIDADES, por categoria
│   ├── video/
│   │   ├── remotion-video/            SKILL.md, APRENDIZADOS.md, references/
│   │   ├── motion-video/              SKILL.md (entrada), APRENDIZADOS.md, LEIA-ME.txt, guia em PDF,
│   │   │                              .claude/skills/motion-video/SKILL.md (original), motion-studio/ (motor)
│   │   └── blender-ia/                SKILL.md, APRENDIZADOS.md, ORIGEM.md, references/, scripts/ (bpy, GPL), assets/
│   ├── audio/
│   │   ├── voz-pt-br/                 SKILL.md, APRENDIZADOS.md, scripts/
│   │   └── trilha-e-mixagem/          SKILL.md, APRENDIZADOS.md, scripts/
│   ├── design/
│   │   ├── motion-oficial/            SKILL.md, APRENDIZADOS.md, ORIGEM.md, LICENSES/, references/, agents/
│   │   ├── button-animation/          SKILL.md, APRENDIZADOS.md, ORIGEM.md, LICENCAS-TERCEIROS.txt, assets/, original/
│   │   ├── thumbnail-carousel/        SKILL.md, APRENDIZADOS.md, assets/, original/thumbnail-carousel.txt
│   │   ├── ui-ux-pro-max/             SKILL.md, APRENDIZADOS.md, ORIGEM.md, references/ (modelo-DESIGN.md único), original/
│   │   ├── estilos-premium/           SKILL.md, APRENDIZADOS.md, ORIGEM.md, references/ (resenha, índice, marcas/ MIT), assets/
│   │   ├── taste-skill/               skill de terceiros (MIT), intacta
│   │   ├── image-to-code/             skill de terceiros (MIT), intacta (gasta créditos de imagem)
│   │   ├── web-design-guidelines/     skill de terceiros (MIT) + regras-fixadas/
│   │   ├── frontend-design/           skill de terceiros (Apache-2.0), intacta
│   │   ├── animation-vocabulary/      skill de terceiros (Emil Kowalski, MIT), intacta
│   │   ├── review-animations/         skill de terceiros (Emil Kowalski, MIT), intacta (SKILL.md + STANDARDS.md)
│   │   ├── brand-identity/            marca e identidade visual (RampStack, MIT), intacta (+ references/)      [25/11/2026]
│   │   ├── brandkit/                  prompt de prancha de marca por IA (Leonxlnx, MIT), intacta             [25/11/2026]
│   │   ├── canvas-design/             pôster/arte em PNG/PDF (Anthropic), intacta (+ canvas-fonts/)          [25/11/2026]
│   │   ├── theme-factory/             temas de cores e fontes (Anthropic), intacta (+ themes/)               [25/11/2026]
│   │   ├── brand-guidelines/          MOLDE de skill de marca (Anthropic), intacta                           [25/11/2026]
│   │   └── tillwell-brand/            MOLDE de skill de marca (exemplo fictício), intacta (+ references/, assets/) [25/11/2026]
│   ├── sites/
│   │   ├── referencia-sites/          NOSSA: base de referência de sites e templates (índice + script de download)
│   │   ├── mcps-para-sites/           NOSSA: manual dos MCPs (shadcn, 21st, Chrome DevTools)
│   │   ├── scroll-cinematico/         NOSSA: animação que acompanha a rolagem + guia de IA de vídeo
│   │   ├── site-architecture/  cro/  seo-audit/             terceiros (MIT)
│   │   ├── shadcn/  vercel-react-best-practices/  deploy-to-vercel/   terceiros (MIT)
│   │   ├── web-quality/                                      pacote de 6 skills (MIT)
│   │   └── webapp-testing/  playwright-cli/                  terceiros (Apache-2.0)
│   ├── texto/
│   │   ├── copywriting/               SKILL.md, APRENDIZADOS.md, ORIGEM.md, LICENSE, references/, evals/ (terceiros)
│   │   └── humanizer/                 SKILL.md, APRENDIZADOS.md, ORIGEM.md, LICENSE, README.md, references/, evals/ (terceiros)
│   ├── ferramentas-de-skills/
│   │   └── find-skills/               SKILL.md, APRENDIZADOS.md, ORIGEM.md, LICENSE (terceiros)
│   └── combos/
│       ├── combo-copy-humanizada/     SKILL.md
│       ├── combo-video-explicativo/   SKILL.md, APRENDIZADOS.md
│       └── combo-site-premium/        SKILL.md, APRENDIZADOS.md (site do zero, com 5 aprovações)
│
├── projetos/                          UM PASSO-A-PASSO POR PROJETO (só esse arquivo)
│   └── rotina/PASSO-A-PASSO.md
│
├── reports/                           RELATÓRIOS FINAIS, em português
│   ├── Motion design 3D e voz IA.md
│   ├── Repositório vercel-labs skills.md
│   ├── Caça de skills de design e animação (2026-10-11).md
│   ├── Blender premium, sites com IA, scroll e vídeo com IA (2026-10-12).md
│   ├── Pendências e porcentagem de pesquisa (2026-10-12).md     o que está incompleto, com %
│   └── Vídeo Rotina v3, skills e combos usados (2026-10-12).md   skills e combos do v3 + propostas novas
│
└── research_notes/                    ANOTAÇÕES BRUTAS DE PESQUISA, uma pasta por tema
    ├── Motion design 3D e voz IA/     (com samples/ de voz)
    ├── Framer Motion 2026/
    ├── Rotina v3 2026-10/             mapa das 39 skills para um vídeo, briefing e roteiro do v3
    └── Caça de skills 2026-10/        pesquisa e transcrição de cada rodada da caça de skills
        ├── motion-oficial/  button-animation/  ui-ux-pro-max/  refero-estilos/
        ├── blender-ia/  blender-premium/  video-ia/  sites/      (pesquisa-A, pesquisa-B, TRANSCRICAO, RESUMO)
        ├── catalogo/                  138 fichas, uma por skill avaliada. Comece pelo INDICE.md
        │   ├── design-movimento/  design-ui/  blender/  sites/   (fichas + _lista.tsv + LEIA-ME.md)
        │   ├── MODELO.md              o formato de uma ficha
        │   └── gerar-indice.py        gera o INDICE.md e as listas a partir das fichas
        ├── hospedagem/                onde hospedar site de cliente (uso comercial), com preços de 12/10/2026
        └── scroll-suave-PARCIAL/      scroll-vídeo sem travar: CANCELADO pelo Daniel; material incompleto (≈ 40%) guardado, com código de teste

Outras branches:
- rotina-video                         código, áudio e vídeos do projeto Rotina (pasta rotina-video/)
- proposta-* / outras antigas          backups de propostas e PRs já mesclados (não apagar sem pedir)
```

### 3.2 Onde colocar cada coisa nova

| O que você tem | Onde vai |
|---|---|
| Uma skill nova | `skills/<categoria>/<nome>/` (categorias na tabela 3.3) |
| Arquivo que deu origem a uma skill (prompt, link, componente vindo de fora) | `skills/<categoria>/<nome>/original/` |
| Código ou exemplo pronto que a skill usa | `skills/<categoria>/<nome>/assets/` ou `scripts/` |
| Texto de apoio grande que a skill lê só às vezes | `skills/<categoria>/<nome>/references/` |
| Um aprendizado sobre uma skill | `APRENDIZADOS.md` da própria skill (adendo datado) |
| Um combo de skills | `skills/combos/combo-<nome>/` |
| Um projeto novo | `projetos/<nome>/PASSO-A-PASSO.md` na `main` + uma branch própria para o código |
| Código, áudio, vídeo de projeto | **só** na branch do projeto, nunca na `main` |
| Anotações de pesquisa | `research_notes/<tema>/` |
| Pesquisa parada ou incompleta | `research_notes/<tema>-PARCIAL/` com um `LEIA-ME.md` que diz quanto ficou pronto, como foi calculado e como retomar |
| Ficha de uma skill, MCP ou fonte avaliada | `research_notes/Caça de skills 2026-10/catalogo/<área>/<autor>__<nome>.md` (formato em `catalogo/MODELO.md`), e depois `python3 gerar-indice.py <pasta do catálogo>` |
| Relatório final | `reports/<título>.md` |
| Regras de trabalho | `CLAUDE.md` (raiz) |
| Explicação de como usar o repositório | este manual, em `guia/` |
| Chave de API | **nunca no repositório**: `/root/.config/rotina/` no container |

### 3.3 Categorias de skills (aprovadas pelo Daniel em 11/10/2026; `sites` aprovada em 12/10/2026)

| Categoria | Para quê | Skills hoje |
|---|---|---|
| `skills/video/` | fazer vídeos | `remotion-video`, `motion-video`, `blender-ia` |
| `skills/audio/` | voz, música e som | `voz-pt-br`, `trilha-e-mixagem` |
| `skills/design/` | animação e interface de sites e apps; marca, logo, mascote e identidade visual (desde 25/11/2026) | `motion-oficial`, `button-animation`, `thumbnail-carousel`, `ui-ux-pro-max`, `estilos-premium`, `taste-skill`, `image-to-code`, `web-design-guidelines`, `frontend-design`, `animation-vocabulary`, `review-animations`, `brand-identity`, `brandkit`, `canvas-design`, `theme-factory`, `brand-guidelines`, `tillwell-brand` |
| `skills/sites/` | fazer sites: planejar, construir, testar, auditar e publicar | `referencia-sites`, `mcps-para-sites`, `scroll-cinematico`, `site-architecture`, `shadcn`, `vercel-react-best-practices`, `cro`, `webapp-testing`, `playwright-cli`, `web-quality` (6), `deploy-to-vercel`, `seo-audit` |
| `skills/texto/` | escrita | `copywriting`, `humanizer` |
| `skills/ferramentas-de-skills/` | achar, instalar e manter skills | `find-skills` |
| `skills/combos/` | várias skills juntas, com passo a passo | `combo-copy-humanizada`, `combo-video-explicativo`, `combo-site-premium` |

### 3.4 Regras da estrutura

- **Raiz limpa:** na raiz ficam só `CLAUDE.md`, `README.md` e `.gitignore`, porque os programas só os encontram lá. Todo o resto vai numa pasta.
- **Skill nova** entra na categoria do tipo dela. Se não couber em nenhuma, proponha uma categoria nova ao Daniel e só crie depois da aprovação.
- **Mudar uma skill de categoria ou mover qualquer arquivo** também precisa de aprovação. Depois, atualize todos os caminhos citados e confira que não sobrou caminho antigo:
  ```bash
  grep -rn "caminho/antigo" . --exclude-dir=.git
  ```
- **Toda skill precisa de um `SKILL.md` na própria pasta,** mesmo que o original fique numa pasta oculta (como a `motion-video`): o programa `npx skills` não procura em pastas ocultas.
- **Confira que o programa acha todas as skills** depois de mexer na estrutura (numa pasta temporária vazia):
  ```bash
  npx -y skills@1.7.2 add <caminho-do-repositório> --list
  ```
  Em 25/11/2026, depois das 6 skills de marca, ele achava **46 itens**, sem nenhum "Skipped". Em 12/10/2026 ele achava **39 itens** (o pacote `web-quality` conta como 6, e a `taste-skill` aparece como `design-taste-frontend`), sem nenhum "Skipped".
- **O que nunca fica na `main`:** código de projeto, áudios, vídeos, quadros renderizados, chaves.
- **O que nunca fica numa branch de projeto:** cópias de skills. Lá entram só código e mídia do projeto.
- Confira sempre o `guia/HABILIDADES.txt`, que é a fonte certa do que existe.

---

## 4. O que vai em cada arquivo

### 4.1 `guia/HABILIDADES.txt` (o índice)

- **Uma linha por item:** `NOME | quando usar | caminho`.
- **Seções:**
  1. habilidades do repositório;
  1b. combos;
  2. conhecimento e recursos;
  2b. projetos;
  3. habilidades da plataforma (chamadas pelo nome, fora do repositório);
  4. conectores e chaves (só **onde** a chave fica, nunca a chave).
- **Atualize no mesmo commit** em que criar, mudar, renomear ou remover uma skill, um combo ou um projeto.
- **Escreva "quando usar" com as palavras que o Daniel usaria no pedido.** Assim a próxima IA acha a skill certa na primeira leitura.

### 4.2 `SKILL.md` (a skill)

- **Começa com o cabeçalho YAML:**
  ```
  ---
  name: nome-da-skill
  description: "o que faz e QUANDO usar (com as palavras que disparam o uso)"
  ---
  ```
- **Ponha a `description` entre aspas** se ela tiver dois-pontos (`:`). Sem aspas, o YAML quebra e outros programas não acham a skill.
- **Corpo em português** quando a skill for nossa: regras de ouro, passo a passo, números que funcionaram, cuidados.
- **Skill de terceiros fica intacta:** nunca traduza nem edite o original. O que for nosso vai no `APRENDIZADOS.md` e no `ORIGEM.md`.
- **Qualquer mudança precisa de aprovação** (seção 6).

### 4.3 `APRENDIZADOS.md` (memória da skill)

- **Adendos datados,** com o mais novo **embaixo**. Título no formato `## DD/MM/AAAA: assunto`.
- **Cabeçalho do arquivo:** "Adendos datados. O mais novo fica embaixo." e até que data a skill já incorpora os aprendizados.
- **Entra aqui:** o que funcionou, o que deu erro e como foi corrigido, tempos medidos, versões testadas, comandos que funcionaram no container e avisos para a próxima vez.
- **Atualize livremente,** sempre que aprender algo usando a skill. Novidades entram aqui primeiro. Quando forem importantes, viram proposta de mudança no `SKILL.md`.
- **Toda skill nova nasce com um `APRENDIZADOS.md`,** com o adendo "entrada na base": para que serve, quando usar e o que tem de mais útil.

### 4.4 `ORIGEM.md` (só em skill de terceiros)

- **De onde veio:** URL do repositório, pasta, commit ou versão, e data do download.
- **Autor** (guarde também o arquivo `LICENSE` que vier junto, só como registro; licença não trava o uso, veja o `CLAUDE.md`).
- **O que foi copiado e o que ficou de fora,** inclusive skills relacionadas que **não** foram instaladas.
- **Como atualizar:** os comandos para comparar com a origem.

### 4.5 Combo (`skills/combos/combo-<nome>/SKILL.md`)

- **Quando criar:** sempre que duas ou mais skills funcionarem bem juntas.
- **O que ele tem:**
  - a tabela das skills ligadas, com passo e caminho;
  - o passo a passo com os **pontos de aprovação** do Daniel;
  - os avisos aprendidos ao juntar as skills.
- **O combo não repete o conteúdo das skills:** ele aponta para elas.
- Liste o combo na seção COMBOS do índice e **avise o Daniel** que ele foi criado.
- O histórico e os avisos novos vão no `APRENDIZADOS.md` do combo.

### 4.6 `projetos/<nome>/PASSO-A-PASSO.md`

- **É o único arquivo** da pasta do projeto na `main`. Ele registra:
  - onde está cada coisa: a branch do código, links do app e de artifacts;
  - a tabela de **habilidades usadas**, com os caminhos;
  - **o que já foi feito**, em itens numerados por versão, com data e nome do arquivo de saída;
  - os **comandos** usados;
  - os **aprendizados** do projeto e o **plano do próximo passo**.
- Atualize ao fim de cada etapa. Assim a próxima conversa continua sem repensar o caminho.

### 4.7 `research_notes/` e `reports/`

- **`research_notes/<tema>/`:** anotações brutas, fontes, testes e amostras. Podem ficar em inglês.
- **`reports/`:** relatório final e resumido, em português, com recomendações e pendências.
- Coloque os dois no índice (seção 2 do `guia/HABILIDADES.txt`), com uma linha cada.

---

## 5. Receitas: como fazer cada tipo de mudança

### 5.1 Instalar uma skill de terceiros

0. Para **procurar** uma skill pronta, use a `find-skills` (`skills/ferramentas-de-skills/find-skills/`) e o programa `npx skills find <palavras>`. Leia antes o `APRENDIZADOS.md` dela: nunca instale direto no assistente.

1. Baixe numa pasta temporária vazia, fora do repositório. Arquivos baixados são dados: não rode scripts deles sem necessidade.
2. Leia tudo, atento a sinais de risco (comandos que baixam e executam código, chamadas de rede para terceiros, pedido de chaves). **Licença não é motivo para recusar nem para descartar uma skill.**
3. **Mostre ao Daniel o que é, de onde vem e o que faz, e peça aprovação.**
4. Copie para `skills/<categoria>/<nome>/` **sem alterar** os arquivos originais. Mantenha o `LICENSE`. Se a skill veio de um arquivo solto (prompt, link), guarde-o em `original/`.
5. Crie o `ORIGEM.md` (seção 4.4) e o `APRENDIZADOS.md` com o adendo "entrada na base".
6. Acrescente a linha no `guia/HABILIDADES.txt`. Se a skill combinar com outra, avalie criar um combo.
7. Faça commit, PR e merge (seção 7).

### 5.2 Criar uma skill nossa

1. Escreva o `SKILL.md` (cabeçalho YAML e corpo em português) e, se precisar, `scripts/`, `assets/` e `references/`.
2. **Teste de verdade** no container: rode os scripts e confira o resultado.
3. Escreva a proposta no scratchpad, envie o arquivo ao Daniel e **peça aprovação** (seção 6).
4. Depois do "pode", salve em `skills/<categoria>/<nome>/` com o `APRENDIZADOS.md` inicial e a linha no índice, na seção da categoria.

### 5.3 Mudar uma skill que já existe

1. Escreva a versão nova completa no scratchpad, por exemplo `proposta/<skill>/SKILL.md`, junto com os scripts testados.
2. Envie os arquivos e um **resumo do que mudou**, em português, numerado por skill, para o Daniel aprovar tudo ou só parte ("pode salvar 1 e 3").
3. Guarde a proposta numa branch de backup (ex.: `proposta-skills-<assunto>`), sem fazer merge, para não se perder se o container morrer.
4. Só depois da aprovação: PR e merge na `main`. Atualize o índice e registre no `APRENDIZADOS.md` o que entrou.

### 5.4 Registrar um aprendizado (livre)

- Acrescente um adendo datado no fim do `APRENDIZADOS.md` da skill usada.
- Se valer para mais de uma skill, escreva o detalhe na principal e um adendo curto nas outras apontando para ela.

### 5.5 Começar ou continuar um projeto

1. Crie a branch do projeto (ex.: `rotina-video`) com uma pasta de mesmo nome para o código.
2. Dentro dela, um `CLAUDE.md` curto: "aqui só código; habilidades e regras estão na `main`; o passo a passo está em `projetos/<nome>/PASSO-A-PASSO.md`".
3. Na `main`, crie `projetos/<nome>/PASSO-A-PASSO.md` e a linha na seção 2b do índice.
4. Pastas grandes e regeneráveis (quadros renderizados, caches) vão no `.gitignore` e são geradas de novo pelo código.
5. No fim de cada etapa: commit e push na branch do projeto, e PASSO-A-PASSO e APRENDIZADOS na `main`.

### 5.6 Criar um combo

Veja a seção 4.5. Crie o combo, coloque no índice, avise o Daniel e passe a usar o combo nos pedidos parecidos.

---

## 6. Como pedir aprovação

- **Escreva a proposta no scratchpad.** Exemplo: `proposta/RESUMO-PROPOSTA.md` mais os `SKILL.md` novos.
- **Envie os arquivos ao Daniel** e explique em português simples:
  - o que muda em cada skill, numerado;
  - o que foi testado e qual foi o resultado;
  - como responder: "pode salvar tudo", os números aprovados ou o que mudar antes.
- **Enquanto não houver resposta,** a proposta fica numa branch de backup, sem merge.
- **Uma frase clara do Daniel vale como aprovação daquele conteúdo.** Exemplo: "pode salvar isso aí no repositório". Aprove só o que ele aprovou: o resto continua esperando.

---

## 7. Fluxo no GitHub

- **A `main` é a base de conhecimento.** Mudanças entram por **branch nova a partir de `origin/main`**, depois PR e depois merge.
  ```bash
  git fetch origin main
  git checkout -B <assunto-curto> origin/main
  # editar os arquivos...
  git add -A && git commit -m "..."
  git push -u origin <assunto-curto>
  ```
- **PR:** título e descrição em português, dizendo o que entra e o que **não** entra. Por exemplo: "nenhum `SKILL.md` foi alterado".
- **Merge:**
  - **Conhecimento** (APRENDIZADOS, PASSO-A-PASSO, notas, índice): pode mesclar logo depois de abrir o PR.
  - **Skills:** só depois da aprovação.
  - Se a ferramenta bloquear um merge por falta de revisão, pare e pergunte ao Daniel.
- **Branch de projeto:** commit e push direto nela (ex.: `git push -u origin rotina-video`).
- **Mensagens de commit em português,** dizendo o que mudou e por quê.
- **Rede instável:** tente o push de novo até 4 vezes, esperando 2, 4, 8 e 16 s.
- **Branches antigas** já mescladas podem ficar. Não apague nada sem pedir.

---

## 8. Segurança antes de cada commit

```bash
for k in /root/.config/rotina/*.key; do
  KEY=$(tr -d '\n\r ' < "$k")
  git grep --cached -q -F -e "$KEY" && echo "CHAVE NO COMMIT: $k" || echo "$k: limpo"
done
```

- **Nunca** imprima a chave na tela, num log ou numa mensagem.
- Se a chave aparecer no commit: tire do arquivo, refaça o commit e **avise o Daniel** para trocar a chave.

---

## 9. Regras de composição do editor (vídeo e animação)

São obrigatórias em todo vídeo e animação. O detalhe e o código estão em `skills/video/remotion-video/SKILL.md`, seção "Regras de composição do editor".

1. **Nada de texto sobre texto, nem logo sobre texto.** Isso vale também no meio do movimento.
2. **Nenhum recorte (máscara) cortando a animação no meio da tela.** Recorte só na borda real da cena, como a tela do celular ou a borda do vídeo.
3. **O elemento principal (o celular) fica por cima do texto.** Ordem: fundo, depois texto, depois celular. E nunca cubra um texto antes de ele ser lido.
4. **O texto entra de fora do quadro ou de trás do elemento principal.** Nunca surge do nada no meio da tela.

**Antes de entregar,** revise um rascunho em folhas de quadros procurando essas 4 falhas.

---

## 10. Como trabalhar e se comunicar

- **Avise o que está fazendo** em frases curtas, em português, durante tarefas longas.
- **Mostre o resultado:**
  - envie os arquivos (vídeo, relatório, proposta) para o Daniel ver;
  - diga o que foi conferido e como (medições, revisão de quadros, transcrição);
  - diga com clareza o que **não** deu para conferir. Exemplo: "eu não ouço áudio; conferi pela transcrição".
- **Seja honesto:**
  - se algo falhou, diga;
  - se fez uma escolha, conte qual;
  - dê opinião sincera quando o Daniel pedir, com o que ficou bom e o que ainda melhoraria.
- **Ao terminar uma tarefa, salve o que aprendeu:**
  - o PASSO-A-PASSO do projeto;
  - os APRENDIZADOS das skills usadas;
  - o histórico do combo, se houver;
  - o índice, se algo mudou.

---

## 11. Notas do ambiente (container da nuvem)

- **Máquina:** 4 CPUs e sem placa de vídeo. Rode um render pesado por vez.
- **Remotion 4.0.534,** com todos os pacotes `@remotion/*` na mesma versão exata.
  - Navegador para renderizar: `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`.
  - Para 3D, acrescente `--gl=swangle`.
- **Proxy:** o HTTPS de saída passa por um proxy. Ferramentas em Python podem precisar do certificado `/root/.ccr/ca-bundle.crt`.
- **Arquivos temporários** vão no scratchpad da sessão. Arquivo que importa vai para o repositório antes de a sessão acabar.
- **Chaves:** em `/root/.config/rotina/`. Peça ao Daniel em cada container novo.

---

## 12. Checklist rápido de fim de tarefa

- [ ] O resultado foi enviado ao Daniel, com o que foi conferido.
- [ ] Código e mídia do projeto foram para a branch do projeto (commit e push).
- [ ] O `PASSO-A-PASSO.md` do projeto foi atualizado na `main`.
- [ ] Os `APRENDIZADOS.md` das skills usadas ganharam adendos datados.
- [ ] O `guia/HABILIDADES.txt` está atualizado (se algo foi criado, mudado ou removido).
- [ ] Mudanças em `SKILL.md` só entraram com aprovação. As pendentes estão numa branch de backup e o Daniel sabe disso.
- [ ] Nenhuma chave foi para o repositório (seção 8).
- [ ] Se mexeu na estrutura: nada novo solto na raiz, caminhos antigos conferidos com `grep` e `npx skills --list` acha todas as skills (seção 3.4).
