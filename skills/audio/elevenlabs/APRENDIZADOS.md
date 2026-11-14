# Aprendizados: elevenlabs

Adendos datados; o mais novo fica embaixo. Os arquivos oficiais ficam intactos.

## 14/11/2026: entrada na base

- **Para que serve:** skills oficiais da API do ElevenLabs, só as de mídia:
  - `text-to-speech`: narração em 90+ idiomas, inclusive com voz clonada (a "Lyria" do vídeo analisado);
  - `sound-effects`: efeito sonoro a partir de uma descrição em texto, com duração e loop (o vídeo analisado usou 312 deixas de som);
  - `music`: trilha por texto ou por um **plano de composição** com seções, o que permite trilha com o tamanho exato de cada capítulo;
  - `speech-to-text`: transcrição Scribe com o tempo de cada palavra (é a que a `video-use` usa no original);
  - `voice-isolator`: tirar ruído e música de fundo de uma gravação;
  - `voice-changer`: trocar a voz de uma gravação mantendo a emoção e o ritmo.
- **Onde entra no mapa:** etapa 4 (voz) e etapa 8 (som) do `combo-video-ia-completo`. A mixagem final (ducking, −14 LUFS) continua na `trilha-e-mixagem`.
- **Chave:** `ELEVENLABS_API_KEY`; o host é `api.elevenlabs.io`. O original manda rodar `npx @elevenlabs/cli onboard init`, mas no container peça a chave ao Daniel. Primeiro tente o formulário de credencial com o cabeçalho `xi-api-key`; se ele recusar, a chave entra pelas configurações do ambiente ou colada no chat, salva só em `/root/.config/rotina/`.
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
