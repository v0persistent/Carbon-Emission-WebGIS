package com.co2emission.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "city_emission", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"city_id", "year"})
})
public class CityEmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "city_id", nullable = false)
    private City city;

    @Column(nullable = false)
    private Short year;

    // ---- 行业排放 ----
    private Double agriculture;
    private Double service;
    private Double industry;
    private Double residential;
    private Double transport;
    private Double energy;

    // ---- 范围排放 ----
    @Column(name = "indirect_emission")
    private Double indirectEmission;

    @Column(name = "direct_emission")
    private Double directEmission;

    @Column(name = "total_emission")
    private Double totalEmission;

    // ---- 强度指标 ----
    @Column(name = "per_capita_emission")
    private Double perCapitaEmission;

    @Column(name = "co2_per_gdp")
    private Double co2PerGdp;

    private Double gdp;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
