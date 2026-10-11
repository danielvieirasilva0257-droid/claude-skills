# Uma geração image-to-video no Space zerogpu-aoti/wan2-2-fp8da-aoti-faster (Wan 2.2 I2V A14B, ZeroGPU, anônimo).
import sys, shutil, time
from gradio_client import Client, handle_file
img, out = sys.argv[1], sys.argv[2]
prompt = ("slow cinematic orbit around a polished champagne-gold metallic sphere on a dark graphite studio background, "
          "soft key light glides across the surface, subtle reflections, gentle slow motion, premium product commercial")
t=time.time()
c = Client("zerogpu-aoti/wan2-2-fp8da-aoti-faster", verbose=False)
res = c.predict(input_image=handle_file(img), prompt=prompt, steps=4, duration_seconds=2.0,
                seed=42, randomize_seed=False, api_name="/generate_video")
vid = res[0]["video"] if isinstance(res[0], dict) else res[0]
shutil.copy(vid, out)
print("ok", out, "segundos", round(time.time()-t,1))
