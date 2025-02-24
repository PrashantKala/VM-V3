from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS
from llm_operation import Config, LLMChains

app = Flask(__name__)
CORS(app)

@app.route('/api/chat', methods=['POST'])
def post_response():
    data = request.get_json()
    user_input = data.get('message', 'default')
    print(user_input)
    
    # STREAMING = False
    
    # @stream_with_context
    # def generate():
    #     try:
    #         for token in LLMChains.get_ai_output(user_input):  # Updated function to support streaming
    #             yield token
    #     except Exception as e:
    #         yield f"data: Error: {str(e)}\n\n"

    # if STREAMING:
    #     return Response(generate(), mimetype='text/event-stream')
    # else:
    ai_output = LLMChains.get_ai_output(user_input)
    print("Done-1")
    response = {"choices": [{"message": {"content": ai_output}}]}
    print(response)
    return jsonify(response)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)