const resolve = require('../utils');
const filePath = resolve('../');
module.exports = {
    login:`${filePath}/src/views/login/base.ts`,
    router:`${filePath}/src/router/index.ts`,
    main:`${filePath}/src/main.ts`,
    i18nDir:`${filePath}/src/i18n/lang`,
    i18nPath:`${filePath}/src/i18n/config.js`,
    i18nNum:2,
    themePath: `${filePath}/src/assets/themes`,
	tip:`${filePath}/src/api/tip.ts`,
    loading:`${filePath}/src/api/loading.ts`,
}