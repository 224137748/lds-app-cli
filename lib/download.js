const download = require('download');
// loading 动画库
const ora = require('ora');
const chalk = require('chalk');
const fse = require('fs-extra');
const path = require('path');

const defaultConfig = require('./config');

// 拼接 config.json 完整路径
const cfgPath = path.resolve(__dirname, '../config.json');

// 拼接 template 模板文件夹完整路径
const tplPath = path.resolve(__dirname, '../template');

async function downloadTemplate() {

}