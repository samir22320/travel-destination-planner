package com.samir.travelplanner.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
@Entity
@Table(
        name = "destinations",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "countryCode")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Destination {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String countryCode;

    @Column(nullable = false)
    private String countryName;

    private String capital;

    private String region;

    private Long population;

    private String currencyCode;

    private String currencyName;

    private String flagUrl;

    @Column(nullable = false)
    private Boolean approved;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}