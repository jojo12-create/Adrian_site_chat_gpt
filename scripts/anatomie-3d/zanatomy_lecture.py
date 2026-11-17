import os,struct,numpy as np,pickle
from pathlib import Path
from blend import Blend
B=Blend(os.environ.get("ZANATOMY_BLEND", "Startup.blend")); m=B.m
TL={n:l for n,l in zip(B.types,B.tlen)}
tree_file = Path(os.environ.get("ZANATOMY_TREE", "tree.pkl"))
if not tree_file.is_file():
    raise FileNotFoundError("Index tree.pkl requis (non fourni avec le prototype). Définir ZANATOMY_TREE ; voir README.md.")
with tree_file.open("rb") as f:
    T=pickle.load(f)
sysof,path=T["sysof"],T["path"]
OB={b[2]:b for b in B.of("OB")}
oname=lambda a:B.get("Object",OB[a][5],"id.name")[2:]
otype=lambda a:B.get("Object",OB[a][5],"type")
def omat(a): return np.array(B.get("Object",OB[a][5],"obmat"),dtype=np.float64).reshape(4,4)
def mesh(a):
    """sommets monde (repère Blender) et triangles d'un objet maillage"""
    d=B.get("Object",OB[a][5],"data")
    if d not in B.by_addr: return None
    mb=B.by_addr[d][5]; LOC=B.local[d]
    nv,nl,npoly=B.get("Mesh",mb,"totvert"),B.get("Mesh",mb,"totloop"),B.get("Mesh",mb,"totpoly")
    if nv<3 or npoly<1: return None
    pv,pl,pp=B.get("Mesh",mb,"mvert"),B.get("Mesh",mb,"mloop"),B.get("Mesh",mb,"mpoly")
    if not(pv in LOC and pl in LOC and pp in LOC): return None
    if LOC[pv][1]<nv*TL['MVert'] or LOC[pl][1]<nl*TL['MLoop'] or LOC[pp][1]<npoly*TL['MPoly']: return None
    sv,sl,sp=TL["MVert"],TL["MLoop"],TL["MPoly"]
    v=np.ndarray((nv,3),dtype="<f4",buffer=m,offset=LOC[pv][5],strides=(sv,4)).astype(np.float64)
    lv=np.ndarray((nl,),dtype="<u4",buffer=m,offset=LOC[pl][5],strides=(sl,)).astype(np.int64)
    P=np.ndarray((npoly,2),dtype="<i4",buffer=m,offset=LOC[pp][5],strides=(sp,4)).astype(np.int64)
    tris=[]
    for k in range(3,int(P[:,1].max())+1):
        q=P[P[:,1]>=k]
        tris.append(np.stack([lv[q[:,0]],lv[q[:,0]+k-2],lv[q[:,0]+k-1]],1))
    t=np.concatenate(tris); M=omat(a)
    w=v@M[:3,:3]+M[3,:3]
    if np.linalg.det(M[:3,:3])<0: t=t[:,::-1]
    return w,t
def to_atlas(w,off=np.zeros(3)):
    """Blender (X droite→gauche du sujet, Y vers l'arrière, Z haut) → repère du modèle (Y haut, Z vers l'avant)"""
    return np.stack([w[:,0],w[:,2],-w[:,1]],1)+off

def curve(a):
    """liste de (points monde Nx3, rayons N) pour un objet courbe ; None si vide"""
    d=B.get("Object",OB[a][5],"data")
    if d not in B.by_addr: return None
    cb=B.by_addr[d][5]; LOC=B.local[d]
    ext2=B.get("Curve",cb,"ext2"); bev=B.get("Curve",cb,"bevobj"); M=omat(a)
    sc=abs(np.linalg.det(M[:3,:3]))**(1/3)
    out=[]; nb=B.get("Curve",cb,"nurb.first")
    while nb and nb in LOC:
        o=LOC[nb][5]
        ty=B.get("Nurb",o,"type")&7; nu=B.get("Nurb",o,"pntsu"); nvv=B.get("Nurb",o,"pntsv"); cyc=B.get("Nurb",o,"flagu")&1
        pb,pz=B.get("Nurb",o,"bp"),B.get("Nurb",o,"bezt")
        if pz and pz in LOC and nu>=2:
            s=TL["BezTriple"]; ro=B.lay["BezTriple"]["radius"][0]
            V=np.ndarray((nu,9),dtype="<f4",buffer=m,offset=LOC[pz][5],strides=(s,4)).astype(float).reshape(nu,3,3)
            R=np.ndarray((nu,),dtype="<f4",buffer=m,offset=LOC[pz][5]+ro,strides=(s,)).astype(float)
            pts=[];rs=[]; tt=np.linspace(0,1,7)[:-1,None]
            for i in range(nu-1):
                p0,p1,p2,p3=V[i,1],V[i,2],V[i+1,0],V[i+1,1]
                pts.append((1-tt)**3*p0+3*(1-tt)**2*tt*p1+3*(1-tt)*tt**2*p2+tt**3*p3); rs.append(R[i]+(R[i+1]-R[i])*tt[:,0])
            pts.append(V[-1,1][None]); rs.append(R[-1:])
            P=np.concatenate(pts); Rr=np.concatenate(rs)
        elif pb and pb in LOC and nu*max(nvv,1)>=2:
            s=TL["BPoint"]; ro=B.lay["BPoint"]["radius"][0]; n=nu*max(nvv,1)
            P=np.ndarray((n,3),dtype="<f4",buffer=m,offset=LOC[pb][5],strides=(s,4)).astype(float)
            Rr=np.ndarray((n,),dtype="<f4",buffer=m,offset=LOC[pb][5]+ro,strides=(s,)).astype(float)
            if ty==4 and len(P)>=3:      # NURBS : lissage de Chaikin (2 passes), extrémités conservées
                for _ in range(2):
                    q=np.empty((2*len(P)-2,3)); q[0::2]=0.75*P[:-1]+0.25*P[1:]; q[1::2]=0.25*P[:-1]+0.75*P[1:]
                    r=np.empty(2*len(Rr)-2); r[0::2]=0.75*Rr[:-1]+0.25*Rr[1:]; r[1::2]=0.25*Rr[:-1]+0.75*Rr[1:]
                    P=np.concatenate([P[:1],q,P[-1:]]); Rr=np.concatenate([Rr[:1],r,Rr[-1:]])
        else:
            nb=struct.unpack_from("<Q",m,o)[0]; continue
        out.append((P@M[:3,:3]+M[3,:3],Rr*ext2*sc))
        nb=struct.unpack_from("<Q",m,o)[0]
    return out or None, ext2, bool(bev)
