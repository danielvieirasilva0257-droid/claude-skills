---
name: combo-copy-humanizada
description: Combo para escrever texto que convence e não parece escrito por IA. Primeiro usa a skill copywriting para escrever, depois a skill humanizer para tirar o jeito de IA. Use para páginas, anúncios, legendas, posts, e-mails curtos e roteiros de vídeo/narração, sobretudo em português do Brasil.
---

# Combo: copy que convence + copy que soa humana

Este combo **não repete** o conteúdo das skills: ele diz a ordem, o que ajustar em cada passo e o que já foi aprendido ao juntá-las. Abra cada skill só quando chegar ao passo dela.

## Skills ligadas (na ordem de uso)

| Passo | Skill | Caminho |
|---|---|---|
| 1. Escrever | copywriting | `skills/texto/copywriting/SKILL.md` (referências em `skills/texto/copywriting/references/`) |
| 2. Humanizar | humanizer | `skills/texto/humanizer/SKILL.md` (padrões em `skills/texto/humanizer/references/patterns.md`) |
| Se for roteiro de vídeo | combo-video-explicativo | `skills/combos/combo-video-explicativo/SKILL.md` |
| Se o texto virar voz | voz-pt-br | `skills/audio/voz-pt-br/SKILL.md` |

## Passo a passo

1. **Briefing numa mensagem só.**
   - Veja se existe `.agents/product-marketing.md` ou `.claude/product-marketing.md` e use o que tiver ali.
   - Pergunte só o que faltar: o objetivo e a **única** ação que o leitor deve fazer, o público e as objeções dele, o produto e o diferencial, as provas reais (números, depoimentos), de onde vem o tráfego, o tom e o idioma.
   - Para vídeo: a duração e o número de falas.
2. **Escreva com a `copywriting`.**
   - Leia o `SKILL.md` dela e abra as referências só quando precisar (títulos e estrutura em `copy-frameworks.md`; a lista proibida em `ai-tells.md`).
   - Entregue o texto com anotações e 2 ou 3 alternativas de título e de chamada para ação (CTA).
   - Faltou prova ou diferencial? Escreva `[NEED: ...]` e **não invente**.
3. **Autoconferência rápida** (a da própria `copywriting`): procure os padrões proibidos, releia as frases com mais de 20 palavras e leia em voz alta.
4. **Humanize com a `humanizer`.**
   - Rode `rewrite` com `--purpose marketing`.
   - Escolha a voz pelo tipo de texto:

     | Texto | Voz |
     |---|---|
     | anúncio ou Reels com energia | `casual` |
     | tutorial, onboarding, explicação | `warm` |
     | institucional ou comunicado | `professional` |
     | documentação técnica | `technical` |

   - Se o usuário já trouxe um texto pronto, rode antes um `detect` para ver o que de fato soa como IA, e mexa **só** nisso.
   - **Se o texto já soa humano, não mexa.** O `humanizer` avisa que o melhor corte às vezes é nenhum.
5. **Reconferir depois de humanizar** (a ordem das skills pode criar conflito):
   - **Os fatos continuam iguais?** Números, nomes, recursos e prazos não podem mudar.
   - **Ficou claro?** A `copywriting` põe clareza acima de esperteza. Se a "alma" do `humanizer` tornou um título menos claro, volte ao título anterior.
   - **A CTA continua única, clara e no fim?** Os truques de "tangente", "começar no meio do pensamento" e "terminar sem fechar" são para ensaios e posts, **não** para CTA nem para título de conversão.
   - **Não trocou um tique por outro?** Trocar por sinônimo cria tiques novos. Conserte a partir dos fatos.
6. **Entregar** o texto final, com um resumo curto do que mudou (antes e depois dos trechos principais) e os `[NEED: ...]` que ainda faltam. Peça a aprovação do usuário.
7. **Salvar o aprendizado:** acrescente o que descobriu em `skills/texto/copywriting/APRENDIZADOS.md`, em `skills/texto/humanizer/APRENDIZADOS.md` e no "Histórico" deste combo.

## Português do Brasil: o que procurar

As duas skills foram escritas para inglês. A **estrutura** dos tiques de IA vale igual em português; o **vocabulário** muda. Esta lista é **adaptação nossa** (julgamento do Claude, ainda a validar com uso real), não vem das skills originais:

- **Contraste revelador:** "Não é só X, é Y", "Mais do que X, é Y", "Muito além de X".
- **Aberturas de estoque:** "No mundo acelerado de hoje", "Em um mundo cada vez mais...", "Você já parou para pensar...", "Seja você X ou Y".
- **Frases de propaganda:**
  - "Descubra o poder de", "Desbloqueie", "Leve para o próximo nível", "Revolucione", "Diga adeus a";
  - "A solução definitiva", "sem complicação" repetido.
- **Palavras de enfeite:** "mergulhe", "navegar pelo cenário", "ecossistema", "jornada", "robusto", "otimizar", "potencializar", "alavancar", "transformar" (quando está no lugar de um fato).
- **Estrutura:**
  - listas de negação ("sem X, sem Y, sem Z");
  - pergunta que a própria frase responde ("O resultado? ...");
  - frase que se arrasta em gerúndios ("...garantindo, promovendo, impulsionando");
  - três itens por reflexo;
  - parágrafo que sempre termina num resumo.
- **Pontuação:** travessão (—) em texto curto.
- **Anglicismos do público** ("app", "deload", "PIX") ficam, porque é assim que o usuário fala. Só a sua pronúncia na voz precisa de cuidado (veja `skills/audio/voz-pt-br/SKILL.md`).

## Se o texto for um roteiro de vídeo (narração)

- Escreva **para o ouvido**: frases curtas, palavras fáceis de falar, sem siglas confusas, uma fala por momento do vídeo.
- Depois de humanizar, **leia em voz alta ou rode a voz** para ouvir o ritmo. Frase que trava na voz precisa ser reescrita.
- Cada fala vira um arquivo de voz e define o tempo do vídeo (`combo-video-explicativo`, passos 2 e 3). Mudar o texto depois desalinha tudo, então feche o texto **antes** de gerar a voz.

## Histórico do combo

- **09/10/2026:** criado quando o usuário pediu para usar a `copywriting` e depois a `humanizer`. Ainda não foi usado em um texto real. O primeiro uso será o roteiro do próximo vídeo do Rotina.
- **04/11/2026:** usado no roteiro do Rotina v7 (15 falas). Aprendizado: num roteiro de demonstração, conferir cada frase contra o que o app faz de verdade antes de gravar a tela ("dois toques" era falso e saiu).
