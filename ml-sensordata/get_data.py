import serial
import csv
import time

def write_csv(filename, timestamp, cervical_pressure, thoracic_pressure, lumbar_pressure, sacral_pressure):
    # Define the data rows
    data = [[timestamp, cervical_pressure, thoracic_pressure, lumbar_pressure, sacral_pressure]]
    
    # Append data to CSV file
    with open(filename, mode='a', newline='') as file:
        writer = csv.writer(file)
        writer.writerows(data)

# Example usage:
# write_csv('pressure_data.csv', 0, 10, 20, 30, 40)  # Initial example data

# Define the serial port and baud rate
serial_port = '/dev/tty.usbmodem1302'  # Change this to your Arduino's COM port
baud_rate = 9600  # Make sure this matches your Arduino's baud rate

# Create a serial object
ser = serial.Serial(serial_port, baud_rate)

try:
    # Infinite loop to continuously read data from Arduino
    while True:
        # Read one line of data from the serial port
        line = ser.readline().decode().strip()
        port_a, port_b, port_c, port_d = list(map(int,line.split(",")))
        timestamp = int(time.time())  # Get current timestamp in seconds
        write_csv("sensor_data.csv", timestamp, port_c, port_b, port_d, port_a)
        # Print the received data
        print("Received:", port_c, port_b, port_d, port_a)

except KeyboardInterrupt:
    # Close the serial port when KeyboardInterrupt (Ctrl+C) is detected
    ser.close()
    print("Serial port closed")