package com.anime.backend.controller;

import com.anime.backend.entity.Anime;
import com.anime.backend.service.AnimeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/anime")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class AnimeController {
    private final AnimeService animeService;

    // 허용되는 문자 패턴 (한글, 영어, 공백, 하이픈만 허용)
    private static final Pattern ALLOWED_CHARACTERS = Pattern.compile("^[a-zA-Z가-힣\\s\\-]*$");
    // 허용되는 정렬 키워드 화이트리스트
    private static final List<String> ALLOWED_SORTS = List.of("score", "rank", "none");

    @GetMapping("/library")
    public ResponseEntity<?> getLibrary(
            @RequestParam(required = false) String genre,
            @RequestParam(required = false, defaultValue = "none") String sortBy // 정렬 파라미터 추가
    ) {
        System.out.println("DEBUG: Library request [Genre: " + genre + ", Sort: " + sortBy + "]");

        // 1. 장르 파라미터 보안 및 유효성 검사
        if (genre != null && !genre.trim().isEmpty() && !genre.equals("전체")) {
            if (genre.length() > 20 || !ALLOWED_CHARACTERS.matcher(genre).matches()) {
                return ResponseEntity.badRequest().body("잘못된 요청입니다.");
            }
        }

        // 2. 정렬 파라미터 보안 검사 (화이트리스트에 없는 값이 오면 none으로 고정)
        String finalSortBy = ALLOWED_SORTS.contains(sortBy) ? sortBy : "none";

        // 3. 데이터 가져오기 (가변 리스트로 변환하여 정렬 가능하게 함)
        List<Anime> animes;
        if (genre == null || genre.trim().isEmpty() || genre.equals("전체")) {
            animes = new ArrayList<>(animeService.getAllAnime());
        } else {
            animes = new ArrayList<>(animeService.getAnimesByGenre(sanitize(genre)));
        }

        // 4. 정렬 로직 적용
        if ("score".equals(finalSortBy)) {
            // 평점 높은 순 (내림차순), null인 경우 0.0 처리
            animes.sort(Comparator.comparing(Anime::getScore, Comparator.nullsLast(Comparator.reverseOrder())));
        } else if ("rank".equals(finalSortBy)) {
            // 순위 낮은 순 (오름차순, 1위가 먼저), null인 경우 뒤로 보냄
            animes.sort(Comparator.comparing(Anime::getRanking, Comparator.nullsLast(Comparator.naturalOrder())));
        }

        return ResponseEntity.ok(animes);
    }

    @PostMapping("/recommend")
    public ResponseEntity<List<Anime>> recommend(@RequestBody Map<String, List<String>> body) {
        List<String> answers = body.get("answers");
        List<String> safeAnswers = answers.stream()
                .map(this::sanitize)
                .toList();

        return ResponseEntity.ok(animeService.recommendAnime(safeAnswers));
    }

    private String sanitize(String input) {
        if (input == null) return null;
        return input.replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll("\"", "&quot;")
                .replaceAll("'", "&#x27;");
    }
}