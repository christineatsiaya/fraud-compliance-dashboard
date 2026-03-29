#import necessary libraries
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import supabase



# create the FastAPI app
app = FastAPI()

# allow CORS for all origins (for development purposes)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/health")
async def health_check():
    return {"status": "ok"}

