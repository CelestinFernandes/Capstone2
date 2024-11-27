# Use the official Python image from the Docker Hub as the base image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements.txt (or any other necessary files) into the container
COPY requirements.txt .

# Install the required Python dependencies from the requirements file
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire project directory into the container
COPY . .

# Expose the port that FastAPI will run on (default is 8000)
EXPOSE 8000

# Command to run the FastAPI app using Uvicorn
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
