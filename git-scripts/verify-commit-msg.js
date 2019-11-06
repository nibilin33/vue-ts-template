const msgPath =require('path').join('../', process.env.GIT_PARAMS);
const msg = require('fs').readFileSync(msgPath, 'utf-8').trim();

const commitRE = /^(revert: )?(feat|fix|polish|docs|style|refactor|perf|test|workflow|ci|chore|types|build)(\(.+\))?: .{1,50}/;

if (!commitRE.test(msg)) {
  console.log('提交代码信息不符合规范');
  process.exit(1)
}
process.exit(0);