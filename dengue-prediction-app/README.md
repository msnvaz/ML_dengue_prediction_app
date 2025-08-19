# Dengue Prediction App

## Description
A machine learning application for predicting dengue outbreaks.

## Installation

### Prerequisites
- Python 3.8 or higher
- pip package manager

### Setup
1. Clone the repository:
```bash
git clone <repository-url>
cd dengue-prediction-app
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
- Windows: `venv\Scripts\activate`
- macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
```bash
pip install -r requirements.txt
```

## Usage

### Running the Application
```bash
python app.py
```

### Training the Model
```bash
python train.py
```

### Making Predictions
```bash
python predict.py --input data/input.csv --output predictions.csv
```

## Project Structure
```
dengue-prediction-app/
├── app.py
├── train.py
├── predict.py
├── requirements.txt
├── data/
├── models/
└── README.md
```