#!/usr/bin/env node
const { promisify } = require('util');
const figlet = promisify(require('figlet'));
// 清空控制台命令行
const clear = require('clear');
// 加载commander 库
const program = require('commander');
const updateCheckPackage = require('../lib/update');
const setMirror = require('../lib/mirror');

program.version(require('../package.json').version, '-v, --version');


program
  .command('upgrade')
  .description('Check the lds-app-cli version.')
  .action(() => updateCheckPackage());


program
  .command('mirror <template_mirror>')
  .description('Set the template mirror.')
  .action((tplMirror) => setMirror(tplMirror));

// 解析命令行参数
program.parse(process.argv);