import string
from pydantic import BaseModel

class deleteTableRequest(BaseModel):
    tableName: str
    where: dict

    def __getitem__(self, item):
        return getattr(self, item)