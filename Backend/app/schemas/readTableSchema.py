from pydantic import BaseModel

class readTableRequest(BaseModel):
    From: list
    SELECT: list
    filters: dict
    
    def __getitem__(self, item):
        return getattr(self, item)