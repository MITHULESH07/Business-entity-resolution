import joblib
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from app.schemas.prediction import PredictRequest
from app.services.features import create_features

app = FastAPI(
    title="Business Entity Resolution API",
    description = "API for detecting duplicate business records using ML",
    version="1.0.0",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","https://business-entity-resolution.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model=joblib.load("model/xgboost_model.joblib")

@app.get("/")
def home():
    return {"message":"Welcome to Business Entity Resolution API. Use /docs for API documentation."}

@app.post("/predict")
def predict(request:PredictRequest):
    features = create_features(request.record1,request.record2)
    feature_values = [list(features.values())]
    prediction = model.predict(feature_values)[0]
    probability = model.predict_proba(feature_values)[0][1]

    return {
        "match":bool(prediction),
        "confidence":round(float(probability),4),
        "features":features
    }

@app.get("/model_info")
def mode_info():
    return{
        "model_name": "XGBoost",
        "algorithm": "XGBClassifier",
        "n_estimators": 100,
        "max_depth": 3,
        "learning_rate": 0.1,
        "features": [
            "name_similarity",
            "address_similarity",
            "city_match",
            "state_match",
            "zip_match"
        ],
        "status": "loaded"
    }

@app.get("/health")
def health():
    return {
        "status":"healthy",
        "model_status":model is not None
    }

@app.get("/metrics")
def metrics():
    return{
        "accuracy": 0.50,
        "precision": 0.50,
        "recall": 1.00,
        "f1_score": 0.67,
        "test_samples": 2,
        "note": "Metrics from the current tiny demo dataset"
    }
