def build_analysis_context(data_list):
    if not data_list:
        return {
            "summary": {
                "period": None,
                "count": 0,
                "total": 0,
                "average": 0,
                "max": 0,
                "min": 0,
                "recent_trend": "데이터가 없습니다."
            },
            "highest_spending": None,
            "lowest_spending": None,
            "memo_totals": {},
            "monthly_totals": {},
            "recent_data": []
        }

    values = [int(item["value"]) for item in data_list]
    dates = [item["date"] for item in data_list]

    total = sum(values)
    average = total / len(values)

    highest = max(data_list, key=lambda x: int(x["value"]))
    lowest = min(data_list, key=lambda x: int(x["value"]))

    recent_values = values[-3:]

    if len(recent_values) < 2:
        recent_trend = "데이터가 부족합니다."
    elif recent_values[-1] > recent_values[0]:
        recent_trend = "최근 지출이 증가하는 추세입니다."
    elif recent_values[-1] < recent_values[0]:
        recent_trend = "최근 지출이 감소하는 추세입니다."
    else:
        recent_trend = "최근 지출이 비슷한 수준입니다."

    memo_totals = {}

    for item in data_list:
        memo = item.get("memo", "기타")
        value = int(item["value"])

        if memo not in memo_totals:
            memo_totals[memo] = 0

        memo_totals[memo] += value

    monthly_totals = {}

    for item in data_list:
        month = item["date"][:7]
        value = int(item["value"])

        if month not in monthly_totals:
            monthly_totals[month] = 0

        monthly_totals[month] += value

    return {
        "summary": {
            "period": f"{dates[0]} ~ {dates[-1]}",
            "count": len(data_list),
            "total": total,
            "average": round(average, 2),
            "max": max(values),
            "min": min(values),
            "recent_trend": recent_trend
        },
        "highest_spending": {
            "date": highest["date"],
            "value": int(highest["value"]),
            "memo": highest.get("memo", "")
        },
        "lowest_spending": {
            "date": lowest["date"],
            "value": int(lowest["value"]),
            "memo": lowest.get("memo", "")
        },
        "memo_totals": memo_totals,
        "monthly_totals": monthly_totals,
        "recent_data": data_list[-10:]
    }