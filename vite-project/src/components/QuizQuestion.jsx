import { useState } from "react";

const questions = [
    {
        id: 1,
        content: "어떤 분위기의 애니를 좋아하나요?",
        options: ["액션/긴장감 넘치는", "감동/드라마틱한", "개그/유쾌한", "로맨스/설레는"]
    },
    {
        id: 2,
        content: "선호하는 배경 세계관은?",
        options: ["판타지/이세계", "현실/학교/일상", "SF/미래/우주", "역사/시대극"]
    },
    {
        id: 3,
        content: "주인공 스타일은?",
        options: ["강한 전사형", "천재/두뇌파형", "평범한 성장형", "미스터리한 캐릭터"]
    },
    {
        id: 4,
        content: "어떤 요소가 가장 중요한가요?",
        options: ["화려한 액션", "탄탄한 스토리", "감동과 눈물", "캐릭터 매력"]
    },
    {
        id: 5,
        content: "선호하는 분위기는?",
        options: ["긴장감/스릴", "따뜻함/힐링", "코미디/웃음", "심리/미스터리"]
    },
    {
        id: 6,
        content: "같이 보고 싶은 사람은?",
        options: ["혼자 보고싶어요", "가족이랑", "친구랑", "연인이랑"]
    },
    {
        id: 7,
        content: "애니 길이는?",
        options: ["짧게 (영화/12화)", "적당히 (13~26화)", "길게 (26화 이상)", "상관없어요"]
    },
];

function QuizQuestion({ onFinish }) {
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleAnswer = async (answer) => {
        const newAnswers = [...answers, answer];
        setAnswers(newAnswers);

        if (current + 1 < questions.length) {
            setCurrent(current + 1);
        } else {
            setLoading(true);
            const res = await fetch("http://localhost:8080/api/anime/recommend", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answers: newAnswers }),
            });
            const data = await res.json();
            setLoading(false);
            onFinish(data);
        }
    };

    if (loading) return <h2>🤖 분석 중이에요...</h2>;

    const q = questions[current];
    const progress = ((current) / questions.length) * 100;

    return (
        <div style={{ maxWidth: "500px", margin: "0 auto" }}>
            {/* 진행바 */}
            <div style={{ backgroundColor: "#eee", borderRadius: "10px", marginBottom: "20px" }}>
                <div style={{
                    width: `${progress}%`,
                    backgroundColor: "#ff6b6b",
                    height: "8px",
                    borderRadius: "10px",
                    transition: "width 0.3s"
                }} />
            </div>
            <p style={{ color: "#888" }}>{current + 1} / {questions.length}</p>
            <h2 style={{ marginBottom: "24px" }}>{q.content}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {q.options.map((opt) => (
                    <button key={opt} onClick={() => handleAnswer(opt)} style={{
                        padding: "14px 30px",
                        fontSize: "16px",
                        backgroundColor: "white",
                        color: "#333",
                        border: "2px solid #4ecdc4",
                        borderRadius: "12px",
                        cursor: "pointer",
                        transition: "all 0.2s"
                    }}
                            onMouseOver={e => e.target.style.backgroundColor = "#4ecdc4"}
                            onMouseOut={e => e.target.style.backgroundColor = "white"}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default QuizQuestion;