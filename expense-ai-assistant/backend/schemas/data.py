from pydantic import BaseModel, Field
from datetime import date


class DataCreate(BaseModel):
    date: date
    value: int = Field(gt=0)
    memo: str = Field(min_length=1, max_length=200)


class DataUpdate(BaseModel):
    date: date
    value: int = Field(gt=0)
    memo: str = Field(min_length=1, max_length=200)