const fse = require('fs-extra');
const ora = require('ora');
const chalk = require('chalk');
const inquirer = require('inquirer');
// 用于替换模板字符串
const handlebars = require('handlebars');
const path = require('path');
const downloadTemplate = require('./download');
const { logSymbols } = require('./constance');

async function initProject(projectName) {
  try {
    const exists = await fse.pathExists(projectName);
    if (exists) {
      // 路径已存在，则项目重名
      console.log(logSymbols.warning, chalk.red('The project already existx.'));

    } else {
      // 执行控制台交互
      inquirer.prompt(
        [
          {
            type: 'input',   // 类型，
            name: 'name',    // 用来索引当前 name 的值
            message: 'Set a global name for Javascript plugin?',
            default: 'default'

          }
        ]
      ).then(async (answer) => {
        const initSpinner = ora(chalk.cyan('Initializing project...'));
        initSpinner.start();
        // node。js进程的工作目录
        const processPath = process.cwd();
        // 项目名称小写， 应该加正则判断
        const LCProjectName = projectName.toLowerCase();
        // 拼接项目完整路径
        const targetPath = `${processPath}/${LCProjectName}`;
      });
    }
  } catch (err) {
    console.err(logSymbols.warning, `${err}`);
    process.exit();
  }

}


