const path = require('path');
const fs = require('fs');

const gloabPj = path.resolve(process.cwd(), 'package.json');
const treePj = path.resolve(__dirname, 'package.json');
const gf = fs.readFileSync(gloabPj, 'utf-8');
const tf = fs.readFileSync(treePj, 'utf-8');
const { dependencies } = JSON.parse(tf);
const outFile = Object.assign(JSON.parse(gf).dependencies, dependencies);
fs.writeFileSync(gloabPj, JSON.stringify(Object.assign({}, JSON.parse(gf), { dependencies: outFile }), null, 3), 'utf-8');
