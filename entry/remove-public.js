const { mode } = require('./config')();
const fs = require('fs-extra');
const resolve = require('./utils');
console.log(mode);
if (mode !== 'pc') {
    fs.removeSync(resolve(`../dist/${mode}/UE`)); 
}