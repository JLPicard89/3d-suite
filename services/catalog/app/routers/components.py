from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from ..db import get_db
from .. import models, schemas

router = APIRouter()

@router.get("/healthz")
async def healthz():
    return {"ok": True}

@router.get("/components", response_model=list[schemas.ComponentOut])
async def list_components(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(models.Component))
    return [schemas.ComponentOut.model_validate(row.__dict__) for row in res.scalars().all()]

@router.post("/components", response_model=schemas.ComponentOut, status_code=201)
async def create_component(payload: schemas.ComponentCreate, db: AsyncSession = Depends(get_db)):
    comp = models.Component(**payload.model_dump())
    db.add(comp)
    await db.commit()
    await db.refresh(comp)
    return schemas.ComponentOut.model_validate(comp.__dict__)

@router.get("/components/{id}", response_model=schemas.ComponentOut)
async def get_component(id: str, db: AsyncSession = Depends(get_db)):
    obj = await db.get(models.Component, id)
    if not obj:
        raise HTTPException(status_code=404, detail="Not found")
    return schemas.ComponentOut.model_validate(obj.__dict__)