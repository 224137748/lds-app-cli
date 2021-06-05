const { checkProjectDeploy, getConfig, exit } = require('./utils');
const { logSymbols, htmlTplPath } = require('./constance');
const fse = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const webpackConfig = require('./webpack.dev.config');
const WebpackDevServer = require('webpack-dev-server');
const HtmlWebpackPlugin = require('html-webpack-plugin');

async function start(projectPath, port) {
  // 去掉路径最强前面的斜杠， //example/618
  projectPath = projectPath.replace(/^\/*(.*)/, '$1');
  try {
    const jsonConfig = getConfig(projectPath);
    if (!jsonConfig.rootPath) {
      exit(`请先初始化项目，终端执行：${chalk.yellow('lds init project-name')}`);
    }
    const absolutePath = path.join(jsonConfig.rootPath, 'src', projectPath);
    // 判断项目路径是否存在
    if (!fse.pathExistsSync(absolutePath)) {
      exit(`${projectPath}路径不存在~！`);
    }


    // 判断项目入口、配置文件是否存在
    try {
      await checkProjectDeploy(absolutePath);
    } catch (error) {
      exit(`${error}`);
    }


    // 配置文件
    const pageConfig = require(path.resolve(absolutePath, './config.js'));
    // 项目chunkName => 配置打包路径
    const chunkName = projectPath + '/index';
    // webpackConfig.entry = absolutePath + '/index.js';
    webpackConfig.entry = {
      [chunkName]: path.resolve(absolutePath, './index.js')
    };


    // webpack-dev-server 启动content-path
    const contentPath = path.join(jsonConfig.rootPath, 'dist');
    webpackConfig.output = {
      path: contentPath,
      filename: '[name].js',
      publicPath: '/'
    };

    // 如果是普通项目，则添加html-withimg-loader, 处理html中src路径问题
    if (pageConfig.frame === 'normal') {
      webpackConfig.module.rules.push(
        {
          test: /\.(htm|html)$/i,
          loader: 'html-withimg-loader'
        },
      );
    }

    // html-webpack-plugin
    webpackConfig.plugins.push(
      new HtmlWebpackPlugin({
        title: pageConfig.title || 'lds-app',
        template: pageConfig.frame === 'normal' ? (path.resolve(absolutePath, './index.html')) : htmlTplPath,
        meta: {
          description: pageConfig.description || '',
          keyword: pageConfig.keyword || ''
        },
        inject: true,
        chunks: [chunkName],
        filename: `${chunkName}.html`
      })
    );

    const devServerOptions = {
      contentBase: [contentPath, path.resolve(jsonConfig.rootPath, 'developer')],
      watchContentBase: true,
      hot: true,
      historyApiFallback: true,
      hotOnly: true,
      open: true,
      openPage: projectPath,
      noInfo: true,
      // 更新 监听 html 变化
      before(app, server, compiler) {
        const watchFiles = ['.html'];
        compiler.hooks.done.tap('done', () => {
          const changedFiles = Object.keys(compiler.watchFileSystem.watcher.mtimes);

          if (
            this.hot &&
            changedFiles.some(filePath => watchFiles.includes(path.parse(filePath).ext))
          ) {
            server.sockWrite(server.sockets, 'content-changed');
          }
        });
      }
      // publicPath: '/assets/' + projectPath
    };

    // 想要启用 HMR，还需要修改 webpack 配置对象，使其包含 HMR 入口起点
    WebpackDevServer.addDevServerEntrypoints(webpackConfig, devServerOptions);

    const compiler = webpack(webpackConfig);
    const server = new WebpackDevServer(compiler, devServerOptions);

    server.listen(port, 'localhost', function (err, result) {


      if (err) {
        console.error(logSymbols.error, chalk.red(`项目启动失败： ${err}`));
      }
      console.log(logSymbols.success, chalk.green(`项目启动成功，浏览器打开: http://localhost:${port}`));
    });




  } catch (error) {
    console.error(logSymbols.error, chalk.red(`Running failed, ${error}`));
    process.exit();
  }

}

module.exports = start;