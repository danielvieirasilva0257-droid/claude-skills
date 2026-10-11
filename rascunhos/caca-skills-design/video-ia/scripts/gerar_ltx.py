# Uma geração image-to-video no Space oficial Lightricks/LTX-2-3 (ZeroGPU, anônimo, sem token).
import sys, shutil, time
from gradio_client import Client, handle_file
img, out = sys.argv[1], sys.argv[2]
prompt = ("Slow cinematic orbit around a polished champagne-gold metallic sphere floating on a dark graphite "
          "studio background, soft key light glides across the surface, subtle reflections, gentle slow motion, "
          "clean minimal premium product commercial, no text")
t=time.time()
c = Client("Lightricks/LTX-2-3", verbose=False)
res = c.predict(input_image=handle_file(img), prompt=prompt, duration=3.0, enhance_prompt=False,
                seed=42, randomize_seed=False, height=512, width=768, api_name="/generate_video")
vid = res[0]["video"] if isinstance(res[0], dict) else res[0]
shutil.copy(vid, out)
print("ok", out, "seed", res[1], "segundos", round(time.time()-t,1))
