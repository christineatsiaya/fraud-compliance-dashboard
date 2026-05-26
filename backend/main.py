#import necessary libraries
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import supabase
from routers.states import router as states_router
from routers.sar import router as sar_router
from routers.risk import router as risk_router
from routers.interventions import router as interventions_router
from routers.ai import router as ai_router

# create the FastAPI app
app = FastAPI()


# include the routers
app.include_router(states_router)
app.include_router(sar_router)
app.include_router(risk_router)
app.include_router(interventions_router)
app.include_router(ai_router)

# allow CORS for all origins for development purposes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/health")
async def health_check():
    return {"status": "ok"}

