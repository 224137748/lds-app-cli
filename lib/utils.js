const fse = require('fs-extra');
const { configPath } = require('./constance');


/**
 *检查路径是否存在
 *
 * @param {*} path
 * @return {*} 
 */
function checkPathExists(path) {
  return new Promise((resolve, reject) => {
    try {
      const hasEntry = fse.pathExistsSync(path + '/index.js');
      const hasConfig = fse.pathExistsSync(path + '/config.js');
      if (hasEntry && hasConfig) {
        resolve(true);
      } else {
        reject(`
        ${hasEntry ? '' : '项目入口文件 index.js 不存在~！'} \n
        ${hasConfig ? '' : '项目配置文件 confg.js 文件不存在~！'}
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

module.exports = {
  checkPathExists,
  getConfig,
  setConfig
};