const { renderTemplateFile } = require('template-file');
const resolve = require('./utils');
const templatePath = resolve('./template/config.js');
const fs = require('fs');
const path = require('path');
let { modeFile, mode } = require('./config')();
const renderList = ['tip','loading'];
const commonList = ['login','router','main'];
let outPut = {};
console.log(mode, 'genTemplate');
function formatMode() {
    if (mode === 'reservation') {
        mode = 'pc';
    }
}
formatMode();
function readDirs(cpath,lang) {
    fs.readdir(cpath, (err, files) => {
        if (err) throw err
        files.forEach(file => {
            //拼接获取绝对路径，fs.stat(绝对路径,回调函数)
            let fPath = path.join(cpath, file);
            fs.stat(fPath, (err, stat) => {
                if (stat.isFile()) {
                    if(file.endsWith('.js')){
                        if(!outPut[lang]) {
                            outPut[lang] = [];
                        }
                        outPut[lang].push(fPath.replace(
                            path.resolve(__dirname,'..','src/i18n'),'.')
                            .replace(/[\\]/g,'/'));
                    }
                }
                else {
                    readDirs(fPath,path.basename(fPath));
                }
            })
            
        }); 
    });
}
readDirs(modeFile.i18nDir);
module.exports = function genTemplate() {
    setTimeout(()=>{
        renderTemplateFile(templatePath, {files:JSON.stringify(outPut)})
        .then(renderedString => {
            fs.writeFile(modeFile.i18nPath, renderedString, "utf8",(error)=>{
                console.log(error);
            });
        }      
    )
    },200);
    renderList.forEach((name) => {
        renderTemplateFile(resolve(`./template/${mode}-${name}.ts`), {...modeFile})
        .then(renderedString => {
            fs.writeFile(modeFile[name], renderedString, "utf8",(error)=>{
                console.log(error);
            });
    });
    });
    commonList.forEach((name) => {
        renderTemplateFile(resolve(`./template/${name}.ts`), {...modeFile})
        .then(renderedString => {
            fs.writeFile(modeFile[name], renderedString, "utf8",(error)=>{
                console.log(error);
        });
    });
    });
}
