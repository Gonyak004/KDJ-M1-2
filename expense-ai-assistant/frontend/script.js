const API_BASE_URL = "http://127.0.0.1:8000";

let expenseChart = null;
let monthlyChart = null;

let allData = [];
let currentPage = 1;

const itemsPerPage = 10;


document.addEventListener("DOMContentLoaded", () => {
    loadData();
    loadSummary();
    loadConversations();
});


async function loadData() {
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/data`
        );

        const data = await response.json();

        allData = data;
        currentPage = 1;

        renderDataTable();
        drawExpenseChart(data);
        drawMonthlyChart(data);

    } catch (error) {
        console.error(error);
        alert("소비 데이터를 불러오지 못했습니다.");
    }
}


function renderDataTable() {
    const list = document.getElementById("data-list");

    list.innerHTML = "";

    const start =
        (currentPage - 1) * itemsPerPage;

    const end =
        start + itemsPerPage;

    const pageData =
        allData.slice(start, end);

    pageData.forEach(item => {

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td>${item.date}</td>

            <td>
                ${Number(item.value).toLocaleString()}원
            </td>

            <td>${item.memo}</td>

            <td>
                <button
                    onclick='editData(${JSON.stringify(item)})'>
                    수정
                </button>

                <button
                    onclick="deleteData('${item.id}')">
                    삭제
                </button>
            </td>
        `;

        list.appendChild(row);
    });

    updatePagination();
}


function updatePagination() {

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                allData.length / itemsPerPage
            )
        );

    document.getElementById(
        "page-info"
    ).textContent =
        `${currentPage} / ${totalPages}`;
}


function previousPage() {

    if (currentPage > 1) {

        currentPage--;

        renderDataTable();
    }
}


function nextPage() {

    const totalPages =
        Math.ceil(
            allData.length / itemsPerPage
        );

    if (currentPage < totalPages) {

        currentPage++;

        renderDataTable();
    }
}


async function loadSummary() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/data/summary`
            );

        const summary =
            await response.json();

        document.getElementById(
            "total"
        ).textContent =
            `${Number(summary.total).toLocaleString()}원`;

        document.getElementById(
            "average"
        ).textContent =
            `${Number(summary.average).toLocaleString()}원`;

        document.getElementById(
            "max"
        ).textContent =
            `${Number(summary.max).toLocaleString()}원`;

        document.getElementById(
            "min"
        ).textContent =
            `${Number(summary.min).toLocaleString()}원`;

        document.getElementById(
            "trend"
        ).textContent =
            `최근 추세: ${summary.recent_trend}`;

    } catch (error) {

        console.error(error);
    }
}


function drawExpenseChart(data) {

    const canvas =
        document.getElementById(
            "expenseChart"
        );

    if (!canvas) return;

    if (expenseChart) {
        expenseChart.destroy();
    }

    expenseChart =
        new Chart(canvas, {

            type: "line",

            data: {

                labels:
                    data.map(item => item.date),

                datasets: [
                    {
                        label: "일별 지출",

                        data:
                            data.map(
                                item => Number(item.value)
                            ),

                        borderWidth: 2,

                        tension: 0.2
                    }
                ]
            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                scales: {

                    y: {

                        beginAtZero: true,

                        ticks: {

                            callback: function(value) {

                                return (
                                    value.toLocaleString()
                                    + "원"
                                );
                            }
                        }
                    }
                }
            }
        });
}


function drawMonthlyChart(data) {

    const canvas =
        document.getElementById(
            "monthlyChart"
        );

    if (!canvas) return;

    const monthlyTotals = {};

    data.forEach(item => {

        const month =
            item.date.substring(0, 7);

        if (!monthlyTotals[month]) {
            monthlyTotals[month] = 0;
        }

        monthlyTotals[month] +=
            Number(item.value);
    });

    const labels =
        Object.keys(monthlyTotals);

    const values =
        Object.values(monthlyTotals);

    if (monthlyChart) {
        monthlyChart.destroy();
    }

    monthlyChart =
        new Chart(canvas, {

            type: "bar",

            data: {

                labels: labels,

                datasets: [
                    {
                        label: "월별 지출",

                        data: values,

                        borderWidth: 1
                    }
                ]
            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                scales: {

                    y: {

                        beginAtZero: true,

                        ticks: {

                            callback: function(value) {

                                return (
                                    value.toLocaleString()
                                    + "원"
                                );
                            }
                        }
                    }
                }
            }
        });
}


function openDataForm() {

    document
        .getElementById("data-form")
        .classList.remove("hidden");

    document.getElementById(
        "edit-id"
    ).value = "";

    document.getElementById(
        "data-date"
    ).value = "";

    document.getElementById(
        "data-value"
    ).value = "";

    document.getElementById(
        "data-memo"
    ).value = "";
}


function closeDataForm() {

    document
        .getElementById("data-form")
        .classList.add("hidden");
}


async function saveData() {

    const id =
        document.getElementById(
            "edit-id"
        ).value;

    const date =
        document.getElementById(
            "data-date"
        ).value;

    const value =
        Number(
            document.getElementById(
                "data-value"
            ).value
        );

    const memo =
        document.getElementById(
            "data-memo"
        ).value;

    if (!date || !value || !memo) {

        alert(
            "날짜, 금액, 메모를 모두 입력해주세요."
        );

        return;
    }

    const body = {
        date,
        value,
        memo
    };

    try {

        let response;

        if (id) {

            response =
                await fetch(
                    `${API_BASE_URL}/api/data/${id}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(body)
                    }
                );

        } else {

            response =
                await fetch(
                    `${API_BASE_URL}/api/data`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(body)
                    }
                );
        }

        if (!response.ok) {
            throw new Error("저장 실패");
        }

        alert(
            id
                ? "소비 데이터가 수정되었습니다."
                : "소비 데이터가 추가되었습니다."
        );

        closeDataForm();

        await loadData();
        await loadSummary();

    } catch (error) {

        console.error(error);

        alert(
            "저장 중 오류가 발생했습니다."
        );
    }
}


function editData(item) {

    document.getElementById(
        "edit-id"
    ).value = item.id;

    document.getElementById(
        "data-date"
    ).value = item.date;

    document.getElementById(
        "data-value"
    ).value = item.value;

    document.getElementById(
        "data-memo"
    ).value = item.memo;

    document
        .getElementById("data-form")
        .classList.remove("hidden");
}


async function deleteData(id) {

    if (
        !confirm(
            "정말 삭제하시겠습니까?"
        )
    ) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/data/${id}`,
                {
                    method: "DELETE"
                }
            );

        if (!response.ok) {
            throw new Error("삭제 실패");
        }

        alert(
            "소비 데이터가 삭제되었습니다."
        );

        await loadData();
        await loadSummary();

    } catch (error) {

        console.error(error);

        alert(
            "삭제 중 오류가 발생했습니다."
        );
    }
}


async function sendQuestion() {

    const input =
        document.getElementById(
            "question"
        );

    const question =
        input.value.trim();

    if (!question) {

        alert(
            "질문을 입력해주세요."
        );

        return;
    }

    addMessage(
        "user",
        question
    );

    input.value = "";

    document
        .getElementById("loading")
        .classList.remove("hidden");

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/chat`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            question
                        })
                }
            );

        if (!response.ok) {
            throw new Error("AI 답변 실패");
        }

        const result =
            await response.json();

        addMessage(
            "assistant",
            result.answer
        );

        loadConversations();

    } catch (error) {

        console.error(error);

        addMessage(
            "assistant",
            "AI 답변을 가져오는 중 오류가 발생했습니다."
        );

    } finally {

        document
            .getElementById("loading")
            .classList.add("hidden");
    }
}


function addMessage(
    role,
    content
) {

    const chatBox =
        document.getElementById(
            "chat-box"
        );

    const message =
        document.createElement("div");

    message.className =
        `message ${role}`;

    message.textContent =
        content;

    chatBox.appendChild(
        message
    );

    chatBox.scrollTop =
        chatBox.scrollHeight;
}


function handleEnter(event) {

    if (event.key === "Enter") {
        sendQuestion();
    }
}


async function loadConversations() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/conversations`
            );

        const conversations =
            await response.json();

        const list =
            document.getElementById(
                "conversation-list"
            );

        list.innerHTML = "";

        conversations
            .slice()
            .reverse()
            .forEach(conversation => {

                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "conversation-item";

                item.textContent =
                    conversation.title;

                item.onclick = () =>
                    loadConversation(
                        conversation.id
                    );

                list.appendChild(item);
            });

    } catch (error) {

        console.error(error);
    }
}


async function loadConversation(id) {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/api/conversations/${id}`
            );

        const conversation =
            await response.json();

        const chatBox =
            document.getElementById(
                "chat-box"
            );

        chatBox.innerHTML = "";

        conversation.messages
            .forEach(message => {

                addMessage(
                    message.role,
                    message.content
                );
            });

    } catch (error) {

        console.error(error);

        alert(
            "대화를 불러오지 못했습니다."
        );
    }
}