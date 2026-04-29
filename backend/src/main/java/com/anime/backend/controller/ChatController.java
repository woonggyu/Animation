package com.anime.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ChatController {

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chatWithAI(@RequestBody Map<String, String> request) {
        // 1. 요청 데이터 널 체크
        String userMessage = request.get("message");
        if (userMessage == null || userMessage.trim().isEmpty()) {
            Map<String, String> badRequest = new HashMap<>();
            badRequest.put("answer", "메시지를 입력해주세요.");
            return ResponseEntity.badRequest().body(badRequest);
        }

        String flaskUrl = "http://localhost:5000/chat";
        RestTemplate restTemplate = new RestTemplate();

        Map<String, String> flaskRequest = new HashMap<>();
        flaskRequest.put("message", userMessage);

        try {
            // 2. 제네릭 타입 경고 해결 (ParameterizedTypeReference 사용)
            ResponseEntity<Map<String, Object>> responseEntity = restTemplate.exchange(
                    flaskUrl,
                    HttpMethod.POST,
                    new HttpEntity<>(flaskRequest),
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );

            Map<String, Object> response = responseEntity.getBody();

            // 3. NullPointerException 방지 (Optional 사용)
            String answer = Optional.ofNullable(response)
                    .map(res -> (String) res.get("answer"))
                    .orElse("Flask 서버로부터 응답을 받지 못했습니다.");

            Map<String, String> result = new HashMap<>();
            result.put("answer", answer);

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            Map<String, String> errorResult = new HashMap<>();
            errorResult.put("answer", "서버가 부끄러움을 타나 봐요. 잠시 후 다시 시도해 주세요! 🤖");
            return ResponseEntity.status(500).body(errorResult);
        }
    }
}