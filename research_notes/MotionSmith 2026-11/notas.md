# MotionSmith e a skill Motion Video Director (pesquisa de 04/11/2026)

## O conector (pago)
- MCP: https://motionsmith.miftahul.com/api/mcp (login OAuth). Autor: Miftahul Islam Efaz.
- Motor único: `motion-video-director` v3.6.4. Sem assinatura, só `account_status` e `list_engines` respondem;
  `list_styles`, `get_scripts` etc. dizem "no active subscription". Plano a partir de US$ 5,96/mês.
- Com assinatura, entrega a mais: estilos prontos, 128 fontes, 65 efeitos, 69 sons, pacotes de recursos, scripts v3.6.4.
  As instruções do servidor pedem para não salvar em disco os guias baixados.

## A skill grátis (v3.0.0)
- Repositório original `Miftahul-Islam-Efaz/Motion-graphics-skill`: não está mais acessível (privado ou apagado).
- Espelho público com os mesmos commits do autor (08/10/2026): https://github.com/mattypark/Motion-graphics-skill
- Conteúdo: `skills/motion-video-director/SKILL.md` (440 linhas) + `scripts/` (preflight.sh, preview.mjs,
  create_env.sh, normalize_env.py, analyze_ref.sh) + plugin do Claude Code (`.claude-plugin/`). Sem arquivo LICENSE.
- Fluxo: mensagem inicial → preflight → referências + história → roteiro de voz ElevenLabs → usuário manda o MP3 →
  storyboard e prévias → aprovação → render. Canvas/SVG/Three.js/GSAP em Chrome headless, ffmpeg, faster-whisper, Demucs.
- Seções úteis: direção, tipos de vídeo, catálogo de motion, efeitos de edição, princípios de animação, cor, som,
  3D, tipografia cinética, receitas de vídeos de referência, checklist de qualidade.
- Pontos a adaptar se for trazida: as 4 regras de composição do Daniel, voz Gemini (o repositório já usa), PROGRESS.md
  versus o nosso PASSO-A-PASSO.md, render no container (Chrome com --no-sandbox).

## Status
- Aguardando aprovação do Daniel para trazer como `skills/video/motion-video-director/`.
