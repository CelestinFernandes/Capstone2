# base.py

import pandas as pd
from sklearn.model_selection import train_test_split
from torch.utils.data import Dataset
from transformers import Trainer, TrainingArguments
import torch

# Load and prepare the data
data_path = 'model/source_data/scripts_data_updated.csv'
df = pd.read_csv(data_path)
df = df[['script_content', 'rating']].dropna()
train_df, val_df = train_test_split(df, test_size=0.2, random_state=42)

# Dataset class for tokenizing and handling text data
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

# Function to train the model
def train_model(model, train_dataset, val_dataset, model_name):
    training_args = TrainingArguments(
        output_dir='./results',
        num_train_epochs=3,
        per_device_train_batch_size=4,
        per_device_eval_batch_size=4,
        warmup_steps=500,
        weight_decay=0.01,
        logging_dir='./logs',
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
    print(f"Evaluation metrics for {model_name}: {metrics}")
