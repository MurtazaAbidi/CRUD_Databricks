from pydantic import BaseModel

class createTableRequest(BaseModel):
    tableName: str
    attributes: dict

    def __getitem__(self, item):
        return getattr(self, item)