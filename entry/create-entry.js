const args = require('./parse')(process.argv);
const path = require('path');
const mode = args.mode || 'pc';
const modeFile = require(`./${mode}`);
const fs = require('fs');
let outPut = {};
function readDirs(cpath,lang) {
    fs.readdir(cpath, (err, files) => {
        if (err) throw err
        files.forEach(file => {
            //拼接获取绝对路径，fs.stat(绝对路径,回调函数)
            let fPath = path.join(cpath, file);
            fs.stat(fPath, (err, stat) => {
                if (stat.isFile()) {
                    if(file.endsWith('.json')){
                        const data = fs.readFileSync(fPath);
                        const jslang = JSON.parse(data);
                        outPut[lang]={...outPut[lang],...jslang};
                    }
                }
                else {
                    readDirs(fPath,path.basename(fPath));
                }
            })
            
        }); 
    });

}
fs.writeFile(modeFile.routerPath,modeFile.router,(error)=>{
    console.log(error);
});
fs.writeFile(modeFile.mainPath,modeFile.main,(error)=>{
    console.log(error);
});
readDirs(modeFile.i18nDir);
function writeConfig() {
    if(Object.keys(outPut).length> 0) {
        fs.writeFile(modeFile.i18nPath,`${JSON.stringify(outPut)}`,(error)=>{
            console.log(error);
        });
        return;
    }
    setTimeout(()=>{
        writeConfig();
    },100);

}
writeConfig();
