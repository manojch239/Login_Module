from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timezone, timedelta
from typing import Optional
import logging


# Models and database setup
from database import engine, SessionLocal, Base
from models import User
from schemas import UserCreate, UserLogin


class Token(BaseModel):
    token: str

#Create the database

#Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()


# OAuth2 setup
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

origins = [
    "http://localhost:3000",
    # "http://localhost:8000",
]

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,   # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],    # Allow all methods
    allow_headers=["*"],    # Allow all headers
)


# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Create a  secret for JWT and algorithm
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Dependency to get the DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Utility functions

#create a function to get the user by username
def get_user_by_username(db, username: str):
    return db.query(User).filter(User.username == username).first()

#create a new user
def create_user(db, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    # db_user = User(username=user.username, email=user.email, hashed_password=hashed_password)
    db_user = User(username=user.username, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return "User created successfully"

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

#create a function to authenticate a user
def authenticate_user(db: Session, username: str, password: str):
    user = db.query(User).filter(User.username == username).first()
    if not user or not verify_password(password, user.hashed_password):
        return False
    return user

#create a function to create a access token
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


#create a function to verify the token
def verify_token(token: Token):
    try:
        payload = jwt.decode(token.token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=400, detail="Invalid token")
        return username
    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


# Routes for user registration and login
@app.post("/register/")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    try:  
        logger.info(f"Received registration request: {user}")
        db_user = get_user_by_username(db, username=user.username)
        if db_user:
            raise HTTPException(status_code=400, detail="Username already exists")
        result = create_user(db=db, user=user)  
        logger.info(f"User registration successful: {result}")
        return {"message": result} 
    except Exception as e:
        logger.error(f"Error during user registration: {str(e)}")
        raise HTTPException(status_code=500, detail= f"Internal server error : {str(e)}")
    

@app.post("/login/")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# @app.get("/verify-token/{token}")



@app.post("/verify-token/")
async def verify_user_token(token:Token):
    # print(token)
    if token is None:
        raise HTTPException(status_code=400, detail="Token is required")
    token_data = verify_token(token=token)
    if token_data is None:
        raise HTTPException(status_code=400, detail="Toke verification failed")
    else:
        return {"message": "Token is valid","status":"success"}



