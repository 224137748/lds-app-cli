const { promisify } = require('util');
const fse = require('fs-extra');
const ora = require('ora');
const chalk = require('chalk');
// 清空控制台命令行
const clear = require('clear');
const figlet = promisify(require('figlet'));
const { join } = require('path');
const { exit, downloadTemplate } = require('./utils');


async function initProject(projectName) {
  clear();
  projectName = projectName.toLowerCase();

  // 校验项目名称
  if (!/^[0-9a-zA-Z-_]+$/.test(projectName)) {
    exit('项目名只能由英文字母、数字以及—和_组成~！');
  }

  // node.js进程的工作目录
  const processPath = process.cwd();

  // 项目药初始化的路径
  const rootPath = join(processPath, projectName);

  // 校验当前目录是否存在
  const exists = fse.pathExistsSync(rootPath);
  if (exists) {
    exit('项目名称在当前目录下已存在~！');
  }

  // welcome
  // console.log(chalk.green(
  //   figlet.textSync('Welcome lds-cli', {
  //     font: 'DOS Rebel',
  //   })
  // ));

  try {

    const initSpinner = ora(chalk.cyan('初始化项目...'));
    initSpinner.start();

    // 检查路径是否存在
    await downloadTemplate(rootPath);

    // 如果成功，Spinner 就改变文字信息
    initSpinner.text = chalk.green('初始化项目成功！');
    // 终止等待动画并显示 ✔ 标志
    initSpinner.succeed();


    // try {
    //   // copy 模板
    //   await fse.copy(templatePath, targetPath);
    // } catch (err) {
    //   console.log(logSymbols.error, chalk.red(`Copy template failed, ${err}`));
    //   process.exit();
    // }


    // 替换模板
    // const multiFiles = [
    //   `${targetPath}/package.json`,
    //   `${targetPath}/gulpfile.js`,
    //   `${targetPath}/test/index.html`,
    //   `${targetPath}/src/index.js`
    // ];
    // 用条件循环把模板字符替换到文件去
    // for (var i = 0; i < multiFiles.length; i++) {
    //   // 这里记得 try {} catch {} 哦，以便出错时可以终止掉 Spinner
    //   try {
    //     // 等待读取文件
    //     const multiFilesContent = await fse.readFile(multiFiles[i], 'utf8');
    //     // 等待替换文件，handlebars.compile(原文件内容)(模板字符)
    //     const multiFilesResult = await handlebars.compile(multiFilesContent)(multiMeta);
    //     // 等待输出文件
    //     await fse.outputFile(multiFiles[i], multiFilesResult);
    //   } catch (err) {
    //     // 如果出错，Spinner 就改变文字信息
    //     initSpinner.text = chalk.red(`Initialize project failed. ${err}`);
    //     // 终止等待动画并显示 X 标志
    //     initSpinner.fail();
    //     // 退出进程
    //     process.exit();
    //   }
    // }


    console.log(`
      开始创建工程：
        ${chalk.yellow('lds create mini-app')}
      启动工程：
        ${chalk.yellow('lds start mini-app')}
      打包工程：
        ${chalk.yellow('lds build mini-app')}
    `);
    process.exit();
    // console.log(`
    //     To get started:

    //         cd ${chalk.yellow(LCProjectName)}
    //         ${chalk.yellow('npm install')} or ${chalk.yellow('yarn install')}
    //         ${chalk.yellow('npm run dev')} or ${chalk.yellow('yarn run dev')}
    // 			`);




  } catch (err) {
    exit();
  }

}

module.exports = initProject;


