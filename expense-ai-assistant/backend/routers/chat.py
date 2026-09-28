from fastapi import APIRouter, HTTPException
from datetime import datetime

from services.firebase import db
from services.gemini_service import ask_gemini
from services.analysis import build_analysis_context

router = APIRouter(
    prefix="/api/chat",
    tags=["chat"]
)


@router.post("")
def chat(data: dict):
    try:
        question = data.get("question", "").strip()

        if not question:
            raise HTTPException(
                status_code=400,
                detail="질문을 입력해주세요."
            )

        docs = db.collection("data").order_by("date").stream()

        data_list = []

        for doc in docs:
            item = doc.to_dict()
            item["id"] = doc.id
            data_list.append(item)

        context = build_analysis_context(data_list)

        answer = ask_gemini(question, context)

        conversation_ref = db.collection(
            "conversations"
        ).document()

        conversation_data = {
            "title": question[:30],
            "messages": [
                {
                    "role": "user",
                    "content": question
                },
                {
                    "role": "assistant",
                    "content": answer
                }
            ],
            "created_at": datetime.now().isoformat()
        }

        conversation_ref.set(conversation_data)

        return {
            "answer": answer,
            "summary": context["summary"],
            "conversation_id": conversation_ref.id
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )