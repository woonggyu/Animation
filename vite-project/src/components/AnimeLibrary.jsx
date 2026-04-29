import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AnimeChat from './AnimeChat'; // 챗봇 컴포넌트 임포트

const AnimeLibrary = () => {
    const [animes, setAnimes] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState("전체");
    const [sortBy, setSortBy] = useState("none");
    const [searchTerm, setSearchTerm] = useState("");

    // 한글화된 DB 데이터에 맞춰 value값도 한글로 설정
    const genres = [
        { label: "전체", value: "전체" },
        { label: "🔥 액션", value: "액션" },
        { label: "🪄 판타지", value: "판타지" },
        { label: "💖 로맨스", value: "로맨스" },
        { label: "🤣 코미디", value: "코미디" },
        { label: "🎭 드라마", value: "드라마" },
        { label: "🚀 SF", value: "SF" },
        { label: "🏆 수상작", value: "수상작" },
        { label: "🕵️ 미스터리", value: "미스터리" },
        { label: "👻 초자연", value: "초자연" },
        { label: "🌿 일상", value: "일상" }
    ];

    useEffect(() => {
        const fetchAnimes = async () => {
            try {
                // 백엔드 엔드포인트 호출
                const url = `http://localhost:8080/api/anime/library?genre=${selectedGenre}&sortBy=${sortBy}`;
                const res = await axios.get(url);
                setAnimes(res.data);
            } catch (err) {
                console.error("데이터 로딩 실패", err);
            }
        };
        fetchAnimes();
    }, [selectedGenre, sortBy]);

    // 클라이언트 측 검색 필터링
    const filteredAnimes = animes.filter(anime =>
        anime.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={styles.container}>
            {/* 헤더 섹션 */}
            <header style={styles.header}>
                <h1 style={styles.title}>📚 애니메이션 도감</h1>
                <p style={styles.subtitle}>전 세계 인기 애니메이션 TOP {animes.length}</p>
            </header>

            {/* 컨트롤 섹션 (검색, 장르필터, 정렬) */}
            <div style={styles.controlBox}>
                <input
                    style={styles.searchInput}
                    placeholder="애니 제목을 검색하세요..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div style={styles.filterGroup}>
                    {genres.map((g) => (
                        <button
                            key={g.value}
                            onClick={() => setSelectedGenre(g.value)}
                            style={selectedGenre === g.value ? styles.activeBtn : styles.btn}
                        >
                            {g.label}
                        </button>
                    ))}
                </div>

                <div style={styles.sortGroup}>
                    <button
                        onClick={() => setSortBy(sortBy === "score" ? "none" : "score")}
                        style={sortBy === "score" ? styles.activeSort : styles.sortBtn}
                    >
                        {sortBy === "score" ? "✅ 평점 높은 순" : "⭐ 평점순 보기"}
                    </button>
                </div>
            </div>

            {/* 그리드 섹션 (카드 리스트) */}
            <div style={styles.grid}>
                {filteredAnimes.length > 0 ? (
                    filteredAnimes.map(anime => (
                        <div key={anime.id} style={styles.card}>
                            {/* 랭킹 뱃지 */}
                            {anime.ranking > 0 && (
                                <div style={{
                                    ...styles.rankBadge,
                                    backgroundColor: anime.ranking === 1 ? '#FFD700' :
                                        anime.ranking === 2 ? '#C0C0C0' :
                                            anime.ranking === 3 ? '#CD7F32' : 'rgba(0,0,0,0.5)'
                                }}>
                                    Rank {anime.ranking}
                                </div>
                            )}

                            {/* 평점 뱃지 */}
                            {anime.score > 0 && (
                                <div style={styles.ratingBadge}>
                                    ★ {anime.score.toFixed(1)}
                                </div>
                            )}

                            <div style={styles.imgWrapper}>
                                <img src={anime.imageUrl} alt={anime.title} style={styles.img} />
                            </div>

                            <div style={styles.cardBody}>
                                <h3 style={styles.cardTitle}>{anime.title}</h3>
                                <div style={styles.tagWrapper}>
                                    {/* 콤마나 슬래시로 구분된 장르를 태그로 분리 */}
                                    {anime.genre?.split(/[/,]/).map((tag, i) => (
                                        <span key={i} style={styles.genreTag}>#{tag.trim()}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={styles.noResult}>검색 결과가 없습니다. 😢</div>
                )}
            </div>

            {/* 챗봇 컴포넌트 추가 */}
            <AnimeChat />
        </div>
    );
};

const styles = {
    container: { padding: '50px 20px', maxWidth: '1100px', margin: '0 auto', fontFamily: "'Noto Sans KR', sans-serif" },
    header: { textAlign: 'center', marginBottom: '40px' },
    title: { fontSize: '2.5rem', fontWeight: '800', color: '#222', marginBottom: '10px' },
    subtitle: { color: '#666', fontSize: '1.1rem', fontWeight: '500' },
    controlBox: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginBottom: '50px' },
    searchInput: { width: '100%', maxWidth: '400px', padding: '15px 25px', borderRadius: '30px', border: '2px solid #eee', outline: 'none', fontSize: '1rem', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' },
    filterGroup: { display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', maxWidth: '900px' },
    sortGroup: { display: 'flex', justifyContent: 'center', marginTop: '10px' },
    btn: { padding: '8px 16px', borderRadius: '20px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', transition: '0.2s', color: '#555', fontSize: '0.9rem' },
    activeBtn: { padding: '8px 16px', borderRadius: '20px', border: 'none', background: '#ff6b6b', color: 'white', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(255,107,107,0.3)', fontSize: '0.9rem' },
    sortBtn: { padding: '8px 20px', borderRadius: '12px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontSize: '0.9rem', color: '#666' },
    activeSort: { padding: '8px 20px', borderRadius: '12px', border: 'none', background: '#ffbb33', color: 'white', fontWeight: 'bold', fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(255,187,51,0.4)' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '30px' },
    card: { position: 'relative', backgroundColor: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.08)', transition: 'transform 0.3s ease' },
    rankBadge: { position: 'absolute', top: '12px', left: '12px', color: 'white', padding: '3px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold', zIndex: 10, boxShadow: '0 2px 6px rgba(0,0,0,0.3)' },
    ratingBadge: { position: 'absolute', top: '12px', right: '12px', backgroundColor: 'rgba(0, 0, 0, 0.6)', color: '#ffbb33', padding: '4px 10px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 'bold', zIndex: 10 },
    imgWrapper: { width: '100%', height: '300px', overflow: 'hidden' },
    img: { width: '100%', height: '100%', objectFit: 'cover' },
    cardBody: { padding: '18px' },
    cardTitle: { fontSize: '1.1rem', fontWeight: 'bold', color: '#333', marginBottom: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    tagWrapper: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
    genreTag: { fontSize: '0.7rem', color: '#4ecdc4', backgroundColor: '#f0fdfc', padding: '4px 9px', borderRadius: '6px', fontWeight: '700' },
    noResult: { gridColumn: '1 / -1', padding: '100px', fontSize: '1.2rem', color: '#999', textAlign: 'center' }
};

export default AnimeLibrary;