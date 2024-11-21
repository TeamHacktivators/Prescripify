
# Prescripify

Prescripify is a web application designed for doctors, enabling them to create accounts, upload patient-doctor conversation audio files, and automatically generate prescriptions by extracting key details such as illness, medicines, dosage, and advice. Additionally, the app provides a comprehensive comparison of medicine prices and availability from various online vendors, streamlining the prescription and procurement process.


## Pre-Requisites

- Webdriver for selenium
- AWS cli configuration
- Nodejs
- AWS lambda function connected with **AWS Transcribe** and map it with AWS Gateway

## Installation

```bash
  git clone https://github.com/TeamHacktivators/Prescripify.git
  cd Prescripify
  npm install 
  ```
  Configure AWS for loacl development - https://docs.amplify.aws/react/start/account-setup/
```bash
  npx ampx sandbox
  cd summarizer
  pip install -r requirements.txt
  cd ..
  cd medicineExtractor
  pip install -r requirements.txt
  cd ..
```
Create an .env file to securely store your API keys. Include the following keys:
```
VITE_API_SPEECHTOTEXT
GENAI_API_KEY
```
Now run the application:
```bash  
  npm run dev
  cd summarizer
  python app.py
  cd ..
  cd medicineExtractor
  uvicorn apiService:app --reload
```
    
## Features

Features of this projects are:

- **Doctor Account Management**: Allows doctors to create and manage their accounts for personalized use.  
- **Audio Processing for Prescription Generation**: Extracts key terms like illness, medicines, dosage, and advice from doctor-patient conversation audio files to automatically generate prescriptions.  
- **Medicine Price Comparison**: Searches for medicines across multiple online vendors, showing availability and price comparisons.  
- **Streamlined Prescription Workflow**: Simplifies the process of creating and delivering detailed prescriptions to patients.  
- **Multi-Vendor Integration**: Connects with various online medicine sellers to fetch real-time data on medicine availability and costs.  
- **Secure and Confidential**: Ensures patient and doctor data privacy while processing audio and prescription information.  
- **User-Friendly Interface**: Designed with ease of use in mind, enabling quick navigation and efficient operations for doctors.  
## Use Cases

This project can be used for the following purposes:-

- **Healthcare Providers**: Automate prescription generation to save time and improve efficiency in patient care.  
- **Doctors**: Quickly generate detailed prescriptions based on audio conversations, reducing manual effort.  
- **Patients**: Access prescriptions with accurate details of illness, medicines, dosage, and tips recommended by their doctors.  
- **Pharmacists**: Get access to medicine price comparisons across online vendors for better procurement decisions.  
- **E-Commerce Medicine Platforms**: Improve visibility by integrating with the app for price and availability listings.  
- **Telemedicine Services**: Enhance virtual consultations by providing a seamless prescription generation and medication procurement process.  

