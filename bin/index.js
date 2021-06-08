#!/usr/bin/env node
const { promisify } = require('util');

// 加载commander 库
const program = require('commander');
const updateCheckPackage = require('../lib/update');
const initProject = require('../lib/init');
const start = require('../lib/start');
const create = require('../lib/create');
const build = require('../lib/build');


program.version(require('../package.json').version, '-v, --version');

// 检查版本更新
program
  .command('upgrade')
  .description('Check the lds-app-cli version.')
  .action(() => updateCheckPackage());



// init 初始化项目
program
  .name('lds-app-cli')
  .usage('<commands> [options]')
  .command('init <project_name>')
  .description('Initialize a project.')
  .action(project => initProject(project));


// 创建项目
program
  .command('create <app_name>')
  .description('Create a web app.')
  .action(projectName => create(projectName));

// 启动项目
program
  .command('start <project_path>')
  .option('-p --port <port>', '端口', 3000)
  .description('Running a web app.')
  .action((projectPath, { port }) => start(projectPath, port));

// 打包项目
program
  .command('build <project_path>')
  .description('Build a web app.')
  .action(projectPath => build(projectPath));

// 解析命令行参数
program.parse(process.argv);