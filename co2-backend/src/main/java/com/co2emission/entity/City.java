package com.co2emission.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "city")
public class City {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String province;

    @Column(name = "city_name", nullable = false, length = 100)
    private String cityName;

    @Column(name = "admin_code", nullable = false, length = 20, unique = true)
    private String adminCode;
}
