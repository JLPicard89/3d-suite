import asyncio
from fastapi import FastAPI
from .db import engine
from .models import Base
from .routers import components as components_router

app = FastAPI(title="Catalog Service")
app.include_router(components_router.router)

@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)