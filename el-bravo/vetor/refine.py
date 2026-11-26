import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage as ndi
from skimage.morphology import skeletonize
p=dict(np.load('parts.npz')); Hh_,W_=p['head'].shape
def disk(k):
    y,x=np.ogrid[-k:k+1,-k:k+1]; return x*x+y*y<=k*k
def smooth(m,s): return ndi.gaussian_filter(m.astype(float),s)>0.5
def biggest(m):
    lab,n=ndi.label(m); s=ndi.sum(m,lab,range(1,n+1)); return lab==(1+np.argmax(s))
def raster(fn):
    img=Image.new('L',(W_,Hh_),0); fn(ImageDraw.Draw(img)); return np.asarray(img)>0
def uniform_lines(m,minlen,r):
    sk=skeletonize(m); lab,n=ndi.label(sk,structure=np.ones((3,3)))
    s=ndi.sum(sk,lab,range(1,n+1)); keep=np.isin(lab,np.where(s>=minlen)[0]+1)
    return smooth(ndi.binary_dilation(keep,disk(r)),1.0)
head=smooth(ndi.binary_fill_holes(ndi.binary_closing(p['head'],disk(18))),6)
eyeN0=smooth(ndi.binary_opening(p['eyeN'],disk(8)),4); eyeF0=smooth(ndi.binary_opening(p['eyeF'],disk(8)),4)
g0=ndi.binary_closing(ndi.binary_opening(p['gold'],disk(4)),disk(4))
_g=ndi.binary_closing(g0,disk(14))
# keep the forehead V and the nose area open: only accept closing gains that are small bites
_gain=_g&~g0; _lab,_n=ndi.label(_gain); _s=ndi.sum(_gain,_lab,range(1,_n+1))
g0=g0|np.isin(_lab,np.where(_s<2500)[0]+1)
g0=ndi.binary_opening(g0,disk(6))&~eyeN0&~eyeF0
_h=ndi.binary_fill_holes(g0)&~g0&~ndi.binary_dilation(p['eyeN']|p['eyeF'],disk(4))
_lab,_n=ndi.label(_h); _s=ndi.sum(_h,_lab,range(1,_n+1)); g0=g0|np.isin(_lab,np.where(_s<9000)[0]+1)
gold=smooth(g0,3)&head
# small red bays trapped between the trim and the eye openings -> gold (keeps forehead V and nose area red)
_r=head&~gold&~eyeN0&~eyeF0&~p['opening']&~p['nose']
_lab,_n=ndi.label(_r); _s=ndi.sum(_r,_lab,range(1,_n+1)); _keep={_lab[600,620],_lab[200,500]}
_touch=set(np.unique(_lab[ndi.binary_dilation(eyeN0|eyeF0,disk(8))&_r]))
_small=np.isin(_lab,[i+1 for i in range(_n) if _s[i]<3500 and (i+1) not in _keep and (i+1) in _touch])
gold=smooth(gold|_small,2)&head
star=raster(lambda d: d.polygon([(585,95),(700,70),(850,180),(800,345),(640,330),(590,250)],fill=255))
seams=uniform_lines(p['seams']&~star&~ndi.binary_dilation(gold,disk(10)),95,4)&head
mouth=ndi.binary_erosion(__import__('skimage.morphology',fromlist=['x']).convex_hull_image(ndi.binary_opening(p['mouth'],disk(18))),disk(5)); mouth=smooth(mouth,4); 
ys_m=np.where(mouth.any(1))[0]; mtop=ys_m.min()+15
YY=np.mgrid[0:Hh_,0:W_][0]
creases=uniform_lines(p['creases']&~((YY<mtop+25)),85,3)&p['opening']&~ndi.binary_dilation(p['mouth'],disk(10))
teeth=smooth(p['teeth'],3)
nose=p['nose']; tongue=p['tongue']; opening=p['opening']&head
def shift(m,dx,dy): return ndi.shift(m.astype(float),(dy,dx),order=0)>0.5
def eye(open_m,dx,dy,almond,iris_c,iris_r,hl,er=16):
    o=smooth(ndi.binary_opening(open_m,disk(8)),4)
    inner=smooth(ndi.binary_erosion(o,disk(er))&shift(o,dx,dy),6)
    alm=raster(lambda d: d.polygon(almond,fill=255))&inner
    alm=smooth(alm,2)
    iris=raster(lambda d: d.ellipse([iris_c[0]-iris_r,iris_c[1]-iris_r,iris_c[0]+iris_r,iris_c[1]+iris_r],fill=255))&alm
    pr=int(iris_r*0.47)
    pupil=raster(lambda d: d.ellipse([iris_c[0]-pr,iris_c[1]-pr,iris_c[0]+pr,iris_c[1]+pr],fill=255))&alm
    h=raster(lambda d: d.ellipse([hl[0]-hl[2],hl[1]-hl[2],hl[0]+hl[2],hl[1]+hl[2]],fill=255))
    top=almond[:len(almond)//2+1]
    lid=raster(lambda d: d.line(top,fill=255,width=10,joint='curve'))&inner
    return o,inner,alm,iris,pupil,h,lid
def curve(pts,n=10):
    P=[pts[0]]+pts+[pts[-1]]; out=[]
    for i in range(1,len(P)-2):
        p0,p1,p2,p3=[np.array(P[j],float) for j in (i-1,i,i+1,i+2)]
        for t in np.linspace(0,1,n,endpoint=False):
            out.append(tuple(0.5*((2*p1)+(-p0+p2)*t+(2*p0-5*p1+4*p2-p3)*t*t+(-p0+3*p1-3*p2+p3)*t**3)))
    out.append(tuple(map(float,pts[-1]))); return out
# almond = top edge (outer->inner) then bottom edge back (inner->outer)
almN=curve([(412,428),(445,410),(485,412),(522,438),(552,486)])+curve([(552,486),(515,484),(478,476),(440,458),(412,428)])
almF=curve([(703,537),(728,520),(760,512),(790,513),(814,522)])+curve([(814,522),(795,548),(765,560),(730,556),(703,537)])
EN=eye(p['eyeN'],30,72,almN,(480,449),38,(463,432,8))
EF=eye(p['eyeF'],-26,50,almF,(746,534),30,(733,521,6),14)
C=dict(red=(215,38,30),seam=(142,22,17),gold=(242,174,46),skin=(200,116,62),out=(26,13,8),white=(255,246,232),tongue=(224,106,110),mouth=(61,12,8),iris=(92,46,22),pupil=(26,13,8))
L=np.zeros((Hh_,W_,4),np.uint8)
def put(m,col): L[m]=(*col,255)
def edge2(m,w): return ndi.binary_dilation(m,disk(w))&~ndi.binary_erosion(m,disk(w))
put(head,C['red']); put(seams,C['seam']); put(opening,C['skin']); put(creases,C['out'])
put(gold,C['gold']); put(nose,C['red'])
for o,inner,alm,iris,pupil,h,lid in (EN,EF):
    put(o,C['out']); put(inner,C['skin']); put(alm,C['white']); put(iris,C['iris']); put(pupil,C['pupil']); put(h&iris,C['white']); put(lid,C['out'])
put(mouth,C['mouth']); put(tongue&mouth,C['tongue']); put(teeth&mouth,C['white'])
import flat_band as _fb
_band=_fb.band(W_,Hh_)&gold
put(edge2(gold,4)&head,C['out']); _inside=gold&ndi.binary_erosion(gold,disk(2))
put(edge2(_band,3)&_inside,C['out'])
_dt_n=ndi.distance_transform_edt(~eyeN0); _dt_f=ndi.distance_transform_edt(~eyeF0)
_trimN=smooth(gold&(_dt_n<50),3); _trimF=smooth(gold&(_dt_f<40)&(_dt_f<_dt_n),3)
put(edge2(_trimN,3)&_inside&~_band,C['out']); put(edge2(_trimF,3)&_inside&~_band,C['out']); put(edge2(nose,4),C['out']); put(edge2(mouth,3)&opening,C['out'])
put(head&~ndi.binary_erosion(head,disk(9)),C['out'])
Image.fromarray(L,'RGBA').save('flat_label.png')
Image.fromarray(L,'RGBA').resize((520,580),Image.LANCZOS).save('/tmp/flat_label_small.png')
print('ok')
