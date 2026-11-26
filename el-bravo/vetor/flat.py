import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as ndi
im=np.asarray(Image.open('refs/head_x4.png').convert('RGB')).astype(float)/255
head=np.load('head_mask.npy'); Hh_,W_=head.shape
r,g,b=im[...,0],im[...,1],im[...,2]
mx=im.max(-1); mn=im.min(-1); V=mx; S=np.where(mx>0,(mx-mn)/np.maximum(mx,1e-6),0)
d=mx-mn+1e-6
Hh=np.where(mx==r,((g-b)/d)%6,np.where(mx==g,(b-r)/d+2,(r-g)/d+4))*60
lum=0.299*r+0.587*g+0.114*b
YY,XX=np.mgrid[0:Hh_,0:W_]
def disk(k):
    y,x=np.ogrid[-k:k+1,-k:k+1]; return x*x+y*y<=k*k
def biggest(m):
    lab,n=ndi.label(m)
    if n==0: return m
    s=ndi.sum(m,lab,range(1,n+1)); return lab==(1+np.argmax(s))
def drop_small(m,a):
    lab,n=ndi.label(m); s=ndi.sum(m,lab,range(1,n+1)); return np.isin(lab,np.where(s>=a)[0]+1)
def smooth(m,s=2.5): return ndi.gaussian_filter(m.astype(float),s)>0.5
def raster(fn):
    img=Image.new('L',(W_,Hh_),0); fn(ImageDraw.Draw(img)); return np.asarray(img)>0
redish=((Hh<11)|(Hh>=330))&(S>0.45)
black=(lum<0.17)&head
white=(S<0.32)&(V>0.70)&head
head=smooth(head,3)
# --- band (mouth trim) from measured centreline (x4 coords) ---
band_pts=[(415,1075),(380,1000),(350,940),(332,880),(320,820),(315,760),(318,710),(335,668),(375,645),(440,642),(500,648),(560,667),(610,678),(660,672),(705,652),(752,650),(792,658),(812,700),(815,790),(805,850),(785,910),(750,970),(705,1025),(665,1080)]
def catmull(pts,n=12):
    P=[pts[0]]+pts+[pts[-1]]; out=[]
    for i in range(1,len(P)-2):
        p0,p1,p2,p3=[np.array(P[j],float) for j in (i-1,i,i+1,i+2)]
        for t in np.linspace(0,1,n,endpoint=False):
            out.append(0.5*((2*p1)+(-p0+p2)*t+(2*p0-5*p1+4*p2-p3)*t*t+(-p0+3*p1-3*p2+p3)*t**3))
    out.append(np.array(pts[-1],float)); return [tuple(p) for p in out]
bc=catmull(band_pts)
import flat_band as _fb; band=_fb.band(W_,Hh_)
for p in (bc[0],bc[-1]): pass
opening=raster(lambda dr: dr.polygon(bc+[(665,1160),(415,1160)],fill=255))
# --- eye openings from the black lining (+ inside) ---
def eye_open(cx,cy):
    m=black&(YY<640)
    m=ndi.binary_closing(m,disk(4)); lab,n=ndi.label(m)
    comp=lab==lab[cy,cx]
    comp=ndi.binary_fill_holes(ndi.binary_closing(comp,disk(10)))
    return smooth(ndi.binary_opening(comp,disk(6)),4)
eyeN=eye_open(360,320); eyeF=eye_open(860,470)
print('eyeN',eyeN.sum(),'eyeF',eyeF.sum())
# --- gold: upper trims from colour + band ---
gold1=(Hh>=26)&(Hh<70)&(S>0.35)&head&(YY<700)
gold1=ndi.binary_opening(ndi.binary_closing(gold1,disk(3)),disk(4))
gold=(gold1|band)
gold=ndi.binary_closing(gold,disk(5))
gold=biggest(gold)&~eyeN&~eyeF
gold=smooth(ndi.binary_opening(gold,disk(5)),3)&head
# --- nose: red enclosed between trims ---
nz=redish&(YY>520)&(YY<660)&(XX>540)&(XX<720)&~gold
nose=biggest(ndi.binary_opening(nz,disk(4)))
nose=smooth(ndi.binary_fill_holes(ndi.binary_closing(nose,disk(6))),4)
np.save('parts_gold.npy',gold); np.save('parts_eyeN.npy',eyeN); np.save('parts_eyeF.npy',eyeF); np.save('parts_open.npy',opening&head); np.save('parts_nose.npy',nose)
# debug overlay
out=(im*255*0.35).astype(np.uint8)
def paint(m,col,a=0.75):
    out[m]=(out[m]*(1-a)+np.array(col)*a).astype(np.uint8)
paint(head,(214,38,30),0.5); paint(opening&head,(196,106,53)); paint(gold,(242,174,46)); paint(eyeN,(30,20,15)); paint(eyeF,(30,20,15)); paint(nose,(230,40,30),0.9)
Image.fromarray(out).resize((520,580)).save('/tmp/flat_dbg.png')

# ===== stage 2: remaining parts + flat label image =====
holes=ndi.binary_fill_holes(gold)&~gold&~eyeN&~eyeF
gold=gold|(holes&~drop_small(holes,6000))
nz=redish&(YY>530)&(YY<665)&(XX>530)&(XX<720)
nose=biggest(ndi.binary_opening(nz,disk(4)))
nose=smooth(ndi.binary_fill_holes(ndi.binary_closing(nose,disk(8))),4)
opening=opening&head
# mouth
mcand=(black|white|redish|((Hh<22)|(Hh>=330))&(S>0.2)&(V>0.45)&(S<0.6))&opening&(YY>650)
mcand=ndi.binary_closing(mcand,disk(5)); lab,n=ndi.label(mcand)
mouth=lab==lab[800,560]
mouth=smooth(ndi.binary_fill_holes(ndi.binary_closing(mouth,disk(8))),4)
teeth=smooth(drop_small(ndi.binary_opening(white&mouth,disk(2)),300),2)&mouth
tongue_c=(((Hh<22)|(Hh>=330))&(S>0.2)&(V>0.42))&mouth&~teeth
tongue=smooth(biggest(ndi.binary_opening(tongue_c,disk(5))),4)&mouth
# eyes internals
def eye_parts(eye):
    w=smooth(biggest(ndi.binary_opening(white&eye,disk(2))),2)
    ball=ndi.binary_fill_holes(ndi.binary_closing(w|((lum<0.45)&ndi.binary_dilation(w,disk(14))&eye),disk(10)))
    sk=eye&~black&~w&~ball
    sk=smooth(drop_small(ndi.binary_opening(sk,disk(3)),400),3)
    iris=smooth(ball&~w&(lum<0.5),2)
    return w,iris,sk
wN,irN,skN=eye_parts(eyeN); wF,irF,skF=eye_parts(eyeF)
# seams on the red mask
nearb=head&~ndi.binary_erosion(head,disk(12))
cand=(black|(redish&(V<0.47)))&head&~ndi.binary_dilation(gold|eyeN|eyeF|opening,disk(8))&~nearb
thin=cand&~ndi.binary_opening(cand,disk(5))
seams=smooth(drop_small(thin,160),1.2)
# creases on the skin
cr=(lum<0.27)&opening&~ndi.binary_dilation(mouth,disk(6))&~ndi.binary_dilation(gold,disk(6))
creases=smooth(drop_small(ndi.binary_opening(cr,disk(1)),180),1.2)
C=dict(red=(215,38,30),seam=(142,22,17),gold=(242,174,46),skin=(200,116,62),out=(26,13,8),white=(255,246,232),tongue=(224,106,110),mouth=(61,12,8),iris=(74,36,18))
L=np.zeros((Hh_,W_,4),np.uint8)
def put(m,col): L[m]=(*col,255)
put(head,C['red']); put(seams,C['seam']); put(opening,C['skin']); put(creases,C['out'])
put(gold,C['gold']); put(nose,C['red'])
for eye,w,ir,sk in ((eyeN,wN,irN,skN),(eyeF,wF,irF,skF)):
    put(eye,C['out']); put(sk,C['skin']); put(w,C['white']); put(ir&w|ir,C['iris'])
put(mouth,C['mouth']); put(tongue,C['tongue']); put(teeth,C['white'])
# outlines (uniform)
def edge(m,wi):
    return m&~ndi.binary_erosion(m,disk(wi))
def edge2(m,wi):
    return ndi.binary_dilation(m,disk(wi))&~ndi.binary_erosion(m,disk(wi))
put(edge2(gold,4)&head,C['out']); put(edge2(nose,4),C['out']); put(edge2(mouth,3)&opening,C['out'])
put(edge(head,9),C['out'])
Image.fromarray(L,'RGBA').save('flat_label.png')
np.savez('parts.npz',head=head,gold=gold,nose=nose,opening=opening,mouth=mouth,teeth=teeth,tongue=tongue,eyeN=eyeN,eyeF=eyeF,seams=seams,creases=creases)
Image.fromarray(L,'RGBA').resize((520,580)).save('/tmp/flat_label_small.png')
print('ok', 'teeth',teeth.sum(),'tongue',tongue.sum(),'seams',seams.sum(),'creases',creases.sum())
