from pydantic import BaseModel

class queryRequest(BaseModel):
    tableName: str
    where: str

    def __getitem__(self, item):
        return getattr(self, item)