from flask import Flask, request, jsonify

app = Flask(_name_)

@app.route('/api/response', methods=['GET'])
def get_response():
    user_input = request.args.get('query', 'default')
    response = {"message": f"You sent: {user_input}"}
    return jsonify(response)

if _name_ == '_main_':
    app.run(host='0.0.0.0', port=5000)