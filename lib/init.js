const { promisify } = require('util');
const fse = require('fs-extra');
const ora = require('ora');
const chalk = require('chalk');
// 清空控制台命令行
const clear = require('clear');
const figlet = promisify(require('figlet'));
const { join } = require('path');
const { exit, downloadTemplate, spawnPromise } = require('./utils');



async function initProject(projectName) {
  clear();
  // welcome
  console.log(chalk.green(
    figlet.textSync('Welcome lds-cli', {
      font: 'DOS Rebel',
    })
  ));
  projectName = projectName.toLowerCase();

  // 校验项目名称
  if (!/^[0-9a-zA-Z-_]+$/.test(projectName)) {
    exit('项目名只能由英文字母、数字以及—和_组成~！');
  }

  // node.js进程的工作目录
  const processPath = process.cwd();

  // 项目初始化的路径
  const rootPath = join(processPath, projectName);

  // 校验当前目录是否存在
  const exists = fse.pathExistsSync(rootPath);
  if (exists) {
    exit('项目名称在当前目录下已存在~！');
  }



  try {

    const initSpinner = ora(chalk.cyan('初始化项目...'));
    initSpinner.start();

    // 检查路径是否存在
    await downloadTemplate(rootPath);

    try {
      // 修改package.json中项目名称
      const packageJson = fse.readJsonSync(join(rootPath, 'package.json'));
      packageJson.name = projectName;
      fse.writeJsonSync(join(rootPath, 'package.json'), packageJson);

      // 安装依赖
      initSpinner.text = chalk.cyan('安装依赖...');

      await spawnPromise(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['install'], {
        cwd: rootPath
      });

    } catch (error) {
      initSpinner.text = chalk.red(`初始化项目失败, ${error}`);
      initSpinner.fail();
      process.exit();
    }


    // 如果成功，Spinner 就改变文字信息
    initSpinner.text = chalk.green('初始化项目成功！');
    // 终止等待动画并显示 ✔ 标志
    initSpinner.succeed();


    console.log(`
    
    Next step:
    ===========================
    
    ## 创建工程：
      ${chalk.yellow('lds create mini-app')}

    ===========================
    `);
    process.exit();

  } catch (err) {
    exit();
  }

}

module.exports = initProject;


