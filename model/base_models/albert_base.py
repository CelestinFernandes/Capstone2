# albert.py

from transformers import AlbertTokenizer, AlbertForSequenceClassification
from base import ScriptDataset, train_df, val_df, train_model

# ALBERT model and tokenizer setup
albert_tokenizer = AlbertTokenizer.from_pretrained("albert-base-v2")
albert_model = AlbertForSequenceClassification.from_pretrained("albert-base-v2", num_labels=1)

# Prepare datasets
train_dataset_albert = ScriptDataset(train_df['script_content'], train_df['rating'], albert_tokenizer)
val_dataset_albert = ScriptDataset(val_df['script_content'], val_df['rating'], albert_tokenizer)

# Train ALBERT model
print("Training ALBERT model...")
train_model(albert_model, train_dataset_albert, val_dataset_albert, model_name="ALBERT")
