// ============================================================
// db.json → PostgreSQL 数据导入脚本
// 用法: DB_PASSWORD=xxx node import_dbjson.js
// ============================================================

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// ---- 字段映射：db.json 中文键 → city_emission 英文列名 ----
const FIELD_MAP = {
  '农业':     'agriculture',
  '服务业':   'service',
  '工业':     'industry',
  '生活':     'residential',
  '交通':     'transport',
  '能源':     'energy',
  '间接排放': 'indirect_emission',
  '直接排放': 'direct_emission',
  '总排放':   'total_emission',
  '人均排放': 'per_capita_emission',
  '单位总GDP二氧化碳排放': 'co2_per_gdp',
  'GDP':      'gdp',
};

const EMISSION_FIELDS = Object.keys(FIELD_MAP);
const EMISSION_COLS  = Object.values(FIELD_MAP);

const YEARS = ['2005', '2010', '2015', '2020'];

// ---- 读取 db.json ----
const dbJsonPath = path.resolve(__dirname, '../vue-ol-map-js/backend/db.json');
const db = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8'));

async function migrate() {
  const client = new Client({
    host:     process.env.DB_HOST || 'localhost',
    port:     parseInt(process.env.DB_PORT || '5433'),
    database: process.env.DB_NAME || 'co2_emission',
    user:     process.env.DB_USER || 'co2app',
    password: process.env.DB_PASSWORD,
  });

  await client.connect();
  console.log('Connected to PostgreSQL');

  try {
    // ---- 1. 提取所有唯一城市（按 区划码 去重） ----
    const cityMap = new Map(); // admin_code → { province, city_name }

    for (const year of YEARS) {
      const records = db[`cities_${year}`] || [];
      for (const r of records) {
        const code = r['区划码'];
        if (!code) continue;
        if (!cityMap.has(code)) {
          cityMap.set(code, {
            province:  r['省份'],
            city_name: r['城市名称'],
          });
        }
      }
    }

    console.log(`Found ${cityMap.size} unique cities`);

    // ---- 2. 插入 city 表 ----
    const insertCitySQL = `
      INSERT INTO city (province, city_name, admin_code)
      VALUES ($1, $2, $3)
      ON CONFLICT (admin_code) DO UPDATE
        SET province = EXCLUDED.province,
            city_name = EXCLUDED.city_name
      RETURNING id, admin_code
    `;

    const adminToId = new Map(); // admin_code → city.id

    for (const [adminCode, info] of cityMap) {
      const res = await client.query(insertCitySQL, [
        info.province, info.city_name, adminCode,
      ]);
      adminToId.set(adminCode, res.rows[0].id);
    }

    console.log(`Inserted/updated ${adminToId.size} cities`);

    // ---- 3. 插入 city_emission 表（按年份） ----
    const insertEmissionSQL = `
      INSERT INTO city_emission (
        city_id, year, ${EMISSION_COLS.join(', ')}
      ) VALUES (
        $1, $2, ${EMISSION_COLS.map((_, i) => '$' + (i + 3)).join(', ')}
      )
      ON CONFLICT (city_id, year) DO NOTHING
    `;

    let totalEmissionRows = 0;

    for (const year of YEARS) {
      const records = db[`cities_${year}`] || [];
      let yearCount = 0;

      for (const r of records) {
        const adminCode = r['区划码'];
        if (!adminCode) continue;

        const cityId = adminToId.get(adminCode);
        if (!cityId) {
          console.warn(`  SKIP: admin_code=${adminCode} not found in city table`);
          continue;
        }

        const values = [
          cityId,
          parseInt(year),
          ...EMISSION_FIELDS.map(f => r[f] ?? null),
        ];

        await client.query(insertEmissionSQL, values);
        yearCount++;
      }

      console.log(`  ${year}: ${yearCount} rows`);
      totalEmissionRows += yearCount;
    }

    console.log(`Total city_emission rows: ${totalEmissionRows}`);

  } finally {
    await client.end();
    console.log('Done.');
  }
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
