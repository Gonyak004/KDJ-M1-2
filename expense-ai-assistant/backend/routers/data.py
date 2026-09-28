from fastapi import APIRouter, HTTPException
from datetime import datetime

from schemas.data import DataCreate, DataUpdate
from services.firebase import db


router = APIRouter(
    prefix="/api/data",
    tags=["data"]
)


# 소비 데이터 추가
@router.post("")
def create_data(data: DataCreate):
    try:
        doc_ref = db.collection("data").document()

        doc_data = {
            "date": data.date.isoformat(),
            "value": data.value,
            "memo": data.memo,
            "created_at": datetime.now().isoformat()
        }

        doc_ref.set(doc_data)

        return {
            "id": doc_ref.id,
            **doc_data
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# 소비 데이터 전체 조회
@router.get("")
def get_data():
    try:
        docs = db.collection("data").order_by("date").stream()

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


# 소비 데이터 수정
@router.put("/{data_id}")
def update_data(data_id: str, data: DataUpdate):
    try:
        doc_ref = db.collection("data").document(data_id)

        if not doc_ref.get().exists:
            raise HTTPException(
                status_code=404,
                detail="데이터를 찾을 수 없습니다."
            )

        update_data = {
            "date": data.date.isoformat(),
            "value": data.value,
            "memo": data.memo
        }

        doc_ref.update(update_data)

        return {
            "id": data_id,
            **update_data
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# 소비 데이터 삭제
@router.delete("/{data_id}")
def delete_data(data_id: str):
    try:
        doc_ref = db.collection("data").document(data_id)

        if not doc_ref.get().exists:
            raise HTTPException(
                status_code=404,
                detail="데이터를 찾을 수 없습니다."
            )

        doc_ref.delete()

        return {
            "message": "데이터가 삭제되었습니다.",
            "id": data_id
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.get("/summary")
def get_data_summary():
    try:
        docs = db.collection("data").order_by("date").stream()

        data_list = []

        for doc in docs:
            item = doc.to_dict()
            data_list.append(item)

        if not data_list:
            return {
                "period": None,
                "count": 0,
                "total": 0,
                "average": 0,
                "max": 0,
                "min": 0,
                "recent_trend": "데이터가 없습니다."
            }

        values = [item["value"] for item in data_list]

        total = sum(values)
        average = total / len(values)
        maximum = max(values)
        minimum = min(values)

        dates = [item["date"] for item in data_list]

        # 최근 추세 계산
        if len(values) < 2:
            recent_trend = "데이터가 부족합니다."

        else:
            recent_values = values[-3:]

            if len(recent_values) >= 2:
                if recent_values[-1] > recent_values[0]:
                    recent_trend = "최근 지출이 증가하는 추세입니다."
                elif recent_values[-1] < recent_values[0]:
                    recent_trend = "최근 지출이 감소하는 추세입니다."
                else:
                    recent_trend = "최근 지출이 비슷한 수준입니다."
            else:
                recent_trend = "데이터가 부족합니다."

        return {
            "period": f"{dates[0]} ~ {dates[-1]}",
            "count": len(data_list),
            "total": total,
            "average": round(average, 2),
            "max": maximum,
            "min": minimum,
            "recent_trend": recent_trend
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
        
@router.post("/seed")
def create_seed_data():
    try:
        from datetime import date, timedelta
        import random

        start_date = date(2026, 6, 21)

        memos = [
            "점심 식사",
            "저녁 식사",
            "커피",
            "편의점",
            "교통비",
            "온라인 쇼핑",
            "마트",
            "영화",
            "생활용품",
            "간식"
        ]

        created = []

        for i in range(100):

            current_date = start_date + timedelta(days=i)

            value = random.randint(3000, 50000)

            memo = random.choice(memos)

            doc_ref = db.collection("data").document()

            doc_data = {
                "date": current_date.isoformat(),
                "value": value,
                "memo": memo,
                "created_at": datetime.now().isoformat()
            }

            doc_ref.set(doc_data)

            created.append({
                "id": doc_ref.id,
                **doc_data
            })

        return {
            "message": "100개의 샘플 데이터가 생성되었습니다.",
            "count": len(created)
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )