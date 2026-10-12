# Uma geração imagem-para-vídeo no Space oficial Lightricks/LTX-2-3 (Hugging Face ZeroGPU). Grátis, mas com cota:
# sem login ~2 min/dia (não cabe: o Space pede 150 s); com conta grátis 3,5 min/dia (~1 clipe/dia).
# Licença do modelo: LTX-2.x Community (grátis abaixo de US$ 10 mi/ano de receita). Anote modelo, seed e prompt.
# Uso: python gerar_ltx.py <quadro-inicial.png> <saida.mp4> ["prompt em inglês"]
# Token (opcional, nunca no repositório): variável HF_TOKEN ou o arquivo /root/.config/rotina/hf_token.
# Requer: pip install gradio_client  (testado com 2.7.2; em 11/10/2026 parou na cota anônima, sem gerar vídeo)
import os, sys, shutil, time
from gradio_client import Client, handle_file
img, out = sys.argv[1], sys.argv[2]
prompt = sys.argv[3] if len(sys.argv) > 3 else (
    "Slow cinematic orbit around a polished champagne-gold metallic sphere floating on a dark graphite "
    "studio background, soft key light glides across the surface, subtle reflections, gentle slow motion, "
    "clean minimal premium product commercial, no text")
arq = "/root/.config/rotina/hf_token"
token = os.environ.get("HF_TOKEN") or (open(arq).read().strip() if os.path.exists(arq) else None)
t = time.time()
c = Client("Lightricks/LTX-2-3", token=token, verbose=False)
res = c.predict(input_image=handle_file(img), prompt=prompt, duration=3.0, enhance_prompt=False,
                seed=42, randomize_seed=False, height=512, width=768, api_name="/generate_video")
vid = res[0]["video"] if isinstance(res[0], dict) else res[0]
shutil.copy(vid, out)
print("ok", out, "seed", res[1], "segundos", round(time.time() - t, 1))
