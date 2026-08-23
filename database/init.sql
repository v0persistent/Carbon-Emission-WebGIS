-- ============================================================
-- Carbon Emission WebGIS — 数据库初始化脚本
-- 在 PostgreSQL 容器首次启动时自动执行
-- ============================================================

-- 启用 pg_trgm 扩展（城市名称模糊匹配）
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================================
-- 1. 城市基础信息表
-- ============================================================
CREATE TABLE city (
    id          BIGSERIAL PRIMARY KEY,
    province    VARCHAR(50)  NOT NULL,
    city_name   VARCHAR(100) NOT NULL,
    admin_code  VARCHAR(20)  NOT NULL,

    CONSTRAINT uq_city_admin_code UNIQUE (admin_code)
);

-- 城市名称模糊搜索索引
CREATE INDEX idx_city_name_trgm ON city USING gin (city_name gin_trgm_ops);
CREATE INDEX idx_city_province ON city (province);

-- ============================================================
-- 2. 城市碳排放数据表（按年份）
-- ============================================================
CREATE TABLE city_emission (
    id                  BIGSERIAL PRIMARY KEY,
    city_id             BIGINT          NOT NULL REFERENCES city(id),
    year                SMALLINT        NOT NULL CHECK (year BETWEEN 2000 AND 2100),

    -- 行业排放
    agriculture         DOUBLE PRECISION,
    service             DOUBLE PRECISION,
    industry            DOUBLE PRECISION,
    residential         DOUBLE PRECISION,
    transport           DOUBLE PRECISION,
    energy              DOUBLE PRECISION,

    -- 范围排放
    indirect_emission   DOUBLE PRECISION,
    direct_emission     DOUBLE PRECISION,
    total_emission      DOUBLE PRECISION,

    -- 强度指标
    per_capita_emission DOUBLE PRECISION,
    co2_per_gdp         DOUBLE PRECISION,
    gdp                 DOUBLE PRECISION,

    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_city_year UNIQUE (city_id, year)
);

-- 按年份查询（最常用的查询）
CREATE INDEX idx_emission_year ON city_emission (year);

-- 按城市查多年数据
CREATE INDEX idx_emission_city_id ON city_emission (city_id);

-- ============================================================
-- 3. 用户表
-- ============================================================
CREATE TABLE app_user (
    id              BIGSERIAL PRIMARY KEY,
    username        VARCHAR(50)  NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    display_name    VARCHAR(100),
    role            VARCHAR(20)  NOT NULL DEFAULT 'USER',
    enabled         BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 预置管理员账号 admin / 123456（bcrypt 哈希）
INSERT INTO app_user (username, password_hash, display_name, role)
VALUES ('admin', '$2b$10$YgASEKPg65MTmqgEJgbU9uSJUBsHy5qkzcfOS1FKdyXzLkrnm7QBm', 'Administrator', 'ADMIN');
