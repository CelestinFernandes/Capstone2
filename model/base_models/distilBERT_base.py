# distilbert.py

from transformers import DistilBertTokenizer, DistilBertForSequenceClassification
from base import ScriptDataset, train_df, val_df, train_model

# DistilBERT model and tokenizer setup
distilbert_tokenizer = DistilBertTokenizer.from_pretrained("distilbert-base-uncased")
distilbert_model = DistilBertForSequenceClassification.from_pretrained("distilbert-base-uncased", num_labels=1)

# Prepare datasets
train_dataset_distilbert = ScriptDataset(train_df['script_content'], train_df['rating'], distilbert_tokenizer)
val_dataset_distilbert = ScriptDataset(val_df['script_content'], val_df['rating'], distilbert_tokenizer)

# Train DistilBERT model
print("Training DistilBERT model...")
train_model(distilbert_model, train_dataset_distilbert, val_dataset_distilbert, model_name="DistilBERT")
