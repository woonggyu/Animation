package com.anime.backend.controller;

import com.anime.backend.entity.Comment;
import com.anime.backend.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor // Autowired 대신 생성자 주입 권장
public class CommentController {

    private final CommentRepository commentRepository;

    // 1. 모든 댓글 조회 (최신순)
    @GetMapping
    public List<Comment> getComments() {
        return commentRepository.findAllByOrderByIdDesc();
    }

    // 2. 댓글 등록 (XSS 방어 적용)
    @PostMapping
    public ResponseEntity<Comment> saveComment(@RequestBody Comment comment) {
        // 입력값 유효성 검사
        if (comment.getContent() == null || comment.getContent().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // XSS 방어: 내용과 닉네임에서 HTML 태그 제거 및 이스케이프
        comment.setContent(sanitize(comment.getContent()));
        comment.setNickname(sanitize(comment.getNickname()));

        // 비밀번호 길이 제한 (최소한의 보안)
        if (comment.getPassword() == null || comment.getPassword().length() < 4) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

        return ResponseEntity.ok(commentRepository.save(comment));
    }

    // 3. 댓글 삭제 (비밀번호 검증 및 보안 강화)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable Long id, @RequestParam String password) {
        return commentRepository.findById(id)
                .map(comment -> {
                    // Constant-time 비교는 아니더라도 최소한 null 체크 포함
                    if (comment.getPassword() != null && comment.getPassword().equals(password)) {
                        commentRepository.delete(comment);
                        return ResponseEntity.ok().build();
                    } else {
                        // 비밀번호 틀릴 시 401 Unauthorized 반환
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 일치하지 않습니다.");
                    }
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // XSS 방어를 위한 단순 정제 메소드
    private String sanitize(String input) {
        if (input == null) return "";
        return input.replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll("\"", "&quot;")
                .replaceAll("'", "&#x27;")
                .replaceAll("&", "&amp;");
    }
}