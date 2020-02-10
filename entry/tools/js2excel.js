const json2xls = require('json2xls');
const fs = require('fs');
const resolve = require('../utils');
let jsonArr = [];
const langList = ['zh','en'];
const allLang ={};
langList.forEach((lang) => {
    allLang[lang] = JSON.parse(fs.readFileSync(`${resolve(`/tools/data-${lang}.json`)}`).toString());
});
Object.keys(allLang.zh).forEach((name) => {
    let ob = {key: name};
    langList.forEach((flag) => {
        ob[flag] = allLang[flag][name];
    });
    jsonArr.push(ob);
});
const xls = json2xls(jsonArr);
fs.writeFileSync(resolve('/tools/i18n.xlsx'), xls, 'binary');