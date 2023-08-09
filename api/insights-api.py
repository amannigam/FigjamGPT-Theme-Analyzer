import json

from flask import Flask, request
from flask_cors import CORS

from insightsoperations import InsightsOperations

app = Flask(__name__)
CORS(app)


# Endpoint that handles POST requests and returns the request body as JSON
@app.route('/themes', methods=['POST'])
def post():
    data = request.json
    operations = InsightsOperations()
    notes = data['notes']
    themes = operations.getThemes(notes)
    return json.dumps({"themes": themes})


# Endpoint that handles errors and returns an error message as JSON
@app.errorhandler(404)
def not_found(error):
    return json.dumps({'error': 'Resource not found.'}), 404


if __name__ == '__main__':
    app.run()
