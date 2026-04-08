"""
==============================================================
  Heart Disease Prediction – Model Training Script
  Uses a synthetic dataset & Random Forest Classifier
==============================================================
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os

# ───────────────────────────────────────────────────────────
# 1. Generate a realistic synthetic heart-disease dataset
# ───────────────────────────────────────────────────────────
np.random.seed(42)
NUM_SAMPLES = 2000

age             = np.random.randint(20, 81, NUM_SAMPLES)
blood_pressure  = np.random.randint(90, 201, NUM_SAMPLES)
cholesterol     = np.random.randint(100, 401, NUM_SAMPLES)
heart_rate      = np.random.randint(50, 201, NUM_SAMPLES)
chest_pain_type = np.random.randint(0, 4, NUM_SAMPLES)   # 0-3

# Build a risk score that loosely mirrors medical knowledge
risk_score = (
    (age - 20) / 60 * 0.25 +                       # older → riskier
    (blood_pressure - 90) / 110 * 0.20 +            # high BP → riskier
    (cholesterol - 100) / 300 * 0.20 +              # high cholesterol → riskier
    np.where((heart_rate < 60) | (heart_rate > 100),
             0.15, 0.0) +                           # abnormal HR → riskier
    (chest_pain_type / 3) * 0.20                    # type 3 worst
)

noise  = np.random.normal(0, 0.12, NUM_SAMPLES)
target = (risk_score + noise > 0.45).astype(int)     # threshold → 0/1

df = pd.DataFrame({
    "age":             age,
    "blood_pressure":  blood_pressure,
    "cholesterol":     cholesterol,
    "heart_rate":      heart_rate,
    "chest_pain_type": chest_pain_type,
    "target":          target,
})

print(f"Dataset shape : {df.shape}")
print(f"Class balance : \n{df['target'].value_counts()}\n")

# ───────────────────────────────────────────────────────────
# 2. Train / Test split
# ───────────────────────────────────────────────────────────
X = df.drop("target", axis=1)
y = df["target"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ───────────────────────────────────────────────────────────
# 3. Train a Random Forest Classifier
# ───────────────────────────────────────────────────────────
model = RandomForestClassifier(
    n_estimators=200,
    max_depth=10,
    random_state=42,
    n_jobs=-1,
)
model.fit(X_train, y_train)

# ───────────────────────────────────────────────────────────
# 4. Evaluate
# ───────────────────────────────────────────────────────────
y_pred   = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print(f"Accuracy : {accuracy:.4f}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# ───────────────────────────────────────────────────────────
# 5. Save model
# ───────────────────────────────────────────────────────────
model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "heart_model.pkl")
joblib.dump(model, model_path)
print(f"\n[OK] Model saved to {model_path}")
