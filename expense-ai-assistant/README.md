# 소비 지출 AI 비서

사용자의 소비 데이터를 Firestore에 저장하고 Gemini AI를 활용하여 소비 지출을 분석하는 AI 비서입니다.

## 1. 프로젝트 소개

본 프로젝트는 사용자가 날짜, 지출 금액, 메모를 입력하면 데이터를 Firestore에 저장하고, 저장된 소비 데이터를 기반으로 AI가 자연어 질문에 답변하는 서비스입니다.

## 2. 주요 기능

### 소비 데이터 관리
- 소비 데이터 추가
- 소비 데이터 조회
- 소비 데이터 수정
- 소비 데이터 삭제

### 소비 분석
- 총 지출
- 평균 지출
- 최대 지출
- 최소 지출
- 최근 지출 추세
- 일별 소비 추이
- 월별 지출 비교

### AI 소비 상담
- 자연어 질문 처리
- 실제 Firestore 데이터 기반 답변
- Gemini API 활용
- 소비 데이터 상세 분석

### 대화 기록
- AI 대화 자동 저장
- 대화 목록 조회
- 이전 대화 불러오기
- 대화 삭제

## 3. 기술 스택

### Frontend
- HTML
- CSS
- JavaScript
- Chart.js
- Vercel

### Backend
- Python
- FastAPI
- Uvicorn
- Render

### Database
- Firebase Firestore

### AI
- Google Gemini API

## 4. 프로젝트 구조


     expense-ai-assistant/
     ├── backend/
     │   ├── main.py
     │   ├── requirements.txt
     │   ├── routers/
     │   │   ├── data.py
     │   │   ├── chat.py
     │   │   └── conversations.py
     │   ├── schemas/
     │   │   └── data.py
     │   └── services/
     │       ├── firebase.py
     │       ├── analysis.py
     │       └── gemini_service.py
     │
     └── frontend/
         ├── index.html
         ├── style.css
         └── script.js

#

사용자
  ↓
Frontend
  ↓
FastAPI
  ↓
Firestore
  ↓
소비 데이터 조회 및 요약
  ↓
Gemini API
  ↓
AI 답변
  ↓
Frontend

API

Data
POST /api/data
GET /api/data
PUT /api/data/{id}
DELETE /api/data/{id}
GET /api/data/summary

Chat

POST /api/chat

Conversations

POST /api/conversations
GET /api/conversations
GET /api/conversations/{id}
DELETE /api/conversations/{id}

환경변수

GEMINI_API_KEY=YOUR_API_KEY

>Firebase 서비스 계정 파일과 API 키는 보안을 위해 GitHub에 업로드하지 않습니다.

로컬 실행

백엔드 터미널

     cd backend
     python -m venv .venv

     .\.venv\Scripts\Activate.ps1

패키지 설치

     pip install -r requirements.txt
     python -m uvicorn main:app --reload

Swagger

     http://127.0.0.1:8000/docs

프론트엔드 터미널

     cd frontend
     python -m http.server 5500

브라우저

     http://127.0.0.1:5500


#

배포

Backend는 Render에 배포하고 Frontend는 Vercel에 배포합니다.

배포 후 Frontend의 API 주소를 Render Backend 주소로 변경합니다.

#

프로젝트 목표

본 프로젝트를 통해 FastAPI 기반 API 서버 구성, Firestore CRUD, Pydantic 데이터 검증, AI API 연동, 데이터 요약 및 컨텍스트 주입, CORS 설정, 환경변수 관리 및 웹 배포 과정을 구현합니다.

Build Command

     pip install -r requirements.txt

Start Command

     uvicorn main:app --host 0.0.0.0 --port $PORT

#

Render 환경변수

     GEMINI_API_KEY

.env에 키 값을 추가합니다.

추가로 Firebase도 추가해야 합니다.

현재 코드

     credentials.Certificate(
     "firebase-service-account.json"
     )

>위와 같은 코드를 사용하므로 Render에서는 로컬 파일이 없습니다. 따라서 배포용으로 Firebase 인증 방식을 수정해야 합니다.

firebase.py를 다음 형태로 변경합니다.

     import os
     import json

     import firebase_admin
     from firebase_admin import credentials, firestore

     if not firebase_admin._apps:

     service_account_json = os.getenv(
        "FIREBASE_SERVICE_ACCOUNT_JSON"
     )

     if service_account_json:

        service_account_info = json.loads(
            service_account_json
        )

        cred = credentials.Certificate(
            service_account_info
        )

     else:

        cred = credentials.Certificate(
            "firebase-service-account.json"
        )

     firebase_admin.initialize_app(cred)

     db = firestore.client()

로컬에서는 아래와 같은 json파일을 사용하고

>firebase-service-account.json

Rander에서는 아래와 같은 환경변수를 사용합니다.

>FIREBASE_SERVICE_ACCOUNT_JSON

