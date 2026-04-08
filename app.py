"""
==============================================================
  Heart Disease Prediction – Local Development Server (Flask)
  Run: python app.py
  Visit: http://localhost:5000
==============================================================
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import joblib
import numpy as np
import os

# ── App setup ────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__, static_folder="public", static_url_path="")
CORS(app)

# ── Load trained model ───────────────────────────────────────
MODEL_PATH = os.path.join(BASE_DIR, "heart_model.pkl")
model = joblib.load(MODEL_PATH)
print(f"[OK] Model loaded from {MODEL_PATH}")

# ── Routes ───────────────────────────────────────────────────

@app.route("/")
def serve_index():
    """Serve the main HTML page."""
    return send_from_directory(app.static_folder, "index.html")


@app.route("/login.html")
@app.route("/login")
def serve_login():
    """Serve the login page."""
    return send_from_directory(app.static_folder, "login.html")


@app.route("/admin.html")
@app.route("/admin")
def serve_admin():
    """Serve the admin dashboard."""
    return send_from_directory(app.static_folder, "admin.html")


@app.route("/api/predict", methods=["POST"])
def predict():
    """
    Accept JSON with: age, blood_pressure, cholesterol, heart_rate, chest_pain_type
    Return: prediction (0/1), probability %, risk_level
    """
    try:
        data = request.get_json(force=True)

        # Extract & validate features
        age             = float(data.get("age", 0))
        blood_pressure  = float(data.get("blood_pressure", 0))
        cholesterol     = float(data.get("cholesterol", 0))
        heart_rate      = float(data.get("heart_rate", 0))
        chest_pain_type = float(data.get("chest_pain_type", 0))

        features = np.array([[age, blood_pressure, cholesterol,
                              heart_rate, chest_pain_type]])

        # Predict
        prediction  = int(model.predict(features)[0])
        probability = float(model.predict_proba(features)[0][1]) * 100  # % chance of disease

        # Determine risk level
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


# ── Run ──────────────────────────────────────────────────────
if __name__ == "__main__":
    app.run(debug=True, port=5000)
