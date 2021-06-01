const { resolve } = require('path');
const chalk = require('chalk');


module.exports = {
  /** 
   * config.json配置文件路径
   */
  configPath: resolve(__dirname, '../config.json'),
  /** 
   * template 模板文件夹路径
   */
  templatePath: resolve(__dirname, '../template'),

  logSymbols: {
    info: chalk.blue('ℹ'),
    success: chalk.green('✔'),
    warning: chalk.yellow('⚠'),
    error: chalk.red('✖')
  }
};