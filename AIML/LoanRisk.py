import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder
import joblib
import os

# Create models directory if it doesn't exist
if not os.path.exists('models'):
    os.makedirs('models')

# Load dataset from Data folder
try:
    df = pd.read_csv("Data/train.csv")
except FileNotFoundError:
    raise FileNotFoundError("Please ensure 'train.csv' exists in the Data folder")

# Data Cleaning: Replace '3+' with '3' in Dependents column
df['Dependents'] = df['Dependents'].replace('3+', '3')

# Define features and target
features = ['ApplicantIncome', 'CoapplicantIncome', 'LoanAmount', 'Loan_Amount_Term', 'Credit_History', 
            'Gender', 'Married', 'Dependents', 'Education', 'Self_Employed', 'Property_Area']
X = df[features]
y = df['Loan_Status'].map({'Y': 1, 'N': 0})  # 1 = Loan Approved, 0 = Loan Rejected

# Split data into train and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Preprocessing for numerical and categorical data
numerical_features = ['ApplicantIncome', 'CoapplicantIncome', 'LoanAmount', 'Loan_Amount_Term', 'Credit_History']
categorical_features = ['Gender', 'Married', 'Dependents', 'Education', 'Self_Employed', 'Property_Area']

# Numerical pipeline: Impute missing values and scale features
numerical_pipeline = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='mean')),
    ('scaler', StandardScaler())
])

# Categorical pipeline: Impute missing values and one-hot encode
categorical_pipeline = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('onehot', OneHotEncoder(handle_unknown='ignore'))
])

# Combine preprocessing pipelines using ColumnTransformer
preprocessor = ColumnTransformer(
    transformers=[
        ('num', numerical_pipeline, numerical_features),
        ('cat', categorical_pipeline, categorical_features)
    ])

# Create a full pipeline that includes preprocessing and the model
pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
])

# Train the model
pipeline.fit(X_train, y_train)

# Evaluate the model
y_pred = pipeline.predict(X_test)
print("Accuracy:", accuracy_score(y_test, y_pred))
print("Classification Report:\n", classification_report(y_test, y_pred))

# Save the entire pipeline (including preprocessing and model) to models folder
model_path = os.path.join('models', 'loan_eligibility_pipeline.pkl')
joblib.dump(pipeline, model_path)

# Function to predict loan eligibility and confidence value
def predict_loan_eligibility_with_confidence(input_data):
    # Load the pipeline from models folder
    model_path = os.path.join('models', 'loan_eligibility_pipeline.pkl')
    pipeline = joblib.load(model_path)
    
    # Convert input data to DataFrame (assuming input_data is a dictionary)
    input_df = pd.DataFrame([input_data])
    
    # Predict using the pipeline
    prediction = pipeline.predict(input_df)
    probabilities = pipeline.predict_proba(input_df)
    
    # Extract confidence for "Approved" (class 1)
    confidence_approved = probabilities[0][1]
    
    result = "Approved" if prediction[0] == 1 else "Rejected"
    return result, confidence_approved

# Example usage:
if __name__ == "__main__":
    input_data = {
        'ApplicantIncome': 5000,
        'CoapplicantIncome': 0,
        'LoanAmount': 120,
        'Loan_Amount_Term': 360,
        'Credit_History': 1,
        'Gender': 'Male',
        'Married': 'Yes',
        'Dependents': '0',
        'Education': 'Graduate',
        'Self_Employed': 'No',
        'Property_Area': 'Urban'
    }

    result, confidence = predict_loan_eligibility_with_confidence(input_data)
    print(f"Loan Status: {result}, Confidence (Approved): {confidence:.2f}")