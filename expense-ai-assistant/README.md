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
- Pydantic
- Firebase Admin SDK
- python-dotenv
- google-genai
- Render

>FastAPI를 이용하여 REST API를 구성하고, 데이터 처리 및 AI 요청 기능을 백엔드에서 담당하도록 구성했습니다.

### Database
- Firebase Firestore

### AI
- Google Gemini API

## 4. 프로젝트 구조


     expense-ai-assistant/
     ├── backend/
     │   ├── main.py
     │   ├── requirements.txt
     │   ├─ .gitignore
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

>https://expense-ai-assistant.onrender.com 

*[1. render 백엔드 브라우저를 실행하여 데이터베이스 활성화]*

>Render 공식 문서 기준으로 Free 플랜의 Web Service는 15분 동안 외부에서 들어오는 요청이 없으면 자동으로 spin down(절전/중지 상태) 됩니다. 이후 다시 요청이 들어오면 자동으로 서버를 깨우며, 이 과정에 약 1분 정도 걸릴 수 있습니다

>http://kdj-m1-2.vercel.app

*[2. vercel 배포 사이트 접속]*

#
Backend는 Render에 배포하고 Frontend는 Vercel에 배포합니다.

배포 후 Frontend의 API 주소를 Render Backend 주소로 변경합니다.

#

Render 환경변수

     GEMINI_API_KEY

.env에 키 값을 추가합니다.

#

## 5.  소비 데이터 시각화

저장된 소비 데이터를 Chart.js를 이용하여 시각화합니다.

일별 지출

날짜별 소비 금액을 선 그래프로 표시합니다.

    X축: 날짜
    Y축: 지출 금액
    그래프 종류: Line Chart
    일별 지출

월별 소비 금액을 합산하여 막대 그래프로 표시합니다.

    X축: 월
    Y축: 월별 총 지출
    그래프 종류: Bar Chart
    월별 소비 

사용자가 소비와 관련된 질문을 입력하면 백엔드에서 현재 소비 데이터의 요약 정보를 가져옵니다.

이 요약 정보를 AI 프롬프트에 포함한 후 Gemini API를 호출하여 데이터 기반 답변을 생성합니다.

예를 들어 다음과 같은 질문을 할 수 있습니다.

>현재 총 지출이 얼마인가요?

또는

>최근 소비 추세가 어떤가요?

AI는 저장된 데이터의 요약 정보를 기반으로 답변합니다.

## 5-5. 소비 데이터

Firestore의 data 컬렉션에 다음과 같은 형태로 저장합니다.

     {
    "date": "2026-06-21",
    "value": 12000,
    "memo": "점심 식사",
    "created_at": "2026-06-21T12:00:00"
    }

**대화 데이터**

Firestore의 conversations 컬렉션에는 대화 제목과 메시지를 저장합니다.

     {
    "title": "현재 소비 분석",
    "messages": [
        {
            "role": "user",
            "content": "현재 총 지출이 얼마인가요?"
        },
        {
            "role": "assistant",
            "content": "현재 총 지출은 ...원입니다."
        }
    ],
    "created_at": "2026-06-21T12:00:00"
     }

## 데이터 검증

FastAPI에서는 Pydantic을 이용하여 소비 데이터 요청을 검증합니다.

소비 데이터 생성 요청은 다음과 같이 정의했습니다.

    class DataCreate(BaseModel):
    date: date
    value: int = Field(gt=0)
    memo: str = Field(min_length=1, max_length=200)

이를 통해 다음과 같은 검증을 적용했습니다.

날짜는 날짜 형식이어야 합니다.
금액은 정수이며 0보다 커야 합니다.
메모는 최소 1자 이상이어야 합니다.
메모는 최대 200자까지 입력할 수 있습니다.

이와 같은 검증을 적용한 이유는 잘못된 데이터가 데이터베이스에 저장되는 것을 방지하고 API 입력값의 안정성을 확보하기 위해서입니다.

## 프로젝트 분리

>main.py

FastAPI 애플리케이션을 초기화하고 CORS를 설정합니다.

각 라우터를 FastAPI 애플리케이션에 등록합니다.

>routers/data.py

소비 데이터 CRUD와 데이터 요약 기능을 담당합니다.

>routers/conversations.py

대화 기록의 저장, 조회, 삭제 및 특정 대화 불러오기를 담당합니다.

>routers/chat.py

사용자 질문을 받고 소비 데이터 요약 정보를 AI에 전달하여 답변을 생성하는 기능을 담당합니다.

>services/firebase.py

Firebase Firestore 연결을 담당합니다.

>services/openai_service.py

파일명은 기존 프로젝트 구조에 따라 openai_service.py로 유지되어 있지만, 현재 실제 AI API는 OpenAI가 아닌 Google Gemini API를 사용합니다.

>schemas/data.py

Pydantic 모델을 정의하여 데이터 입력값을 검증합니다.

기능별로 파일을 분리하여 하나의 파일에 모든 코드를 작성하는 방식보다 유지보수와 기능별 관리가 쉽도록 구성했습니다.

## 6. 서비스 계정 키 보호

irebase 서비스 계정 키는 보안상 중요한 정보이기 때문에 Python 코드에 직접 내용을 작성하지 않았습니다.

로컬 개발 환경에서는 다음 파일을 사용했습니다.

firebase-service-account.json

이 파일은 .gitignore에 등록하여 GitHub에 올라가지 않도록 설정했습니다.

.venv/
__pycache__/
.env
firebase-service-account.json

배포 환경인 Render에서는 서비스 계정 JSON 내용을 FIREBASE_SERVICE_ACCOUNT_JSON 환경 변수로 등록하고, 백엔드에서 환경 변수의 값을 읽어 Firebase 인증에 사용하도록 구성했습니다.

따라서 Firebase 서비스 계정 키가 GitHub 저장소에 직접 노출되지 않도록 했습니다.

## 환경 변수 및 API 키 보호

API 키와 Firebase 인증 정보는 소스 코드에 직접 작성하지 않고 환경 변수로 관리했습니다.

로컬 개발 환경에서는 .env 파일을 사용합니다.

>예시: GEMINI_API_KEY=YOUR_GEMINI_API_KEY

실제 API 키는 README나 GitHub 저장소에 작성하지 않습니다.

.env 파일 역시 .gitignore에 등록하여 GitHub에 업로드되지 않도록 했습니다.

배포 환경

Render에서는 다음과 같은 환경 변수를 사용합니다.

    GEMINI_API_KEY
    FIREBASE_SERVICE_ACCOUNT_JSON
    ALLOWED_ORIGINS

GEMINI_API_KEY는 Gemini API를 호출하기 위한 인증 키입니다.

FIREBASE_SERVICE_ACCOUNT_JSON은 Firebase Firestore에 접근하기 위한 서비스 계정 JSON 정보입니다.

ALLOWED_ORIGINS는 CORS를 통해 API 접근을 허용할 프론트엔드 주소를 관리하기 위한 환경 변수입니다.

프론트엔드에서는 백엔드 API 주소를 다음과 같이 설정하여 사용합니다.

    const API_BASE_URL = "https://expense-ai-assistant.onrender.com"

API 키와 Firebase 인증 정보는 프론트엔드 코드에 포함하지 않고 백엔드에서만 사용합니다.

## 7. CORS 설정

*프론트엔드와 백엔드는 서로 다른 도메인에서 실행됩니다.*

Frontend:
https://kdj-m1-2.vercel.app

Backend:
https://expense-ai-assistant.onrender.com

따라서 브라우저의 동일 출처 정책에 의해 프론트엔드에서 백엔드 API를 호출하려면 CORS 설정이 필요합니다.

FastAPI에서 CORS 를 설정하고 Vercel의 프론트엔드 주소를 허용했습니다.

주요 허용 주소는 다음과 같습니다.

    http://127.0.0.1:5500
    http://localhost:5500
    https://kdj-m1-2.vercel.app

이를 통해 로컬 개발 환경과 Vercel 배포 환경에서 백엔드 API를 호출할 수 있도록 구성했습니다.

## 8. 백엔드 배포

Render 백엔드 배포

백엔드는 Render Web Service로 배포했습니다.

배포 과정은 다음과 같습니다.

    GitHub 저장소 연결
      ↓
    Render Web Service 생성
      ↓
    Python 환경 설정
      ↓
    requirements.txt 기반 패키지 설치
      ↓
    환경 변수 등록
      ↓
    FastAPI 서버 실행
      ↓
    배포 완료

배포된 백엔드 주소
>https://expense-ai-assistant.onrender.com

Swagger 주소
>https://expense-ai-assistant.onrender.com/docs

## 8-5. 프론트엔드 배포

프론트엔드는 Vercel을 이용하여 배포했습니다.

배포된 서비스: https://kdj-m1-2.vercel.app/

프론트엔드는 별도의 프레임워크 없이 다음 파일을 사용합니다.

    index.html
    style.css
    script.js

>JavaScript에서 Render의 FastAPI 백엔드 주소를 사용하여 API를 호출합니다.

     사용자
       ↓
     Vercel 프론트엔드
       ↓
    FastAPI 백엔드
       ↓
     Firebase Firestore
       ↓
     소비 데이터 조회 및 요약
       ↓
     Gemini API
       ↓
     AI 답변
       ↓
     Firestore 대화 기록 저장
       ↓
     프론트엔드에 답변 표시


## 9. 데이터 분석 및 요약 흐름

이 프로젝트에서는 소비 데이터를 단순하게 저장하는 것에 그치지 않고 데이터 요약을 생성하여 AI 기능에 활용합니다.

전체 흐름은 다음과 같습니다.

     소비 데이터 수집
       ↓
    Firestore 저장
       ↓
     날짜 기준 데이터 조회
       ↓
     데이터 개수 계산
       ↓
     총 지출 계산
       ↓
     평균 지출 계산
       ↓
     최대/최소 지출 계산
       ↓
     최근 데이터 기반 추세 계산
       ↓
     요약 정보 생성
       ↓
     AI 프롬프트에 삽입

*이를 통해 시계열 데이터를 AI 서비스에서 활용할 수 있도록 구성했습니다.*

## 최소 100개 이상의 시계열 데이터

과제의 데이터 조건을 만족하기 위해 소비 데이터를 최소 100개 이상 준비했습니다.

현재 프로젝트에서는 샘플 소비 데이터를 생성하여 Firestore에 저장하고 날짜별 소비 데이터로 활용했습니다.

각 데이터는 날짜, 지출 금액, 소비 메모를 가지고 있어 시계열 데이터 분석과 시각화에 사용할 수 있습니다.

현재 최종 테스트 데이터는 100건으로 구성했습니다.

## 사용자 인터페이스 기능

프론트엔드에서는 다음과 같은 기능을 제공합니다.

소비 데이터 입력

사용자는 다음 정보를 입력하여 소비 데이터를 추가할 수 있습니다.

     1.날짜

     2.지출 금액

     3.메모

#

**데이터를 추가하면 Firestore에 저장되고 화면의 소비 데이터 목록이 갱신됩니다.**

소비 데이터 수정

기존 소비 데이터의 날짜, 금액, 메모를 수정할 수 있습니다.

소비 데이터 삭제

기존 소비 데이터를 삭제할 수 있습니다.

데이터 요약

전체 소비 데이터를 기준으로 다음 정보를 화면에 표시합니다.

    총 지출
    평균 지출
    최대 지출
    최소 지출
    최근 추세
    소비 데이터 시각화

저장된 소비 데이터를 기준으로 일별 지출과 월별 지출을 그래프로 확인할 수 있습니다.

## AI 채팅

사용자는 자연어로 소비 관련 질문을 입력할 수 있습니다.

예시

>최근 소비 추세가 어떻게 되나요?

>평균적으로 얼마를 사용하고 있나요?

>가장 많이 지출한 금액은 얼마인가요?

질문은 /api/chat으로 전달되고 소비 데이터 요약 정보와 함께 Gemini API로 전달됩니다.

## 로딩 표시

AI 응답을 기다리는 동안 로딩 상태를 화면에 표시하도록 구성했습니다. 이를 통해 사용자가 요청이 처리되고 있는지 확인할 수 있습니다.

대화 기록

>AI와 대화한 내용은 Firestore의 conversations 컬렉션에 저장됩니다.

저장된 대화 목록을 조회할 수 있으며 특정 대화를 선택하여 이전 대화 내용을 다시 불러올 수 있습니다.

## 다크 모드

프론트엔드에는 추가 기능으로 다크 모드를 구현했습니다.

사용자가 다크 모드 버튼을 누르면 화면의 색상 테마가 변경되며, 선택한 테마는 localStorage에 저장하여 페이지를 다시 열어도 유지되도록 구성했습니다.


|API|엔드포인트|전체 목록|
|--|:---|:--|
|Method|	Endpoint|	기능
|POST	|/api/data	|소비 데이터 추가
|GET	|/api/data	|소비 데이터 전체 조회
|PUT	|/api/data/{id}	|소비 데이터 수정
|DELETE	|/api/data/{id}	|소비 데이터 삭제
|GET	|/api/data/summary	|소비 데이터 요약
|POST	|/api/conversations	|대화 저장
|GET	|/api/conversations	|대화 목록 조회
|GET	|/api/conversations/{id}	|특정 대화 조회
|DELETE	|/api/conversations/{id}	|대화 삭제
|POST	|/api/chat	|AI 질문 및 답변 생성

## 10. AI 프롬프트 구성

AI에게 전달하는 기본적인 컨텍스트는 다음과 같은 구조로 구성됩니다.

    당신은 사용자의 소비 지출을 분석하는 AI 비서입니다.

    사용자의 소비 데이터 요약:

    기간
    데이터 개수
    총 지출
    평균 지출
    최대 지출
    최소 지출
    최근 추세

    사용자의 질문에 위 데이터를 근거로 답변해주세요.
    데이터에 없는 내용을 사실처럼 만들어내지 마세요.
    한국어로 답변해주세요.

이후 사용자의 실제 질문을 추가하여 Gemini API에 전달합니다.

이를 통해 AI가 실제 데이터와 관계없는 일반적인 답변을 하는 것을 줄이고 저장된 소비 데이터에 기반한 답변을 생성하도록 구성했습니다.

## 11. Render와 Vercel을 분리한 이유

    Vercel
     ↓
    Frontend
    HTML / CSS / JavaScript

    Render
     ↓
    Backend
    FastAPI

    Firebase
     ↓
    Database

    Gemini
     ↓
    AI

이렇게 분리하면 프론트엔드와 백엔드를 각각 독립적으로 관리할 수 있습니다.

>또한 Gemini API 키와 Firebase 서비스 계정 정보는 백엔드에서만 사용하기 때문에 프론트엔드에 민감한 인증 정보를 노출하지 않을 수 있습니다.

## 데이터 생성 및 테스트

개발 과정에서는 최소 100개의 샘플 소비 데이터를 생성하여 CRUD, 요약 API, 그래프, AI 채팅 기능을 테스트했습니다.

샘플 데이터는 다음과 같은 형태를 사용합니다.

    날짜: 2026-06-21 ~ 2026-09-28
    데이터 수: 100건

각 데이터에는 임의의 지출 금액과 소비 메모가 포함되어 있습니다.

이를 통해 실제 데이터를 하나씩 직접 입력하지 않아도 100건 이상의 시계열 데이터를 이용하여 전체 서비스를 테스트할 수 있도록 구성했습니다.


## 11. 예외 처리

API 요청 과정에서 오류가 발생하는 경우 HTTP 상태 코드와 오류 메시지를 반환하도록 구성했습니다.

주요 예외 처리 기준은 다음과 같습니다.

존재하지 않는 데이터를 조회하는 경우 404 반환
잘못된 입력값은 Pydantic 검증을 통해 처리
Firebase 처리 중 오류가 발생하면 500 오류 처리
AI API 요청 실패 시 오류 처리
프론트엔드에서는 API 요청 실패 시 사용자에게 상태 메시지 표시

프론트엔드에서는 API 요청 실패 시 데이터가 없는 것처럼 보이지 않도록 오류 상태를 화면에 표시하도록 구성했습니다.