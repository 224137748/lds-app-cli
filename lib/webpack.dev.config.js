
const { VueLoaderPlugin } = require('vue-loader');
const webpackbar = require('webpackbar');
const webpack = require('webpack');
// 加快二次编译速度
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = {
  mode: 'development',
  watch: true,
  watchOptions: {
    // 不监听的文件或文件夹，支持正则匹配
    // 默认为空
    ignored: /node_modules/,
    // 监听到变化发生后会等300ms再去执行动作，防止文件更新太快导致重新编译频率太高
    // 默认为 300ms
    aggregateTimeout: 300,
    // 判断文件是否发生变化是通过不停的去询问系统指定文件有没有变化实现的
    // 默认每隔1000毫秒询问一次
    poll: 1000
  },
  entry: '',
  output: {},
  resolve: {
    extensions: ['.tsx', '.ts', '.vue', '.jsx', '.js',]
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader',

      },
      {
        test: /\.(css|less)$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader']
      },
      {
        test: /\.(woff|woff2|png|jpe?g|gif|svg|mp3|mp4)/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 3 * 1024, //小于这个时将会已base64位图片打包处理
              // 图片文件输出的文件夹
              // outputPath: "static/images",
              // 使用commonJs规范，使之不予html-loader冲突
              esModule: false,
              name: '[name].[ext]'
            },
          },
        ],
      },
      {
        test: /\.(jsx?|tsx?)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            // 开启编译缓存
            cacheDirectory: true,
            presets: [
              ['@babel/preset-env', {
                useBuiltIns: 'usage',
                corejs: 3
              }],
              '@babel/preset-react',
              '@babel/preset-typescript'
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new webpackbar({
      name: '正在启动...'
    }),
    new VueLoaderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HardSourceWebpackPlugin(),
  ],
  devtool: 'eval-source-map'

};