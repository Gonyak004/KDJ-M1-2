import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY가 설정되지 않았습니다.")

client = genai.Client(api_key=api_key)


def ask_gemini(question: str, context: dict):
    prompt = f"""
당신은 사용자의 소비 지출을 분석하는 AI 비서입니다.

다음은 사용자의 실제 소비 데이터 분석 결과입니다.

[기본 요약]
{context["summary"]}

[가장 많이 지출한 기록]
{context["highest_spending"]}

[가장 적게 지출한 기록]
{context["lowest_spending"]}

[메모별 지출 합계]
{context["memo_totals"]}

[월별 지출 합계]
{context["monthly_totals"]}

[최근 소비 기록]
{context["recent_data"]}

사용자의 질문:
{question}

답변 규칙:
1. 제공된 데이터를 근거로 답변합니다.
2. 데이터에 없는 사실을 만들어내지 않습니다.
3. 금액은 원 단위로 표시합니다.
4. 필요한 경우 날짜와 메모를 함께 설명합니다.
5. 한국어로 자연스럽게 답변합니다.
6. 단순히 데이터를 나열하지 말고 질문에 직접 답변합니다.
"""

    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=prompt
    )

    return response.text