# -*- coding: utf-8 -*-

from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import numpy as np
import pandas as pd

# Load your dataset
df = pd.read_csv('data.csv')

# Hypothetical scoring function - this is an oversimplification
# Assuming higher pressure values indicate worse conditions
df['Cervical_Condition_Score'] = df['Cervical_Pressure'].apply(lambda x: round(x / 10))
df['Thoracic_Condition_Score'] = df['Thoracic_Pressure'].apply(lambda x: round(x / 10))
df['Lumbar_Condition_Score'] = df['Lumbar_Pressure'].apply(lambda x: round(x / 10))
df['Sacral_Condition_Score'] = df['Sacral_Pressure'].apply(lambda x: round(x / 10))

# Save the updated DataFrame with scores
updated_scores_file_path = '/mnt/data/updated_data_with_scores.csv'

# Preprocess the dataset (assuming preprocessing is already done as per previous steps)
# Make sure to standardize your features as neural networks perform better with normalized data
scaler = StandardScaler()
features = ['Cervical_Pressure', 'Thoracic_Pressure', 'Lumbar_Pressure', 'Sacral_Pressure', 'Age', 'Height', 'Weight', 'Duration_of_Use']  # Add or remove features based on your dataset
X = scaler.fit_transform(df[features])
y = df[['Cervical_Condition_Score', 'Thoracic_Condition_Score', 'Lumbar_Condition_Score', 'Sacral_Condition_Score']]  # Assuming these are the targets

# Split the data into training and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Define the MLP model
model = Sequential([
    Dense(128, activation='relu', input_dim=X_train.shape[1]),
    Dense(64, activation='relu'),
    Dense(y_train.shape[1], activation='linear')  # 'linear' activation for regression
])

model.compile(optimizer='adam', loss='mse')  # Mean Squared Error loss for regression

# Train the model
model.fit(X_train, y_train, epochs=100, batch_size=32, validation_split=0.2, verbose = 0)


import numpy as np

# Make predictions with the model
predictions = model.predict(X_test)

# Identify the worst-affected region by finding the index of the highest score
worst_region_indices = np.argmax(predictions, axis=1)  # Indices of the worst conditions

# Translate indices to region names
regions = ['Cervical', 'Thoracic', 'Lumbar', 'Sacral']

# Calculate the mean score for each region across all trials
mean_cervical_score = df['Cervical_Condition_Score'].mean()
mean_thoracic_score = df['Thoracic_Condition_Score'].mean()
mean_lumbar_score = df['Lumbar_Condition_Score'].mean()
mean_sacral_score = df['Sacral_Condition_Score'].mean()

# Combine the mean scores into a dictionary for easier comparison
mean_scores = {
    'Cervical': mean_cervical_score,
    'Thoracic': mean_thoracic_score,
    'Lumbar': mean_lumbar_score,
    'Sacral': mean_sacral_score
}

# Identify the region with the highest mean score - the higher the score
worst_region = max(mean_scores, key=mean_scores.get)
worst_score = mean_scores[worst_region]

#print(f"The worst affected region is {worst_region} with an average score of {worst_score:.2f}")

from sklearn.metrics import mean_squared_error

# Calculate MSE
mse = mean_squared_error(y_test, predictions)
import json

# Package results into a dictionary
results = {
    "worst_region": worst_region,
    "worst_score": float(worst_score),  # Convert to float for JSON serialization
 #   "mse": float(mse)  # Convert to float for JSON serialization
}
# Print results as JSON
print(json.dumps(results))