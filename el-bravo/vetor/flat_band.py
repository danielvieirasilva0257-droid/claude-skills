import numpy as np
from PIL import Image, ImageDraw
band_pts=[(415,1075),(380,1000),(350,940),(332,880),(320,820),(315,760),(318,710),(335,668),(375,645),(440,642),(500,648),(560,667),(610,678),(660,672),(705,652),(752,650),(792,658),(812,700),(815,790),(805,850),(785,910),(750,970),(705,1025),(665,1080)]
def catmull(pts,n=12):
    P=[pts[0]]+pts+[pts[-1]]; out=[]
    for i in range(1,len(P)-2):
        p0,p1,p2,p3=[np.array(P[j],float) for j in (i-1,i,i+1,i+2)]
        for t in np.linspace(0,1,n,endpoint=False):
            out.append(tuple(0.5*((2*p1)+(-p0+p2)*t+(2*p0-5*p1+4*p2-p3)*t*t+(-p0+3*p1-3*p2+p3)*t**3)))
    out.append(tuple(map(float,pts[-1]))); return out
def band(W,H,w=36):
    pts=catmull(band_pts,40); img=Image.new("L",(W,H),0); d=ImageDraw.Draw(img); r=w/2
    for (x,y) in pts: d.ellipse([x-r,y-r,x+r,y+r],fill=255)
    return np.asarray(img)>0
