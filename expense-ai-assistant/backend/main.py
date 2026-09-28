from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from services.firebase import db
from routers.data import router as data_router
from routers.conversations import router as conversations_router
from routers.chat import router as chat_router


app = FastAPI(
    title="Expense AI Assistant",
    description="소비 지출을 분석하는 AI 비서 API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
        "https://kdj-m1-2.vercel.app/"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(data_router)
app.include_router(conversations_router)
app.include_router(chat_router)

@app.get("/")
def root():
    return {
        "message": "Expense AI Assistant API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "ok"
    }


@app.get("/firebase-test")
def firebase_test():
    try:
        collections = list(db.collections())

        return {
            "status": "success",
            "message": "Firebase Firestore connection successful",
            "collections": [collection.id for collection in collections]
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }