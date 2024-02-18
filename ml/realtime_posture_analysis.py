import cv2
import imageio
import os
import json
import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
import pandas as df

# Load the MoveNet model
model = hub.load("https://tfhub.dev/google/movenet/multipose/lightning/1")
movenet = model.signatures["serving_default"]

WIDTH = 192
HEIGHT = 192
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

def process_webcam_input(movenet, WIDTH=192, HEIGHT=192, MAX_FRAMES=1000):
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Webcam not accessible.")
        return

    print("Starting real-time inference...")
    with open('posture_scores.json', 'w') as file:
        while True:
            ret, frame = cap.read()
            if not ret:
                print("Failed to capture frame.")
                break

            image = cv2.resize(frame, (WIDTH, HEIGHT))
            input_image = tf.cast(tf.image.resize_with_pad(image, WIDTH, HEIGHT), dtype=tf.int32)
            input_image = tf.expand_dims(input_image, axis=0)

            results = movenet(input_image)
            keypoints = results["output_0"].numpy()[:,:,:51].reshape((6,17,3))

            loop(image, keypoints, threshold=0.11)

            frame_rgb = cv2.cvtColor(cv2.resize(image, (640, 480), interpolation=cv2.INTER_LANCZOS4), cv2.COLOR_BGR2RGB)
            temp_filename = 'skeleton_temp.jpg'
            cv2.imwrite(temp_filename, cv2.cvtColor(frame_rgb, cv2.COLOR_RGB2BGR))
            os.rename(temp_filename, 'skeleton.jpg')

            keypoints_yx = keypoints[0, :, :2]
            keypoints_processed = keypoints_yx.flatten().reshape(1, -1)
            
            # Placeholder for model prediction logic
            scores = {'back_align': 0.0, 'shoulder_align': 0.0, 'neck_align': 0.0}
            file.write(json.dumps(scores) + '\n')
            
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    process_webcam_input(movenet)
