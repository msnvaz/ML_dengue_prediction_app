from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
import json

# Load model, encoder, and mappings
try:
    model = joblib.load("model.pkl")
    le_district = joblib.load("encoder.pkl")
    
    # Load district coordinates and province mappings
    with open("district_coords.json", "r") as f:
        district_coords = json.load(f)
    
    with open("province_district_mapping.json", "r") as f:
        province_district_mapping = json.load(f)
        
except Exception as e:
    raise Exception(f"Error loading model, encoder, or mappings: {e}")

app = FastAPI(title="Dengue Prediction API")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionRequest(BaseModel):
    year: int
    month: int
    district: str
    temperature: float
    rainfall: float
    humidity: float

@app.post("/predict")
def predict(data: PredictionRequest):
    try:
        # Validate district
        if data.district not in le_district.classes_:
            raise HTTPException(status_code=400, detail="Unknown district")
        
        # Get latitude and longitude from district coordinates
        if data.district not in district_coords:
            raise HTTPException(status_code=400, detail="District coordinates not found")
        
        latitude = district_coords[data.district]['latitude']
        longitude = district_coords[data.district]['longitude']

        # Seasonal features
        month_sin = np.sin(2 * np.pi * data.month / 12)
        month_cos = np.cos(2 * np.pi * data.month / 12)

        # Use current weather as lag features (simplified approach)
        # In production, you might want to store actual historical data
        features = np.array([[
            data.temperature, data.temperature, data.temperature,  # temp_lag1, temp_lag2, temp_lag3
            data.rainfall, data.rainfall, data.rainfall,          # rain_lag1, rain_lag2, rain_lag3
            data.humidity, data.humidity, data.humidity,          # humid_lag1, humid_lag2, humid_lag3
            month_sin, month_cos,
            latitude, longitude
        ]])

        prediction = model.predict(features)[0]
        prediction = int(round(max(0, prediction)))

        return {
            "success": True,
            "predicted_cases": prediction,
            "district": data.district,
            "year": data.year,
            "month": data.month,
            "coordinates": {
                "latitude": latitude,
                "longitude": longitude
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/provinces")
def get_provinces():
    """Get all available provinces"""
    return {"provinces": list(province_district_mapping.keys())}

@app.get("/districts/{province}")
def get_districts_by_province(province: str):
    """Get all districts for a specific province"""
    if province not in province_district_mapping:
        raise HTTPException(status_code=404, detail="Province not found")
    
    return {"districts": province_district_mapping[province]}

@app.get("/districts")
def get_all_districts():
    """Get all available districts with their coordinates"""
    return {"districts": district_coords}