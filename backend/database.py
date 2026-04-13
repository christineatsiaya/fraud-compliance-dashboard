# imports for database connection and operations
import os
from pathlib import Path
from dotenv import load_dotenv 
from supabase import create_client, Client

# Load .env from the backend directory 
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
