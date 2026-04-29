import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const AnimeChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [chatLog, setChatLog] = useState([
        { role: 'bot', content: '안녕하세요! 궁금한 애니메이션에 대해 물어보세요. 📚' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const logRef = useRef(null);

    // 스크롤 최하단 유지
    useEffect(() => {
        if (logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
        }
    }, [chatLog]);

    const sendMessage = async () => {
        if (!message.trim() || isLoading) return;

        const userMsg = { role: 'user', content: message };
        setChatLog(prev => [...prev, userMsg]);
        setMessage("");
        setIsLoading(true);

        try {
            // Spring Boot의 챗봇 엔드포인트로 연결 (경로는 나중에 맞추면 됩니다)
            const res = await axios.post('http://localhost:8080/api/chat', { message: message });

            setChatLog(prev => [...prev, { role: 'bot', content: res.data.answer || "응답을 가져오지 못했어요." }]);
        } catch (err) {
            setChatLog(prev => [...prev, { role: 'bot', content: "서버 연결에 실패했습니다. 😢" }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* 우측 하단 플로팅 버튼 */}
            <button onClick={() => setIsOpen(!isOpen)} style={styles.floatingBtn}>
                {isOpen ? '✖' : '🤖'}
            </button>

            {/* 챗봇 창 (보내주신 UI 스타일 적용) */}
            {isOpen && (
                <div style={styles.app}>
                    <header style={styles.header}>🍎 Ani-Buddy 추천봇</header>

                    <div style={styles.log} ref={logRef}>
                        {chatLog.map((msg, i) => (
                            <div key={i} style={{...styles.bubble, ...(msg.role === 'user' ? styles.user : styles.bot)}}>
                                {msg.content}
                            </div>
                        ))}
                        {isLoading && <div style={{...styles.bubble, ...styles.bot}}>...</div>}
                    </div>

                    <div style={styles.inputArea}>
                        <input
                            style={styles.msgInput}
                            type="text"
                            placeholder="질문을 입력하세요."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        />
                        <button style={styles.sendBtn} onClick={sendMessage} disabled={isLoading}>
                            전송
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

const styles = {
    floatingBtn: { position: 'fixed', bottom: '30px', right: '30px', width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#ff6b6b', color: 'white', fontSize: '24px', border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', zIndex: 1001 },
    app: { position: 'fixed', bottom: '100px', right: '30px', width: '380px', height: '600px', background: '#fff', borderRadius: '12px', boxShadow: '0 10px 30px rgba(20,20,50,0.15)', display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 1000 },
    header: { background: '#ff6b6b', color: 'white', padding: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' },
    log: { flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', background: '#f8f9fa' },
    bubble: { maxWidth: '78%', padding: '10px 14px', borderRadius: '12px', lineHeight: '1.45', fontSize: '0.95rem', wordBreak: 'break-word' },
    user: { alignSelf: 'flex-end', background: '#ff6b6b', color: 'white' },
    bot: { alignSelf: 'flex-start', background: '#f1f3f5', color: '#333' },
    inputArea: { display: 'flex', gap: '8px', padding: '12px', borderTop: '1px solid #eee' },
    msgInput: { flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', outline: 'none' },
    sendBtn: { background: '#ff6b6b', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }
};

export default AnimeChat;