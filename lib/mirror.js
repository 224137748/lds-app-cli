
const fse = require('fs-extra');
const { configPath, logSymbols } = require('./constance');

// 加载 生成 config.json 文件的函数
const generateConfig = require('./config');
const chalk = require('chalk');

async function setMirror(link) {
  // 判断是否有 config.json 存在
  const exists = await fse.pathExists(configPath);

  if (exists) {
    mirrorAction(link);
  } else {
    await generateConfig();
    mirrorAction(link);
  }

}

async function mirrorAction(link) {
  try {
    // 读取 config.json 
    const jsonConfig = await fse.readJSON(configPath);
    jsonConfig.mirror = link;
    // 写入文件
    await fse.writeJSON(configPath, jsonConfig);
    console.log(logSymbols.success, 'Set the mirror successful.');
  } catch (error) {
    console.log(logSymbols.error, chalk.red(`Set the mirror failed. ${error}`));
    process.exit();
  }
}


module.exports = setMirror;