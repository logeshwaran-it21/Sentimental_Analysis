import pickle
from fastapi import FastAPI
from pydantic import BaseModel
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer
nltk.download('stopwords')

ps = PorterStemmer()

# Load the vectorizer and model
vectorizer = pickle.load(open("countvectorizer.pkl", "rb"))
model = pickle.load(open("model1.pkl", "rb"))

app = FastAPI()

class PredictionRequest(BaseModel):
    text: str

def decontracted(phrase):
    # specific contractions
    phrase = re.sub(r"won\'t", "will not", phrase)
    phrase = re.sub(r"can\'t", "can not", phrase)

    # general contractions
    phrase = re.sub(r"n\'t", " not", phrase)
    phrase = re.sub(r"\'re", " are", phrase)
    phrase = re.sub(r"\'s", " is", phrase)
    phrase = re.sub(r"\'d", " would", phrase)
    phrase = re.sub(r"\'ll", " will", phrase)
    phrase = re.sub(r"\'t", " not", phrase)
    phrase = re.sub(r"\'ve", " have", phrase)
    phrase = re.sub(r"\'m", " am", phrase)
    return phrase

def cleaning(text):
    text = decontracted(text)
    text = text.lower()
    text = re.sub(r'@\S+', '', text)  # Removing @mentions
    text = re.sub(r'#\S+', '', text)  # Removing hashtags
    text = re.sub(r'https?\S+', '', text)  # Removing hyperlinks
    text = re.sub('[^a-z]', ' ', text)  # Removing non-alphabet characters
    text = text.split()
    text = [ps.stem(word) for word in text if word not in stopwords.words('english')]
    return ' '.join(text)

@app.post("/api/predict")
def predict(predictionRequest: PredictionRequest):
    cleaned_text = cleaning(predictionRequest.text)
    transformed_text = vectorizer.transform([cleaned_text])
    prediction = model.predict(transformed_text.toarray())

    # Assuming the model returns 1 for positive and 0 for negative
    sentiment = "positive" if prediction[0] == 1 else "negative"
    return {
        "text": predictionRequest.text,
        "sentiment": sentiment
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
