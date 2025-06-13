from flask import Flask, request, jsonify
from flask_cors import CORS
from pythainlp.corpus.wordnet import synsets
import requests

app = Flask(__name__)
CORS(app)

def translate(text, target_lang):
    url = "https://translate.googleapis.com/translate_a/single"
    params = {
        "client": "gtx",
        "sl": "auto",
        "tl": target_lang,
        "dt": "t",
        "q": text
    }
    try:
        res = requests.get(url, params=params)
        return res.json()[0][0][0]
    except:
        return "❌ แปลไม่สำเร็จ"

@app.route("/lookup", methods=["GET"])
def lookup():
    word = request.args.get("word", "").strip()
    if not word:
        return jsonify({"error": "❌ โปรดใส่คำค้นหา"}), 400

    try:
        lang = "en" if word.isascii() else "th"
        synset = synsets(word, lang="tha" if lang == "en" else "tha")
        definitions = [s.definition() for s in synset] if synset else []

        translated = translate(word, "th" if lang == "en" else "en")
        meaning = definitions[0] if definitions else "ไม่พบคำนิยามใน WordNet"

        return jsonify({
            "translation": translated,
            "definition": meaning
        })
    except Exception as e:
        return jsonify({"definition": f"❌ เกิดข้อผิดพลาด: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(port=5000)
