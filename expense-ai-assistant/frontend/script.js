const API_BASE_URL = "https://expense-ai-assistant.onrender.com";

let expenseChart = null;
let monthlyChart = null;

let allData = [];
let currentPage = 1;

const itemsPerPage = 10;


// ========================================
// 페이지 시작
// ========================================

document.addEventListener("DOMContentLoaded", () => {
    loadData();
    loadSummary();
    loadConversations();
    loadTheme();
});


// ========================================
// 공통 오류 표시
// ========================================

function showStatus(message, type = "info") {
    let status = document.getElementById("status-message");

    if (!status) {
        status = document.createElement("div");
        status.id = "status-message";
        status.className = "status-message";

        const container = document.querySelector(".container");

        if (container) {
            container.prepend(status);
        }
    }

    status.textContent = message;
    status.className = `status-message ${type}`;

    if (type === "success") {
        setTimeout(() => {
            status.textContent = "";
        }, 2500);
    }
}


// ========================================
// 소비 데이터 불러오기
// ========================================

async function loadData() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/data`);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        allData = Array.isArray(data) ? data : [];
        currentPage = 1;

        renderDataTable();
        drawExpenseChart(allData);
        drawMonthlyChart(allData);

    } catch (error) {
        console.error("소비 데이터 불러오기 실패:", error);

        allData = [];
        currentPage = 1;

        renderDataTable();

        drawExpenseChart([]);
        drawMonthlyChart([]);

        showStatus(
            "소비 데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.",
            "error"
        );
    }
}


// ========================================
// 소비 데이터 테이블
// ========================================

function renderDataTable() {
    const list = document.getElementById("data-list");

    if (!list) {
        return;
    }

    list.innerHTML = "";

    // 데이터가 없는 경우
    if (allData.length === 0) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td colspan="4" class="empty-data">
                <div class="empty-icon">🧾</div>
                <strong>아직 등록된 소비 내역이 없습니다.</strong>
                <span>아래의 소비 내역 추가 버튼을 이용해 데이터를 등록해보세요.</span>
            </td>
        `;

        list.appendChild(row);

        updatePagination();
        return;
    }

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    const pageData = allData.slice(start, end);

    pageData.forEach(item => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.date}</td>
            <td>${Number(item.value).toLocaleString()}원</td>
            <td>${escapeHtml(item.memo || "")}</td>
            <td>
                <button onclick='editData(${JSON.stringify(item)})'>
                    수정
                </button>

                <button onclick="deleteData('${item.id}')">
                    삭제
                </button>
            </td>
        `;

        list.appendChild(row);
    });

    updatePagination();
}


// ========================================
// HTML 문자 처리
// ========================================

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ========================================
// 페이지네이션
// ========================================

function updatePagination() {
    const pageInfo = document.getElementById("page-info");

    if (!pageInfo) {
        return;
    }

    const totalPages = Math.max(
        1,
        Math.ceil(allData.length / itemsPerPage)
    );

    if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    pageInfo.textContent = `${currentPage} / ${totalPages}`;
}


function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        renderDataTable();
    }
}


function nextPage() {
    const totalPages = Math.ceil(allData.length / itemsPerPage);

    if (currentPage < totalPages) {
        currentPage++;
        renderDataTable();
    }
}


// ========================================
// 전체 요약 정보
// ========================================

async function loadSummary() {
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/data/summary`
        );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const summary = await response.json();

        const period = document.getElementById("summary-period");
        const count = document.getElementById("summary-count");
        const total = document.getElementById("summary-total");
        const average = document.getElementById("summary-average");
        const max = document.getElementById("summary-max");
        const min = document.getElementById("summary-min");
        const trend = document.getElementById("summary-trend");

        if (period) {
            period.textContent =
                summary.period || "데이터 없음";
        }

        if (count) {
            count.textContent =
                `${summary.count || 0}건`;
        }

        if (total) {
            total.textContent =
                `${Number(summary.total || 0).toLocaleString()}원`;
        }

        if (average) {
            average.textContent =
                `${Number(summary.average || 0).toLocaleString()}원`;
        }

        if (max) {
            max.textContent =
                `${Number(summary.max || 0).toLocaleString()}원`;
        }

        if (min) {
            min.textContent =
                `${Number(summary.min || 0).toLocaleString()}원`;
        }

        if (trend) {
            trend.textContent =
                summary.recent_trend || "데이터가 없습니다.";
        }

    } catch (error) {
        console.error("요약 정보 불러오기 실패:", error);

        const total = document.getElementById("summary-total");
        const count = document.getElementById("summary-count");
        const average = document.getElementById("summary-average");
        const max = document.getElementById("summary-max");
        const min = document.getElementById("summary-min");
        const trend = document.getElementById("summary-trend");
        const period = document.getElementById("summary-period");

        if (period) period.textContent = "데이터 없음";
        if (count) count.textContent = "0건";
        if (total) total.textContent = "0원";
        if (average) average.textContent = "0원";
        if (max) max.textContent = "0원";
        if (min) min.textContent = "0원";
        if (trend) trend.textContent = "데이터를 불러오는 중입니다.";
    }
}


// ========================================
// 소비 데이터 추가/수정 폼 열기
// ========================================

function openDataForm() {
    const form = document.getElementById("data-form");

    if (form) {
        form.style.display = "block";
    }

    const idInput = document.getElementById("data-id");

    if (idInput) {
        idInput.value = "";
    }

    document.getElementById("data-date").value = "";
    document.getElementById("data-value").value = "";
    document.getElementById("data-memo").value = "";

    const title = document.getElementById("form-title");

    if (title) {
        title.textContent = "소비 내역 추가";
    }
}


function closeDataForm() {
    const form = document.getElementById("data-form");

    if (form) {
        form.style.display = "none";
    }
}


// ========================================
// 소비 데이터 저장
// ========================================

async function saveData() {
    const id = document.getElementById("data-id").value;

    const date = document.getElementById("data-date").value;
    const value = document.getElementById("data-value").value;
    const memo = document.getElementById("data-memo").value;

    if (!date || !value || !memo) {
        showStatus(
            "날짜, 금액, 메모를 모두 입력해주세요.",
            "error"
        );
        return;
    }

    const payload = {
        date: date,
        value: Number(value),
        memo: memo
    };

    try {
        let response;

        if (id) {
            response = await fetch(
                `${API_BASE_URL}/api/data/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                }
            );
        } else {
            response = await fetch(
                `${API_BASE_URL}/api/data`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                }
            );
        }

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        closeDataForm();

        await loadData();
        await loadSummary();

        showStatus(
            id
                ? "소비 내역이 수정되었습니다."
                : "소비 내역이 추가되었습니다.",
            "success"
        );

    } catch (error) {
        console.error("소비 데이터 저장 실패:", error);

        showStatus(
            "소비 내역을 저장하지 못했습니다.",
            "error"
        );
    }
}


// ========================================
// 소비 데이터 수정
// ========================================

function editData(item) {
    const form = document.getElementById("data-form");

    if (form) {
        form.style.display = "block";
    }

    document.getElementById("data-id").value = item.id;
    document.getElementById("data-date").value = item.date;
    document.getElementById("data-value").value = item.value;
    document.getElementById("data-memo").value = item.memo;

    const title = document.getElementById("form-title");

    if (title) {
        title.textContent = "소비 내역 수정";
    }

    window.scrollTo({
        top: form.offsetTop - 30,
        behavior: "smooth"
    });
}


// ========================================
// 소비 데이터 삭제
// ========================================

async function deleteData(id) {
    const confirmed = confirm(
        "이 소비 내역을 삭제하시겠습니까?"
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/api/data/${id}`,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        await loadData();
        await loadSummary();

        showStatus(
            "소비 내역이 삭제되었습니다.",
            "success"
        );

    } catch (error) {
        console.error("소비 데이터 삭제 실패:", error);

        showStatus(
            "소비 내역을 삭제하지 못했습니다.",
            "error"
        );
    }
}


// ========================================
// 일별 소비 그래프
// ========================================

function drawExpenseChart(data) {
    const canvas = document.getElementById("expenseChart");

    if (!canvas) {
        return;
    }

    if (expenseChart) {
        expenseChart.destroy();
    }

    if (!data || data.length === 0) {
        return;
    }

    const labels = data.map(item => item.date);
    const values = data.map(item => Number(item.value));

    expenseChart = new Chart(canvas, {
        type: "line",

        data: {
            labels: labels,

            datasets: [
                {
                    label: "일별 지출",
                    data: values,
                    borderWidth: 2,
                    tension: 0.3,
                    fill: false
                }
            ]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: true
                }
            },

            scales: {
                y: {
                    beginAtZero: true,

                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString() + "원";
                        }
                    }
                }
            }
        }
    });
}


// ========================================
// 월별 소비 그래프
// ========================================

function drawMonthlyChart(data) {
    const canvas = document.getElementById("monthlyChart");

    if (!canvas) {
        return;
    }

    if (monthlyChart) {
        monthlyChart.destroy();
    }

    if (!data || data.length === 0) {
        return;
    }

    const monthlyTotals = {};

    data.forEach(item => {
        const month = item.date.substring(0, 7);

        if (!monthlyTotals[month]) {
            monthlyTotals[month] = 0;
        }

        monthlyTotals[month] += Number(item.value);
    });

    const labels = Object.keys(monthlyTotals);
    const values = Object.values(monthlyTotals);

    monthlyChart = new Chart(canvas, {
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

            plugins: {
                legend: {
                    display: true
                }
            },

            scales: {
                y: {
                    beginAtZero: true,

                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString() + "원";
                        }
                    }
                }
            }
        }
    });
}


// ========================================
// AI 질문
// ========================================

async function sendQuestion() {
    const input = document.getElementById("question-input");
    const chatBox = document.getElementById("chat-box");

    if (!input || !chatBox) {
        return;
    }

    const question = input.value.trim();

    if (!question) {
        return;
    }

    addMessage("user", question);

    input.value = "";

    const loading = document.createElement("div");

    loading.className = "message assistant loading";
    loading.id = "chat-loading";

    loading.innerHTML = `
        <span>AI가 소비 데이터를 분석하고 있습니다...</span>
    `;

    chatBox.appendChild(loading);

    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch(
            `${API_BASE_URL}/api/chat`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    question: question
                })
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const result = await response.json();

        const loadingElement =
            document.getElementById("chat-loading");

        if (loadingElement) {
            loadingElement.remove();
        }

        addMessage(
            "assistant",
            result.answer || "답변을 받지 못했습니다."
        );

        loadConversations();

    } catch (error) {
        console.error("AI 질문 처리 실패:", error);

        const loadingElement =
            document.getElementById("chat-loading");

        if (loadingElement) {
            loadingElement.remove();
        }

        addMessage(
            "assistant",
            "현재 AI 답변을 불러오지 못했습니다. 잠시 후 다시 질문해주세요."
        );
    }
}


// ========================================
// 채팅 메시지 추가
// ========================================

function addMessage(role, content) {
    const chatBox = document.getElementById("chat-box");

    if (!chatBox) {
        return;
    }

    const message = document.createElement("div");

    message.className =
        role === "user"
            ? "message user"
            : "message assistant";

    message.textContent = content;

    chatBox.appendChild(message);

    chatBox.scrollTop = chatBox.scrollHeight;
}


// ========================================
// Enter로 질문
// ========================================

function handleEnter(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendQuestion();
    }
}


// ========================================
// 대화 목록
// ========================================

async function loadConversations() {
    const list =
        document.getElementById("conversation-list");

    if (!list) {
        return;
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/api/conversations`
        );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const conversations = await response.json();

        list.innerHTML = "";

        if (!conversations || conversations.length === 0) {
            list.innerHTML = `
                <div class="empty-conversations">
                    아직 저장된 대화가 없습니다.
                </div>
            `;

            return;
        }

        conversations
            .slice()
            .reverse()
            .forEach(conversation => {
                const item = document.createElement("div");

                item.className = "conversation-item";

                item.innerHTML = `
                    <button
                        onclick="loadConversation('${conversation.id}')"
                    >
                        ${escapeHtml(
                            conversation.title || "새로운 대화"
                        )}
                    </button>
                `;

                list.appendChild(item);
            });

    } catch (error) {
        console.error("대화 목록 불러오기 실패:", error);

        list.innerHTML = `
            <div class="empty-conversations">
                대화 기록을 불러오지 못했습니다.
            </div>
        `;
    }
}


// ========================================
// 대화 불러오기
// ========================================

async function loadConversation(id) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/conversations/${id}`
        );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const conversation = await response.json();

        const chatBox =
            document.getElementById("chat-box");

        if (!chatBox) {
            return;
        }

        chatBox.innerHTML = "";

        if (
            conversation.messages &&
            conversation.messages.length > 0
        ) {
            conversation.messages.forEach(message => {
                addMessage(
                    message.role,
                    message.content
                );
            });
        }

        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (error) {
        console.error("대화 불러오기 실패:", error);

        showStatus(
            "대화 내용을 불러오지 못했습니다.",
            "error"
        );
    }
}


// ========================================
// 다크모드
// ========================================

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");

    const isDark =
        document.body.classList.contains("dark-mode");

    localStorage.setItem(
        "darkMode",
        isDark ? "on" : "off"
    );

    updateThemeButton(isDark);
}


function loadTheme() {
    const darkMode =
        localStorage.getItem("darkMode");

    const isDark = darkMode === "on";

    if (isDark) {
        document.body.classList.add("dark-mode");
    }

    updateThemeButton(isDark);
}


function updateThemeButton(isDark) {
    const button =
        document.getElementById("theme-toggle");

    if (!button) {
        return;
    }

    button.textContent =
        isDark
            ? "☀️ 라이트모드"
            : "🌙 다크모드";
}