const filePaths =  {{ files }};
let messages = {};
Object.keys(filePaths).forEach(lang => {
    messages[lang] = {};
    filePaths[lang].forEach(path => {
        Object.assign(messages[lang], require(`${path}`));
    });
});
Object.keys(messages).forEach((lang)=>{
    Object.assign(messages[lang] , require(`./element-locale/${lang}.js`).default);
});
export default messages;