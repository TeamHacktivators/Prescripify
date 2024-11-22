from flask import Flask, jsonify
from flask_cors import CORS
from selenium_test import test_pharmeasy, test_1mg, test_apollo, get_best

app = Flask(__name__)

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

@app.route("/get_best/<string:medicine>", methods=["GET"])
def best_data(medicine):
    try:
        data = get_best(medicine)
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=8000,debug=True)