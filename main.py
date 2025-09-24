from fastapi import FastAPI, HTTPException, Depends
from fastapi import Body, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from fastapi import FastAPI, HTTPException, Depends
from fastapi import Body, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from jose import JWTError, jwt 
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import bcrypt
import datetime

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
class UserDB(Base):
    __tablename__ = "Kullanicilar"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    position = Column(String, default="user")
    department = Column(String, nullable=True)


class AracDB(Base):
    __tablename__ = "araclar"
    id = Column(Integer, primary_key=True, index=True)
    marka = Column(String, nullable=True)
    model = Column(String, nullable=True)
    yil = Column(String, nullable=True)
    renk = Column(String, nullable=True)
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

class HareketDB(Base):
    __tablename__ = "Hareketler"
    id = Column(Integer, primary_key=True, index=True)
    plaka = Column(String, index= True)
    kullanan = Column(String, index= True)
    yer = Column(String)
    baslangic = Column(String)
    son = Column(String, default = "Bilgi yok")
    neden = Column(String, default = "İş")


class IstekAracDB(Base):
    __tablename__ = "istek_arac"
    id = Column(Integer, primary_key=True, index=True)
    marka = Column(String, nullable=True)
    model = Column(String, nullable=True)
    yil = Column(String, nullable=True)
    renk = Column(String, nullable=True)
    plaka = Column(String)
    kullanan = Column(String, index=True)
    sahip =Column(String, index=True)
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

#-----------------------------
# Auth
#-----------------------------
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
SECRET_KEY = "dansedenornitorenk"
ALGORITHM = "HS256"

def create_access_token(data: dict, expires_delta: Optional[datetime.timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.datetime.utcnow() + expires_delta
    else:
        expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=120)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def get_user(db, username: str):
    return db.query(UserDB).filter(UserDB.username == username).first()

def authenticate_user(db, username: str, password: str):
    user = get_user(db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Geçersiz kimlik bilgileri",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("username")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = get_user(db, username=username)
    if user is None:
        raise credentials_exception
    return user

def position_check(current_user: UserDB = Depends(get_current_user)):
    if current_user.position == "user":
        return 1
    elif current_user.position == "tahsis sahibi":
        return 2
    elif current_user.position == "havuz":
        return 3
    elif current_user.position == "admin":
        return 4
    else:
        return 0


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

class HareketModel(BaseModel):
    plaka: str
    kullanan: str
    yer: str
    baslangic: str
    son: str
    neden: str

class IstekAracModel(BaseModel):
    marka: Optional[str] = None
    model: Optional[str] = None
    yil: Optional[str] = None
    renk: Optional[str] = None
    plaka: str
    kullanan: str
    sahip: str
    yer: str
    gidilecek_yer: str
    baslangic: str
    son: Optional[str] = "Belli değil"
    neden: Optional[str] = "Yok"
    aciliyet: Optional[str] = "Yok"

class IadeModel(BaseModel):
    marka: Optional[str] = None
    model: Optional[str] = None
    yil: Optional[str] = None
    renk: Optional[str] = None
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
    marka: Optional[str] = None
    model: Optional[str] = None
    yil: Optional[str] = None
    renk: Optional[str] = None
    plaka: str
    yer: str
    kullanan: Optional[str] = None
    baslangic: Optional[str] = None
    son: Optional[str] = None
    durum: Optional[str] = "uygun"
    tahsis: bool = False
    tahsisli: Optional[str] = None




# ----------------------------
# Endpoints
# ----------------------------
#------ 1.Araç Listesi --------
@app.get("/araclar")
def get_araclar(db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    
    return db.query(AracDB).all()

# ----- 2.Plaka ile Araç Getir --------

@app.get("/araclar/{plaka}")
def get_arac_by_plaka(plaka: str, db: Session = Depends(get_db), current_user:UserDB = Depends(get_current_user)):
    arac = db.query(AracDB).filter(AracDB.plaka == plaka).first()
    if not arac:
        raise HTTPException(status_code=404, detail="Araç bulunamadı")
    return {"arac": jsonable_encoder(arac)}

# ----- 3.İstek Listesi --------

@app.get("/istekler")
def get_istekler(db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    if position_check(current_user) >= 2:
        return db.query(IstekDB).all()
    elif position_check(current_user) == 1:
        return db.query(IstekDB).filter(IstekDB.kullanan == current_user.username).all()

# ----- 4.İstek Araç Listesi --------

@app.get("/istek_araclar")
def get_istek_araclar(db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user) ):
    if position_check(current_user) >= 3:
        return db.query(IstekAracDB).all()
    elif position_check(current_user) == 2:
        tahsisli_arac = db.query(AracDB).filter(AracDB.tahsisli== current_user.username).first()
        if not tahsisli_arac:
            return db.query(IstekAracDB).filter(IstekAracDB.kullanan == current_user.username).first()
        tahsis_plaka = tahsisli_arac.plaka
        istek_araclar = db.query(IstekAracDB).all()
        donus = [
            istek_arac
            for istek_arac in istek_araclar
            if istek_arac.plaka == tahsis_plaka or istek_arac.kullanan == current_user.username
        ]
        return donus

            
    elif position_check(current_user) == 1:
        return db.query(IstekAracDB).filter(IstekAracDB.kullanan == current_user.username).all()
    else:
        raise HTTPException(status_code=404, detail="Kullanıcının yetkisi dışında.")

# ----- 5.İstek Oluştur --------

@app.post("/istek_olustur")
def arac_iste(model: IstekModel, db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    
    
    if position_check(current_user) >= 2:
        mevcut = db.query(IstekDB).filter(IstekDB.kullanan == model.kullanan).first()
        if mevcut:
            raise HTTPException(status_code=400, detail="Kişinin zaten bir isteği var")
        yeni_istek = IstekDB(
            kullanan = model.kullanan,
            yer = model.yer,
            gidilecek_yer=model.gidilecek_yer,
            baslangic=model.baslangic,
            son=model.son,
            neden=model.neden,
            aciliyet=model.aciliyet

        )
    elif model.kullanan != current_user.username:
        raise HTTPException(status_code=404, detail = "Başkası adına istek oluşturamazsınız.")
    elif position_check(current_user) == 1 :
        mevcut = db.query(IstekDB).filter(IstekDB.kullanan == current_user.username).first()
        if mevcut:
            raise HTTPException(status_code = 404, detail = "İsteğiniz bulunmakta tekrar istek yapamazsınız.")
        yeni_istek = IstekDB(
            kullanan=current_user.username,
            yer=model.yer,
            gidilecek_yer=model.gidilecek_yer,
            baslangic=model.baslangic,
            son=model.son,
            neden=model.neden,
            aciliyet=model.aciliyet
        )
    else:
        raise HTTPException(status_code=404, detail="Kullanıcının yetkisi dışında.")

    db.add(yeni_istek)
    db.commit()
    db.refresh(yeni_istek)

    return {"status": "İstek oluşturuldu", "istek": jsonable_encoder(yeni_istek)}

# ----- 6.Plaka ile İstek Oluştur --------
    
@app.put("/istek_olustur/{plaka}")
def arac_iste(plaka: str, model: IstekAracModel, db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    
    # Kullanıcının adı ve plaka için mevcut istek
    if position_check(current_user) >= 2:
        kullanan = model.kullanan
    elif position_check(current_user) == 1:
        kullanan = current_user.username
    else:
        raise HTTPException(status_code=403, detail="Kullanıcının yetkisi dışında.")

    mevcut = db.query(IstekAracDB).filter(
        IstekAracDB.kullanan == kullanan,
        IstekAracDB.plaka == plaka
    ).first()

    if mevcut:
        return {"status": "Bu kullanıcı ve araç için istek zaten mevcut.", "istek": jsonable_encoder(mevcut)}

    arac = db.query(AracDB).filter(AracDB.plaka == plaka).first()
    if not arac:
        raise HTTPException(status_code=404, detail="Araç bulunamadı")

    yeni_istek_arac = IstekAracDB(
        marka=model.marka,
        model=model.model,
        yil=model.yil,
        renk=model.renk,
        plaka=plaka,
        kullanan=kullanan,
        sahip=model.sahip,
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

# ----- 7.Araç Üzerine Al --------

@app.post("/uzerine_al/{plaka}")
def arac_uzerine_al(plaka: str, model: UzerineAlModel, db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    # Araç var mı kontrolü
    arac = db.query(AracDB).filter(AracDB.plaka == plaka).first()
    if not arac:
        raise HTTPException(status_code=404, detail="Araç bulunamadı")

    # Araç tahsisli mi, tahsis edilen kullanıcı kim?
    if not arac.tahsisli:
        raise HTTPException(status_code=403, detail="Araç tahsisli değil, üzerine alınamaz.")

    if arac.kullanan:
        raise HTTPException(status_code=400, detail="Araç zaten kullanımda")

    # Sadece tahsis edilen kullanıcı kendi aracını alabilir
    if arac.tahsisli != current_user.username:
        raise HTTPException(status_code=403, detail="Bu araç sizin tahsisinizde değil.")

    # Aracı üzerine alma işlemi
    arac.kullanan = current_user.username
    arac.durum = "kullanımda"
    arac.yer = model.yer
    arac.baslangic = model.baslangic
    arac.son = model.son

    db.commit()
    db.refresh(arac)

    # Kullanıcı isteği varsa sil
    istek = db.query(IstekDB).filter(IstekDB.kullanan == current_user.username).first()
    if istek:
        db.delete(istek)
        db.commit()
    istek_arac = db.query(IstekAracDB).filter(IstekAracDB.kullanan == current_user.username).delete()
    istek_plaka = db.query(IstekAracDB).filter(IstekAracDB.plaka == plaka).delete()
    db.commit()

    return {"status": "Araç üzerine alındı", "arac": jsonable_encoder(arac)}


# ----- 8.Araç İade --------
@app.post("/iade")
def arac_iade(model: IadeModel, db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    arac = db.query(AracDB).filter(AracDB.plaka == model.plaka).first()
    if not arac:
        raise HTTPException(status_code=404, detail="Araç bulunamadı")

    # Sadece aracı kullanan, havuz veya admin iade edebilir
    pozisyon = position_check(current_user)
    if arac.kullanan != current_user.username and pozisyon <= 2 and arac.tahsisli != current_user.username:
        raise HTTPException(status_code=403, detail="Bu aracı iade etme yetkiniz yok")

    # Hareket kaydı oluştur
    yeni_hareket = HareketDB(
        plaka=arac.plaka,
        kullanan=arac.kullanan,
        baslangic=arac.baslangic,
        son=model.son,
        yer=arac.yer,
        neden=model.neden
    )
    db.add(yeni_hareket)
    db.commit()
    db.refresh(yeni_hareket)

    # Aracı iade et
    arac.durum = "uygun"
    arac.kullanan = None
    arac.yer = model.yer
    arac.baslangic = None
    arac.son = model.son
    arac.neden = model.neden

    db.commit()
    db.refresh(arac)

    return {"status": "Araç iade edildi", "arac": jsonable_encoder(arac)}


# ----- 9.Araç Ekle --------

@app.post("/arac_ekle")
def arac_ekle(arac: AracCreate, db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    mevcut = db.query(AracDB).filter(AracDB.plaka == arac.plaka).first()
    if mevcut:
        raise HTTPException(status_code=400, detail="Bu plaka zaten mevcut")
    
    if position_check(current_user) >= 2:

        yeni_arac = AracDB(
            marka=arac.marka,
            model=arac.model,
            yil=arac.yil,
            renk=arac.renk,
            plaka=arac.plaka,
            yer=arac.yer,
            kullanan = arac.kullanan,
            baslangic = arac.baslangic,
            son = arac.son,
            durum = arac.durum,
            tahsis=arac.tahsis,
            tahsisli=arac.tahsisli
        )

        db.add(yeni_arac)
        db.commit()
        db.refresh(yeni_arac)

        return {"status": "Araç eklendi", "arac": jsonable_encoder(yeni_arac)}
    else:
        raise HTTPException(status_code = 403, detail = "Yetki yok.")

# ----- 10.Araç Güncelle --------

@app.put("/arac_guncelle/{plaka}")
def update_vehicle(plaka: str, form: UpdateVehicleForm, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    if position_check(current_user) >= 2:
        arac = db.query(AracDB).filter(AracDB.plaka == plaka).first()
        if not arac:
            raise HTTPException(status_code=404, detail="Araç bulunamadı")

        for key, value in form.dict(exclude_unset=True).items():
            setattr(arac, key, value)

        db.commit()
        db.refresh(arac)
        return {"status": "Araç güncellendi", "arac": jsonable_encoder(arac)}
    else:
        raise HTTPException(status_code = 403, detail = "Yetki yok.")

# ----- 11.Araç Sil --------

@app.delete("/araclar/{plaka}")
def delete_arac(plaka: str, db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    if position_check(current_user) >= 2:
        arac = db.query(AracDB).filter(AracDB.plaka == plaka).first()
        if not arac:
            raise HTTPException(status_code=404, detail="Araç bulunamadı")

        db.delete(arac)
        db.commit()
        return {"status": "Araç silindi", "plaka": plaka}
    else:
        raise HTTPException(status_code = 403, detail = "Yetki yok.")

# ----- 12.İstek Sil --------

@app.delete("/istek_sil")
def istek_sil(
    kullanan: str = Query(None),
    body: dict = Body(None),
    db: Session = Depends(get_db),
    current_user: UserDB = Depends(get_current_user)
):
    # Eğer query parametresi boşsa, body'den al
    if body:
        kullanan = kullanan or body.get("kullanan")

    if not kullanan:
        raise HTTPException(status_code=400, detail="Silmek için kullanan belirtilmeli")
    if position_check(current_user) < 1 or (position_check(current_user) == 1 and kullanan != current_user.username):
        raise HTTPException(status_code=403, detail="Bu isteği silme yetkiniz yok")
    istek = db.query(IstekDB).filter(IstekDB.kullanan == kullanan).first()

    if not istek:
        raise HTTPException(status_code=404, detail="İstek bulunamadı")

    db.delete(istek)
    db.commit()
    return {"status": "İstek silindi", "kullanan": kullanan}
    db.query(AracIstekDB).filter(AracIstekDB.kullanan == kullanan).delete()

# ----- 13.İstek Araç Sil --------
@app.delete("/istek_arac_sil")
def istek_arac_sil(
    plaka: str = Query(None),
    kullanan: str = Query(None),
    body: dict = Body(None),
    db: Session = Depends(get_db),
    current_user: UserDB = Depends(get_current_user)
):
    # Eğer query parametreleri boşsa, body'den al
    if body:
        plaka = plaka or body.get("plaka")
        kullanan = kullanan or body.get("kullanan")
    
    if not kullanan or not plaka:
        raise HTTPException(status_code=400, detail="Silmek için kullanan ve plaka belirtilmeli")
    
    if position_check(current_user) >= 2 or (position_check(current_user) == 1 and kullanan == current_user.username):
        pass
    else:
        raise HTTPException(status_code=403, detail="Bu isteği silme yetkiniz yok")

    istek = db.query(IstekAracDB).filter(
        IstekAracDB.kullanan == kullanan,
        IstekAracDB.plaka == plaka
    ).first()

    if not istek:
        raise HTTPException(status_code=404, detail="İstek bulunamadı")

    db.delete(istek)
    db.commit()
    return {"status": "İstek silindi", "kullanan": kullanan, "plaka": plaka}

# ----- 14.Uygun Araçlar --------

@app.get("/uygun")
def get_araclar_uygun(db: Session = Depends(get_db), current_user:UserDB = Depends(get_current_user)):
    araclar = db.query(AracDB).all()
    uygun_araclar = []
    for arac in araclar:
        if arac.durum.lower() == "uygun":
            uygun_araclar.append(arac)
    return uygun_araclar

# ----- 15.İstek Sil Tümü ve Plaka ile Sil --------

@app.delete("/istek_sil_tumu/{kullanan}")
def istek_sil_tumu(kullanan: str, db: Session = Depends(get_db), current_user:UserDB = Depends(get_current_user)):
    if position_check(current_user) < 2 or (position_check(current_user) == 1 and kullanan != current_user.username):
        raise HTTPException(status_code=403, detail="Bu isteği silme yetkiniz yok")
    try:
        # Hem IstekDB hem IstekAracDB'den sil
        db.query(IstekDB).filter(IstekDB.kullanan == kullanan).delete()
        db.query(IstekAracDB).filter(IstekAracDB.kullanan == kullanan).delete()
        db.commit()
        return {"message": f"{kullanan} adlı kullanıcının tüm istekleri silindi"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Hata: {str(e)}")

# ----- 16.Plaka ile İstek Sil --------

@app.delete("/istek_sil_plaka/{plaka}")
def istek_sil_plaka(plaka: str, db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    if position_check(current_user) < 1:
        raise HTTPException(status_code=403, detail = "Yetki yok")
    db.query(IstekAracDB).filter(IstekAracDB.plaka == plaka).delete()
    db.commit()
    return {"message": f"{plaka} plakalı aracın tüm istekleri silindi"}

# ----- 17. Kullanıcı Kayıt --------

@app.post("/register")
def register_user(
    username: str = Body(...), 
    password: str = Body(...), 
    position: str = Body("user"),  # eskiden 'yetki'
    department: Optional[str] = Body(None), 
    db: Session = Depends(get_db)
):
    existing_user = db.query(UserDB).filter(UserDB.username == username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Kullanıcı zaten mevcut")

    hashed_password = get_password_hash(password)
    new_user = UserDB(username=username, hashed_password=hashed_password, position=position, department=department)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"status": "Kullanıcı kaydedildi", "user": jsonable_encoder(new_user)}

# ----- 18. Kullanıcı Giriş --------

@app.post("/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Hatalı kullanıcı adı veya şifre",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = datetime.timedelta(minutes=120)
    access_token = create_access_token(
        data={"username": user.username, "position": user.position},  # eskiden 'yetki'
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "position": user.position, "user": user.username}


# ----- 19. Kullanıcılar -----

@app.get("/users")
def get_users(db: Session = Depends(get_db)):
    return db.query(UserDB).all()

# ----- 20. Kullanıcı Sil -----

@app.delete("/users/{kullanan}")
def delete_user(kullanan: str, db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    # Sadece admin silebilir
    if position_check(current_user) < 4:
        raise HTTPException(status_code=403, detail="Bu işlemi yapma yetkiniz yok")

    user = db.query(UserDB).filter(UserDB.username == kullanan).first()
    if not user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")

    try:
        # Kullanıcıya ait tüm istekleri sil
        db.query(IstekDB).filter(IstekDB.kullanan == kullanan).delete()
        db.query(IstekAracDB).filter(IstekAracDB.kullanan == kullanan).delete()

        # Kullanıcıya tahsisli araçları sıfırla
        db.query(AracDB).filter(AracDB.tahsisli == kullanan).update({
            AracDB.tahsis: False,
            AracDB.tahsisli: None,
            AracDB.kullanan: None,
            AracDB.baslangic: None,
            AracDB.son: None
        })

        # Kullanıcının kullandığı araçları da sıfırla
        db.query(AracDB).filter(AracDB.kullanan == kullanan).update({
            AracDB.kullanan: None,
            AracDB.durum: "uygun",
            AracDB.baslangic: None,
            AracDB.son: None
        })

        # Kullanıcıyı sil
        db.delete(user)
        db.commit()

        return {"status": "Kullanıcı ve ilgili veriler silindi", "kullanan": kullanan}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Hata: {str(e)}")


# ----- 20. Parola Değiştir -----

@app.put("/users/change_password/{username}")
def change_password(
    username: str,
    old_password: Optional[str] = Body(None),  # kendi kullanıcı için gerekli
    new_password: str = Body(...),
    db: Session = Depends(get_db),
    current_user: UserDB = Depends(get_current_user)
):
    # Kullanıcıyı al
    user = db.query(UserDB).filter(UserDB.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")

    # Admin yetkisi
    is_admin = current_user.position == "admin"

    # Eğer admin değilse, sadece kendi parolasını değiştirebilir
    if not is_admin:
        if current_user.username != username:
            raise HTTPException(status_code=403, detail="Bu kullanıcı için parola değiştirme yetkiniz yok")
        if not old_password:
            raise HTTPException(status_code=400, detail="Mevcut parolanızı girmeniz gerekiyor")
        if not verify_password(old_password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Eski parola yanlış")

    # Yeni parolayı hashle ve kaydet
    user.hashed_password = get_password_hash(new_password)
    db.commit()
    db.refresh(user)

    return {"status": "Parola başarıyla değiştirildi", "user": user.username}


