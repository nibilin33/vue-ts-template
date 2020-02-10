const args = require('./parse')(process.argv);

module.exports = function getConfig(userMode) {
    const mode = userMode ? userMode : args.mode || 'pc';
    const modeFile = require(`./modes/${mode}`);
    return {
        mode,
        modeFile,
    };
}
