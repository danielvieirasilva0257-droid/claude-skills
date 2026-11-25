# Caça de skills de desenho e design de personagem (25/11/2026)

Pedido do Daniel: skills de **desenho e design de personagem** (bases de desenho, estilo anime/HQ). Animação 2D fica de fora (já temos). Motivo: as cabeças desenhadas "sem base" ficaram feias.

- O catálogo skills.sh não responde do container (proxy); `npx skills find` volta "No skills found" para tudo, até "remotion". Busca feita pela web e os repositórios baixados do GitHub para ler.

## Candidatas lidas (esperando aprovação para instalar)

| Skill | Repositório (commit) | Licença | O que traz | Nota |
|---|---|---|---|---|
| `image-to-svg` | shhac/skills, `skills/image-to-svg` (0c9cf75) | MIT | Recriar uma imagem (mascote, logo) em SVG por partes: recortes de referência, medidas por proporção, fichas por parte do rosto (olhos, boca, nariz, formato do rosto, cabelo, corpo, acessórios, comida, objetos), estilos (linha e pincel, geométrico/flat, curvas), loop renderizar → comparar com diff do ImageMagick → corrigir | A mais útil agora: o rosto do El Bravo é o do logo atual. Pede um subagente por parte (gasta muito crédito); dá para seguir a mesma ordem sem subagentes. Usa magick, rsvg-convert, xmllint (vtracer e svgo opcionais) |
| `character-design` | omer-metin/skills-for-antigravity, `skills/character-design` (e8dcf4e) | Apache-2.0 | Fundamentos de design de personagem: regra das 3 leituras (silhueta → cor → detalhe), linguagem de formas (círculo, quadrado, triângulo), proporções, folha de expressões, turnaround, escala (32 px), checklists de validação e erros comuns | Base teórica. Foco em personagem de jogo, mas vale para mascote |
| `svg-creation` | dvy1987/agent-loom, `.agents/skills/svg-creation` (54960e6) | MIT | Ofício de SVG estático: grade, traço, economia de caminhos, limpeza com SVGO; manda vetorizar bitmap com ferramenta (vtracer/Potrace) em vez de "decalcar no olho" | Complementa a image-to-svg na parte técnica |

## Vistas e deixadas de lado
- `tmchow/illo-skill` (ilustração editorial com mascote), `mycurelabs/mascot-character-sheet`, `s1dashu/ip-as-logo`, `jimliu/baoyu-skills@baoyu-comic` (estilos manga e ligne-claire): dependem de **gerador de imagem por IA** (chave de API), não ensinam a desenhar em código.
- `possumworx/svg-drawing` e `lev-os/agents@pencil`: o GitHub pediu login para baixar (repositório privado ou removido).

## O que o Daniel destacou nas referências (25/11/2026)
- Gostou muito do **mascote desenhado abraçando a foto real da comida** (Korean Tiger) e dos **adesivos** (stickers). Na listagem: aplicações 35 e 31/32.

## 25/11/2026 (2ª rodada): skills de HQ e mascote que usam motor de imagem
Todas precisam de um gerador de imagem por IA (no container não há chave; conectados: Higgsfield e OpenArt). Nenhuma foi instalada. O Daniel pediu para o foco continuar nas skills de desenho por código.
- `s1dashu/ip-as-logo-skill`: mascote simples e fofo que vira logo, legível em 32 px; exige modelo de imagem de ponta (GPT Image 2, Nano Banana Pro/2) e nunca cai para SVG. ~4,7 mil estrelas.
- `JimLiu/baoyu-skills@baoyu-comic`: HQ "de conhecimento" com estilos de traço (ligne-claire = linha uniforme e cor chapada, estilo Tintin; manga; realista; nanquim; giz; minimalista) e tons. MIT, ~27 mil estrelas. As fichas de estilo (`references/art-styles/`) podem servir de vocabulário de traço.
- `shinchven/nano-banana-skills@character-reference-sheet`: folha de referência do personagem mantendo a continuidade com as imagens de amostra (Nano Banana).
- `mascot-character-sheet` (Aident/mycurelabs): folha de mascote em várias vistas (Fal).

## 25/11/2026 (3ª rodada): processo de criação de personagem — todas salvas
O Daniel pediu uma skill do processo de criação de personagem (das explorações até o final, e as vistas do personagem pronto) e depois mandou **salvar todas**, com e sem motor de imagem. Entraram em `skills/design/`: `concept-art` (Omer Metin; processo, sem motor), `ip-as-logo`, `baoyu-comic`, `character-reference-sheet`, `mascot-character-sheet`, `video-character-design` (todas com motor).
Não salvas, porque dependem de um serviço pago próprio que não temos: `edhahn/agent-skills@concept-art` (ComfyUI num servidor com GPU; e tem o mesmo nome da `concept-art` instalada), `inference-sh/skills@character-design-sheet` (CLI inference.sh com login), `fal-ai-community/skills@character-design` (conta fal).
