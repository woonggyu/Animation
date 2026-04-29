animation project


Ani-Buddy: AI 기반 애니메이션 추천 서비스
사용자의 취향을 분석하고 RAG 기반 챗봇을 통해 정확한 애니메이션 정보를 제공하는 풀스택 웹 서비스입니다.

# 1프로젝트 소개
```
개요: LLM의 환각 현상을 방지하기 위해 RAG(Retrieval-Augmented Generation) 기술을 도입한 애니메이션 추천 서비스입니다.

핵심 기능: 사용자와의 질문 게임을 통해 취향을 파악하고, 최적의 TOP 3 추천 리스트를 생성합니다.

구조: React(프론트), Spring Boot(메인 백엔드), Flask(AI 서버)를 유기적으로 연결한 마이크로서비스 아키텍처를 지향합니다.
```

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

```
Frontend
React, Vite, Axios

Backend
Java 17, Spring Boot 3.x, Spring Data JPA

AI & Data Analysis
Python 3.12, Ollama (Llama3), Pandas, Scikit-learn

Database
MySQL, CSV
```


# 4주요기능
```
1.취향 분석 질문 게임: 가벼운 문답을 통해 사용자의 선호 장르와 스타일을 분석하여 TOP 3 애니메이션을 추천합니다.

2.RAG 기반 챗봇: 100개 이상의 정제된 데이터를 기반으로 AI가 애니메이션의 줄거리, 평점 정보를 정확하게 답변합니다.

3.풀스택 API 연동: Axios를 이용해 React - Spring Boot - Flask 간의 실시간 데이터 통신을 구현했습니다.
```





# 5 db구조
```
1) ANIME Table (애니메이션 기본 정보)

작품의 메타데이터를 저장하며, AI 서버에서 RAG 검색을 수행할 때 원천 데이터로 활용됩니다.

NUM: 작품 고유 번호 (Primary Key)

TITLE: 애니메이션 제목

GENRE: 장르 (액션, 로맨스, 판타지 등)

RATING: 작품 평점

DESCRIPTION: 상세 줄거리 (AI 분석 및 답변 생성용 핵심 데이터)

2) COMMENTS Table (사용자 후기 및 대화 기록)

특정 작품에 대해 사용자들이 남긴 피드백을 저장하며, ANIME 테이블과 연동됩니다.

CNO: 댓글 고유 식별 번호 (Primary Key)

NUM: 애니메이션 고유 번호 (Foreign Key) - ANIME 테이블의 NUM과 연결

ID: 작성자 닉네임 또는 아이디

CONTENT: 후기 및 댓글 내용

REGDATE: 데이터 등록 일자
```


# 6 문제점 및 해결방안
```
문제점 및 해결 방안
문제 1: 서로 다른 서버 간 통신 (CORS)
현상: 포트가 다른 서버 간 데이터 요청 시 브라우저 차단 발생.
해결: Spring Boot와 Flask에 CORS 설정을 적용하여 해결.

문제 2: 데이터 형식 불일치
현상: Java와 Python 간 JSON 데이터 규격이 달라 데이터가 깨지는 현상.
해결: 표준 DTO 규격을 정의하고 JSON 포맷을 통일하여 무결성 확보.
```
# 7실행방법
```
AI Server: cd backend-ai -> pip install -r requirements.txt -> python app.py

Backend: MySQL DB 생성 후 application.properties 설정 -> BackendApplication 실행

Frontend: cd frontend -> npm install -> npm run dev
```







