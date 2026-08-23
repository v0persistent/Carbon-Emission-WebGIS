package com.co2emission.controller;

import com.co2emission.dto.ApiResponse;
import com.co2emission.dto.CityEmissionDTO;
import com.co2emission.service.CityEmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CityEmissionController {

    private final CityEmissionService cityEmissionService;

    /**
     * 获取指定年份所有城市的碳排放数据。
     * 响应 JSON 结构与原 json-server 的 db.json 完全一致。
     */
    @GetMapping("/cities/{year}")
    public ApiResponse<List<CityEmissionDTO>> getCitiesByYear(@PathVariable int year) {
        List<CityEmissionDTO> data = cityEmissionService.getCitiesByYear(year);
        return ApiResponse.success(data);
    }
}
