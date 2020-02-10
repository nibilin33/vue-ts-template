const fs = require('fs');
const path = require('path');
const { mode } = require('./config')();
const cssPath = path.join(path.resolve(__dirname, `../dist/${mode}/${mode}`), 'css');
console.log(cssPath);
const extra = require("fs-extra");
const cheerio = require('cheerio');
const chalk = require('chalk');
// 不需要进行查询的文件列表
const excludeFile = ['app.css'];
/**
 * 获取生成目录中的css文件名
 * @param startPath
 * @returns {Array}
 */
function findSync(startPath) {
  const result = [];
  function finder(fullPath) {
    const files = fs.readdirSync(fullPath);
    files.forEach((val, index) => {
      const fPath = path.join(fullPath, val);
      const stats = fs.statSync(fPath);
      // 如果是文件夹则继续查找
      if (stats.isDirectory()) {
        finder(fPath);
      }
      // 如果是CSS文件并且不在exclude列表中
      if (stats.isFile() && path.extname(fPath) == '.css') {
        const fileName = `${val.substring(0, val.indexOf('.'))}.css`;
        if (fileName.indexOf('theme-') > -1) {
          const relativePath = `/ume/${path.posix.join(`${mode}/css`, val)}`;
          result.push(relativePath);
        }
      }
    });
  }
  finder(startPath);
  return result;
}

function extractCss() {
  const reWritePath = path.resolve(__dirname, `../dist/${mode}/index.html`);
  console.log(reWritePath);
  fs.readFile(reWritePath, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }
    const $ = cheerio.load(data);
    const cssUrls = findSync(cssPath);
    console.log(cssUrls);
    $('head').append(`<script>var themeURL = ${JSON.stringify(cssUrls)}</script>`);
    fs.writeFile(reWritePath, $.html(), (err) => {
      if (err) {
        throw err;
      }
      console.log(chalk.cyan('  css theme rewrite complete.\n'));
    });
  });
}
extractCss();

setTimeout(()=>{
    extra.copy(path.resolve(__dirname, `../dist`),
        path.resolve(__dirname, `../server/dist`),
        function (err) {
        if (err) return console.error(err)
        console.log('success!');
    });
},200);
