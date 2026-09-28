from fastapi import APIRouter, HTTPException
from datetime import datetime

from services.firebase import db

router = APIRouter(
    prefix="/api/conversations",
    tags=["conversations"]
)


@router.post("")
def create_conversation(data: dict):
    try:
        doc_ref = db.collection("conversations").document()

        conversation_data = {
            "title": data.get("title", "새로운 대화"),
            "messages": data.get("messages", []),
            "created_at": datetime.now().isoformat()
        }

        doc_ref.set(conversation_data)

        return {
            "id": doc_ref.id,
            **conversation_data
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.get("")
def get_conversations():
    try:
        docs = (
            db.collection("conversations")
            .order_by("created_at")
            .stream()
        )

        result = []

        for doc in docs:
            item = doc.to_dict()
            item["id"] = doc.id
            result.append(item)

        return result

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.get("/{conversation_id}")
def get_conversation(conversation_id: str):
    try:
        doc_ref = db.collection("conversations").document(conversation_id)
        doc = doc_ref.get()

        if not doc.exists:
            raise HTTPException(
                status_code=404,
                detail="대화를 찾을 수 없습니다."
            )

        result = doc.to_dict()
        result["id"] = doc.id

        return result

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.delete("/{conversation_id}")
def delete_conversation(conversation_id: str):
    try:
        doc_ref = db.collection("conversations").document(conversation_id)

        if not doc_ref.get().exists:
            raise HTTPException(
                status_code=404,
                detail="대화를 찾을 수 없습니다."
            )

        doc_ref.delete()

        return {
            "message": "대화가 삭제되었습니다.",
            "id": conversation_id
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )