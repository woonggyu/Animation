package com.anime.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "anime")
public class Anime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String genre;
    @Column(columnDefinition = "TEXT")
    private String description;
    private String imageUrl;
    private String tags;

    private Double score; // 평점 (예: 9.27)
    private Integer ranking; // 순위 (예: 1)
}
