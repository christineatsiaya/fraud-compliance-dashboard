import pandas as pd
from dotenv import load_dotenv
from supabase import create_client
import os

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase = create_client(url, key)

df = pd.read_csv("sar_data.csv")

df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]

print("CSV columns:", df.columns.tolist())

df = df[df["year_month"].astype(str).str[:4].str.isnumeric()]
df["year"] = df["year_month"].astype(str).str[:4].astype(int)
df["state_code"] = df["state"].astype(str).str.strip()
df["state_name"] = df["state"].astype(str).str.strip()
df["filing_count"] = (
    df["count"]
    .astype(str)
    .str.replace(",", "", regex=False)
    .astype(int)
)

records = df[["year", "state_code", "state_name", "industry", "filing_count"]].to_dict(
    orient="records"
)

batch_size = 500

for i in range(0, len(records), batch_size):
    batch = records[i : i + batch_size]
    supabase.table("sar_filings").insert(batch).execute()
    print(f"Inserted {i + len(batch)} rows")

print("Done seeding SAR filings.")