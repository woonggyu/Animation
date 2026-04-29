import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommentSection = () => {
    const [comments, setComments] = useState([]);
    const [nickname, setNickname] = useState("");
    const [password, setPassword] = useState("");
    const [content, setContent] = useState("");

    // 1. 초기 로딩 시 댓글 목록 가져오기 (Read)
    const fetchComments = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/comments');
            setComments(response.data);
        } catch (error) {
            console.error("댓글을 불러오는데 실패했습니다.", error);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    // 2. 댓글 등록 (Create)
    const handleCreate = async () => {
        if (!nickname.trim() || !password.trim() || !content.trim()) {
            alert("모든 항목을 입력해주세요!");
            return;
        }

        try {
            await axios.post('http://localhost:8080/api/comments', {
                nickname,
                password,
                content
            });
            // 등록 성공 후 입력창 초기화 및 목록 갱신
            setNickname("");
            setPassword("");
            setContent("");
            fetchComments();
        } catch (error) {
            alert("등록 중 오류가 발생했습니다.");
        }
    };

    // 3. 댓글 삭제 (Delete)
    const handleDelete = async (id) => {
        const inputPw = prompt("삭제 비밀번호를 입력하세요.");
        if (!inputPw) return;

        try {
            // @RequestParam으로 전달하므로 URL 쿼리 파라미터로 보냅니다.
            await axios.delete(`http://localhost:8080/api/comments/${id}?password=${inputPw}`);
            alert("삭제되었습니다.");
            fetchComments();
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert("비밀번호가 일치하지 않습니다.");
            } else {
                alert("삭제 중 오류가 발생했습니다.");
            }
        }
    };

    return (
        <div style={styles.container}>
            {/* 입력 폼 */}
            <div style={styles.inputBox}>
                <div style={styles.infoRow}>
                    <input
                        style={styles.smallInput}
                        placeholder="닉네임"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                    <input
                        style={styles.smallInput}
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <textarea
                    style={styles.textarea}
                    placeholder="매너 있는 댓글은 작성자에게 큰 힘이 됩니다!"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <button onClick={handleCreate} style={styles.submitBtn}>댓글 등록</button>
            </div>

            {/* 댓글 리스트 */}
            <div style={styles.list}>
                {comments.map((c) => (
                    <div key={c.id} style={styles.commentCard}>
                        <div style={styles.cardHeader}>
                            <span style={styles.cardNickname}>{c.nickname}</span>
                            <div style={styles.cardRight}>
                                <span style={styles.cardDate}>
                                    {new Date(c.createdAt).toLocaleString()}
                                </span>
                                <button
                                    style={styles.delBtn}
                                    onClick={() => handleDelete(c.id)}
                                >
                                    삭제
                                </button>
                            </div>
                        </div>
                        <p style={styles.cardContent}>{c.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 스타일 (이전과 동일하게 유지)
const styles = {
    container: { width: '100%', maxWidth: '800px', margin: '0 auto' },
    inputBox: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '12px', border: '1px solid #eee' },
    infoRow: { display: 'flex', gap: '10px' },
    smallInput: { padding: '10px', borderRadius: '6px', border: '1px solid #ddd', flex: 1 },
    textarea: { width: '100%', height: '80px', padding: '12px', borderRadius: '6px', border: '1px solid #ddd', resize: 'none' },
    submitBtn: { padding: '12px', backgroundColor: '#ff6b6b', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
    list: { display: 'flex', flexDirection: 'column', gap: '15px' },
    commentCard: { padding: '15px', borderBottom: '1px solid #eee', textAlign: 'left' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' },
    cardNickname: { fontWeight: 'bold', color: '#333' },
    cardRight: { display: 'flex', gap: '10px', alignItems: 'center' },
    cardDate: { fontSize: '0.8rem', color: '#888' },
    delBtn: { background: 'none', border: 'none', color: '#ff6b6b', fontSize: '0.8rem', cursor: 'pointer' },
    cardContent: { lineHeight: '1.5', color: '#444', whiteSpace: 'pre-wrap' }
};

export default CommentSection;