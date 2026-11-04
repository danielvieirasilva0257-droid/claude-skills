# Aprendizados: watch

Adendos datados. O mais novo fica embaixo. O SKILL.md original fica intacto.

## 04/11/2026: primeiro uso (referência do vídeo Rotina v7)

- **Para que serve:** "assistir" a um vídeo (link ou arquivo): tira quadros com horário e pega a transcrição. Use para estudar um vídeo de referência antes de criar um estilo.
- **Como rodar aqui no container:**
  1. `pip install yt-dlp` (o ffmpeg já vem instalado).
  2. `python3 scripts/setup.py --engine local` e depois `python3 scripts/setup.py --backend none --detail token-burner` (sem chave do Gemini e sem baixar o WhisperX de 1,5 GB).
  3. `python3 scripts/watch.py "<arquivo.mp4>" --question "<pergunta>" --out-dir <scratchpad>`.
- **Para estudar motion, os quadros dela não bastam.** No modo `token-burner` ela pegou só 10 quadros de um vídeo de 27 s (só as trocas de cena). Para ver transições e ritmo, complete com folhas de quadros a 4 fps (ffmpeg `fps=4,tile=9x4`, 9 s por folha), como no §13 da skill `motion-video-director`.
- **Modo Gemini** (o Gemini assiste ao vídeo inteiro, com áudio): precisa de `GEMINI_API_KEY` em `~/.config/watch/.env`. A chave do Google AI Studio que o Daniel já usa para a voz serve. Ainda não testado.
- **Transcrição:** sem legendas e com `--backend none`, ela não transcreve. Para o áudio, use o faster-whisper (veja `skills/video/motion-video-director/APRENDIZADOS.md`).
