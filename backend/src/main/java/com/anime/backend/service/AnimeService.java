package com.anime.backend.service;

import com.anime.backend.entity.Anime;
import com.anime.backend.repository.AnimeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnimeService {
    private final AnimeRepository animeRepository;

    public List<Anime> getAllAnime() {
        return animeRepository.findAll();
    }
    // [추가] 장르별 필터링 로직
    public List<Anime> getAnimesByGenre(String genre) {
        // Repository에 findByGenreContaining 메서드가 정의되어 있어야 합니다.
        return animeRepository.findByGenreContainingIgnoreCase(genre);
    }

    public List<Anime> recommendAnime(List<String> answers) {
        List<Anime> allAnime = animeRepository.findAll();

        // 질문별 가중치
        int[] weights = {3, 2, 2, 1, 2};

        Map<Long, Integer> scoreMap = new HashMap<>();

        for (Anime anime : allAnime) {
            int score = 0;
            String tags = anime.getTags() != null ? anime.getTags() : "";

            for (int i = 0; i < answers.size(); i++) {
                String answer = answers.get(i).toLowerCase();
                int weight = i < weights.length ? weights[i] : 1;

                // 분위기
                if (answer.contains("액션") || answer.contains("긴장")) {
                    if (tags.contains("액션") || tags.contains("긴장감")) score += weight * 3;
                }
                if (answer.contains("감동") || answer.contains("드라마")) {
                    if (tags.contains("감동") || tags.contains("드라마")) score += weight * 3;
                }
                if (answer.contains("개그") || answer.contains("코미디")) {
                    if (tags.contains("개그") || tags.contains("코미디")) score += weight * 3;
                }
                if (answer.contains("로맨스")) {
                    if (tags.contains("로맨스")) score += weight * 3;
                }

                // 배경
                if (answer.contains("판타지") || answer.contains("이세계")) {
                    if (tags.contains("판타지")) score += weight * 2;
                }
                if (answer.contains("sf") || answer.contains("미래")) {
                    if (tags.contains("SF")) score += weight * 2;
                }
                if (answer.contains("역사") || answer.contains("시대")) {
                    if (tags.contains("역사")) score += weight * 2;
                }
                if (answer.contains("학교") || answer.contains("현실")) {
                    if (tags.contains("학교") || tags.contains("일상")) score += weight * 2;
                }

                // 주인공 스타일
                if (answer.contains("전사") || answer.contains("강한")) {
                    if (tags.contains("전투") || tags.contains("액션")) score += weight;
                }
                if (answer.contains("천재") || answer.contains("두뇌")) {
                    if (tags.contains("두뇌") || tags.contains("전략")) score += weight * 2;
                }
                if (answer.contains("성장")) {
                    if (tags.contains("성장")) score += weight * 2;
                }
                if (answer.contains("미스터리")) {
                    if (tags.contains("미스터리")) score += weight * 2;
                }

                // 스토리 요소
                if (answer.contains("스토리") || answer.contains("감동")) {
                    if (tags.contains("드라마") || tags.contains("감동")) score += weight;
                }
                if (answer.contains("캐릭터")) {
                    if (tags.contains("우정") || tags.contains("성장")) score += weight;
                }
            }

            scoreMap.put(anime.getId(), score);
        }

        // TOP 3 반환
        return allAnime.stream()
                .sorted((a, b) -> scoreMap.getOrDefault(b.getId(), 0)
                        - scoreMap.getOrDefault(a.getId(), 0))
                .limit(3)
                .collect(Collectors.toList());
    }
}