from flask import Flask, jsonify
from flask_cors import CORS
from selenium_test import test_pharmeasy, test_1mg, test_apollo

app = Flask(__name__)

# Add CORS Middleware
CORS(app, supports_credentials=True)

@app.route("/get_apollo/<string:medicine>", methods=["GET"])
def apollo_data(medicine):
    try:
        data = test_apollo(medicine)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get_1mg/<string:medicine>", methods=["GET"])
def data_1mg(medicine):
    try:
        data = test_1mg(medicine)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get_pharmeasy/<string:medicine>", methods=["GET"])
def pharmeasy_data(medicine):
    try:
        data = test_pharmeasy(medicine)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    from waitress import serve
    # Using waitress for production-like server behavior
    serve(app, host="0.0.0.0", port=8000)
