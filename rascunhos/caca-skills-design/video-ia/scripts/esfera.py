# Gera um quadro inicial simples: esfera de vidro/metal escuro sobre fundo grafite com luz suave.
import numpy as np, sys
from PIL import Image, ImageFilter
W,H=1536,1024
y,x=np.mgrid[0:H,0:W].astype(np.float32)
# fundo: gradiente radial grafite -> preto
r=np.sqrt(((x-W*0.5)/W)**2+((y-H*0.45)/H)**2)
bg=np.clip(0.16-0.22*r,0.01,1.0)
img=np.stack([bg*0.95,bg*0.97,bg*1.05],-1)
# esfera
cx,cy,R=W*0.5,H*0.48,H*0.28
dx,dy=(x-cx)/R,(y-cy)/R
d2=dx*dx+dy*dy
m=d2<1
nz=np.sqrt(np.clip(1-d2,0,1))
L=np.array([-0.5,-0.6,0.62]);L/=np.linalg.norm(L)
ndl=np.clip(dx*L[0]+dy*L[1]+nz*L[2],0,1)
# especular (Blinn)
Hh=L+np.array([0,0,1.0]);Hh/=np.linalg.norm(Hh)
spec=np.clip(dx*Hh[0]+dy*Hh[1]+nz*Hh[2],0,1)**80
rim=np.clip(1-nz,0,1)**3
base=np.array([0.55,0.42,0.30])  # champanhe/dourado
col=(0.05+0.75*ndl[...,None])*base+spec[...,None]*1.2+rim[...,None]*np.array([0.25,0.3,0.4])*0.6
img[m]=col[m]
# sombra de contato
sh=np.exp(-(((x-cx)/(R*1.1))**2+((y-(cy+R*1.02))/(R*0.12))**2))
img*= (1-0.6*sh)[...,None]
im=Image.fromarray((np.clip(img,0,1)**(1/1.1)*255).astype(np.uint8))
im=im.filter(ImageFilter.GaussianBlur(0.6))
im.save(sys.argv[1])
print('ok',sys.argv[1])
