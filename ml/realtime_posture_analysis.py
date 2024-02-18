import os 

# import all relevant libraries
"""os.system('pip install "opencv-python-headless<4.3"')
os.system("pip install opencv-python")
os.system("pip install mediapipe")
os.system("pip install tensorflow")
os.system("pip install tensorflow-hub")
os.system("pip install matplotlib")"""
os.system("pip install openai==0.28")

import openai
openai.api_key = os.getenv('OPENAI_API_KEY')
import cv2
import os
import json
import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
import pandas as pd
import time

# Posture Regression Scoring
def calculate_distance(point1, point2):
    return np.sqrt((point1[0] - point2[0])**2 + (point1[1] - point2[1])**2)

def calculate_angle(point1, point2, point3):
    """Calculate angle between three points (in degrees).
       When considering the points, only use the (x, y) coordinates
    """
    a = np.array(point1)  # Convert point1 to a NumPy array
    b = np.array(point2)  # Convert point2 to a NumPy array
    c = np.array(point3)  # Convert point3 to a NumPy array

    # Calculate vectors from point B to point A and from point B to point C
    ba = a - b
    bc = c - b

    # Calculate the cosine of the angle between the vectors
    cosine_angle = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc))
    
    # Ensure cosine_angle is within -1 to 1 range to avoid NaN results
    cosine_angle = np.clip(cosine_angle, -1, 1)

    # Calculate the angle in radians and then convert to degrees
    angle = np.arccos(cosine_angle)

    return np.degrees(angle)

def normalize_score(angle, ideal_angle):
    """Normalize score between 0 and 1, where 0 is the ideal_angle."""
    deviation = abs(angle - ideal_angle)
    normalized_score = deviation / ideal_angle
    return min(normalized_score, 1)  # Ensure score does not exceed 1

def heuristic_posture_scores(keypoints, FRAME_HEIGHT=1080):
    """Score the postural, spinal, and shoulder alignment.
    Assuming keypoints: 0-Nose, 5-Left Shoulder, 6-Right Shoulder, 11-Left Hip, 12-Right Hip"""

    # Calculate angles
    back_angle = calculate_angle(keypoints[10:12], keypoints[22:24], keypoints[24:26])  # Shoulder to hips
    neck_head_angle = calculate_angle(keypoints[0:2], keypoints[10:12], keypoints[12:14])  # Nose to shoulders

    # Shoulder levelness: Ideal is a straight horizontal line, so difference in y-coordinates
    shoulder_levelness = abs(keypoints[10] - keypoints[11])

    # Assuming the maximum possible y-coordinate difference as the height of the frame (e.g., 1080 pixels),
    # you may adjust this based on your actual frame height
    shoulder_score = min(shoulder_levelness / FRAME_HEIGHT, 1)

    # Normalize scores (0 is best, 1 is worst)
    back_score = normalize_score(back_angle, 180)
    neck_head_score = normalize_score(neck_head_angle, 180)

    return {'back_score': back_score, 'neck_head_score': neck_head_score, 'shoulder_score': shoulder_score}

def loop(frame, keypoints, threshold=0.11):
    for instance in keypoints:
        denormalized_coordinates = draw_keypoints(frame, instance, threshold)
        draw_edges(denormalized_coordinates, frame, EDGE_COLORS, threshold)

def draw_keypoints(frame, keypoints, threshold=0.11):
    denormalized_coordinates = np.squeeze(np.multiply(keypoints, [WIDTH,HEIGHT,1]))
    for keypoint in denormalized_coordinates:
        keypoint_y, keypoint_x, keypoint_confidence = keypoint
        if keypoint_confidence > threshold:
            cv2.circle(frame, (int(keypoint_x), int(keypoint_y)), 4, (255,0,0), -1)
    return denormalized_coordinates

def draw_edges(denormalized_coordinates, frame, edges_colors, threshold=0.11):
    for edge, color in edges_colors.items():
        p1, p2 = edge
        y1, x1, confidence_1 = denormalized_coordinates[p1]
        y2, x2, confidence_2 = denormalized_coordinates[p2]
        if (confidence_1 > threshold) & (confidence_2 > threshold):
            cv2.line(frame, (int(x1), int(y1)), (int(x2), int(y2)), color, 2, cv2.LINE_AA)
def initialize_webcam():
    """
    Initializes webcam for capturing and returns necessary objects for processing.
    """
    # Initialize webcam capture; 0 usually refers to the default webcam.
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("Error: Could not open webcam.")
        return None, None, None, None

    # Assuming frame count is not fixed for a continuous stream
    frame_count = None
    
    # Initialize an empty list to hold processed frames (if needed)
    output_frames = []

    # Get initial shape (width, height) from the first frame to setup processing parameters
    ret, frame = cap.read()
    if not ret:
        print("Error: Could not read frame from webcam.")
        cap.release()
        return None, None, None, None
    
    initial_shape = [frame.shape[1], frame.shape[0]]  # Width, Height

    # Return to the beginning of the stream
    cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
    
    return cap, frame_count, output_frames, initial_shape

def process_webcam_input(movenet, WIDTH=512, HEIGHT=512):
    """
    Continuously captures frames from the webcam, displays the estimated skeleton in real-time.
    """
    cap, frame_count, output_frames, initial_shape = initialize_webcam()
    if cap is None:
        print("Webcam not accessible.")
        return

    print("Starting real-time inference...")
    
    last_call_time = time.time()    
    
    # Initially clear the posture_scores.json file
    with open('posture_scores.json', 'w') as file:
        file.write('[')  # Start of JSON array
    
    with open('ml_outputs/posture_scores.json', 'w') as file:
        while True:
            ret, frame = cap.read()
            if not ret:
                print("Failed to capture frame.")
                break

            # Process frame
            image = cv2.resize(frame, (WIDTH, HEIGHT))
            input_image = tf.cast(tf.image.resize_with_pad(image, WIDTH, HEIGHT), dtype=tf.int32)
            input_image = tf.expand_dims(input_image, axis=0)

            # Run inference
            results = movenet(input_image)
            """
            Output shape :  [1, 6, 56] ---> (batch size), (instances), (xy keypoints coordinates and score from [0:50]
            and [ymin, xmin, ymax, xmax, score] for the remaining elements)
            First, let's resize it to a more convenient shape, following this logic :
            - First channel ---> each instance
            - Second channel ---> 17 keypoints for each instance
            - The 51st values of the last channel ----> the confidence score.
            Thus, the Tensor is reshaped without losing important information.
            """
            keypoints = results["output_0"].numpy()[:,:,:51].reshape((6,17,3))

            loop(image, keypoints, threshold=0.11)

            # Get the output frame : reshape to the original size
            frame_rgb = cv2.cvtColor(
                cv2.resize(
                    image,(initial_shape[0], initial_shape[1]),
                    interpolation=cv2.INTER_LANCZOS4
                ),
                cv2.COLOR_BGR2RGB # OpenCV processes BGR images instead of RGB
            )
            
            ######### REAL-TIME OUTPUTS ###########
            
            # skeleton frames updated on skeleton.jpg photo fifle
            temp_filename = '../chair/src/skeleton_temp.jpg'
            frame_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)  # Convert to RGB
            cv2.imwrite(temp_filename, cv2.cvtColor(frame_rgb, cv2.COLOR_RGB2BGR))  # Save to temp file
            os.rename(temp_filename, '../chair/src/skeleton.jpg')  # Rename the temporary file to 'skeleton.jpg' once the image is fully written
            
            # posture scores saved to posture_scores.json file 
            keypoints_yx = keypoints[0, :, :2] # Select the first batch of keypoints and then take only the (y, x) coordinates, discarding the confidence scores
            keypoints_processed = keypoints_yx.flatten()#.reshape(1, -1) # Flatten the array to a shape of (1, 34)
            
            #score_back = model_back.predict(keypoints_processed)[0][0]
            #score_shoulder = hmodel_shoulder.predict(keypoints_processed)[0][0]
            #score_neck_head = model_neck_head.predict(keypoints_processed)[0][0]
            score_back, score_shoulder, score_neck_head = heuristic_posture_scores(keypoints_processed).values()

            # Write posture scores to JSONL file
            scores = {'back_align': float(score_back), 'shoulder_align': float(score_shoulder), 'neck_align': float(score_neck_head)}
            file.write(json.dumps(scores) + '\n')
            
            # Write GPT diagnoses to the posture_recommendations.txt file every minute
            current_time = time.time()
            if current_time - last_call_time >= 60:
                # prompt is all the posture scores
                try:
                    with open('ml_outputs/posture_scores.json', 'r') as json_file:
                        json_contents = json_file.read()
                        prompt = json_contents.strip()
                except Exception as e:
                    print(f"Error reading posture_scores.json: {e}")
                    prompt = "[]"  # Use an empty JSON arr if there's an error
                
                # Call the GPT function for posture analysis                
                gpt_response = ask_posture_analysis_expert(prompt)

                # Process the GPT response (for example, logging, displaying, or saving it)
                with open('ml_outputs/posture_recommendations.txt', 'w') as rec_file:
                    rec_file.write(gpt_response + '\n')
                last_call_time = current_time  # Update the last call time
            
            if cv2.waitKey(1) & 0xFF == ord('q'):  # Press 'q' to exit
                break

    cap.release()
    cv2.destroyAllWindows()

def ask_posture_analysis_expert(posture_score_data):
    try:
        response = openai.Completion.create(
            model="Posture Analysis Expert", # custom GPT's exact name
            prompt=posture_score_data,
            temperature=0.8, # Adjust based on how deterministic you want the output to be
            max_tokens=150, # Adjust according to how long you expect the response to be
            top_p=1,
            frequency_penalty=0,
            presence_penalty=0
        )
        return response.choices[0].text.strip()
    except Exception as e:
        return str(e)
    
    
if __name__ == "__main__":
    # MAKE SURE YOUR KERNEKL IS Python 3.11.5 when runnning the script
    # Train regression model on real data points from yoga_train_data.csv
    df = pd.read_csv('sample_data/yoga_train_data.csv') # TODO: CHANGE TO RELATIVE PATH
    cols_of_interest = [
        'nose_x', 'nose_y', 'nose_score',
        'left_eye_x', 'left_eye_y', 'left_eye_score',
        'right_eye_x', 'right_eye_y', 'right_eye_score',
        'left_ear_x', 'left_ear_y', 'left_ear_score',
        'right_ear_x', 'right_ear_y', 'right_ear_score',
        'left_shoulder_x', 'left_shoulder_y', 'left_shoulder_score',
        'right_shoulder_x', 'right_shoulder_y', 'right_shoulder_score',
        'left_elbow_x', 'left_elbow_y', 'left_elbow_score',
        'right_elbow_x', 'right_elbow_y', 'right_elbow_score',
        'left_wrist_x', 'left_wrist_y', 'left_wrist_score',
        'right_wrist_x', 'right_wrist_y', 'right_wrist_score',
        'left_hip_x', 'left_hip_y', 'left_hip_score',
        'right_hip_x', 'right_hip_y', 'right_hip_score',
        'left_knee_x', 'left_knee_y', 'left_knee_score',
        'right_knee_x', 'right_knee_y', 'right_knee_score',
        'left_ankle_x', 'left_ankle_y', 'left_ankle_score',
        'right_ankle_x', 'right_ankle_y', 'right_ankle_score'
    ]
    
    cols_of_interest = [col for col in cols_of_interest if not col.endswith('_score')]

    df = df.filter(cols_of_interest)
    X = df.to_numpy() # (968, 34)
    num_samples = X.shape[0]

    y_back, y_shoulder, y_neck_head = [], [], []
    # Simulate scores for back, shoulder, and neck/head alignment (ranging from 0 to 1)
    for keypoints in X:
        curr_y_back, curr_y_shoulder, curr_y_neck_head = heuristic_posture_scores(keypoints).values()
        y_back.append(curr_y_back)
        y_shoulder.append(curr_y_shoulder)
        y_neck_head.append(curr_y_neck_head)

    y_back, y_shoulder, y_neck_head = np.array(y_back).reshape((num_samples, 1)), np.array(y_shoulder).reshape((num_samples, 1)), np.array(y_neck_head).reshape((num_samples, 1))
    # Split data into training and testing sets
    X_train, X_test, y_train_back, y_test_back = train_test_split(X, y_back, test_size=0.2, random_state=42)
    _, _, y_train_shoulder, y_test_shoulder = train_test_split(X, y_shoulder, test_size=0.2, random_state=42)
    _, _, y_train_neck_head, y_test_neck_head = train_test_split(X, y_neck_head, test_size=0.2, random_state=42)

    # Train separate models for each score
    model_back = LinearRegression().fit(X_train, y_train_back)
    model_shoulder = LinearRegression().fit(X_train, y_train_shoulder)
    model_neck_head = LinearRegression().fit(X_train, y_train_neck_head)


    # Load the MoveNet model
    model = hub.load("https://tfhub.dev/google/movenet/multipose/lightning/1")
    movenet = model.signatures["serving_default"]

    WIDTH = 512
    HEIGHT = 512
    EDGE_COLORS = {
        (0, 1): (144, 238, 144),
        (0, 2): (173, 216, 230),
        (1, 3): (144, 238, 144),
        (2, 4): (173, 216, 230),
        (0, 5): (144, 238, 144),
        (0, 6): (173, 216, 230),
        (5, 7): (144, 238, 144),
        (7, 9): (173, 216, 230),
        (6, 8): (144, 238, 144),
        (8, 10): (173, 216, 230),
        (5, 6): (144, 238, 144),
        (5, 11): (173, 216, 230),
        (6, 12): (144, 238, 144),
        (11, 12): (173, 216, 230),
        (11, 13): (144, 238, 144),
        (13, 15): (173, 216, 230),
        (12, 14): (144, 238, 144),
        (14, 16): (173, 216, 230)
    }
    
    # real-time skeleton + posture scoring inference + gpt diagnosis
    process_webcam_input(movenet)
