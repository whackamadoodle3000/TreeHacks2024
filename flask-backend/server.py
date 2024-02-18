from flask import Flask, jsonify
import json

app = Flask(__name__)


def read_jsonl(filename):
    data = []
    with open(filename, 'r') as file:
        for line in file:
            # Load each line (JSON object) as a dictionary
            json_data = json.loads(line.strip())
            data.append(json_data)
    return data

@app.route('/get_pose_data', methods=['GET'])
def get_pose_output_data():
    # Load data from JSON file
    data = read_jsonl('../ml/posture_scores.json')
    return jsonify(data)
    
@app.route('/get_spine_data', methods=['GET'])
def get_spine_output_data():
    # Load data from JSON file
    with open('../ml-sensordata/spine_indicator.txt', 'r') as file:
        return file.read()


if __name__ == '__main__':
    app.run(debug=True)