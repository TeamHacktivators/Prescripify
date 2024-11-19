import os
from flask import Flask, request, jsonify
from flask_cors import CORS  
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.exceptions import OutputParserException
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)

llm = ChatGroq(temperature=0, groq_api_key=os.getenv("GENAI_API_KEY"), model_name='llama-3.1-70b-versatile')

def extract_prescription(llm, cleaned_text):
    prompt_extract = PromptTemplate.from_template(
        """
        ### PRESCRIPTION TEXT FROM DOCTOR:
        {page_data}
        ### INSTRUCTION:
        The prescription text is the presciption from a doctor.
        Your job is to extract the medicines and return them in JSON format containing the following keys: `patient` storing the patient name, `medicine` containing `name`, `dosage`, `duration` and `description` where name is the name of the medicine provided, dosage is the times the medicine should be consumed in a day, duration is the no of days the medicine should be consumed, description is a one liner description of the medicine, a key `tips` contains addition information provided by the doctor containing prohibited items and recommended items in a single paragraph and a key illness containing information about the illnesses patient has in a paragraph.
        The keys should be only specified above, no change in spelling, keep them as specified.
        Only return the valid JSON.
        ### VALID JSON (NO PREAMBLE):
        """
    )
    chain_extract = prompt_extract | llm
    res = chain_extract.invoke(input={"page_data": cleaned_text})
    try:
        json_parser = JsonOutputParser()
        res = json_parser.parse(res.content)
    except OutputParserException:
        raise OutputParserException("Context too big. Unable to parse jobs.")
    return res if isinstance(res, list) else [res]

@app.route("/")
def hello_world():
    return "Homepage"

@app.route('/extract', methods=['POST'])
def upload_text():
    data = request.get_json()
    text = data.get('text', '')
    if not text:
        return jsonify({"error": "Text data is required"}), 400
    result = extract_prescription(llm, text)
    return jsonify(result), 201

if __name__ == '__main__':
    app.run(debug=False)
