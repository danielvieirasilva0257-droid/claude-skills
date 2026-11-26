import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as ndi
im=np.asarray(Image.open('refs/head_x4.png').convert('RGB')).astype(float)
H,W,_=im.shape
lum=0.299*im[...,0]+0.587*im[...,1]+0.114*im[...,2]
dark=lum<38
# background = dark pixels connected to the border
lab,n=ndi.label(dark)
border=set(np.unique(np.r_[lab[0],lab[-1],lab[:,0],lab[:,-1]]))-{0}
bg=np.isin(lab,list(border))
poly=[(470,18),(600,6),(740,48),(845,120),(905,225),(935,335),(925,480),(895,640),(860,790),(800,900),(740,990),(680,1030),(600,1048),(500,1015),(390,955),(270,885),(140,770),(92,640),(88,500),(110,380),(160,250),(250,130),(350,55)]
pm=Image.new('L',(W,H),0); ImageDraw.Draw(pm).polygon(poly,fill=255)
pm=np.asarray(pm)>0
head=pm & ~bg
head=ndi.binary_fill_holes(ndi.binary_closing(head,iterations=3))
lab2,n2=ndi.label(head); sizes=ndi.sum(head,lab2,range(1,n2+1)); head=lab2==(1+np.argmax(sizes))
np.save('head_mask.npy',head)
ov=(im*0.45).copy(); ov[head]=im[head]
Image.fromarray(ov.astype(np.uint8)).resize((520,580)).save('/tmp/head_mask_dbg.png')
print(head.sum(), head.shape)
