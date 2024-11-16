import pandas as pd
import torch
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from transformers import AlbertTokenizer, AlbertForSequenceClassification
from torch.utils.data import Dataset
from transformers import Trainer, TrainingArguments

# Load the data
data_path = '/kaggle/input/imdb-movie-scripts-imdb-details/scripts_data_filtered.csv'
df = pd.read_csv(data_path)

# Drop rows with missing IMDb scores and concatenate features
df = df.dropna(subset=['rating'])
excluded_columns = ['rating', 'title']  # Columns to exclude
feature_columns = [col for col in df.columns if col not in excluded_columns]

# Create a new column combining all text features
df['combined_features'] = df[feature_columns].astype(str).agg(' '.join, axis=1)

# Train-Test Split
train_df, val_df = train_test_split(df, test_size=0.2, random_state=42)

# Scale ratings (target variable)
scaler = MinMaxScaler(feature_range=(0, 1))
train_df['rating'] = scaler.fit_transform(train_df[['rating']])
val_df['rating'] = scaler.transform(val_df[['rating']])

# Dataset class
class ScriptDataset(Dataset):
    def __init__(self, texts, labels, tokenizer, max_len=512):
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_len = max_len

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, idx):
        text = self.texts.iloc[idx]
        label = self.labels.iloc[idx]
        encoding = self.tokenizer(text, padding='max_length', truncation=True, max_length=self.max_len, return_tensors="pt")
        return {**{k: v.squeeze() for k, v in encoding.items()}, 'labels': torch.tensor(label, dtype=torch.float)}

# Load ALBERT tokenizer and model
albert_tokenizer = AlbertTokenizer.from_pretrained("albert-base-v2")
albert_model = AlbertForSequenceClassification.from_pretrained("albert-base-v2", num_labels=1)

# Prepare datasets
train_dataset_albert = ScriptDataset(train_df['combined_features'], train_df['rating'], albert_tokenizer)
val_dataset_albert = ScriptDataset(val_df['combined_features'], val_df['rating'], albert_tokenizer)

# Check device availability and move model to the appropriate device (GPU or CPU)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
albert_model.to(device)

# Training function
def train_model(model, train_dataset, val_dataset):
    training_args = TrainingArguments(
        output_dir='./results_alberta',
        num_train_epochs=10,
        per_device_train_batch_size=4,
        per_device_eval_batch_size=4,
        warmup_steps=500,
        weight_decay=0.01,
        logging_dir='./logs_alberta',
        logging_steps=10,
        evaluation_strategy="epoch",
        fp16=torch.cuda.is_available()
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
    )

    trainer.train()
    metrics = trainer.evaluate()
    print(f"Evaluation metrics for ALBERT: {metrics}")

# Train the ALBERT model
print("Training ALBERT model...")
train_model(albert_model, train_dataset_albert, val_dataset_albert)

# Function for unscaled rating conversion
def unscale_rating(scaled_rating):
    return scaler.inverse_transform([[scaled_rating]])[0][0]

# Define a function for inference
def predict(model, tokenizer, text, max_len=512):
    model.eval()
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)

    encoding = tokenizer(text, padding='max_length', truncation=True, max_length=max_len, return_tensors="pt")
    encoding = {k: v.to(device) for k, v in encoding.items()}

    with torch.no_grad():
        outputs = model(**encoding)
        scaled_predicted_rating = outputs.logits.squeeze().item()
        predicted_rating = unscale_rating(scaled_predicted_rating)
    return predicted_rating

# Test the ALBERT model on the validation set
print("Testing ALBERT model...\n")
for idx, row in val_df.sample(5, random_state=42).iterrows():
    movie_name = row['title']
    combined_features = row['combined_features']
    actual_rating = scaler.inverse_transform([[row['rating']]])[0][0]
    predicted_rating = predict(albert_model, albert_tokenizer, combined_features)
    print(f"Movie: {movie_name}\nALBERT - Actual Rating: {actual_rating:.1f}, Predicted Rating: {predicted_rating:.1f}\n")
    