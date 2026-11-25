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
