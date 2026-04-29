animation project


Ani-Buddy: AI 기반 애니메이션 추천 서비스
사용자의 취향을 분석하고 RAG 기반 챗봇을 통해 정확한 애니메이션 정보를 제공하는 풀스택 웹 서비스입니다.

1. 프로젝트 소개
개요: LLM의 환각 현상을 방지하기 위해 RAG(Retrieval-Augmented Generation) 기술을 도입한 애니메이션 추천 서비스입니다.

핵심 기능: 사용자와의 질문 게임을 통해 취향을 파악하고, 최적의 TOP 3 추천 리스트를 생성합니다.

구조: React(프론트), Spring Boot(메인 백엔드), Flask(AI 서버)를 유기적으로 연결한 마이크로서비스 아키텍처를 지향합니다.


# 2프로젝트 구조
```
Ani-recommend
├── frontend/ (React + Vite)
│   ├── src/
│   │   ├── components/      # UI 컴포넌트 (AnimeChat, QuizStart 등)
│   │   ├── App.jsx          # 메인 앱 로직
│   │   └── main.jsx         # 진입점
│   └── vite.config.js       # Vite 설정
│
├── backend-spring/ (Spring Boot)
│   ├── src/main/java/com/anime/backend/
│   │   ├── controller/      # API 엔드포인트 (Chat, Question 등)
│   │   ├── service/         # 비즈니스 로직
│   │   ├── repository/      # MySQL JPA 접근
│   │   └── entity/          # DB 매핑 (User, Anime 등)
│   └── src/main/resources/application.properties
│
└── backend-ai/ (Python Flask)
    ├── app.py               # AI 서버 메인 로직
    ├── anime_data.csv       # RAG용 애니메이션 데이터셋
    └── requirements.txt     # 설치 패키지 목록

```

# 3기술스택
 
2. 기술 스택 (Tech Stack)
Frontend: React, Vite, Axios
Backend (Web): Java 17, Spring Boot 3.x, Spring Data JPA
Backend (AI): Python 3.10, Flask, Ollama (Llama3)
Database: MySQL, CSV (애니메이션 원천 데이터)
Library: Scikit-learn (TF-IDF 벡터화), Flask-CORS



# 4주요기능
1.취향 분석 질문 게임: 가벼운 문답을 통해 사용자의 선호 장르와 스타일을 분석하여 TOP 3 애니메이션을 추천합니다.

2.RAG 기반 챗봇: 100개 이상의 정제된 데이터를 기반으로 AI가 애니메이션의 줄거리, 평점 정보를 정확하게 답변합니다.

3.풀스택 API 연동: Axios를 이용해 React - Spring Boot - Flask 간의 실시간 데이터 통신을 구현했습니다.


# 5 db구조


# 6 문제점 및 해결방안
5. 문제점 및 해결 방안
문제 1: 서로 다른 서버 간 통신 (CORS)
현상: 포트가 다른 서버 간 데이터 요청 시 브라우저 차단 발생.
해결: Spring Boot와 Flask에 CORS 설정을 적용하여 해결.

문제 2: 데이터 형식 불일치
현상: Java와 Python 간 JSON 데이터 규격이 달라 데이터가 깨지는 현상.
해결: 표준 DTO 규격을 정의하고 JSON 포맷을 통일하여 무결성 확보.

# 7실행방법

AI Server: cd backend-ai -> pip install -r requirements.txt -> python app.py

Backend: MySQL DB 생성 후 application.properties 설정 -> BackendApplication 실행

Frontend: cd frontend -> npm install -> npm run dev








