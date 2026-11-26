import numpy as np, colorsys
from PIL import Image
from scipy import ndimage as ndi
im=np.asarray(Image.open('refs/head_x4.png').convert('RGB')).astype(float)/255
head=np.load('head_mask.npy')
r,g,b=im[...,0],im[...,1],im[...,2]
mx=im.max(-1); mn=im.min(-1); V=mx; S=np.where(mx>0,(mx-mn)/np.maximum(mx,1e-6),0)
d=mx-mn+1e-6
Hh=np.where(mx==r,((g-b)/d)%6,np.where(mx==g,(b-r)/d+2,(r-g)/d+4))*60
cls=np.zeros(head.shape,np.uint8)  # 0 bg
BLACK,RED,DRED,GOLD,SKIN,WHITE,PINK,MOUTH=1,2,3,4,5,6,7,8
c=np.full(head.shape,RED,np.uint8)
lum=0.299*r+0.587*g+0.114*b
c[(Hh>=11)&(Hh<70)&(S>0.35)]=SKIN
c[(Hh>=29)&(Hh<70)&(S>0.35)&(V>0.66)]=GOLD
c[((Hh<11)|(Hh>=330))&(S>0.55)&(V>0.62)]=RED
c[((Hh<11)|(Hh>=330))&(S>0.45)&(V<=0.62)]=DRED
c[((Hh<20)|(Hh>=330))&(S<=0.62)&(S>0.2)&(V>0.6)]=PINK
c[(S<0.30)&(V>0.70)]=WHITE
c[lum<0.16]=BLACK
c[~head]=0
np.save('cls_raw.npy',c)
pal={0:(40,40,40),1:(0,0,0),2:(230,30,30),3:(120,10,10),4:(255,200,0),5:(200,120,70),6:(255,255,255),7:(255,120,170),8:(90,0,60)}
out=np.zeros(c.shape+(3,),np.uint8)
for k,v in pal.items(): out[c==k]=v
Image.fromarray(out).resize((520,580),Image.NEAREST).save('/tmp/cls_dbg.png')
for k,nm in [(1,'black'),(2,'red'),(3,'dred'),(4,'gold'),(5,'skin'),(6,'white'),(7,'pink')]: print(nm,(c==k).sum())
