from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID, uuid4

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
)

class Item(BaseModel):
    id: Optional[UUID] = None
    name: str
    amount: int
    picked: bool = False

Items: List[Item] = []

@app.get("/")
async def read_root():
    return {"hello": "world"}

@app.get("/items", response_model=List[Item])
async def read_items():
    return Items

@app.post("/items/", response_model=Item)
async def create_item(item: Item):
    item.id = item.id or uuid4()
    Items.append(item)
    return item

@app.put("/items/{item_id}", response_model=Item)
async def update_item(item_id: UUID, updated_item: Item):
    for i, item in enumerate(Items):
        if item.id == item_id:
            updated_item.id = item_id
            Items[i] = updated_item
            return updated_item
    raise HTTPException(status_code=404, detail="Item not found")

@app.delete("/items/{item_id}", response_model=dict)
async def delete_item(item_id: UUID):
    for i, item in enumerate(Items):
        if item.id == item_id:
            del Items[i]
            return {"message": "Item deleted successfully"}
    raise HTTPException(status_code=404, detail="Item not found")
