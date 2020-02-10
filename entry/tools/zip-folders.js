const zipFolder = require('zip-folder');
const folder = process.env.folder || 'pc';
const resolve = require('../utils');
const zipPath = resolve(`../dist/${folder}`);
zipFolder(zipPath, `${zipPath}.zip`, function(err) {
    if(err) {
        console.log('oh no!', err);
    } else {
        console.log('EXCELLENT');
    }
});