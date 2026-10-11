# Origem da skill `estilos-premium`

A skill é **nossa**: o `SKILL.md` e os `references/` foram escritos em português, em 11/10/2026. Ela reúne material de três fontes, com regras diferentes de uso.

## 1. Refero Styles: só aprendizado e links, nenhum arquivo

- **Site:** https://styles.refero.design. São 1.342 estilos e cerca de 50 coleções, com um DESIGN.md gerado para cada site.
- **Pesquisa:** três agentes, em 11/10/2026: premium, animação e minimalista com os guias `/ai-agents/`. A transcrição completa está fora da skill, em `scratchpad/hunter/refero/TRANSCRICAO.md`.
- **O que diz a licença:**
  - **Termos de uso:** https://doc.refero.design/legal/terms-of-use, atualizados em 03/08/2026.
    - **Permitido (§10):** usar o conteúdo para "pesquisa de design, inspiração, referência interna e trabalho comum de design de produto". O texto também diz que **os aprendizados** podem ser usados para projetar e construir os próprios produtos, inclusive em trabalho comercial, e que dá para pôr o conteúdo em moodboards, Figma e apresentações.
    - **Proibido (§10, §13 e §14):**
      - revender, **redistribuir** ou sublicenciar;
      - **raspagem, robôs, automação ou extração sistemática** fora dos downloads documentados;
      - publicar o conteúdo como **biblioteca ou dataset independente**, ou transformá-lo em "**repositório**" ou ativo de IA concorrente;
      - usar para treinar ou avaliar modelos de IA.
  - **robots.txt** de styles.refero.design: bloqueia o site inteiro para robôs de IA (ClaudeBot, anthropic-ai, GPTBot, CCBot e outros) e bloqueia `/api/` para todos.
- **Consequência nesta skill:**
  - **nenhum DESIGN.md do Refero** foi incluído, nem trechos copiados deles;
  - **entraram:**
    - `references/indice-estilos.md`, com nome, tipo, resumo de 1 linha **escrito por nós** e link para a página;
    - `references/resenha-o-que-aprendemos.md`, `references/padroes-premium.md` e `references/movimento-sites.md`, que são **sínteses nossas**, com números agregados de vários estilos e exemplos pontuais de marcas citados como observação;
    - `references/modelo-DESIGN.md`, um modelo em branco nosso. A ordem das seções segue o formato DESIGN.md comum, que não é exclusivo do Refero; o próprio Refero diz que o formato foi popularizado pelo Google Stitch.
- **Os arquivos baixados na pesquisa** (DESIGN.md, HTML, JSON) ficam só no scratchpad, como referência interna. **Não devem ir para nenhum repositório** e podem ser apagados ao fim da sessão.
- **Caminho oficial** para pesquisa automática: o **Refero MCP** (`https://api.refero.design/mcp`, planos Pro, Team ou Lifetime, 8.000 chamadas por mês). Uso em produto ou em alto volume pede plano Business.
- **Marcas e fontes:** logos, nomes e fotos pertencem aos donos. Os textos do Refero são interpretações automáticas, não guias oficiais. As fontes citadas são, na maioria, comerciais.

## 2. Skill oficial do Refero: MIT, adaptada em partes

- **Origem:** https://github.com/referodesign/refero_skill, versão 1.0.2, commit `a9b54a3e62a6391f5f5ab7a20e4ddb32fb79a27d` (05/09/2026). Licença **MIT**, "Copyright (c) 2026 Refero". O texto está em `LICENSE-refero-skill-MIT.txt`.
- **O que adaptamos, em português e com as nossas palavras:**
  - a ideia de **travar a referência** (o que preservar, emprestar e rejeitar);
  - a **tabela de decisões** com fonte;
  - "não tire a média das referências";
  - "preserve o papel dos tokens";
  - a checklist **anti-"cara de IA"** e os testes do card, da identidade, do texto e "editorial".
- **O que não copiamos:** a skill inteira. Ela fica na pasta da pesquisa (`scratchpad/hunter/refero/minimal/skill-oficial/`). Se o Daniel quiser instalá-la, o `SKILL.md` explica como e avisa que a descrição dela se declara a skill "principal" de design.

## 3. VoltAgent/awesome-design-md: 15 fichas copiadas (MIT)

- **Origem:** https://github.com/VoltAgent/awesome-design-md, commit `13be5c05c63be24b57581162364167028020f043` (05/10/2026). Licença **MIT**, "Copyright (c) 2026 VoltAgent". O texto está em `references/marcas/LICENSE-VoltAgent-MIT.txt`.
- **Licença conferida no clone** em 11/10/2026. Os DESIGN.md fazem parte do commit, logo estão cobertos pela licença do repositório.
- **Copiadas sem alteração** para `references/marcas/` (só o nome do arquivo mudou): apple, bmw, ferrari, lamborghini, bugatti, tesla, nike, spacex, linear, vercel, stripe, notion, superhuman, raycast e framer.
- **Procedência conferida:** os arquivos não citam o Refero e seguem outro formato (cabeçalho YAML do Google Stitch). Também não têm links, scripts nem instruções embutidas.
- **Avisos:**
  - são análises "inspiradas", não guias oficiais;
  - o README de cada marca no repositório aponta para o site comercial getdesign.md;
  - as marcas continuam sendo dos donos.
- **Ficaram de fora:** as outras 58 fichas da coleção. Exemplos: BMW M, PlayStation, Spotify, Airbnb, ElevenLabs e Cursor.

## 4. Outras fontes pontuais

- **Samsung** (ausente no Refero): medidas de samsung.com/sec publicadas por https://oh-my-design.kr/design-systems/samsung (projeto `kwakseongjae/oh-my-design`, capturas de 13/07 e 29/09/2026). Não é oficial e não declara licença. Usamos **só valores pontuais**, sem copiar o texto.
- **Movimento:** CSS e JS públicos de 10 sites de estúdio (monopo, OFF+BRAND, 14islands, Lusion, Active Theory, Unicorn Studio, gsap.com, Jitter, Linear e outros). Foram **lidos como texto, sem executar**. Usamos só durações e curvas medidas; o código das receitas é nosso.

## Como atualizar

- **Refero:** abra as páginas do índice no navegador e atualize o resumo **com as suas palavras**. Para pesquisa em volume, só pelo MCP oficial. **Não rode robôs.**
- **VoltAgent:**
  ```bash
  git clone --depth 1 https://github.com/VoltAgent/awesome-design-md
  ```
  Compare `design-md/<marca>/DESIGN.md` com `references/marcas/<marca>-DESIGN.md`, confira se a licença continua MIT e mostre a mudança ao Daniel antes de trocar.
- **Skill oficial:**
  ```bash
  git clone --depth 1 https://github.com/referodesign/refero_skill
  ```
  Compare o `VERSION` e o `README.md`.
