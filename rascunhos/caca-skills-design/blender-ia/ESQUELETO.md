# Esqueleto da skill blender-ia (montado antes das pesquisas, 11/10/2026)

Base já conhecida (research_notes/Motion design 3D e voz IA/3d_pipeline.md e 3d_round2.md; remotion-video SKILL.md):
- Blender 5.2.2 LTS (tarball 383 MB, 9 s download, 24 s extração) em scratchpad/3d/blender-dl/.
- Container: 4 vCPU, 15 GB, sem GPU, sem libEGL. Eevee em `-b` aborta (libEGL); Eevee com xvfb-run + llvmpipe funciona mas não é mais barato que Cycles.
- Cycles CPU + OIDN 1080x1920: 45,8 s/quadro a 64 spp (medido ocioso); ~20/27 s a 16/32 spp (estimado). 16 spp ~ igual a 64 spp.
- Plano de 3–5 s: 30–50 min (16 spp). Use em 1–2 planos-herói.
- blender-mcp (ahujasid) precisa da interface gráfica (socket no add-on); headless = `blender -b -P script.py`.
- Poly Haven: CC0. Celular genérico procedural (evitar render de produto Apple).
- Pendentes antigos: alpha round-trip para Remotion, motion blur/DOF custo, flicker OIDN, Sketchfab/Poly Pizza, geradores 3D por IA e licenças.

Seções planejadas do SKILL.md:
1. Quando usar Blender x Remotion/R3F x CSS 3D (tabela de decisão)
2. Regras de ouro
3. Rodar no container (headless): instalar, comando, Cycles CPU, tempos, Eevee
4. Rodar na máquina do Daniel (com GPU e MCP): blender-mcp, instalação, segurança
5. Receitas bpy: cena vazia, câmera suave (bezier/ease, track-to), turntable, luz de estúdio (3 pontos + HDRI), materiais de celular, tela com imagem/sequência, render transparente
6. Assets por IA e bancos de assets (licenças)
7. Integração com Remotion (sequência PNG RGBA como camada)
8. Tempos medidos
9. Regras de composição do editor aplicadas ao 3D
10. Checklist
