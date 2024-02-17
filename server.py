from flask import Flask, request

app = Flask(__name__)


'''
TO USE

url = 'http://your-flask-server-url/upload'
files = {'file': open('path/to/your/file', 'rb')}
response = requests.post(url, files=files)
'''
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return 'No file part'
    
    file = request.files['file']
    
    if file.filename == '':
        return 'No selected file'
    
    # Save the file to a desired location
    file.save('/output_videos' + file.filename)
    
    return 'File uploaded successfully'

if __name__ == '__main__':
    app.run(debug=True)


