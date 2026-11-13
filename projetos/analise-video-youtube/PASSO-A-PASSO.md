# Análise de vídeo do YouTube → guia de produção de conteúdo

## Primeira análise: LK1GKHCdNAA (13/11/2026)

- **Vídeo:** "Você não faz ideia como o YouTube funciona. E eu vou te provar." (Breno Perrucho + Gabriel Saab, 32:27)
- **Entregas:** `reports/analise-video-LK1GKHCdNAA/`. Ficaram em `reports/` (e não na raiz, como o pedido dizia) por causa da regra de raiz limpa.
  - `analise.md`: resumo, gancho de 3/10/30 s, linha do tempo, loops, técnicas, conceitos, frases-modelo e o esqueleto
  - `mapa-mental.md`: Mermaid mindmap
  - `processo.md`: Mermaid flowchart + tabela "o que fazer em cada etapa"
  - `mapa-construcao.html`: **a entrega principal (pedido do Daniel em 13/11).** Mapa mental navegável da arquitetura do vídeo, da ideia à publicação, com 9 fases e ~70 ramos. Clicar num ramo abre os filhos e um painel com: o que é, por que funciona, como aplicar, estrutura (filhos), exemplo no vídeo com tempo, frase-modelo e erros comuns. Botões anterior/próximo percorrem o mapa na ordem de construção. O D3 7.9.0 está embutido no arquivo (funciona sem internet). Skill de design usada: `skills/design/frontend-design/SKILL.md`
  - (o `slides.html` foi removido: o Daniel não quer slides com checklist, quer um mapa/arquitetura)
  - `template-roteiro.md`: template em branco
  - `prompt-roteiro.md`: prompt pronto para a IA escrever o roteiro
- **O vídeo e os quadros foram apagados no fim.** Só as análises ficaram.

## Como foi feito (o caminho que funcionou neste container da nuvem)

1. **Skill `watch`** (bradautomates/claude-video, v0.3.2). Não está no repositório; foi instalada no container:
   - `npx -y skills add bradautomates/claude-video --skill watch -g -y` (fica em `~/.agents/skills/watch`)
   - `pip install yt-dlp` (o `ffmpeg` já existe)
   - `python3 ~/.agents/skills/watch/scripts/setup.py --engine local` e depois `--backend none --detail balanced` (sem Whisper na nuvem, sem chave)
2. **O YouTube não baixa daqui.** Mesmo com o YouTube liberado na rede, ele responde "Sign in to confirm you're not a bot" para o IP da nuvem. Sites de download (ytdown) mostram uma verificação da Cloudflare. **Não tente burlar nenhuma dessas verificações.**
3. **O que funcionou:** o Daniel baixou o MP4 no ytdown pelo celular, subiu numa pasta do Google Drive compartilhada por link e eu baixei com:
   - `curl -sSL -o video.mp4 "https://drive.usercontent.google.com/download?id=<ID>&export=download&confirm=t"`
   - Hosts liberados no ambiente: `drive.google.com`, `drive.usercontent.google.com`. O `gdown` não serve, porque redireciona para `*.googleusercontent.com`, que é bloqueado.
4. **Quadros:** `watch.py <video.mp4> --no-whisper --detail balanced --max-frames 160`. Depois, juntei os quadros em **folhas de contato 4×4 com o tempo de cada um** (script em Python com Pillow) para ver 16 quadros por leitura. São 10 imagens para 32 min.
5. **Transcrição local, grátis e sem chave:** faster-whisper `small`, em int8, na CPU, num venv. Levou cerca de 5 min para 32 min de áudio.
   - Hosts do Hugging Face liberados: `huggingface.co`, `cas-server.xethub.hf.co`, `us.aws.cdn.hf.co`, `cas-bridge.xethub.hf.co`, `transfer.xethub.hf.co`.
   - **Problema:** o `PyAV` novo quebra o `decode_audio` (`metadata_errors`). **Solução:** extrair um WAV mono de 16 kHz com o ffmpeg e passar para o `transcribe()` um array numpy lido com o módulo `wave`.
   - Comando: `ffmpeg -i video.mp4 -vn -ac 1 -ar 16000 audio.wav`, depois `model.transcribe(arr, language="pt", beam_size=1, vad_filter=True, condition_on_previous_text=False)`.
6. **Mapa conferido** com o Playwright em 1440×860 e no iPhone 13 (clicar, abrir tudo, anterior/próximo): sem erros e sem rolagem lateral.
   - Cuidado 1: o cdnjs é bloqueado neste container. Embuta a biblioteca (`npm pack d3@7.9.0`, copie `dist/d3.min.js` para dentro do HTML).
   - Cuidado 2: um `<svg>` com `position:fixed; inset:0` fica com 300×150; ponha `width:100%; height:100%` explícitos.

## Aprendizados

- **Preferência do Daniel (13/11/2026):** para guias de produção, ele quer **mapa mental navegável / arquitetura** (clicar e ver a explicação: o que é, por que funciona, como aplicar), e **não slides com checklist**. Foco em estrutura de roteiro e de vídeo (gancho, começo, meio, fim), não em teoria do algoritmo.

- Para vídeos do YouTube na nuvem: **peça logo o MP4 (Drive) ou uma chave do Gemini** (motor `gemini` da skill `watch`, em que o Google assiste pelo link). Não perca tempo tentando o yt-dlp direto.
- A chave do Gemini **não** dá para salvar pelo formulário de credencial, porque ela vai no cabeçalho `x-goog-api-key`. Ela entra pelas configurações do ambiente (segredo de rede) ou colada no chat e salva só no container.
- No celular, a janela de aprovação de mudança de rede pode ser recusada sozinha. Peça ao Daniel para aprovar pelo navegador.
- A transcrição small erra nomes próprios. Confira os nomes nos quadros (texto na tela) antes de citar.

## Próximo passo

- Usar o `template-roteiro.md` e o `prompt-roteiro.md` num vídeo real do Daniel e anotar aqui o que funcionou.
- Se isso virar rotina: propor ao Daniel uma skill `texto/analise-de-video` (ou um combo com `combo-copy-humanizada`) com este fluxo.

## Habilidades usadas

- `watch` (fora do repositório, instalada no container): `~/.agents/skills/watch/SKILL.md`
- Referência de roteiro e copy: `skills/combos/combo-copy-humanizada/SKILL.md` (não foi usada desta vez; boa para a próxima etapa, roteiro → texto final)
