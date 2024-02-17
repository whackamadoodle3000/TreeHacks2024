import serial
import csv


def write_csv(filename, cervical_pressure, thoracic_pressure, lumbar_pressure, sacral_pressure):
    # Define the headers and data rows
    headers = ['Cervical_Pressure', 'Thoracic_Pressure', 'Lumbar_Pressure', 'Sacral_Pressure']
    data = [[cervical_pressure, thoracic_pressure, lumbar_pressure, sacral_pressure]]
    
    # Write data to CSV file
    with open(filename, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(headers)
        writer.writerows(data)


# Example usage:
write_csv('pressure_data.csv', 10, 20, 30, 40)

# Define the serial port (COM port) and baud rate
serial_port = '/dev/tty.usbmodem1302'  # Change this to your Arduino's COM port
baud_rate = 9600  # Make sure this matches your Arduino's baud rate

# Create a serial object
ser = serial.Serial(serial_port, baud_rate)

try:
    # Infinite loop to continuously read data from Arduino
    while True:
        # Read one line of data from the serial port
        line = ser.readline().decode().strip()
        port_a, port_b, port_c = list(map(int,line.split(",")))
        write_csv("sensor_data.csv", port_a, port_b, port_c, port_c)
        # Print the received data
        print("Received:", line)

except KeyboardInterrupt:
    # Close the serial port when KeyboardInterrupt (Ctrl+C) is detected
    ser.close()
    print("Serial port closed")