"""Lecteur minimal de fichiers .blend (structure des blocs + SDNA)."""
import struct,mmap,re
class Blend:
    def __init__(s,path):
        f=open(path,"rb"); s.m=mmap.mmap(f.fileno(),0,access=mmap.ACCESS_READ); m=s.m
        assert m[:7]==b"BLENDER",m[:12]
        s.ps=8 if m[7:8]==b"-" else 4; s.en="<" if m[8:9]==b"v" else ">"; s.ver=int(m[9:12])
        s.blocks=[]; s.by_addr={}; o=12; hs=16+s.ps
        while True:
            code=m[o:o+4].rstrip(b"\0").decode(); size=struct.unpack_from(s.en+"i",m,o+4)[0]
            addr=struct.unpack_from(s.en+("Q" if s.ps==8 else "I"),m,o+8)[0]
            sdna,count=struct.unpack_from(s.en+"ii",m,o+8+s.ps)
            b=(code,size,addr,sdna,count,o+hs); s.blocks.append(b); s.by_addr[addr]=b
            if code=="DNA1": s._dna(o+hs)
            if code=="ENDB": break
            o+=hs+size
        s._layouts()
        # les adresses des blocs DATA ne sont uniques qu'à l'intérieur de leur bloc d'identité (ID) : tables locales
        s.local={}; cur=None; s.by_addr={}
        for b in s.blocks:
            if b[0]=="DATA":
                if cur is not None: cur.setdefault(b[2],b)
                s.by_addr.setdefault(b[2],b)
            else:
                cur={}; s.local[b[2]]=cur
        for b in s.blocks:
            if b[0]!="DATA": s.by_addr[b[2]]=b
    def _dna(s,o):
        m=s.m; e=s.en; o0=o
        def al(o): return o0+((o-o0+3)&~3)
        assert m[o:o+8]==b"SDNANAME"; o+=8; n=struct.unpack_from(e+"i",m,o)[0]; o+=4
        names=[]
        for _ in range(n):
            j=m.find(b"\0",o); names.append(m[o:j].decode()); o=j+1
        o=al(o); assert m[o:o+4]==b"TYPE"; o+=4; n=struct.unpack_from(e+"i",m,o)[0]; o+=4
        types=[]
        for _ in range(n):
            j=m.find(b"\0",o); types.append(m[o:j].decode()); o=j+1
        o=al(o); assert m[o:o+4]==b"TLEN"; o+=4
        tlen=list(struct.unpack_from(e+"%dh"%len(types),m,o)); o+=2*len(types)
        o=al(o); assert m[o:o+4]==b"STRC"; o+=4; n=struct.unpack_from(e+"i",m,o)[0]; o+=4
        strc=[]
        for _ in range(n):
            t,nf=struct.unpack_from(e+"hh",m,o); o+=4
            fl=[struct.unpack_from(e+"hh",m,o+4*i) for i in range(nf)]; o+=4*nf
            strc.append((t,fl))
        s.names,s.types,s.tlen,s.strc=names,types,tlen,strc
    def _layouts(s):
        s.lay={}; s.sidx={}
        for i,(t,fl) in enumerate(s.strc):
            off=0; d={}
            for ft,fn in fl:
                name=s.names[fn]; tn=s.types[ft]
                dims=[int(x) for x in re.findall(r"\[(\d+)\]",name)]; cnt=1
                for x in dims: cnt*=x
                base=re.sub(r"\[.*","",name).lstrip("*").strip("()")
                isptr=name.startswith("*") or name.startswith("(*")
                sz=(s.ps if isptr else s.tlen[ft])*cnt
                d[base.split(")")[0]]=(off,tn,isptr,cnt,sz); off+=sz
            s.lay[s.types[t]]=d; s.sidx[i]=s.types[t]
    def field(s,st,base,path):
        """décalage et type d'un champ, chemin 'a.b.c'"""
        off=base
        for p in path.split("."):
            o,tn,isptr,cnt,sz=s.lay[st][p]; off+=o; st=tn
        return off,tn,isptr,cnt,sz
    def get(s,st,base,path):
        off,tn,isptr,cnt,sz=s.field(st,base,path); e=s.en
        if isptr: v=struct.unpack_from(e+("%dQ" if s.ps==8 else "%dI")%cnt,s.m,off)
        elif tn=="char": return s.m[off:off+cnt].split(b"\0")[0].decode("utf8","replace")
        else:
            c={"int":"i","float":"f","short":"h","uchar":"B","double":"d","int64_t":"q","uint64_t":"Q","ushort":"H","int8_t":"b","uint":"I"}[tn]
            v=struct.unpack_from(e+"%d%s"%(cnt,c),s.m,off)
        return v[0] if cnt==1 else v
    def of(s,code): return [b for b in s.blocks if b[0]==code]
