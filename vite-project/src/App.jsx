import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import QuizStart from "./components/QuizStart";
import QuizQuestion from "./components/QuizQuestion";
import QuizResult from "./components/QuizResult";
import AnimeLibrary from "./components/AnimeLibrary"; // 새로 만든 도감 컴포넌트

function App() {
    return (
        <Router>
            <div style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                {/* 1. 네비게이션 바 (상단 메뉴) */}
                <nav style={navStyle}>
                    <div style={logoStyle}>🎬 Anime</div>
                    <div style={linkGroupStyle}>
                        <Link to="/" style={linkStyle}>애니 추천</Link>
                        <Link to="/library" style={linkStyle}>애니 도감</Link>
                    </div>
                </nav>

                {/* 2. 실제 화면이 바뀌는 영역 */}
                <div style={{ padding: "20px" }}>
                    <Routes>
                        {/* 메인 퀴즈 페이지 */}
                        <Route path="/" element={<QuizContainer />} />

                        {/* 도감 페이지 */}
                        <Route path="/library" element={<AnimeLibrary />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

// 퀴즈의 진행 상태(start -> quiz -> result)를 관리하는 내부 컨테이너
function QuizContainer() {
    const [step, setStep] = useState("start");
    const [result, setResult] = useState(null);

    return (
        <div style={{ textAlign: "center" }}>
            {step === "start" && <QuizStart onStart={() => setStep("quiz")} />}
            {step === "quiz" && (
                <QuizQuestion
                    onFinish={(res) => {
                        setResult(res);
                        setStep("result");
                    }}
                />
            )}
            {step === "result" && <QuizResult result={result} onRetry={() => setStep("start")} />}
        </div>
    );
}

// 간단한 스타일 객체
const navStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 50px",
    backgroundColor: "white",
    borderBottom: "1px solid #eee",
    position: "sticky",
    top: 0,
    zIndex: 100
};

const logoStyle = {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "#ff6b6b"
};

const linkGroupStyle = {
    display: "flex",
    gap: "30px"
};

const linkStyle = {
    textDecoration: "none",
    color: "#333",
    fontWeight: "600",
    fontSize: "1rem"
};

export default App;