from pydantic import BaseModel

class BusinessRecord(BaseModel):
    name:str
    address:str
    city:str
    state:str
    zip_code:str

class PredictRequest(BaseModel):    
    record1:BusinessRecord
    record2:BusinessRecord
