# Uma geração imagem-para-vídeo no Space zerogpu-aoti/wan2-2-fp8da-aoti-faster (Wan 2.2 I2V A14B, 4 passos, ZeroGPU).
# Grátis com cota (sem login parou no limite de execuções anônimas em 11/10/2026). Licença do modelo: Apache 2.0.
# Uso: python gerar_wan.py <quadro-inicial.png> <saida.mp4> ["prompt em inglês"]
# Token (opcional, nunca no repositório): variável HF_TOKEN ou o arquivo /root/.config/rotina/hf_token.
# Requer: pip install gradio_client  (testado com 2.7.2)
import os, sys, shutil, time
from gradio_client import Client, handle_file
img, out = sys.argv[1], sys.argv[2]
prompt = sys.argv[3] if len(sys.argv) > 3 else (
    "slow cinematic orbit around a polished champagne-gold metallic sphere on a dark graphite studio background, "
    "soft key light glides across the surface, subtle reflections, gentle slow motion, premium product commercial")
arq = "/root/.config/rotina/hf_token"
token = os.environ.get("HF_TOKEN") or (open(arq).read().strip() if os.path.exists(arq) else None)
t = time.time()
c = Client("zerogpu-aoti/wan2-2-fp8da-aoti-faster", token=token, verbose=False)
res = c.predict(input_image=handle_file(img), prompt=prompt, steps=4, duration_seconds=2.0,
                seed=42, randomize_seed=False, api_name="/generate_video")
vid = res[0]["video"] if isinstance(res[0], dict) else res[0]
shutil.copy(vid, out)
print("ok", out, "segundos", round(time.time() - t, 1))
