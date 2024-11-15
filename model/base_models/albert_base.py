import pandas as pd
import torch
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler
from transformers import AlbertTokenizer, AlbertForSequenceClassification
from torch.utils.data import Dataset
from transformers import Trainer, TrainingArguments

data_path = '/kaggle/input/imdb-movie-scripts-imdb-details/scripts_data_filtered.csv'
df = pd.read_csv(data_path)

# Filter only necessary columns and drop rows with missing IMDb scores
df = df[['script_content', 'rating']].dropna()

# Train-Test Split
train_df, val_df = train_test_split(df, test_size=0.2, random_state=42)

# Scale ratings
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

# Prepare dataset only using script content
train_dataset_albert = ScriptDataset(train_df['script_content'], train_df['rating'], albert_tokenizer)
val_dataset_albert = ScriptDataset(val_df['script_content'], val_df['rating'], albert_tokenizer)

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
        evaluation_strategy="epoch"
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

print("Training ALBERT model...")
train_model(albert_model, train_dataset_albert, val_dataset_albert)

# Make sure that both the model and the input tensors are on the same device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Move model to the correct device (GPU or CPU)
albert_model.to(device)

# Inference function
def predict(model, tokenizer, text, max_len=512):
    model.eval()
    encoding = tokenizer(text, padding='max_length', truncation=True, max_length=max_len, return_tensors="pt")

    # Move input encoding to the same device as the model
    for key in encoding:
        encoding[key] = encoding[key].to(device)

    with torch.no_grad():
        outputs = model(**encoding)
        logits = outputs.logits.squeeze().item()  # Extract the raw logits and convert to a scalar value

    return logits
    
print("Testing ALBERT model...\n")
for idx, row in val_df.sample(5, random_state=42).iterrows():
    script = row['script_content']
    actual_rating = row['rating']
    predicted_rating = predict(albert_model, albert_tokenizer, script)
#     # Unscale the predicted rating back to the 1-10 range
    predicted_rating = scaler.inverse_transform([[predicted_rating]])[0][0]
    actual_rating = scaler.inverse_transform([[actual_rating]])[0][0]
    print(f"ALBERT - Actual: {actual_rating}, Predicted: {predicted_rating}")
    
