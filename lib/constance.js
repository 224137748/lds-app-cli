const { resolve } = require('path');
const chalk = require('chalk');

const promptList = [
  {
    type: 'list',
    name: 'frame',
    message: '请选择项目使用的框架：',
    choices: ['Vue', 'React', 'none']
  },
  {
    type: 'input',
    name: 'title',
    message: '请输入工程的标题： ',
    default: ''
  },
  {
    type: 'input',
    name: 'description',
    message: '请输入工程描述：',
    default: ''
  }
];

module.exports = {
  /** 
   * config.json配置文件路径
   */
  configPath: resolve(__dirname, './config.json'),

  htmlTplPath: resolve(__dirname, '../public/index.html'),

  logSymbols: {
    info: chalk.blue('ℹ'),
    success: chalk.green('✔'),
    warning: chalk.yellow('⚠'),
    error: chalk.red('✖')
  },
  promptList
};