from jose import JWTError, jwt
from fastapi import HTTPException, status
from datetime import datetime, timedelta
import json

SECRET_KEY = "DataBricks PumpJack"
ALGORITHM = "HS256"

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def getCredentials(token: str):
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        id = payload['id']
        credentials={}
        
        if id is None:
            raise credentials_exception
        else:
            with open("./details.json") as file:
                test_data = json.load(file)
            # print(test_data)
            for i in test_data:
                if(i["id"]==id):
                    credentials=i
        if credentials is None:
            raise credentials_exception

        # print(credentials)
        return credentials
    
    except JWTError:
        raise credentials_exception

