import React from 'react';
// 컴포넌트 이름을 기능에 맞게 CommentSection으로 변경합니다.
import CommentSection from './CommentSection';

function QuizResult({ result, onRetry }) {
    if (!result || result.length === 0) return (
        <div className="fade-in" style={{ padding: "40px", textAlign: "center" }}>
            <h2 style={{ color: "#ff6b6b" }}>결과를 불러올 수 없어요 😢</h2>
            <p style={{ color: "#666" }}>서버 연결을 확인해주세요.</p>
            <button onClick={onRetry} style={{
                marginTop: "20px", padding: "12px 24px", fontSize: "16px",
                backgroundColor: "#333", color: "white", border: "none", borderRadius: "8px", cursor: "pointer"
            }}>다시 시도하기</button>
        </div>
    );

    return (
        <div className="fade-in" style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
            <h1 style={{ fontSize: "2.2rem", marginBottom: "30px", color: "var(--text-h)", textAlign: "center" }}>
                🎉 당신을 위한 추천 애니 TOP 3!
            </h1>

            {/* 1. 애니메이션 추천 카드 리스트 */}
            <div style={{ display: "flex", justifyContent: "center", gap: "24px", flexWrap: "wrap", marginBottom: "40px" }}>
                {result.map((anime, index) => (
                    <div key={anime.id} style={cardStyle}
                         onMouseOver={e => {
                             e.currentTarget.style.transform = "translateY(-8px)";
                             e.currentTarget.style.boxShadow = "var(--shadow)";
                         }}
                         onMouseOut={e => {
                             e.currentTarget.style.transform = "translateY(0)";
                             e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
                         }}
                    >
                        <h3 style={{ fontSize: "1.4rem", margin: "0 0 16px 0", color: "#ff6b6b" }}>
                            {index === 0 ? "🥇 1위" : index === 1 ? "🥈 2위" : "🥉 3위"}
                        </h3>

                        <div style={{ width: "100%", height: "280px", overflow: "hidden", borderRadius: "12px", marginBottom: "16px" }}>
                            <img
                                src={anime.imageUrl || "https://via.placeholder.com/200x280?text=No+Image"}
                                alt={anime.title}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </div>

                        <h3 style={{ fontSize: "1.2rem", marginBottom: "8px", color: "var(--text-h)" }}>{anime.title}</h3>
                        <p style={{ color: "#4ecdc4", fontSize: "0.9rem", fontWeight: "bold", marginBottom: "12px" }}>{anime.genre}</p>

                        <p style={{ fontSize: "0.95rem", color: "var(--text)", lineHeight: "1.5", margin: 0 }}>
                            {anime.description ? anime.description.substring(0, 70) + "..." : "설명이 없습니다."}
                        </p>
                    </div>
                ))}
            </div>

            {/* 2. 다시 테스트하기 버튼 */}
            <div style={{ textAlign: "center", marginBottom: "60px" }}>
                <button onClick={onRetry} style={retryButtonStyle}
                        onMouseOver={e => e.target.style.transform = "scale(1.05)"}
                        onMouseOut={e => e.target.style.transform = "scale(1)"}
                >
                    다시 테스트하기 🔄
                </button>
            </div>

            {/* 3. 하단 SNS형 댓글 영역 */}
            <div style={{ borderTop: "2px solid var(--border)", paddingTop: "60px", marginTop: "40px" }}>
                <h2 style={{ fontSize: "1.8rem", marginBottom: "30px", color: "var(--text-h)", textAlign: "center" }}>
                    💬 유저 후기 남기기
                </h2>
                <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
                    {/* 컴포넌트 이름을 CommentSection으로 변경하여 호출 */}
                    <CommentSection />
                </div>
            </div>
        </div>
    );
}

// 스타일 객체 (CSS 변수 활용하여 다크모드 대응)
const cardStyle = {
    backgroundColor: "var(--bg)",
    border: "1px solid var(--border)",
    borderRadius: "16px",
    padding: "20px",
    width: "240px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    transition: "transform 0.3s, boxShadow 0.3s",
    cursor: "pointer"
};

const retryButtonStyle = {
    padding: "16px 40px",
    fontSize: "18px",
    fontWeight: "bold",
    backgroundColor: "#ff6b6b",
    color: "white",
    border: "none",
    borderRadius: "30px",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(255, 107, 107, 0.4)",
    transition: "transform 0.2s"
};

export default QuizResult;