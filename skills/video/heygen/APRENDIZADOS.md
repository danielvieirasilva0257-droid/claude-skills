# Aprendizados: heygen

Adendos datados; o mais novo fica embaixo. Os arquivos oficiais ficam intactos.

## 14/11/2026: entrada na base

- **Para que serve:** skills oficiais da HeyGen:
  - `heygen-avatar`: cria um avatar fixo (rosto + voz), por descrição ou a partir de foto;
  - `heygen-video`: vídeo com apresentador pela API v3 (Video Agent), com checagem de proporção e escolha de voz;
  - `heygen-translate`: tradução e dublagem com clone de voz e sincronia labial.
- **Onde entra no mapa:** etapa 5 (material) do `combo-video-ia-completo`, quando o vídeo tem um apresentador avatar. O avatar vira uma camada que é composta no Remotion ou no HyperFrames. A voz pode vir do ElevenLabs (como no vídeo analisado): a HeyGen sincroniza a boca com esse áudio.
- **Consentimento:** só crie avatar ou clone de voz do próprio Daniel ou de quem autorizou por escrito. A HeyGen exige vídeo de consentimento para avatar de pessoa real.
- **O avatar é o elemento principal:** nenhum texto passa na frente do rosto. Confira com `skills/video/visao-computacional/` (`conferir_regras.py`).
- **Chave e análise de uso:** `HEYGEN_API_KEY`; o host é `api.heygen.com`. Desligue a análise de uso com `export HEYGEN_NO_ANALYTICS=1`.
- **Ainda não testado** (14/11/2026): sem chave.

### Regras nossas (valem sempre)

- **Fale com o Daniel em português do Brasil.** O original fica em inglês e **intacto**; mudar o `SKILL.md` precisa de aprovação. O que aprendermos vai neste arquivo, com data.
- **Chaves de API nunca no repositório.** No container, ficam em `/root/.config/rotina/`; peça de novo em container novo. Não rode assistentes de login no navegador (`onboard`, `auth login`) no container: peça a chave ao Daniel.
- **Rede:** o host da API precisa estar liberado no ambiente (o Daniel aprova pelo navegador; no celular a janela de aprovação pode não aparecer).
- **É plataforma paga:** use só quando o Daniel pedir. As opções grátis do repositório continuam sendo o padrão: `voz-pt-br` (Gemini, Kokoro), `trilha-e-mixagem` e a transcrição local com faster-whisper.
- **Nome dos arquivos de mídia gerada:** `<modelo>_<voz-ou-estilo>_<trecho>.<ext>` (ex.: `eleven-v3_Lyria_abertura.mp3`).
- **As 4 regras de composição do editor** valem em todo quadro (`skills/video/remotion-video/SKILL.md`).
- **Licença não trava o uso** (decisão do Daniel, 12/10/2026). Os termos da plataforma (uso comercial das vozes, músicas e avatares conforme o plano) são fato prático: cite numa linha quando mudarem o resultado.
- **Mapa de uso (da ideia ao vídeo pronto):** `skills/combos/combo-video-ia-completo/SKILL.md`.
