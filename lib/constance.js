const { resolve } = require('path');
const chalk = require('chalk');

const promptList = [
  {
    type: 'list',
    name: 'frame',
    message: 'Please choose this project template',
    choices: ['Vue', 'React', 'Jquery']
  },
  {
    type: 'input',
    name: 'title',
    message: 'Please input the project title. ',
    default: ''
  },
  {
    type: 'input',
    name: 'description',
    message: 'Please input the project description',
    default: ''
  }
];

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
  },
  promptList
};