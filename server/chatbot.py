from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from llm_operation import Config, LLMChains
import traceback

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")  # Allow all origins for Socket.IO

# Route for HTTP POST requests (optional, if you still want to support HTTP)
@app.route('/api/chat', methods=['POST'])
def post_response():
    data = request.get_json()
    user_input = data.get('message', 'default')
    print(user_input)
    
    ai_output = LLMChains.get_ai_output(user_input)
    print("Done-1")
    response = {"choices": [{"message": {"content": ai_output}}]}
    print(response)
    return jsonify(response)

# Socket.IO event for real-time communication
@socketio.on('send_message')
def handle_send_message(data):
    user_input = data.get('message', 'default')
    print(f"Received message from client: {user_input}")
    
    try:
        # Get AI response
        ai_output = LLMChains.get_ai_output(user_input)
        print(f"Sending AI response: {ai_output}")
        
        # Emit the response back to the client
        emit('receive_message', {"choices": [{"message": {"content": ai_output}}]})
    except Exception as e:
        print("Error in handle_send_message:", traceback.format_exc())
        emit('receive_message', {"choices": [{"message": {"content": "Oops!! Something went wrong. Please try again..."}}]})

# Run the app with Socket.IO
if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)