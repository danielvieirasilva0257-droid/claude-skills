# Aprendizados: combo-video-explicativo

Adendos datados. O mais novo fica embaixo.

## 09/10/2026: roteiro com copy

- **Para escrever ou melhorar o roteiro** (passo 2 do combo), use o combo `skills/combos/combo-copy-humanizada/SKILL.md` (copywriting e depois humanizer). Ele já traz a seção de roteiro de narração: escrever para o ouvido, uma fala por momento e fechar o texto **antes** de gerar a voz.
- Isto é um aviso. O `SKILL.md` deste combo só muda com a aprovação do usuário, e a inclusão desse passo fica como proposta.

## 09/10/2026: promo v2 do Rotina (30 s, visual novo, celular 3D)

Ordem que funcionou, do zero ao vídeo final, numa sessão (passo a passo completo em `projetos/rotina/PASSO-A-PASSO.md`):
1. **Roteiro** com `combo-copy-humanizada`, aprovado pelo usuário.
2. **Voz** num pedido só, acelerada com `atempo`. Aperte as pausas e alinhe com WhisperX. O `voz.json` vira a fonte de todos os tempos.
3. **Grade da música:** escolha o BPM e a fase para que a virada caia numa palavra-chave. Defina as seções pelos tempos da voz.
4. **Rig do celular**, depois as telas do app (JPEG), depois o celular 3D (PNG) e por fim as camadas 2D.
5. **Efeitos** pela mesma lista de palavras, depois a mixagem e a medição da voz contra o fundo.
6. **Rascunho** em meia resolução e revisão em folhas de quadros. Depois o render final e a transcrição do áudio final.

**Avisos:**
- **Duração × velocidade:** quando o pedido traz as duas, calcule antes a duração da fala para ver se cabem juntas. Se não couberem, diga ao usuário qual foi a escolha.
- **Ajudantes em paralelo** (subagentes) gastam a mesma cota da sessão. Um ajudante parou no meio por limite de uso, e o trabalho dele se perdeu. Peça que salvem arquivos parciais, ou faça a tarefa no agente principal.
- **Tempo de render** (4 CPUs): telas ~1,5 min, celular 3D ~11 min, rascunho 72 s e final 3 min. A sessão inteira leva umas 3–4 horas de trabalho.

## 10/10/2026: revisão de composição antes do render final

- **Na revisão das folhas de quadros, confira as 4 regras do editor:**
  - texto sobre texto;
  - recorte no meio da tela;
  - texto na frente do celular;
  - texto que surge do nada.
  - Elas estão em `skills/video/remotion-video/APRENDIZADOS.md`, adendo de 10/10/2026.
- **Ordem que funcionou para corrigir o v2:**
  - reescrever as entradas (`Entra`, `Atras`, `PalavraDividida`);
  - conferir com o celular em silhueta, sem esperar o 3D;
  - renderizar de novo só a camada 3D afetada;
  - mover os efeitos sonoros para os novos quadros de pouso;
  - medir a voz contra o fundo outra vez, porque sons em lugares novos mudam a mixagem.

## 11/10/2026: proposta aprovada e salva no SKILL.md

- O Daniel aprovou a proposta com os aprendizados do Rotina v2. O `SKILL.md` agora incorpora tudo até 11/10/2026, já com os caminhos das pastas por categoria.

## 12/10/2026: Rotina v3 com o 3D no Blender

- O esqueleto do combo funcionou trocando o 3D em React pelo Blender. Ordem que mudou: as telas do app ficam prontas **antes** do 3D (viram a textura), e o layout é revisado com o celular em silhueta antes de 2 h 40 min de render. Trilha, efeitos e mixagem são feitos **enquanto** o Blender roda.
- Proposta (espera aprovação): um combo próprio, `combo-promo-3d-blender`. Detalhes: `projetos/rotina/PASSO-A-PASSO.md` (item 6) e `reports/Vídeo Rotina v3, skills e combos usados (2026-10-12).md`.

## 13/10/2026: Rotina v4 (o v3 ficou "simples demais")

- O Daniel comparou o v3 (39 skills lidas, "premium contido", palco escuro) com o v2.1 (menos skills, sistema "papel e tinta") e preferiu o v2.1 com folga. **Escolha o sistema visual antes de aplicar as outras skills.** Para promo de app em Reels, o padrão dele é: fundos que mudam por seção (papel com grade, vermelho, tinta com brilho), Anton gigante com serifa itálica de acento, peças do app saindo do celular em tamanho grande e algo acontecendo o tempo todo.
- O v4 juntou o celular do Blender do v3 com esse sistema. Voz, trilha e poses foram reaproveitadas; só a camada 2D e 136 quadros da tela mudaram. Detalhes: `projetos/rotina/PASSO-A-PASSO.md` (item 7).

## 17/10/2026: Rotina v5 a partir de um vídeo-modelo

- Quando o Daniel manda um modelo ("faz igual, nesse estilo"), separe o que copiar do que manter. Do modelo: ordem das cenas, tipo de movimento, ritmo da voz e formato (16:9). Do app: fonte, ícones e cores de categoria (ele pediu isso de novo no v5).
- Ordem que funcionou: analisar o modelo (folhas de quadros + transcrição com tempos) → roteiro no mesmo número de falas e no mesmo ritmo → voz → trilha na grade da voz → abertura no Blender → cenas 2D → efeitos → revisão.
- Avise na entrega o que o modelo faz contra as regras do editor (no v5, as palavras reveladas no meio do quadro). Detalhes: `projetos/rotina/PASSO-A-PASSO.md` (item 8).

## 17/10/2026: Rotina v6 (vertical, mais longo, foco em treino)

- O Daniel gostou do celular chegando, desfocando atrás e focando no elemento que sobe (abertura do v5) e pediu isso o vídeo todo. O padrão dele agora: alternar tela em foco (frase em cima) com mergulho (cartão grande sobre o celular desfocado), uma troca por fala.
- Ordem que funcionou: roteiro (agente com copy + humanizer) → voz → trilha → telas do app → poses → rascunho com o celular em silhueta → Blender em segundo plano → efeitos e mix → rascunho real → final. Detalhes: `projetos/rotina/PASSO-A-PASSO.md` (item 9).
