const chalk = require('chalk');
const fse = require('fs-extra');
const { configPath, logSymbols } = require('./constance');
const download = require('download');
// loading 动画库
const ora = require('ora');

/**
 *检查项目配置是否存在
 *
 * @param {*} path
 * @return {*} 
 */
function checkProjectDeploy(path) {
  return new Promise((resolve, reject) => {
    try {
      const hasEntry = fse.pathExistsSync(path + '/index.js');
      const hasConfig = fse.pathExistsSync(path + '/config.js');
      if (hasEntry && hasConfig) {
        resolve(true);
      } else {
        reject(`
        ${hasEntry ? '' : '工程入口文件 index.js 不存在~！'} \n
        ${hasConfig ? '' : '工程配置文件 confg.js 文件不存在~！'}
        `);
      }
    } catch (err) {
      reject(`项目配置文件丢失，${err}`);
    }
  });
}

/**
 * 获取 config 配置文件
 */
function getConfig() {
  return fse.readJSONSync(configPath);
}

/**
 * 设置 config 配置文件
 */
function setConfig(key, value) {
  const jsonConfig = fse.readJSONSync(configPath);
  jsonConfig[key] = value;
  return fse.writeJSONSync(configPath, jsonConfig);
}


/**
 * 退出程序
 * @param {*} message 
 */
function exit(message) {
  console.log(logSymbols.error, chalk.red(message));
  process.exit();
}





/**
 * 克隆模板
 * @param {string} rootPath 项目初始化的路径
 */
async function downloadTemplate(rootPath) {

  // 更新config.json 存入项目rootPath
  const jsonConfig = fse.readJSONSync(configPath);
  jsonConfig.rootPath = rootPath;
  fse.writeJSONSync(configPath, jsonConfig);

  // Spinner 初始设置
  const dlSpinner = ora(chalk.cyan('下载模板...'));

  dlSpinner.start();
  try {
    // 下载模板后解压
    await download(jsonConfig.template, rootPath, { extract: true });
    fse.copySync(`${rootPath}/cli-template-main`, rootPath);
    fse.removeSync(`${rootPath}/cli-template-main`);
  } catch (err) {
    // 下载失败提示
    dlSpinner.text = chalk.red(`下载模板失败, ${err}`);

    dlSpinner.fail();
    process.exit();
  }

  dlSpinner.text = chalk.green(`下载模板成功.`);
  // 下载成功
  dlSpinner.succeed();
}


/**
 * 写入模板配置文件
 * @param {object} answer 模板信息
 * @param {string} filePath 写入文件路径
 */
function writePageConfig(answer, filePath) {
  const configSource = `
module.exports = {
  frame: '${answer.frame}',

  // document.title
  title: '${answer.title || ''}',

  // meta: description
  description: '${answer.description || ''}',

  // meta: keyword
  keyword: '${answer.keyword || ''}',

  // 引入外部js资源
  script: [],

  // 配置代理
  // proxy: {
  //   "/api": {
  //     target: "http://localhost:3000",
  //     pathRewrite: {"^/api" : ""}
  //   }
  // }
}
  `;
  fse.writeFileSync(filePath, configSource);
}

module.exports = {
  checkProjectDeploy,
  getConfig,
  setConfig,
  exit,
  downloadTemplate,
  writePageConfig
};