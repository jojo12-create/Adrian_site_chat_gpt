import os,re,json,struct,gzip,numpy as np
from pathlib import Path
from zanatomy_lecture import *
OUT = Path(os.environ.get("ZANATOMY_OUT", "work/anatomie-3d"))
OUT.mkdir(parents=True, exist_ok=True)
def vnorm(v,t):
    fn=np.cross(v[t[:,1]]-v[t[:,0]],v[t[:,2]]-v[t[:,0]]); n=np.zeros_like(v)
    for a in range(3): np.add.at(n,t[:,a],fn)
    return n
def cluster(v,t,cell,by_normal=True):
    k=np.floor(v/cell).astype(np.int64); k-=k.min(0)
    n=vnorm(v,t); ax=np.abs(n).argmax(1); b=ax*2+(n[np.arange(len(n)),ax]<0)
    if not by_normal: b=b*0
    d=k.max(0)+1; key=((k[:,0]*d[1]+k[:,1])*d[2]+k[:,2])*6+b
    u,inv=np.unique(key,return_inverse=True); n_=len(u); cnt=np.bincount(inv,minlength=n_)
    nv=np.stack([np.bincount(inv,weights=v[:,a],minlength=n_)/cnt for a in range(3)],1)
    t=inv[t]; t=t[(t[:,0]!=t[:,1])&(t[:,1]!=t[:,2])&(t[:,0]!=t[:,2])]
    if len(t)==0: return nv[:0],t
    s=np.sort(t,1); _,first=np.unique(s,axis=0,return_index=True); t=t[np.sort(first)]
    used=np.unique(t); rm=-np.ones(n_,np.int64); rm[used]=np.arange(len(used))
    return nv[used],rm[t]
def tube(P,R,sides,step):
    seg=np.linalg.norm(np.diff(P,axis=0),axis=1); keep=np.concatenate([[True],seg>1e-6]); P=P[keep]; R=R[keep]
    if len(P)<2: return None
    s=np.concatenate([[0],np.cumsum(np.linalg.norm(np.diff(P,axis=0),axis=1))]); n=max(2,int(np.ceil(s[-1]/step))+1)
    q=np.linspace(0,s[-1],n); P=np.stack([np.interp(q,s,P[:,a]) for a in range(3)],1); R=np.interp(q,s,R)
    T=np.gradient(P,axis=0); T/=np.linalg.norm(T,axis=1,keepdims=True)+1e-12
    u=np.cross(T[0],[0,1,0]);
    if np.linalg.norm(u)<1e-3: u=np.cross(T[0],[1,0,0])
    u/=np.linalg.norm(u); U=[u]
    for i in range(1,n):
        u=U[-1]-T[i]*(U[-1]@T[i]); u/=np.linalg.norm(u)+1e-12; U.append(u)
    U=np.array(U); W=np.cross(T,U); ang=np.arange(sides)*2*np.pi/sides
    ring=(np.cos(ang)[None,:,None]*U[:,None,:]+np.sin(ang)[None,:,None]*W[:,None,:])*R[:,None,None]+P[:,None,:]
    v=ring.reshape(-1,3); i=np.arange(n-1)[:,None]*sides; j=np.arange(sides)[None,:]; j2=(j+1)%sides
    a=i+j; b=i+j2; c=i+sides+j; d=i+sides+j2
    t=np.concatenate([np.stack([a,c,b],-1).reshape(-1,3),np.stack([b,c,d],-1).reshape(-1,3)])
    fn=np.cross(v[t[0,1]]-v[t[0,0]],v[t[0,2]]-v[t[0,0]])
    if fn@(v[t[0,0]]-P[0])<0: t=t[:,::-1]
    return v,t
has=lambda n,ks:any(k in n for k in ks)
ORD_C=["c3","c4","c5","c6","c7"]
def sk_gid(n,left):
    if has(n,["atlas (c1)","axis (c2)"]) or re.search(r"vertebra c\d",n): return 2
    if re.search(r"vertebra t\d",n): return 3
    if re.search(r"vertebra l[123]\b",n): return 4
    if re.search(r"vertebra l[45]\b",n): return 5
    if has(n,["sacrum","coccyx"]): return 6
    if "hip bone" in n: return 7
    if has(n,[" rib","costal cartilage","sternum","xiphoid"]) or n.endswith("rib"): return 8
    if "scapula" in n: return 9
    if "clavicle" in n: return 10
    if n.startswith("femur"): return 11 if left else 12
    if has(n,["frontal","parietal","occipital","temporal","sphenoid","ethmoid bone","maxilla","mandible","zygomatic","nasal bone","vomer","palatine","lacrimal","incisor","canine","molar","concha"]): return 1
    return 0
def mu_gid(n):
    if "descending part of trapezius" in n: return 60
    if "trapezius" in n: return 21
    if has(n,["supraspinatus","infraspinatus","teres minor","subscapularis"]): return 51
    if has(n,["calcaneal tendon","gastrocnemius","soleus"]): return 52
    if has(n,["rectus femoris","vastus"]): return 53
    if "fibularis" in n: return 54
    if "biceps brachii" in n: return 55
    if has(n,["iliacus","psoas"]): return 56
    if has(n,["flexor carpi","extensor carpi","flexor digitorum superficialis","flexor digitorum profundus","extensor digitorum","palmaris longus","flexor pollicis longus","abductor pollicis longus","extensor pollicis"]) and "foot" not in n and "longus muscle of" not in n and "hallucis" not in n and "digitorum longus" not in n and "digitorum brevis" not in n: return 57
    if "tibialis" in n: return 58
    if has(n,["splenius","semispinalis capitis","semispinalis colli","sternocleidomastoid","levator scapulae","scalen","longissimus capitis","longissimus colli","rectus capitis","obliquus capitis","iliocostalis colli"]): return 22
    if has(n,["abdominal oblique","rectus abdominis","transversus abdominis","linea alba","pyramidalis"]): return 23
    if "rhomboid" in n: return 25
    if has(n,["gluteus","piriformis"]): return 26
    if "deltoid" in n: return 27
    if has(n,["iliocostalis","longissimus","spinalis","multifid"]): return 28
    if has(n,["masseter","temporalis","temporal muscle"]): return 29
    return 20
SK_DROP=["costal cartilage","incisor","canine","molar","premolar","tooth","arytenoid","corniculate","cricoid","cuneiform cartilage","thyroid cartilage","incus","malleus","stapes","cells of ethmoid","hyoid","epiglott","tracheal"]
MU_DROP=["fascia","bursa","septum","retinacul","sheath","tendinous ring","tarsus","aryten","crico","thyro","vocal","gloss","palat","pharyn","uvula","salping","levator palpebrae","superior rectus","inferior rectus","medial rectus","lateral rectus","superior oblique muscle","inferior oblique muscle","sphincter","puborect","pubococc","iliococc","coccygeus","perine","stapedius","tensor tympani","iliopectineal arch","platysma","aponeurosis of","membrane","ligament","ischiocavern","bulbospong","cremaster","levator ani","pubo","dartos","trochlea","hyoid muscle","hyoid","digastric","anal","pes anserinus","arch"]
MU_KEEP=["epicranial aponeurosis","inguinal ligament","iliotibial","calcaneal tendon","linea alba","longus colli"]
BRAIN=["gyrus","gyri","lobule","cuneus","pole","operculum","insula","uncus","flocculus","tonsil of cerebellum","nodule","uvula of vermis","pyramid of vermis","tuber","folium","declive","culmen","lingula","pons","medulla oblongata","midbrain","olfactory bulb","olfactory tract","optic chiasm","optic nerve","optic tract"]
BRAIN_DROP=["nucleus","nuclei","white matter","tract of","fascicul","capsule","peduncle"]
VI_DROP=["gingiva","tongue","uvula","palate","penis","testis","epididym","prostate","seminal","scrot","pleura","omentum","mesocolon","mesenter","peritone","segment of liver","renal pelvis","hypophysis","pineal","parathyroid","epiglott","mucosa","laryn","pharyn","fauces","tonsil","parotid","submandibular","sublingual","bulbo-urethral","visceral systems","cavity","vocal","glans","ureth","deferen","ejaculat"]
def vi_gid(n):
    if "stomach" in n: return 41
    if has(n,["duodenum","jejunum","ileum"]): return 42
    if has(n,["colon","caecum","cecum","rectum","appendix","anal canal"]): return 43
    if has(n,["liver","gallbladder","bile duct"]): return 44
    if has(n,["lung","bronch","trachea"]): return 45
    if has(n,["atrium","ventricle","pulmonary trunk","heart"]): return 46
    if has(n,["kidney","ureter","bladder","suprarenal"]): return 47
    if "diaphragm" in n: return 24
    return 48
def ne_gid(n,left):
    if has(n,["sciatic nerve","tibial nerve","common fibular nerve","sacral plexus","lumbosacral trunk"]): return 36 if left else 37
    if has(n,["cervical plexus","cervical nerve","occipital nerve","great auricular","transverse cervical nerve","supraclavicular nerve","ansa cervicalis","brachial plexus","trunk of brachial","suprascapular nerve","dorsal scapular nerve"]): return 33
    if "intercostal nerve" in n or "subcostal nerve" in n: return 34
    if has(n,["lumbar plexus","iliohypogastric","ilio-inguinal","ilioinguinal","genitofemoral","lateral femoral cutaneous","femoral nerve","obturator nerve","lumbar nerve"]): return 35
    if "vagus" in n: return 38
    if "phrenic" in n: return 39
    if has(n,["cauda equina","spinal dura","spinal cord","spinal nerve","central canal"]): return 32
    return 30
L={k:[] for k in ("skeleton","ligaments","muscles","nerves","viscera","skin")}
raw={}; log={k:[] for k in L}
CELL={"skeleton":0.0047,"muscles":0.0102,"viscera":0.0064,"brain":0.006}
skinV=[];skinT=[];so=0;LIG=[]
for a in sysof:
    if a not in OB: continue
    S=sysof[a][0]; ty=otype(a); N=oname(a); n=N.lower(); left=bool(re.search(r"\.l$",n)); nb=re.sub(r"\.[lr]$","",n)
    if not re.search(r"^[^.]*$|\.[lr]$",N.replace("(C1)","").replace("(C2)","")) and "." in N[-5:] and not re.search(r"\.[lr]$",N): continue
    if ty==1:
        r=mesh(a)
        if r is None: continue
        v=to_atlas(r[0]); t=r[1]
        if not np.isfinite(v).all() or np.abs(v).max()>3: continue
        if S=="1":
            if has(nb,SK_DROP): continue
            if has(nb,['nasal septal','alar cartilage']):     # cartilages du nez : avec les muscles du visage, pas avec les os
                nv,nt=cluster(v,t,0.003)
                continue
            g=sk_gid(nb,left); raw[n]=v
            c=0.0037 if g in(2,3,4,5,6) else (0.0038 if has(nb,["phalanx","incisor","canine","molar","premolar"]) else CELL["skeleton"])
            nv,nt=cluster(v,t,c)
            if len(nt): L["skeleton"].append((nv,nt,g,n)); log["skeleton"].append(nb)
        elif S=="3":
            if not has(nb,["capsule","fat pad","frenula","cartilage","membrane","bursa","intervertebral disc","interpubic disc"]): LIG.append((v,t,n))
            continue
            nv,nt=cluster(v,t,0.004)
            if len(nt): L["skeleton"].append((nv,nt,-1,n))
        elif S=="4":
            if has(nb,MU_DROP) and not has(nb,MU_KEEP): continue
            if nb.startswith("diaphragm"):
                nv,nt=cluster(v,t,CELL["viscera"]); L["viscera"].append((nv,nt,24,n)); continue
            diag=np.linalg.norm(v.max(0)-v.min(0))
            nv,nt=cluster(v,t,float(np.clip(0.034*diag,0.0038,0.0118)))
            if len(nt): L["muscles"].append((nv,nt,mu_gid(nb),n)); log["muscles"].append(nb)
        elif S=="7":
            if nb in ("sclera","cornea"):          # globes oculaires : comblent les orbites sur la couche muscles
                nv,nt=cluster(v,t,0.0025)
                continue
            if nb.startswith("spinal dura"): g=32; c=0.004
            elif has(nb,BRAIN) and not has(nb,BRAIN_DROP): g=31; c=CELL["brain"]
            else: continue
            nv,nt=cluster(v,t,c)
            if len(nt): L["nerves"].append((nv,nt,g,n)); log["nerves"].append(nb)
        elif S in("8","5","6"):
            if S=="5" and not has(nb,["atrium","ventricle","pulmonary trunk"]): continue
            if S=="5" and has(nb,["leaflet","papillary","valve"]): continue
            if S=="6" and nb!="spleen": continue
            if S=="8" and has(nb,VI_DROP): continue
            nv,nt=cluster(v,t,CELL["viscera"])
            if len(nt): L["viscera"].append((nv,nt,vi_gid(nb),n)); log["viscera"].append(nb)
        elif S=="9":
            if has(nb,["hair","eyebrow","eyelash","nail","perionyx"]): continue
            skinV.append(v); skinT.append(t+so); so+=len(v)
    elif ty==2 and S in("7","8"):
        if S=="7" and has(nb,["ciliary","-curve"]): continue
        if S=="8" and has(nb,["duct","deferen","ejaculat","urethra","parotid","submandibular"]): continue
        r=curve(a)
        if r is None or r[0] is None: continue
        segs,ext2,bev=r
        for P,R in segs:
            P=to_atlas(P)
            if not np.isfinite(P).all(): continue
            if S=="7":
                g=ne_gid(nb,left); big=g in(36,37)
                R=np.clip(1.5*R+0.0007,0.0012,0.0042)*(1.25 if big else 1); tb=tube(P,R,6 if big else 5,0.012)
                layer="nerves"
            else:
                R=np.where(R>1e-5,R,ext2 if ext2>0 else 0.002); R=np.clip(R,0.0015,0.012); tb=tube(P,R,8 if R.max()>0.004 else 5,0.009)
                g=vi_gid(nb); layer="viscera"
            if tb is not None: L[layer].append((tb[0],tb[1],g,n+'#tube')); log[layer].append(nb)
# disques → zone de la vertèbre voisine
def yr(g):
    ys=np.concatenate([m[0][:,1] for m in L["skeleton"] if m[2]==g]); return ys.min(),ys.max()
R_={g:yr(g) for g in (2,3,4,5)}
for i,(nv,nt,g,n) in enumerate(L["skeleton"]):
    if g==-1:
        y=nv[:,1].mean(); gg=0
        for k,(lo,hi) in R_.items():
            if lo<=y<=hi and abs(nv[:,0].mean())<0.03: gg=k
        L["skeleton"][i]=(nv,nt,gg,n)
# peau : régions de surface fusionnées, lissées
v=np.concatenate(skinV); t=np.concatenate(skinT)
vol=np.einsum("ij,ij->i",v[t[:,0]],np.cross(v[t[:,1]],v[t[:,2]])).sum()/6
print("peau : %d triangles, volume %.3f m3"%(len(t),vol))
# enveloppe : les régions de peau sont soudées en une seule surface continue (sinon leurs frontières dessinent des formes)
nv,nt=cluster(v,t,0.0085,by_normal=False)
from scipy.sparse import coo_matrix
from scipy.sparse.csgraph import connected_components
nc,lab=connected_components(coo_matrix((np.ones(len(nt)*3),(np.concatenate([nt[:,0],nt[:,1],nt[:,2]]),np.concatenate([nt[:,1],nt[:,2],nt[:,0]]))),shape=(len(nv),len(nv))),directed=False)
big=np.argmax(np.bincount(lab)); keep=lab[nt[:,0]]==big; print("peau : composantes",nc,"triangles gardés",int(keep.sum()),"/",len(nt))
nt=nt[keep]; used=np.unique(nt); rm=-np.ones(len(nv),np.int64); rm[used]=np.arange(len(used)); nv=nv[used]; nt=rm[nt]
# orientation cohérente vers l'extérieur
fn=np.cross(nv[nt[:,1]]-nv[nt[:,0]],nv[nt[:,2]]-nv[nt[:,0]])
e=np.concatenate([nt[:,[0,1]],nt[:,[1,2]],nt[:,[2,0]]]); e=np.concatenate([e,e[:,::-1]]); cnt=np.maximum(np.bincount(e[:,0],minlength=len(nv)),1)[:,None]
for _ in range(12):
    acc=np.zeros_like(nv); np.add.at(acc,e[:,0],nv[e[:,1]]); nv=0.5*nv+0.5*acc/cnt
L["skin"].append((nv,nt,50,"skin"))
for k,vv in L.items(): print(k,len(vv),"parts",sum(len(m[0]) for m in vv),"verts",sum(len(m[1]) for m in vv),"tris")
import collections
for k in L: print("  ",k,dict(collections.Counter(m[2] for m in L[k])))
json.dump({k:sorted(set(v)) for k,v in log.items()},open("zlog.json","w"),indent=0)
# articulations
def top(v,f,up=True):
    y=v[:,1]; th=np.quantile(y,1-f if up else f); return v[y>=th].mean(0) if up else v[y<=th].mean(0)
J={}
for s,S_ in (("l","left"),("r","right")):
    J[f"epaule_{S_}"]=top(raw[f"humerus.{s}"],.07); J[f"hanche_{S_}"]=top(raw[f"femur.{s}"],.07)
    J[f"genou_{S_}"]=top(raw[f"femur.{s}"],.05,False); J[f"cheville_{S_}"]=raw[f"talus.{s}"].mean(0)
    J[f"poignet_{S_}"]=np.concatenate([raw[f"lunate bone.{s}"],raw[f"capitate bone.{s}"],raw[f"scaphoid bone.{s}"]]).mean(0)
# ligaments et ménisques des cinq articulations mises en avant (rattachés à la couche squelette)
JR={"epaule":(13,0.085),"hanche":(14,0.09),"genou":(15,0.085),"cheville":(16,0.07),"poignet":(17,0.06)}
nl=0
for v,t,n in LIG:
    c=v.mean(0)
    for j,(g,r) in JR.items():
        if min(np.linalg.norm(c-J[j+"_left"]),np.linalg.norm(c-J[j+"_right"]))<r:
            L["ligaments"].append((v,np.concatenate([t,t[:,::-1]]),g,n)); nl+=1; break
print("ligaments ajoutés",nl)
from scipy.spatial import cKDTree
AUX={}
for layer,ms in L.items():
    if layer=="skin" or not ms: continue
    V=np.concatenate([m[0] for m in ms]); Nn=np.concatenate([vnorm(m[0],m[1]) for m in ms]); Nn/=np.linalg.norm(Nn,axis=1,keepdims=True)+1e-12
    k=22; rad={"skeleton":0.016,"ligaments":0.01,"muscles":0.03,"nerves":0.016,"viscera":0.022}[layer]
    dist,ix=cKDTree(V).query(V,k=k,distance_upper_bound=rad,workers=-1)
    ok=np.isfinite(dist)&(dist>1e-6); ix=np.where(ok,ix,0)
    dvec=V[ix]-V[:,None,:]; el=np.einsum("ijk,ik->ij",dvec,Nn)/np.where(ok,dist,1)
    occ=(np.clip(el,0,1)*ok).sum(1)/np.maximum(ok.sum(1),1)
    ao=1-np.clip(occ*1.7,0,0.7)
    tubes=np.concatenate([np.full(len(m[0]),m[3].endswith('#tube')) for m in ms])
    # léger lissage de l'occlusion
    for _ in range(4 if layer=='muscles' else 2): ao=0.4*ao+0.6*((ao[ix]*ok).sum(1)+ao)/(ok.sum(1)+1)
    ao=np.where(tubes,np.maximum(ao,0.9),ao)
    aux=np.zeros((len(V),4),np.uint8); aux[:,0]=np.round(ao*255); aux[:,1]=128; aux[:,2]=128; aux[:,3]=128
    if layer=="muscles":
        o=0
        for nv,nt,g,name in ms:
            c=nv-nv.mean(0); w,U=np.linalg.eigh(c.T@c/len(c)); d=U[:,2]
            if d[2]<0: d=-d
            aux[o:o+len(nv),1]=np.round((d[0]*0.5+0.5)*255); aux[o:o+len(nv),2]=np.round((d[1]*0.5+0.5)*255)
            pr=c@d; span=pr.max()-pr.min()
            if w[2]>5.5*max(w[1],1e-12) and span>0.06 and not has(name,["aponeurosis","linea alba","ligament","tract","tendon"]):
                aux[o:o+len(nv),3]=np.round((pr-pr.min())/span*255)
            elif has(name,["aponeurosis","linea alba","ligament","tract","tendon"]): aux[o:o+len(nv),3]=255
            o+=len(nv)
    AUX[layer]=aux; print("occlusion",layer,"moyenne %.2f"%ao.mean(),"min %.2f"%ao.min())
allv=np.concatenate([m[0] for l in L.values() for m in l]); mn=allv.min(0); mx=allv.max(0); ext=(mx-mn).max()
print("bbox",mn.round(3),mx.round(3))
blob=bytearray(); meshes=[]
def flush(layer,vs,gs,ts,ax):
    if not vs: return
    v=np.concatenate(vs); g=np.concatenate(gs); t=np.concatenate(ts)
    q=np.round((v-mn)/ext*65535).astype(np.int64); dq=q.copy(); dq[1:]-=q[:-1]
    o=len(blob); blob.extend((dq%65536).astype("<u2").tobytes()); og=len(blob); blob.extend(g.astype(np.uint8).tobytes())
    oa=len(blob); blob.extend(ax.tobytes())
    while len(blob)%2: blob.append(0)
    f=t.ravel().astype(np.int64); df=f.copy(); df[1:]-=f[:-1]
    oi=len(blob); blob.extend((df%65536).astype("<u2").tobytes())
    meshes.append({"layer":layer,"v":len(v),"i":int(t.size),"p":o,"g":og,"a":oa,"x":oi})
G={}
for layer,ms in L.items():
    vs,gs,ts=[],[],[]; n=0; start=0; tot=0
    A=AUX.get(layer)
    for nv,nt,g,name in ms:
        if n+len(nv)>65000:
            flush(layer,vs,gs,ts,(A[start:tot] if A is not None else np.full((n,4),255,np.uint8))); vs,gs,ts=[],[],[]; n=0; start=tot
        vs.append(nv); gs.append(np.full(len(nv),g)); ts.append(nt+n); n+=len(nv); tot+=len(nv)
        G.setdefault(g,[]).append(nv)
    flush(layer,vs,gs,ts,(A[start:tot] if A is not None else np.full((n,4),255,np.uint8)))
gb={int(g):{"c":np.concatenate(v).mean(0).round(4).tolist(),"min":np.concatenate(v).min(0).round(4).tolist(),"max":np.concatenate(v).max(0).round(4).tolist()} for g,v in G.items()}
head=json.dumps({"min":mn.tolist(),"ext":float(ext),"meshes":meshes,"groups":gb,"joints":{k:v.round(4).tolist() for k,v in J.items()}}).encode()
while len(head)%4: head+=b" "
out=struct.pack("<I",len(head))+head+bytes(blob)
open(OUT / "model.bin","wb").write(out)
print("model.bin %.2f Mo, gzip %.2f Mo"%(len(out)/1e6,len(gzip.compress(out,6))/1e6))
np.savez(OUT / "model_dbg.npz",**{f"{l}_a":a for l,a in AUX.items()},**{f"{l}_{k}":np.concatenate([(m[0] if k=="v" else m[1]+off) for m,off in zip(ms,np.cumsum([0]+[len(m[0]) for m in ms[:-1]]))]) for l,ms in L.items() for k in("v","t")},
         **{f"{l}_g":np.concatenate([np.full(len(m[1]),m[2]) for m in ms]) for l,ms in L.items()})
