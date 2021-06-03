
const { VueLoaderPlugin } = require('vue-loader');
const WebpackProgressBar = require('webpack-progress-bar');
const webpack = require('webpack');

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
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader',

      },

      {
        test: /\.(css|less)$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.(woff|woff2|png|jpe?g|gif|svg)/,
        use: [
          {
            loader: 'url-loader',
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new WebpackProgressBar()
  ],
  devtool: 'eval-source-map'

};