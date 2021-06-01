const fse = require('fs-extra');
const ora = require('ora');
const chalk = require('chalk');
const inquirer = require('inquirer');
// 用于替换模板字符串
const handlebars = require('handlebars');
const path = require('path');
const downloadTemplate = require('./download');
const { logSymbols, templatePath } = require('./constance');

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

        // 检查路径是否存在
        const exists = fse.pathExists(templatePath);
        if (!exists) {
          await downloadTemplate();
        }
        try {
          // copy 模板
          await fse.copy(templatePath, targetPath);
        } catch (err) {
          console.log(logSymbols.error, chalk.red(`Copy template failed, ${err}`));
          process.exit();
        }


        // 替换模板
        const multiFiles = [
          `${targetPath}/package.json`,
          `${targetPath}/gulpfile.js`,
          `${targetPath}/test/index.html`,
          `${targetPath}/src/index.js`
        ];
        // 用条件循环把模板字符替换到文件去
        for (var i = 0; i < multiFiles.length; i++) {
          // 这里记得 try {} catch {} 哦，以便出错时可以终止掉 Spinner
          try {
            // 等待读取文件
            const multiFilesContent = await fse.readFile(multiFiles[i], 'utf8');
            // 等待替换文件，handlebars.compile(原文件内容)(模板字符)
            const multiFilesResult = await handlebars.compile(multiFilesContent)(multiMeta);
            // 等待输出文件
            await fse.outputFile(multiFiles[i], multiFilesResult);
          } catch (err) {
            // 如果出错，Spinner 就改变文字信息
            initSpinner.text = chalk.red(`Initialize project failed. ${err}`);
            // 终止等待动画并显示 X 标志
            initSpinner.fail();
            // 退出进程
            process.exit();
          }
        }

        // 如果成功，Spinner 就改变文字信息
        initSpinner.text = 'Initialize project successful.';
        // 终止等待动画并显示 ✔ 标志
        initSpinner.succeed();
        console.log(`
        To get started:

            cd ${chalk.yellow(LCProjectName)}
            ${chalk.yellow('npm install')} or ${chalk.yellow('yarn install')}
            ${chalk.yellow('npm run dev')} or ${chalk.yellow('yarn run dev')}
					`);



      }).catch(error => {
        if (error.isTtyError) {
          console.log(logSymbols.error, chalk.red("Prompt couldn't be rendered in the current environment."));
        } else {
          console.log(logSymbols.error, chalk.red(error));
        }

      });
    }
  } catch (err) {
    console.err(logSymbols.warning, `${err}`);
    process.exit();
  }

}

module.exports = initProject;


