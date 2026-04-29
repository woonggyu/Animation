import csv
import os
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import ollama

app = Flask(__name__)
CORS(app)

model_name = "llama3"

# --- 경로 설정 ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
csv_path = os.path.join(BASE_DIR, "anime_data.csv")

# 전역 변수 초기화 (경고 방지를 위해 선언 유지)
chat_history = []

def load_docs():
    docs = []
    if not os.path.exists(csv_path):
        print(f"❌ [에러] CSV 파일을 찾을 수 없습니다: {csv_path}")
        return docs

    try:
        with open(csv_path, newline="", encoding="utf-8-sig") as f:
            reader = csv.reader(f, delimiter=',', quotechar='"')
            for row in reader:
                if not row or len(row) < 4:
                    continue

                try:
                    title = row[1].strip()
                    genre = row[2].strip()
                    summary = row[3].strip()
                    score = row[-1].strip()

                    content = f"장르: {genre} | 평점: {score}점 | 줄거리: {summary}"
                    docs.append({"title": title, "content": content})
                except (IndexError, ValueError):
                    continue

        print(f"✅ [정보] {len(docs)}개의 핵심 데이터를 성공적으로 로드했습니다.")
    except Exception as e:
        print(f"❌ [경고] 데이터 로드 중 오류 발생: {e}")
    return docs

# 1. 전역 변수 documents는 여기서 한 번만 정의 (경고 해결)
documents = load_docs()

# TF-IDF 및 벡터화
if documents:
    corpus = [f"{d['title']} {d['content']}" for d in documents]
    vectorizer = TfidfVectorizer(ngram_range=(1, 2))
    doc_vectors = vectorizer.fit_transform(corpus)
else:
    vectorizer, doc_vectors = None, None

def retrieve_docs(query, k=3):
    if vectorizer is None or doc_vectors is None or not documents:
        return ""

    query_vec = vectorizer.transform([query])
    sims = cosine_similarity(query_vec, doc_vectors)[0]
    top_indices = np.argsort(-sims)[:k]

    result_texts = []
    for i in top_indices:
        # float 타입 명시를 통해 타입 경고 방지
        if float(sims[i]) > 0.1:
            result_texts.append(f"제목: {documents[i]['title']}\n정보: {documents[i]['content']}")
    return "\n\n".join(result_texts)

@app.route('/chat', methods=['POST'])
def chat():
    # chat_history가 전역 변수임을 명시
    global chat_history

    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    user_msg = str(data.get("message", "")) # 타입 명시

    # 검색 수행 (RAG)
    context = retrieve_docs(user_msg)

    system_prompt = f"""
    너는 애니메이션 추천봇 'Ani-Buddy'야. 아래 규칙을 반드시 지켜.
    1. 반드시 '한국어'로만 답변할 것. (절대 영어를 섞지 마)
    2. 제공된 [도감 데이터]에 근거해서만 사실을 말할 것.
    3. 친절하고 재치 있는 말투로 대답할 것.

    [도감 데이터]:
    {context if context else "관련 데이터를 찾지 못했습니다."}
    """

    messages = [{'role': 'system', 'content': system_prompt}]
    # 최근 6개 메시지만 포함 (3대화)
    messages.extend(chat_history[-6:])
    messages.append({'role': 'user', 'content': user_msg})

    try:
        response = ollama.chat(model=model_name, messages=messages)
        answer = str(response['message']['content']) # 타입 명시

        # 대화 기록 저장
        chat_history.append({'role': 'user', 'content': user_msg})
        chat_history.append({'role': 'assistant', 'content': answer})

        # 기록 제한 (메모리 관리)
        if len(chat_history) > 10:
            chat_history = chat_history[-10:]

        return jsonify({"answer": answer})
    except Exception as e:
        print(f"❌ [에러] Ollama 호출 실패: {e}")
        return jsonify({"error": "AI가 응답에 실패했습니다."}), 500

if __name__ == '__main__':
    # debug=True는 개발 환경에서만 사용하세요.
    app.run(host='0.0.0.0', port=5000, debug=False)