/*
 * @Autor: ylhuang
 * @Date: 2019-11-22 10:24:12
 * @LastEditTime: 2019-12-31 10:06:30
 */
/* button: border-radius: 4
normal height:28 padding:10 4
big height:40 padding:20 10
large height: 48
input,select border-radius: 4
height: 40px;
dialog:
header:
font-size:12px ;text-align: left;
border-bottom: 1px solid e2edef;

var.scss
@cell-line-height: 40px;
@cell-vertical-padding: 20px;
@cell-horizontal-padding: 30px;
 */

const fs = require('fs');
const path = require('path');

const getThemeEntry = (mode) => {
    const { modeFile } = require('./config')(mode);
    let entry = {};
    const files = fs.readdirSync(modeFile.themePath);
    files.forEach(file => {
        //拼接获取绝对路径，fs.stat(绝对路径,回调函数)
        let fPath = path.join(modeFile.themePath, file);
        const stat = fs.statSync(fPath);
        if (stat.isFile()) {
            console.log(file.indexOf('theme-'),file);
            if(file.endsWith('.css') && file.indexOf('theme-') > -1){
                entry[file.split('.')[0]] = fPath;
            }
        }
    });
    return entry;
}
module.exports = getThemeEntry;