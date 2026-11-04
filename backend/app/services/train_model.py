
import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from xgboost import XGBClassifier

from app.services.features import create_features
from app.schemas.prediction import BusinessRecord


# Load dataset
df = pd.read_csv("data/training_data.csv")

X = []
y = []

# Convert every pair into ML features
for _, row in df.iterrows():

    record1 = BusinessRecord(
        name=row["name1"],
        address=row["address1"],
        city=row["city1"],
        state=row["state1"],
        zip_code=str(row["zip1"])
    )

    record2 = BusinessRecord(
        name=row["name2"],
        address=row["address2"],
        city=row["city2"],
        state=row["state2"],
        zip_code=str(row["zip2"])
    )

    features = create_features(record1, record2)

    X.append(list(features.values()))
    y.append(row["label"])


# Split dataset
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# Train XGBoost
model = XGBClassifier(
    n_estimators=100,
    max_depth=3,
    learning_rate=0.1,
    eval_metric="logloss",
    random_state=42
)

model.fit(X_train, y_train)


# Evaluate
predictions = model.predict(X_test)

print("Accuracy:", accuracy_score(y_test, predictions))
print(classification_report(y_test, predictions))


# Save model
joblib.dump(model, "model/xgboost_model.joblib")

print("Model saved successfully!")
