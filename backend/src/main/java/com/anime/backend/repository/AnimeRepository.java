package com.anime.backend.repository;

import com.anime.backend.entity.Anime;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnimeRepository extends JpaRepository<Anime, Long> {
    List<Anime> findByGenreContainingIgnoreCase(String genre);
}