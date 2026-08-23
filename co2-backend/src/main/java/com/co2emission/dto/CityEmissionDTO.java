package com.co2emission.dto;

import com.co2emission.entity.CityEmission;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

/**
 * 城市碳排放数据 DTO，输出 JSON 键名与 db.json 完全一致，
 * 确保前端 co2DataService.js 无需任何修改。
 */
@Data
public class CityEmissionDTO {

    @JsonProperty("省份")
    private String province;

    @JsonProperty("城市名称")
    private String cityName;

    @JsonProperty("区划码")
    private String adminCode;

    // ---- 行业排放 ----
    @JsonProperty("农业")
    private Double agriculture;

    @JsonProperty("服务业")
    private Double service;

    @JsonProperty("工业")
    private Double industry;

    @JsonProperty("生活")
    private Double residential;

    @JsonProperty("交通")
    private Double transport;

    @JsonProperty("能源")
    private Double energy;

    // ---- 范围排放 ----
    @JsonProperty("间接排放")
    private Double indirectEmission;

    @JsonProperty("直接排放")
    private Double directEmission;

    @JsonProperty("总排放")
    private Double totalEmission;

    // ---- 强度指标 ----
    @JsonProperty("人均排放")
    private Double perCapitaEmission;

    @JsonProperty("单位总GDP二氧化碳排放")
    private Double co2PerGdp;

    @JsonProperty("GDP")
    private Double gdp;

    /**
     * 从 CityEmission 实体 + 关联的 City 实体转换为前端兼容的 DTO
     */
    public static CityEmissionDTO fromEntity(CityEmission e) {
        CityEmissionDTO dto = new CityEmissionDTO();
        dto.province = e.getCity().getProvince();
        dto.cityName = e.getCity().getCityName();
        dto.adminCode = e.getCity().getAdminCode();

        dto.agriculture = e.getAgriculture();
        dto.service = e.getService();
        dto.industry = e.getIndustry();
        dto.residential = e.getResidential();
        dto.transport = e.getTransport();
        dto.energy = e.getEnergy();

        dto.indirectEmission = e.getIndirectEmission();
        dto.directEmission = e.getDirectEmission();
        dto.totalEmission = e.getTotalEmission();

        dto.perCapitaEmission = e.getPerCapitaEmission();
        dto.co2PerGdp = e.getCo2PerGdp();
        dto.gdp = e.getGdp();

        return dto;
    }
}
