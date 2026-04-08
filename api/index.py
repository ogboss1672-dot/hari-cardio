"""
==============================================================
  Heart Disease Prediction – Vercel Serverless Function
  Deployed as /api/* on Vercel
==============================================================
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

# ── App setup ────────────────────────────────────────────────
app = Flask(__name__)
CORS(app)

# ── Load trained model ───────────────────────────────────────
MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "heart_model.pkl")
model = joblib.load(MODEL_PATH)

# ── API Route ────────────────────────────────────────────────

@app.route("/api/predict", methods=["POST"])
def predict():
    """
    Accept JSON with: age, blood_pressure, cholesterol, heart_rate, chest_pain_type
    Return: prediction (0/1), probability %, risk_level
    """
    try:
        data = request.get_json(force=True)

        age             = float(data.get("age", 0))
        blood_pressure  = float(data.get("blood_pressure", 0))
        cholesterol     = float(data.get("cholesterol", 0))
        heart_rate      = float(data.get("heart_rate", 0))
        chest_pain_type = float(data.get("chest_pain_type", 0))

        features = np.array([[age, blood_pressure, cholesterol,
                              heart_rate, chest_pain_type]])

        prediction  = int(model.predict(features)[0])
        probability = float(model.predict_proba(features)[0][1]) * 100

        if probability >= 70:
            risk_level = "High"
        elif probability >= 40:
            risk_level = "Medium"
        else:
            risk_level = "Low"

        return jsonify({
            "success":     True,
            "prediction":  prediction,
            "probability": round(probability, 2),
            "risk_level":  risk_level,
            "factors": {
                "age":            round(min(age / 80, 1) * 100, 1),
                "blood_pressure": round(min(blood_pressure / 200, 1) * 100, 1),
                "cholesterol":    round(min(cholesterol / 400, 1) * 100, 1),
                "heart_rate":     round(min(heart_rate / 200, 1) * 100, 1),
                "chest_pain":     round(chest_pain_type / 3 * 100, 1),
            },
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# Health check
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})
