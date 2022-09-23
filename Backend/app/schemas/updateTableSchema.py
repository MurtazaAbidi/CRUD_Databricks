from pydantic import BaseModel

class updateTableRequest(BaseModel):
    tableName: str
    set: dict
    where: dict
    
    def __getitem__(self, item):
        return getattr(self, item)