const transformFilePaths = [{
    path: '/src/api/meeting',
    filename: 'index',
    fileEnd:'js',
},
{
    path: '/src/views/login',
    filename: 'meeting',
    fileEnd:'ts',
}];
const args = require('../parse')(process.argv);
const mode = args.bussiness|| 'ume';
const resolve = require('../utils');
const fs = require("fs");

transformFilePaths.forEach((data)=>{
    const filePath = resolve(`..${data.path}/${data.filename}.${data.fileEnd}`);
    const targetPath = resolve(`..${data.path}/${data.filename}_${mode}.${data.fileEnd}`);
    const read = fs.readFileSync(targetPath);
    fs.writeFileSync(filePath, read);
    console.log('ennnd');
})