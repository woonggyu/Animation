package com.anime.backend.service;

import com.anime.backend.entity.Anime;
import com.anime.backend.repository.AnimeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AnimeDataService implements ApplicationRunner {

    private final AnimeRepository animeRepository;

    // 영어 장르 → 한글 태그 매핑
    private static final Map<String, String> GENRE_MAP = new HashMap<>();
    static {
        GENRE_MAP.put("Action", "액션");
        GENRE_MAP.put("Adventure", "모험");
        GENRE_MAP.put("Comedy", "코미디");
        GENRE_MAP.put("Drama", "드라마");
        GENRE_MAP.put("Fantasy", "판타지");
        GENRE_MAP.put("Horror", "공포");
        GENRE_MAP.put("Mystery", "미스터리");
        GENRE_MAP.put("Romance", "로맨스");
        GENRE_MAP.put("Sci-Fi", "SF");
        GENRE_MAP.put("Slice of Life", "일상");
        GENRE_MAP.put("Sports", "스포츠");
        GENRE_MAP.put("Supernatural", "초자연");
        GENRE_MAP.put("Thriller", "스릴러");
        GENRE_MAP.put("Suspense", "긴장감");
        GENRE_MAP.put("Award Winning", "수상작");
        GENRE_MAP.put("Ecchi", "에치");
        GENRE_MAP.put("Isekai", "이세계");
        GENRE_MAP.put("Mecha", "로봇");
        GENRE_MAP.put("Music", "음악");
        GENRE_MAP.put("Psychological", "심리");
        GENRE_MAP.put("Historical", "역사");
        GENRE_MAP.put("Military", "전쟁");
        GENRE_MAP.put("School", "학교");
        GENRE_MAP.put("Shounen", "소년");
        GENRE_MAP.put("Shoujo", "소녀");
        GENRE_MAP.put("Seinen", "성인");
        GENRE_MAP.put("Josei", "여성");
        GENRE_MAP.put("Kids", "어린이");
        GENRE_MAP.put("Racing", "레이스");
        GENRE_MAP.put("Samurai", "사무라이");
        GENRE_MAP.put("Space", "우주");
        GENRE_MAP.put("Survival", "생존");
        GENRE_MAP.put("Time Travel", "타임슬립");
        GENRE_MAP.put("Vampire", "뱀파이어");
        GENRE_MAP.put("Gore", "잔혹");
        GENRE_MAP.put("Parody", "패러디");
        GENRE_MAP.put("Gag Humor", "개그");
        GENRE_MAP.put("Strategy Game", "전략");
        GENRE_MAP.put("Medical", "의학");
        GENRE_MAP.put("Super Power", "초능력");
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        // 이미 데이터가 있으면 실행하지 않음 (단, 기존 데이터에 score가 없는 경우를 위해
        // 처음 세팅 시에는 DB를 비우고 다시 실행하는 것을 추천합니다)
        if (animeRepository.count() > 0) return;

        RestTemplate restTemplate = new RestTemplate();

        for (int page = 1; page <= 4; page++) {
            String url = "https://api.jikan.moe/v4/top/anime?limit=25&page=" + page;
            String response = restTemplate.getForObject(url, String.class);

            JSONObject json = new JSONObject(response);
            JSONArray data = json.getJSONArray("data");

            for (int i = 0; i < data.length(); i++) {
                JSONObject item = data.getJSONObject(i);
                Anime anime = new Anime();

                // 제목 설정
                anime.setTitle(item.optString("title_english", item.optString("title")));

                // [추가] 평점 및 순위 데이터 추출
                // API의 필드명은 'score'와 'rank'입니다.
                double score = item.optDouble("score", 0.0);
                int rank = item.optInt("rank", 0);

                anime.setScore(score);   // Anime 엔티티의 setScore 호출
                anime.setRanking(rank);  // Anime 엔티티의 setRanking 호출

                // 설명 (최대 500자 제한)
                String synopsis = item.optString("synopsis", "");
                anime.setDescription(synopsis.length() > 500 ? synopsis.substring(0, 500) : synopsis);

                // 이미지 주소
                anime.setImageUrl(item.getJSONObject("images")
                        .getJSONObject("jpg").optString("large_image_url"));

                // 장르 및 태그 처리 로직 (기존 유지)
                JSONArray genres = item.optJSONArray("genres");
                JSONArray themes = item.optJSONArray("themes");
                StringBuilder genreStr = new StringBuilder();
                StringBuilder tagStr = new StringBuilder();

                processGenresAndThemes(genres, themes, genreStr, tagStr);

                anime.setGenre(genreStr.toString());
                anime.setTags(tagStr.toString());

                animeRepository.save(anime);
            }

            Thread.sleep(1000); // API 레이트 리밋 방지
            System.out.println(page + "페이지 데이터 저장 중... (Score/Rank 포함)");
        }
        System.out.println("애니 100개 및 평점/순위 데이터 저장 완료!");
    }

    // 가독성을 위해 장르 처리 로직을 별도 메소드로 분리하면 좋습니다 (선택사항)
    private void processGenresAndThemes(JSONArray genres, JSONArray themes, StringBuilder genreStr, StringBuilder tagStr) {
        if (genres != null) {
            for (int j = 0; j < genres.length(); j++) {
                String name = genres.getJSONObject(j).optString("name");
                if (genreStr.length() > 0) genreStr.append(", ");
                genreStr.append(name);
                String kor = GENRE_MAP.getOrDefault(name, name);
                if (tagStr.length() > 0) tagStr.append(",");
                tagStr.append(kor);
            }
        }
        if (themes != null) {
            for (int j = 0; j < themes.length(); j++) {
                String name = themes.getJSONObject(j).optString("name");
                String kor = GENRE_MAP.getOrDefault(name, name);
                if (tagStr.length() > 0) tagStr.append(",");
                tagStr.append(kor);
            }
        }
    }
}