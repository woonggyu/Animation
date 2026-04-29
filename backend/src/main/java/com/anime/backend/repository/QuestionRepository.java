package com.anime.backend.repository;

import com.anime.backend.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Sort;
import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findAll(Sort sort);
}