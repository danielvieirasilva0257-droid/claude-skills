# Aprendizados: concept-art

Adendos datados. O mais novo fica embaixo. A skill ainda não incorpora nenhum aprendizado (está intacta, como veio da origem).

## 25/11/2026: entrada na base

- **Para que serve:** o **processo de criação** de personagem e de conceito, do jeito de estúdio: muitos esboços rápidos (thumbnails) → 3 a 5 direções → esboços → desenho fechado → cor → arte final, com aprovação em cada etapa; folhas de "callout" (vistas e detalhes do personagem pronto), composição por valores, sistema de linguagem de design.
- **Quando usar:** mascot folio e apresentação do processo de um personagem (das explorações até o final e as vistas do personagem pronto).
- **Motor de imagem:** Não precisa de motor de imagem: é método. No container não há chave de gerador de imagem; os conectores ligados são o **Higgsfield** e o **OpenArt** (gastam créditos de lá). Os prompts ficam em inglês e as explicações ao Daniel em português.
- **Nunca rode os comandos de instalação do original** (`npx skills add ... -g -y`, `curl | sh`): ela já está instalada aqui.
- **Problema no cabeçalho (25/11/2026):** a `description` tem dois-pontos seguido de espaço ("industry masters: Feng Zhu…") e está sem aspas, então o YAML quebra: o programa `npx skills` pula esta skill ("Nested mappings are not allowed in compact mappings") e outros programas podem não achá-la. **Correção proposta, esperando a aprovação do Daniel:** pôr a `description` inteira entre aspas, sem mudar nenhuma palavra. Enquanto isso, ler o `SKILL.md` direto pelo caminho do índice.
