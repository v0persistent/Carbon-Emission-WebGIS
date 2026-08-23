package com.co2emission.repository;

import com.co2emission.entity.CityEmission;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CityEmissionRepository extends JpaRepository<CityEmission, Long> {

    @EntityGraph(attributePaths = "city")
    List<CityEmission> findByYear(Short year);
}
