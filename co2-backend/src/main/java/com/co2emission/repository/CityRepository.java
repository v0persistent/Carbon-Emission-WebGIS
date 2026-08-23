package com.co2emission.repository;

import com.co2emission.entity.City;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CityRepository extends JpaRepository<City, Long> {
    Optional<City> findByAdminCode(String adminCode);
}
