from flask import Flask, render_template, request, jsonify
from pyngrok import ngrok
import requests
import os

app = Flask(__name__)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json(force=True)

    user_message = data.get("message")
    model = data.get("model", "meta-llama/llama-3-8b-instruct")

    if not user_message:
        return jsonify({"reply": "Please type something 🙂"})

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": "Bearer " + OPENROUTER_API_KEY,
                "Content-Type": "application/json"
            },
            json={
                "model": model,
                "messages": [
                    {"role": "system", "content": "Give clean structured answers. Do not use markdown backticks."},
                    {"role": "user", "content": user_message}
                ],
                "temperature": 0.5,
                "max_tokens": 700
            }
        )

        result = response.json()

        if response.status_code != 200:
            return jsonify({"reply": "API Error: " + str(result)})

        reply = result["choices"][0]["message"]["content"]

        return jsonify({"reply": reply.strip()})

    except Exception as e:
        return jsonify({"reply": "Error: " + str(e)})


if __name__ == "__main__":
    public_url = ngrok.connect(5000)
    print("🚀 Public URL:", public_url)
    app.run(port=5000)
