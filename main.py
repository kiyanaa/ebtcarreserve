from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.orm import declarative_base, sessionmaker, Session

# ----------------------------
# Database
# ----------------------------
Base = declarative_base()
engine = create_engine("sqlite:///araclar.db", connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ----------------------------
# Tables
# ----------------------------
class AracDB(Base):
    __tablename__ = "araclar"
    id = Column(Integer, primary_key=True, index=True)
    plaka = Column(String, unique=True, index=True)
    yer = Column(String)
    durum = Column(String, default="uygun")
    konum = Column(String, nullable=True)
    kullanan = Column(String, nullable=True)
    baslangic = Column(String, nullable=True)
    son = Column(String, nullable=True)
    tahsis = Column(Boolean, default=False)
    tahsisli = Column(String, nullable=True)

class IstekDB(Base):
    __tablename__ = "istekler"
    id = Column(Integer, primary_key=True, index=True)
    kullanan = Column(String, index=True)
    yer = Column(String)
    gidilecek_yer = Column(String)
    baslangic = Column(String)
    son = Column(String, default="Belli değil")
    neden = Column(String, default="Yok")
    aciliyet = Column(String, default="Yok")

class IstekAracDB(Base):
    __tablename__ = "istek_arac"
    id = Column(Integer, primary_key=True, index=True)
    plaka = Column(String)
    kullanan = Column(String, index=True)
    yer = Column(String)
    gidilecek_yer = Column(String)
    baslangic = Column(String)
    son = Column(String, default="Belli değil")
    neden = Column(String, default="Yok")
    aciliyet = Column(String, default="Yok")

Base.metadata.create_all(bind=engine)

# ----------------------------
# FastAPI App
# ----------------------------
app = FastAPI(title="Araç Tahsis Uygulaması")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# Models
# ----------------------------
class UpdateVehicleForm(BaseModel):
    yer: Optional[str] = None
    durum: Optional[str] = None
    kullanan: Optional[str] = None
    baslangic: Optional[str] = None
    son: Optional[str] = None
    tahsis: Optional[bool] = None
    tahsisli: Optional[str] = None

class IstekModel(BaseModel):
    kullanan: str
    yer: str
    gidilecek_yer: str
    baslangic: str
    son: Optional[str] = "Belli değil"
    neden: Optional[str] = "Yok"
    aciliyet: Optional[str] = "Yok"

class IstekAracModel(BaseModel):
    plaka: str
    kullanan: str
    yer: str
    gidilecek_yer: str
    baslangic: str
    son: Optional[str] = "Belli değil"
    neden: Optional[str] = "Yok"
    aciliyet: Optional[str] = "Yok"

class IadeModel(BaseModel):
    plaka: str
    yer: str
    son: str
    neden: Optional[str] = "İş"

class UzerineAlModel(BaseModel):
    kullanan: str
    yer: str
    baslangic: str
    son: str
    neden: str

class AracCreate(BaseModel):
    plaka: str
    yer: str
    tahsis: bool = False
    tahsisli: Optional[str] = None

# ----------------------------
# Data Classes
# ----------------------------
class Istek:
    def __init__(self, model: IstekModel):
        self.kullanan = model.kullanan
        self.yer = model.yer
        self.gidilecek_yer = model.gidilecek_yer
        self.baslangic = model.baslangic
        self.son = model.son
        self.neden = model.neden
        self.aciliyet = model.aciliyet

    def istek_bilgileri(self):
        return self.__dict__

class IstekArac:
    def __init__(self, plaka: str, istek: Istek):
        self.plaka = plaka
        self.kullanan = istek.kullanan
        self.yer = istek.yer
        self.gidilecek_yer = istek.gidilecek_yer
        self.baslangic = istek.baslangic
        self.son = istek.son
        self.neden = istek.neden
        self.aciliyet = istek.aciliyet

class Arac:
    def __init__(self, plaka: str, yer: str):
        self.plaka = plaka
        self.yer = yer
        self.tahsis = False
        self.kisi = None
        self.durum = "uygun"
        self.kullanan = None
        self.baslangic = None
        self.son = None
        self.neden = None

    def uzerine_al(self, model: UzerineAlModel):
        self.kullanan = model.kullanan
        self.durum = "kullanımda"
        self.yer = model.yer
        self.baslangic = model.baslangic
        self.son = model.son
        self.neden = model.neden

    def arac_iade(self, model: IadeModel):
        self.durum = "uygun"
        self.kullanan = None
        self.yer = model.yer
        self.baslangic = None
        self.son = model.son
        self.neden = model.neden

    def arac_bilgileri(self):
        return {
            "plaka": self.plaka,
            "tahsis": self.tahsis,
            "tahsisli kişi": self.kisi,
            "durum": self.durum,
            "kullanan": self.kullanan,
            "yer": self.yer,
            "baslangic": self.baslangic,
            "son": self.son,
            "neden": self.neden
        }


# ----------------------------
# Endpoints
# ----------------------------

@app.get("/araclar")
def get_araclar(db: Session = Depends(get_db)):
    return db.query(AracDB).all()

@app.get("/araclar/{plaka}")
def get_arac_by_plaka(plaka: str, db: Session = Depends(get_db)):
    arac = db.query(AracDB).filter(AracDB.plaka == plaka).first()
    if not arac:
        raise HTTPException(status_code=404, detail="Araç bulunamadı")
    return {"arac": jsonable_encoder(arac)}

@app.get("/istekler")
def get_istekler(db: Session = Depends(get_db)):
    return db.query(IstekDB).all()

@app.post("/istek_olustur")
def arac_iste(model: IstekModel, db: Session = Depends(get_db)):
    mevcut = db.query(IstekDB).filter(IstekDB.kullanan == model.kullanan).first()
    if mevcut:
        raise HTTPException(status_code=400, detail="Kişinin zaten bir isteği var")

    yeni_istek = IstekDB(
        kullanan=model.kullanan,
        yer=model.yer,
        gidilecek_yer=model.gidilecek_yer,
        baslangic=model.baslangic,
        son=model.son,
        neden=model.neden,
        aciliyet=model.aciliyet
    )

    db.add(yeni_istek)
    db.commit()
    db.refresh(yeni_istek)

    return {"status": "İstek oluşturuldu", "istek": jsonable_encoder(yeni_istek)}
    
@app.put("/istek_olustur/{plaka}")
def arac_iste(plaka: str, model: IstekAracModel, db: Session = Depends(get_db)):
    arac = db.query(AracDB).filter(AracDB.plaka == plaka).first()
    if not arac:
        raise HTTPException(status_code=404, detail="Araç bulunamadı")

    yeni_istek_arac = IstekAracDB(
        plaka=model.plaka,
        kullanan=model.kullanan,
        yer=model.yer,
        gidilecek_yer=model.gidilecek_yer,
        baslangic=model.baslangic,
        son=model.son,
        neden=model.neden,
        aciliyet=model.aciliyet
    )

    db.add(yeni_istek_arac)
    db.commit()
    db.refresh(yeni_istek_arac)

    return {"status": "İstek oluşturuldu", "istek": jsonable_encoder(yeni_istek_arac)}

@app.post("/uzerine_al/{plaka}")
def arac_uzerine_al(plaka: str, model: UzerineAlModel, db: Session = Depends(get_db)):
    arac = db.query(AracDB).filter(AracDB.plaka == plaka).first()
    if not arac:
        raise HTTPException(status_code=404, detail="Araç bulunamadı")

    if not arac.kullanan:
        arac.kullanan = model.kullanan
        arac.durum = "kullanımda"
        arac.yer = model.yer
        arac.baslangic = model.baslangic
        arac.son = model.son
        arac.neden = model.neden

        db.commit()
        db.refresh(arac)

        # Kullanıcı isteği varsa sil
        istek = db.query(IstekDB).filter(IstekDB.kullanan == model.kullanan).first()
        if istek:
            db.delete(istek)
            db.commit()
    else:
        raise HTTPException(status_code=400, detail="Araç zaten kullanımda")

    return {"status": "Araç üzerine alındı", "arac": jsonable_encoder(arac)}

@app.post("/iade")
def arac_iade(model: IadeModel, db: Session = Depends(get_db)):
    arac = db.query(AracDB).filter(AracDB.plaka == model.plaka).first()
    if not arac:
        raise HTTPException(status_code=404, detail="Araç bulunamadı")

    arac.durum = "uygun"
    arac.kullanan = None
    arac.yer = model.yer
    arac.baslangic = None
    arac.son = model.son
    arac.neden = model.neden

    db.commit()
    db.refresh(arac)
    return {"status": "Araç iade edildi", "arac": jsonable_encoder(arac)}

@app.post("/arac_ekle")
def arac_ekle(arac: AracCreate, db: Session = Depends(get_db)):
    mevcut = db.query(AracDB).filter(AracDB.plaka == arac.plaka).first()
    if mevcut:
        raise HTTPException(status_code=400, detail="Bu plaka zaten mevcut")

    yeni_arac = AracDB(
        plaka=arac.plaka,
        yer=arac.yer,
        tahsis=arac.tahsis,
        tahsisli=arac.tahsisli
    )

    db.add(yeni_arac)
    db.commit()
    db.refresh(yeni_arac)

    return {"status": "Araç eklendi", "arac": jsonable_encoder(yeni_arac)}

@app.put("/arac_guncelle/{plaka}")
def update_vehicle(plaka: str, form: UpdateVehicleForm, db: Session = Depends(get_db)):
    arac = db.query(AracDB).filter(AracDB.plaka == plaka).first()
    if not arac:
        raise HTTPException(status_code=404, detail="Araç bulunamadı")

    for key, value in form.dict(exclude_unset=True).items():
        setattr(arac, key, value)

    db.commit()
    db.refresh(arac)
    return {"status": "Araç güncellendi", "arac": jsonable_encoder(arac)}

@app.delete("/araclar/{plaka}")
def delete_arac(plaka: str, db: Session = Depends(get_db)):
    arac = db.query(AracDB).filter(AracDB.plaka == plaka).first()
    if not arac:
        raise HTTPException(status_code=404, detail="Araç bulunamadı")

    db.delete(arac)
    db.commit()
    return {"status": "Araç silindi", "plaka": plaka}

@app.delete("/istek_sil")
def istek_sil(kullanan: str, db: Session = Depends(get_db)):
    if not kullanan:
        raise HTTPException(status_code=400, detail="Silmek için kullanan belirtilmeli")

    istek = db.query(IstekDB).filter(IstekDB.kullanan == kullanan).first()
    if not istek:
        raise HTTPException(status_code=404, detail="İstek bulunamadı")

    db.delete(istek)
    db.commit()
    return {"status": "İstek silindi", "kullanan": kullanan}