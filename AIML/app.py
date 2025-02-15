from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import os
import pandas as pd
from werkzeug.exceptions import BadRequest

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the model at startup
try:
    model_path = os.path.join('models', 'loan_eligibility_pipeline.pkl')
    pipeline = joblib.load(model_path)
except FileNotFoundError:
    raise FileNotFoundError("Model file not found. Please train the model first.")

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "Loan Risk Assessment API is running"})

@app.route('/predict', methods=['POST'])
def predict_loan_eligibility():
    """Endpoint to predict loan eligibility"""
    try:
        # Get input data from request
        data = request.get_json()
        
        # Validate required fields
        required_fields = [
            'ApplicantIncome', 'CoapplicantIncome', 'LoanAmount',
            'Loan_Amount_Term', 'Credit_History', 'Gender', 'Married',
            'Dependents', 'Education', 'Self_Employed', 'Property_Area'
        ]
        
        for field in required_fields:
            if field not in data:
                raise BadRequest(f"Missing required field: {field}")

        # Convert input data to DataFrame
        input_df = pd.DataFrame([data])
        
        # Make prediction
        prediction = pipeline.predict(input_df)
        probabilities = pipeline.predict_proba(input_df)
        
        # Extract confidence for "Approved" (class 1)
        confidence_approved = float(probabilities[0][1])
        
        # Prepare response
        result = {
            "loan_status": "Approved" if prediction[0] == 1 else "Rejected",
            "confidence": confidence_approved,
            "probability_approved": confidence_approved,
            "probability_rejected": float(probabilities[0][0])
        }
        
        return jsonify(result)

    except BadRequest as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@app.route('/model-info', methods=['GET'])
def get_model_info():
    """Endpoint to get model information"""
    try:
        return jsonify({
            "model_type": "Random Forest Classifier",
            "features": [
                "ApplicantIncome", "CoapplicantIncome", "LoanAmount",
                "Loan_Amount_Term", "Credit_History", "Gender", "Married",
                "Dependents", "Education", "Self_Employed", "Property_Area"
            ],
            "version": "1.0"
        })
    except Exception as e:
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000) 