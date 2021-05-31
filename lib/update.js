const updateNotifier = require('update-notifier');
const chalk = require('chalk');
const pkg = require('../package.json');

const notifier = updateNotifier({
  // 从 package.json 获取 name 和 version 进行查询
  pkg,
  // 设定检查更新周期，默认为 1000 * 60 * 60 * 24（1 天）
  // 这里设定为 1000 毫秒（1秒）
  updateCheckInterval: 1000
});


function updateCheckPackage() {
  console.log(notifier);
  if (notifier.update) {
    console.log(`New version available: ${chalk.cyan(notifier.update.latest)}, it's recommended that you update before using!`);
    notifier.notify();
  } else {
    console.log(chalk.green('No new version is available.'));
  }
}

module.exports = updateCheckPackage;