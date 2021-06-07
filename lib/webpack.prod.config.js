
const { VueLoaderPlugin } = require('vue-loader');
const webpackbar = require('webpackbar');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// js代码压缩
const TerserPlugin = require('terser-webpack-plugin');
// css代码压缩
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {},
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
        test: /\.(jsx?|tsx?)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {

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
      },
    ]
  },
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: 'all',
      name: true,
    },
    minimizer: [
      new TerserPlugin({
        // 去掉注释
        extractComments: false,
        // 去除的函数，console.log
        terserOptions: {
          compress: { pure_funcs: ['console.log'] },
        }
      }),
      new OptimizeCssAssetsPlugin()
    ]
  },
  plugins: [
    new webpackbar({
      name: '正在打包...'
    }),
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(),
  ]

};