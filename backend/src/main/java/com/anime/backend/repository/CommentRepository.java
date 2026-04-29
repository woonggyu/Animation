package com.anime.backend.repository;

import com.anime.backend.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    // 최신순 정렬을 위해 ID 역순으로 조회
    List<Comment> findAllByOrderByIdDesc();
}