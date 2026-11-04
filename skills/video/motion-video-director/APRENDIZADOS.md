# Aprendizados: motion-video-director

## 04/11/2026: adaptações para usar no repositório do Daniel (ainda não testada num vídeo)
- **Regras de composição do editor valem aqui** (obrigatórias): veja `skills/video/remotion-video/SKILL.md`, seção "Regras de composição do editor". Confira cada storyboard e prévia contra as 4 regras antes de pedir aprovação.
- **Fala e entregas em português do Brasil**: a mensagem inicial (§0a), o roteiro de voz e os resumos vão em pt-BR.
- **Voz**: a skill pede MP3 do ElevenLabs gerado pelo usuário. Alternativa já usada aqui: voz Gemini TTS (`skills/audio/`, chave em `/root/.config/rotina/`). Nome de arquivo: `<modelo>_<voz>_<trecho>.mp3`.
- **Acompanhamento**: a skill cria `PROGRESS.md` e `LOG.md` na pasta do projeto. No nosso repositório, o registro oficial é `projetos/<nome>/PASSO-A-PASSO.md` na `main`; o código e as mídias do projeto ficam numa branch do projeto.
- **Chaves de API**: a skill usa `<projeto>/.env` (fica no .gitignore). Nunca fazer commit dele.
- **Container da nuvem**: o Chromium fica em `/opt/pw-browsers/` (não rode `playwright install`); como roda como root, o Chrome precisa de `--no-sandbox` (igual ao kit motion-video). Não há GPU e só 4 CPUs: um render por vez. `analyze_ref.sh` precisa do `montage` (ImageMagick).
- **Skills parecidas no repositório**: `remotion-video` (Remotion/React) e `motion-video` (canvas, motion-studio). Esta é mais um manual de direção e produção completo, incluindo edição de vídeo gravado.
