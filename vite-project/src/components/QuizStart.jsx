// 최신 React 버전이므로 import React는 생략해도 무방합니다.
function QuizStart({ onStart }) {
    // 버튼 스타일을 변수로 분리하여 가독성을 높였습니다.
    const startButtonStyle = {
        padding: "18px 50px",
        fontSize: "22px",
        fontWeight: "bold",
        backgroundColor: "#ff6b6b", // 포인트 컬러
        color: "white",
        border: "none",
        borderRadius: "50px",
        cursor: "pointer",
        boxShadow: "0 10px 20px rgba(255, 107, 107, 0.3)",
        transition: "all 0.3s ease",
        marginTop: "20px"
    };

    return (
        <div className="fade-in" style={containerStyle}>
            {/* 상단 눈금 디자인 (CSS의 .ticks 활용) */}
            <div className="ticks" style={{ marginBottom: "40px" }}></div>

            <h1 style={titleStyle}>
                🎌 나에게 맞는 애니는?
            </h1>

            <p style={descriptionStyle}>
                몇 가지 질문으로 딱 맞는 애니를 추천해드려요!
            </p>

            <button
                onClick={onStart}
                style={startButtonStyle}
                onMouseOver={e => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 15px 25px rgba(255, 107, 107, 0.5)";
                }}
                onMouseOut={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 10px 20px rgba(255, 107, 107, 0.3)";
                }}
            >
                시작하기 🚀
            </button>
        </div>
    );
}

// 스타일 객체 분리
const containerStyle = {
    padding: "60px 20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    flex: "1",
    minHeight: "50vh",
    textAlign: "center"
};

const titleStyle = {
    fontSize: "3.5rem",
    marginBottom: "24px",
    color: "var(--text-h)",
    letterSpacing: "-1.5px",
    fontWeight: "700"
};

const descriptionStyle = {
    fontSize: "1.3rem",
    color: "var(--text)",
    marginBottom: "48px",
    lineHeight: "1.6"
};

export default QuizStart;