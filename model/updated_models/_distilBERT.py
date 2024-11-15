import torch
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
from torch.utils.data import Dataset
import pandas as pd
from sklearn.model_selection import train_test_split
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
        encoding = self.tokenizer(
            text,
            padding='max_length',
            truncation=True,
            max_length=self.max_len,
            return_tensors="pt"
        )
        return {**{k: v.squeeze() for k, v in encoding.items()}, 'labels': torch.tensor(label, dtype=torch.float)}

# Function to scale ratings
def scale_rating(rating):
    return (rating - 1) / 9  # Scale between 0 and 1

# Function to unscale ratings
def unscale_rating(scaled_rating):
    return scaled_rating * 9 + 1  # Convert back to the range [1, 10]

# Prepare Tokenizer and Model
distilbert_tokenizer = DistilBertTokenizer.from_pretrained("distilbert-base-uncased")
distilbert_model = DistilBertForSequenceClassification.from_pretrained("distilbert-base-uncased", num_labels=1)

# Scale the ratings
train_df['scaled_rating'] = train_df['rating'].apply(scale_rating)
val_df['scaled_rating'] = val_df['rating'].apply(scale_rating)

# Prepare Datasets
train_dataset_distilbert = ScriptDataset(train_df['combined_features'], train_df['scaled_rating'], distilbert_tokenizer)
val_dataset_distilbert = ScriptDataset(val_df['combined_features'], val_df['scaled_rating'], distilbert_tokenizer)

# Training Function
def train_model(model, train_dataset, val_dataset):
    training_args = TrainingArguments(
        output_dir='./results_distilbert_all',
        num_train_epochs=10,
        per_device_train_batch_size=4,
        per_device_eval_batch_size=4,
        warmup_steps=500,
        weight_decay=0.01,
        logging_dir='./logs_distilbert_all',
        logging_steps=10,
        evaluation_strategy="epoch"
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
    )

    trainer.train()

# Train the DistilBERT model
print("Training DistilBERT model...")
train_model(distilbert_model, train_dataset_distilbert, val_dataset_distilbert)


# Define a function for inference
def predict(model, tokenizer, text, max_len=512):
    model.eval()  # Set model to evaluation mode
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")  # Check for GPU availability

    # Move model to the same device
    model.to(device)

    # Tokenize input text
    encoding = tokenizer(text, padding='max_length', truncation=True, max_length=max_len, return_tensors="pt")

    # Move input encoding to the correct device
    encoding = {k: v.to(device) for k, v in encoding.items()}

    with torch.no_grad():
        # Make prediction
        outputs = model(**encoding)
        # Get the raw prediction and unscale it to the range [1, 10]
        scaled_predicted_rating = outputs.logits.squeeze().item()
        predicted_rating = unscale_rating(scaled_predicted_rating)
    return predicted_rating

# Test the DistilBERT model on the validation set
print("Testing DistilBERT model...\n")
for idx, row in val_df.sample(5, random_state=42).iterrows():
    movie_name = row['title'] if 'title' in row else 'Unknown Title'  # Check for the 'title' column
    script = row['script_content']
    actual_rating = row['rating']
    predicted_rating = predict(distilbert_model, distilbert_tokenizer, script)
    print(f"Movie: {movie_name}\nDistilBERT - Actual Rating: {actual_rating:.1f}, Predicted Rating: {predicted_rating:.1f}\n")
