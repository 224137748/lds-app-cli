const chalk = require('chalk');
const fse = require('fs-extra');
const { configPath, logSymbols } = require('./constance');
const download = require('download');
// loading 动画库
const ora = require('ora');
const { spawn } = require("child_process");

/**
 *检查项目配置是否存在
 *
 * @param {*} path
 * @return {*} 
 */
function checkProjectDeploy(path) {
  return new Promise((resolve, reject) => {
    const extArr = ['/index.js', '/index.jsx', '/index.ts', '/index.tsx'];
    let hasEntry = false;
    for (let i = 0; i < extArr.length; i++) {
      if (fse.pathExistsSync(path + extArr[i])) {
        hasEntry = true;
        break;
      }
    }
    try {
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
  const dlSpinner = ora(chalk.cyan('Start downloading templates...'));

  dlSpinner.start();
  try {
    // 下载模板后解压
    await download(jsonConfig.template, rootPath, { extract: true });
    fse.copySync(`${rootPath}/cli-template-main`, rootPath);
    fse.removeSync(`${rootPath}/cli-template-main`);
  } catch (err) {
    // 下载失败提示
    dlSpinner.text = chalk.red(`Failed to download template, ${err}`);

    dlSpinner.fail();
    process.exit();
  }

  dlSpinner.text = chalk.green(`Download templates successfully!`);
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

  meta: {
    // meta: description
    description: '${answer.description || ''}',
    // meta: keyword
    keyword: '${answer.keyword || ''}',
    // viewport等
  },

  // 配置生产路径，只在打包项目时生效，默认值 /
  publicPath: '/',

  // 配置代理 详情参照 [https://github.com/chimurai/http-proxy-middleware#options]
  // proxy: {
  //   "/api": {
  //     target: "http://findream.vip",
  //     pathRewrite: {"^/api" : "/api/music"},
  //     changeOrigin:true,
  //     secure: true    
  //   }
  // }
}
  `;
  fse.writeFileSync(filePath, configSource);
}

/**
 * 获取入口文件路径
 * @param {*} absolutePath 
 */
function getEntryPath(absolutePath) {
  const extArr = ['/index.js', '/index.jsx', '/index.ts', '/index.tsx'];
  let entryPath = '';
  for (let i = 0; i < extArr.length; i++) {
    if (fse.pathExistsSync(absolutePath + extArr[i])) {
      entryPath = absolutePath + extArr[i];
      break;
    }
  }
  return entryPath;
}


/**
 * 执行命令行
 */


const spawnPromise = async (...args) => {
  return new Promise((resolve, reject) => {
    const proc = spawn(...args);
    proc.stdout.pipe(process.stdout);
    proc.stderr.pipe(process.stderr);

    proc.on("close", () => {
      resolve();
    });
    proc.on('error', (error) => {
      console.log(chalk.red(`安装依赖失败，请进入 ${args[2].cwd || '项目内'} 自行安装`));
      reject(error);
    });
  });
};

module.exports = {
  checkProjectDeploy,
  getConfig,
  setConfig,
  exit,
  downloadTemplate,
  writePageConfig,
  getEntryPath,
  spawnPromise
};