from pydantic import BaseModel

class testDataRequest(BaseModel):
    tableName: str
    
    def __getitem__(self, item):
        return getattr(self, item)