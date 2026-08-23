package com.co2emission.service;

import com.co2emission.dto.CityEmissionDTO;
import com.co2emission.entity.CityEmission;
import com.co2emission.repository.CityEmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CityEmissionService {

    private final CityEmissionRepository emissionRepository;

    /**
     * 按年份查询所有城市的碳排放数据，返回前端兼容的 DTO 列表
     */
    @Transactional(readOnly = true)
    public List<CityEmissionDTO> getCitiesByYear(int year) {
        List<CityEmission> entities = emissionRepository.findByYear((short) year);
        return entities.stream()
                .map(CityEmissionDTO::fromEntity)
                .toList();
    }
}
