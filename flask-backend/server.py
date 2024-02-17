from flask import Flask, jsonify
import json

app = Flask(__name__)


@app.route('/get_pose_data', methods=['GET'])
def get_pose_output_data():
    # Load data from JSON file
    with open('../ml/model_output.json', 'r') as file:
        data = json.load(file)
        return jsonify(data)
    
@app.route('/get_spine_data', methods=['GET'])
def get_pose_output_data():
    # Load data from JSON file
    with open('../ml-sensordata/model_output.json', 'r') as file:
        data = json.load(file)
        return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)