const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const readDataDir = 'd:\\cursor_data\\vue-ol-map1\\read_data';
const outputDir = 'd:\\cursor_data\\vue-ol-map1\\vue-ol-map-js\\public\\data';

const targetProperties = [
    '省份', '城市名称', '农业', '服务业', '工业', '生活', '交通', '能源',
    '间接排放', '直接排放', '总排放', '人均排放', '单位总GDP二氧化碳排放', 'GDP'
];

const chineseCharRegex = /[\u4e00-\u9fa5]/;

function extractChinesePart(text) {
    if (!text || typeof text !== 'string') return '';
    const parts = text.split(/[\r\n]+/);
    for (const part of parts) {
        if (chineseCharRegex.test(part)) {
            return part.trim();
        }
    }
    return text.trim();
}

function convertExcelToJson(filePath, year) {
    const workbook = XLSX.readFile(filePath, { codepage: 936 });
    const mergedData = {};
    
    const targetSheetNames = ['二氧化碳', '社会经济', '数据'];
    
    for (const sheetName of workbook.SheetNames) {
        const lowerSheetName = String(sheetName).toLowerCase();
        let isDataSheet = false;
        for (const target of targetSheetNames) {
            if (lowerSheetName.includes(target.toLowerCase())) {
                isDataSheet = true;
                break;
            }
        }
        if (!isDataSheet) {
            if (workbook.SheetNames.length > 3) {
                continue;
            }
        }
        
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });
        
        if (jsonData.length < 2) continue;
        
        const headerRow = jsonData[0];
        const headerKeys = Object.keys(headerRow);
        
        if (headerKeys.length < 3) continue;
        
        const propertyMap = {};
        
        for (const targetProp of targetProperties) {
            for (const key of headerKeys) {
                const chinesePart = extractChinesePart(key);
                if (chinesePart.includes(targetProp) || targetProp.includes(chinesePart)) {
                    propertyMap[targetProp] = key;
                    break;
                }
            }
        }
        
        for (let i = 1; i < jsonData.length; i++) {
            const row = jsonData[i];
            const cityNameKey = propertyMap['城市名称'] || headerKeys[1];
            const cityName = row[cityNameKey];
            
            if (!cityName || typeof cityName !== 'string') continue;
            
            const cityKey = cityName.trim();
            if (!cityKey || cityKey.length < 2) continue;
            
            if (!mergedData[cityKey]) {
                mergedData[cityKey] = {
                    '省份': null, '城市名称': cityKey, '农业': null, '服务业': null,
                    '工业': null, '生活': null, '交通': null, '能源': null,
                    '间接排放': null, '直接排放': null, '总排放': null,
                    '人均排放': null, '单位总GDP二氧化碳排放': null, 'GDP': null
                };
            }
            
            for (const targetProp of targetProperties) {
                const sourceKey = propertyMap[targetProp];
                if (sourceKey !== undefined && row[sourceKey] !== undefined && row[sourceKey] !== null) {
                    let value = row[sourceKey];
                    if (typeof value === 'string') {
                        value = value.trim().replace(/,/g, '');
                        const numValue = parseFloat(value);
                        if (!isNaN(numValue)) {
                            value = numValue;
                        }
                    }
                    if (value !== null && value !== undefined && value !== '' && value !== NaN) {
                        mergedData[cityKey][targetProp] = value;
                    }
                }
            }
        }
    }
    
    return Object.values(mergedData).filter(item => {
        return item['工业'] !== null || item['总排放'] !== null;
    });
}

function main() {
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const files = fs.readdirSync(readDataDir).filter(file => file.endsWith('.xlsx'));
    
    for (const file of files) {
        const match = file.match(/(\d{4})/);
        if (!match) continue;
        
        const year = match[1];
        const filePath = path.join(readDataDir, file);
        
        console.log(`Processing: ${file} (Year: ${year})`);
        
        try {
            const data = convertExcelToJson(filePath, year);
            const outputPath = path.join(outputDir, `co2emissions_${year}.json`);
            fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), { encoding: 'utf8' });
            console.log(`Successfully generated: ${outputPath} (${data.length} records)`);
        } catch (error) {
            console.error(`Error processing ${file}:`, error.message);
        }
    }
    
    console.log('Conversion completed!');
}

main();