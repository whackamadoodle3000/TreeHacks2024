import serial
import csv
import time
import json
import pickle
import numpy as np
from tensorflow.keras.models import load_model
import warnings
import simpleaudio as sa


warnings.filterwarnings("ignore")

def write_csv(filename, timestamp, cervical_pressure, thoracic_pressure, lumbar_pressure, sacral_pressure):
    # Define the data rows
    data = [[timestamp, cervical_pressure, thoracic_pressure, lumbar_pressure, sacral_pressure]]
    
    # Append data to CSV file
    with open(filename, mode='a', newline='') as file:
        writer = csv.writer(file)
        writer.writerows(data)


def create_frontend_data(goodness,data):
    data = data[0]
    if goodness < 0.3:
        # Play the WAV file
        play_obj = wave_obj.play()

        # Wait until the file is done playing
        play_obj.wait_done()
        return data.index(max(data))
    else:
        return -1

# Example usage:
# write_csv('pressure_data.csv', 0, 10, 20, 30, 40)  # Initial example data

# Define the serial port and baud rate
serial_port = '/dev/tty.usbmodem1302'  # Change this to your Arduino's COM port
baud_rate = 9600  # Make sure this matches your Arduino's baud rate
loaded_model = load_model("posture_model.h5")
wave_obj = sa.WaveObject.from_wave_file("l.wav")

with open("scaler.pkl", "rb") as file:
    scaler = pickle.load(file)



# Create a serial object
ser = serial.Serial(serial_port, baud_rate)

try:
    # Infinite loop to continuously read data from Arduino
    while True:
        # Read one line of data from the serial port
        line = ser.readline().decode().strip()
        port_a, port_b, port_c, port_d = list(map(int,line.split(",")))
        timestamp = int(time.time())  # Get current timestamp in seconds

        feature_values = [[port_c, port_b, port_d, port_a]]
        X_new = np.array(feature_values)
        X_new_normalized = scaler.transform(X_new)
        predictions = loaded_model.predict(X_new_normalized, verbose=0)
        indicator = create_frontend_data(predictions[0][0],feature_values)
        # write_csv("new_data.csv", timestamp, port_c, port_b, port_d, port_a)
        # Print the received data
        with open("spine_indicator.txt",'w') as file:
            file.write(str(indicator))

        with open("spine_scores.jsonl", "a") as file:
            file.write(json.dumps({"spine":float(predictions[0][0])})+'\n')
        # print("Received:", port_c, port_b, port_d, port_a)

except KeyboardInterrupt:
    # Close the serial port when KeyboardInterrupt (Ctrl+C) is detected
    ser.close()
    print("Serial port closed")