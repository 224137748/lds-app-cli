const { resolve } = require('path');
const chalk = require('chalk');


module.exports = {
  configPath: resolve(__dirname, '../config.json'),
  logSymbols: {
    info: chalk.blue('ℹ'),
    success: chalk.green('✔'),
    warning: chalk.yellow('⚠'),
    error: chalk.red('✖')
  }
};