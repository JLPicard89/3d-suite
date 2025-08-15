from pydantic import BaseModel, AnyUrl
from typing import Optional

class ComponentCreate(BaseModel):
    sku: str
    name: str
    price: float = 0
    asset_uri: Optional[str] = None

class ComponentOut(ComponentCreate):
    id: str