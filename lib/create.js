const fse = require('fs-extra');
const { join } = require('path');
const inquirer = require('inquirer');
const clear = require('clear');
// 用于替换模板字符串
const handlebars = require('handlebars');
const { configPath, logSymbols, templatePath, promptList } = require('./constance');
const { exit, writePageConfig } = require('./utils');
const chalk = require('chalk');

async function createApp(webAppPath) {
  clear();
  webAppPath = webAppPath.toLowerCase();
  try {
    // 判断是否初始化过项目
    const { rootPath } = fse.readJsonSync(configPath);
    if (!rootPath) {
      exit(`请先初始化项目，终端执行：${chalk.yellow('lds init project-name')}`);
    }

    // 判断app项目名称是否合法
    if (!/^[0-9a-zA-Z-_\/]+$/.test(webAppPath)) {
      exit('web-app工程名称只能由英文字母、数字以及—和_组成~！');
    }

    // 项目创建的路径
    const projectPath = join(rootPath, 'src', webAppPath);
    // 查看项目路径是否已经存在
    const exists = fse.pathExistsSync(projectPath);
    if (exists) {
      exit('web-app工程名称重复，请重新命名！');
    }

    // 开始初始化
    const answer = await inquirer.prompt(promptList);

    // 模板类型
    let tplFramePath = join(templatePath, answer.frame);


    // 拷贝模板
    fse.copySync(tplFramePath, projectPath);

    // 写入配置文件
    writePageConfig(answer, join(projectPath, 'config.js'));


    console.log(`
    ## 创建工程完成
    To get Start:
    ===========================

    进入项目
      ${chalk.yellow('cd ' + rootPath)}

    开始启动工程：
      ${chalk.yellow('lds start ' + webAppPath)}

    ===========================
    `);
    process.exit();

  } catch (error) {
    exit(`创建工程失败，${error}`);
  }






}

module.exports = createApp;
