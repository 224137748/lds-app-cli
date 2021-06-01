#!/usr/bin/env node
const { promisify } = require('util');
const figlet = promisify(require('figlet'));
// 清空控制台命令行
const clear = require('clear');
// 加载commander 库
const program = require('commander');
const updateCheckPackage = require('../lib/update');
const setMirror = require('../lib/mirror');
const downloadTemplate = require('../lib/download');
const initProject = require('../lib/init');

program.version(require('../package.json').version, '-v, --version');

// 检查版本更新
program
  .command('upgrade')
  .description('Check the lds-app-cli version.')
  .action(() => updateCheckPackage());


// 设置镜像
program
  .command('mirror <template_mirror>')
  .description('Set the template mirror.')
  .action((tplMirror) => setMirror(tplMirror));

// 下载模板
program
  .command('template')
  .description('Download template from mirror.')
  .action(() => downloadTemplate());



// init 初始化项目
program
  .name('lds-app-cli')
  .usage('<commands> [options]')
  .command('init <project_name>')
  .description('Create a web App.')
  .action(project => initProject(project));

// 解析命令行参数
program.parse(process.argv);