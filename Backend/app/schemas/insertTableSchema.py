from pydantic import BaseModel

class insertTableRequest(BaseModel):
    tableName: str
    columns: list
    values: list

    def __getitem__(self, item):
        return getattr(self, item)