const download = require('download');
// loading 动画库
const ora = require('ora');
const chalk = require('chalk');
const fse = require('fs-extra');
const path = require('path');
const { configPath, templatePath } = require('./constance');

const generateConfig = require('./config');



async function downloadTemplate() {

  // 检查config.json文件是否存在
  const exists = await fse.pathExists(configPath);
  if (exists) {
    await downloadAction();
  } else {
    await generateConfig();
    await downloadAction();

  }

}

async function downloadAction() {
  try {
    // 清空模板文件夹下面的内容
    await fse.remove(templatePath);
  } catch (error) {
    console.error(error);
    process.exit();
  }

  const jsonConfig = await fse.readJSON(configPath);
  // Spinner 初始设置
  const dlSpinner = ora(chalk.cyan('Downloading template...'));

  dlSpinner.start();
  try {
    // 下载模板后解压
    await download(jsonConfig.mirror + 'template.zip', templatePath, { extract: true });
  } catch (err) {
    // 下载失败提示
    dlSpinner.text = chalk.red(`Download template failed, ${err}`);

    dlSpinner.fail();
    process.exit();
  }

  dlSpinner.text = chalk.green(`Download template successful.`);
  // 下载成功
  dlSpinner.succeed();
}


module.exports = downloadTemplate;