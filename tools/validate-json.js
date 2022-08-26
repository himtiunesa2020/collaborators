const path = require('path');
const fs = require('fs');

// vars
const jsonPath = getArgs(0);
const withSorting = getArgs(1) === '--with-sort'
const metadataMustExist = {
    "name": "string",
    "name": "string",
    "nim": "string",
    "study_program": "string",
    "github": "string"
};


// funcs
function getArgs(i) {
  const args = process.argv.slice(2)
  return args[i]
}


// tests
function validateJson() {
    try {
        // open json file
        const json = fs.readFileSync(jsonPath, 'utf8');
        // parse json
        const jsonObj = JSON.parse(json);
        // ok
        return true
    } catch (error) {
        console.log("[ERROR] file tidak valid. check kembali file, apakah ada kesalahan seperti kurang tanda {} atau kurang tanda [] atau bahkan koma ,");
        process.exit(1);
    }
}
function validateMetadata() {
    const json = fs.readFileSync(jsonPath, 'utf8');
    const jsonObj = JSON.parse(json);

    // file harus arrays
    if (!Array.isArray(jsonObj)) {
        console.log("[ERROR] file harus berupa array");
        process.exit(1);
    }
    
    for (let i = 0; i < jsonObj.length; i++) {
        // check array
        const element = jsonObj[i];
        if (typeof element !== 'object') {
            console.log("[ERROR] setiap block dalam array harus berisi objek");
            process.exit(1);
        }
        // check metada muest exist
        for (const key in metadataMustExist) {
            if (!element.hasOwnProperty(key)) {
                console.log(`[ERROR] block ke-${i} tidak memiliki metadata ${key}`);
                console.log(element);
                process.exit(1);
            }
        }
        // check metadata types
        for (const key in element) {
            if (element.hasOwnProperty(key)) {
                const type = metadataMustExist[key];
                if (typeof element[key] !== type) {
                    console.log(`[ERROR] metadata ${key} harus berupa ${type}`);
                    process.exit(1);
                }
            }
        }
    }
}
function sort() {
    // open json file
    const json = fs.readFileSync(jsonPath, 'utf8');
    // parse json
    const jsonObj = JSON.parse(json);
    // sort berdasarkan nim
    jsonObj.sort((a, b) => {
        return a.nim.localeCompare(b.nim);
    });
    // write to file
    fs.writeFileSync(jsonPath, JSON.stringify(jsonObj, null, 4));
}

// main
function main() {
    if (withSorting) {
        console.log(`[1/3] Menvalidasi file ${jsonPath}...`);
        validateJson();
        console.log(`[2/3] Menvalidasi metadata...`);
        validateMetadata();
        console.log(`[3/3] Melakukan sorting...`);
        sort();
        console.log(`[DONE] File ${jsonPath} valid dan sudah di sort.`);
    } else {
        console.log(`[1/2] Menvalidasi file ${jsonPath}...`);
        validateJson();
        console.log(`[2/2] Menvalidasi metadata...`);
        validateMetadata();
        console.log(`[DONE] File ${jsonPath} valid.`);
    }
}
main();