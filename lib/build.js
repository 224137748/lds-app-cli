

const fse = require('fs-extra');
const webpackProdConfig = require('./webpack.prod.config');
const { htmlTplPath } = require('./constance');
const { exit, getConfig, checkProjectDeploy } = require('./utils');
const { resolve, join } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');


async function build(projectPath) {
  // 去掉路径最强前面的斜杠， //example/618
  projectPath = projectPath.replace(/^\/*(.*)/, '$1');

  try {
    const jsonConfig = getConfig(projectPath);
    if (!jsonConfig.rootPath) {
      exit(`请先初始化项目，终端执行：${chalk.yellow('lds init project-name')}`);
    }

    const absolutePath = join(jsonConfig.rootPath, 'src', projectPath);
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
    const pageConfig = require(resolve(absolutePath, './config.js'));


    // 配置入口
    webpackProdConfig.entry = {
      main: resolve(absolutePath, './index.js')
    };

    // 配置出口
    const outputPath = join(jsonConfig.rootPath, 'build', projectPath);
    webpackProdConfig.output = {
      path: outputPath,
      filename: 'static/js/[name].[hash:8].js',
      // 块名，公共块名(非入口)
      chunkFilename: "[name].[chunkhash].bundle.js",
      publicPath: pageConfig.publicPath ?? '/',
    };

    // image-loader
    const imageLoader = {
      test: /\.(png|svg|jpg|gif|jpeg)$/,
      use: [{
        loader: "url-loader",
        options: {
          limit: 3 * 1024, //小于这个时将会已base64位图片打包处理
          name: '[contenthash].[ext]',
          // 图片文件输出的文件夹
          outputPath: 'static/imgs',
          // 使用commonJs规范，使之不予html-loader冲突
          esModule: false,
        },
      },],
    };

    // css-loader
    const cssLoader = {
      test: /\.(css|less)$/,
      use: [{
        loader: MiniCssExtractPlugin.loader,
        options: {
          // publicPath: "../../",
        },
      },
        "css-loader", // translates CSS into CommonJS
        "postcss-loader",
        "less-loader" // compiles Less to CSS
      ],
    };

    // 字体loader
    const fontLoader = {
      test: /\.(woff|woff2|ico|eot|ttf|otf)/,
      use: [
        {
          loader: 'url-loader',
          options: {
            outputPath: join(outputPath, projectPath, 'static/font')
          }
        },
      ],
    };

    // 注入loader
    webpackProdConfig.module.rules.push(imageLoader, cssLoader, fontLoader);
    webpackProdConfig.plugins.push(
      new MiniCssExtractPlugin({
        filename: 'static/css/[name].[hash:8].css'
      }),
      new HtmlWebpackPlugin({
        template: pageConfig.frame === 'normal' ? (resolve(absolutePath, './index.html')) : htmlTplPath,
        templateParameters: {
          title: pageConfig.title || ''
        },
        meta: {
          description: pageConfig.description || '',
          keyword: pageConfig.keyword || ''
        },
        inject: true,
        chunks: ['main'],
        filename: `index.html`
      })
    );

    // console.log('webpackConfig');
    webpack(webpackProdConfig).run();

  } catch (error) {
    exit(`打包失败，${error}`);
  }

}

module.exports = build;