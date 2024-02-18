import pandas as pd
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import pickle

# Step 1: Read the CSV files
good_posture_df = pd.read_csv("good_posture.csv")
bad_posture_df = pd.read_csv("bad_posture.csv")
good_posture_df = good_posture_df.drop(good_posture_df.columns[0], axis=1)
bad_posture_df = bad_posture_df.drop(bad_posture_df.columns[0], axis=1)

# Step 2: Preprocess bad posture data
bad_posture_df = bad_posture_df[(bad_posture_df.iloc[:,1:] >= 17).any(axis=1)]

# Step 3: Merge data and create labels
good_posture_df["label"] = 1
bad_posture_df["label"] = 0
data = pd.concat([good_posture_df, bad_posture_df])

# Step 4: Split data into features and labels
X = data.drop(columns=["label"])
y = data["label"]

# Step 5: Normalize features
scaler = StandardScaler()
X_normalized = scaler.fit_transform(X)

# Save the scaler object to a file
with open("scaler.pkl", "wb") as file:
    pickle.dump(scaler, file)

# Step 6: Build and train a simple neural network
X_train, X_test, y_train, y_test = train_test_split(X_normalized, y, test_size=0.2, random_state=42)

model = Sequential([
    Dense(64, activation='relu', input_shape=(X_train.shape[1],)),
    Dense(64, activation='relu'),
    Dense(1, activation='sigmoid')
])

model.compile(optimizer='adam',
              loss='binary_crossentropy',
              metrics=['accuracy'])

model.fit(X_train, y_train, epochs=10, batch_size=32, verbose=1)

# Step 7: Evaluate the model
test_loss, test_accuracy = model.evaluate(X_test, y_test)
model.save("posture_model.h5")
print("Test Accuracy:", test_accuracy)